import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

interface QueryPlan {
  query: string;
  executionTime: number;
  planningTime: number;
  executionPlan: any[];
  bufferUsage?: string;
  indexUsage?: string[];
  recommendations?: string[];
}

@Injectable()
export class ExplainAnalyzeService {
  constructor(private dataSource: DataSource) {}

  // Run EXPLAIN ANALYZE on any query
  async analyzeQuery(
    query: string,
    params: any[] = [],
    options: { buffers?: boolean; verbose?: boolean } = {}
  ): Promise<QueryPlan> {
    console.log('🔍 Running EXPLAIN ANALYZE on query...');
    const startTime = Date.now();

    // Build EXPLAIN command with options
    let explainCommand = 'EXPLAIN (ANALYZE true, FORMAT json';
    if (options.buffers) explainCommand += ', BUFFERS true';
    if (options.verbose) explainCommand += ', VERBOSE true';
    explainCommand += ') ';

    try {
      const result = await this.dataSource.query(explainCommand + query, params);
      const planData = result[0]['QUERY PLAN'][0];

      const executionTime = planData['Execution Time'] || 0;
      const planningTime = planData['Planning Time'] || 0;

      // Extract key information from execution plan
      const analysis = this.analyzePlan(planData.Plan);

      const endTime = Date.now();
      console.log(`🔍 EXPLAIN ANALYZE took: ${endTime - startTime}ms`);

      return {
        query,
        executionTime,
        planningTime,
        executionPlan: [planData],
        bufferUsage: this.extractBufferUsage(planData),
        indexUsage: analysis.indexUsage,
        recommendations: analysis.recommendations
      };
    } catch (error) {
      console.error('❌ EXPLAIN ANALYZE failed:', error.message);
      throw new Error(`Query analysis failed: ${error.message}`);
    }
  }

  // Analyze N+1 query pattern
  async analyzeN1Problem() {
    console.log('🔍 Analyzing N+1 problem pattern...');

    const badQuery = `
      SELECT u.id, u.first_name, u.last_name, u.email
      FROM perf_demo.users u
      LIMIT 10
    `;

    const followupQuery = `
      SELECT o.id, o.total_amount, o.status, o.created_at
      FROM perf_demo.orders o
      WHERE o.user_id = $1
    `;

    const optimizedQuery = `
      SELECT
        u.id, u.first_name, u.last_name, u.email,
        o.id as order_id, o.total_amount, o.status, o.created_at as order_created
      FROM perf_demo.users u
      LEFT JOIN perf_demo.orders o ON u.id = o.user_id
      WHERE u.id <= 10
      ORDER BY u.id, o.created_at DESC
    `;

    const [badPlan, optimizedPlan] = await Promise.all([
      this.analyzeQuery(badQuery),
      this.analyzeQuery(optimizedQuery)
    ]);

    return {
      problem: 'N+1 Query Problem',
      badQuery: {
        description: 'Initial query + N follow-up queries',
        mainQuery: badPlan,
        followupQuery: followupQuery,
        estimatedTotalQueries: 11, // 1 + 10 follow-ups
        totalEstimatedTime: badPlan.executionTime * 11
      },
      optimizedQuery: {
        description: 'Single JOIN query',
        plan: optimizedPlan,
        improvement: `${Math.round((badPlan.executionTime * 11 - optimizedPlan.executionTime) / (badPlan.executionTime * 11) * 100)}% faster`
      }
    };
  }

  // Analyze index usage
  async analyzeIndexUsage(tableName: string) {
    console.log(`🔍 Analyzing index usage for table: ${tableName}`);

    const indexQuery = `
      SELECT
        schemaname,
        tablename,
        indexname,
        idx_scan as scans,
        idx_tup_read as tuples_read,
        idx_tup_fetch as tuples_fetched
      FROM pg_stat_user_indexes
      WHERE tablename = $1
      ORDER BY idx_scan DESC
    `;

    const tableStatsQuery = `
      SELECT
        schemaname,
        tablename,
        seq_scan as sequential_scans,
        seq_tup_read as sequential_reads,
        idx_scan as index_scans,
        idx_tup_fetch as index_fetches,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes
      FROM pg_stat_user_tables
      WHERE tablename = $1
    `;

    const [indexStats, tableStats] = await Promise.all([
      this.dataSource.query(indexQuery, [tableName]),
      this.dataSource.query(tableStatsQuery, [tableName])
    ]);

    const analysis = {
      tableName,
      tableStats: tableStats[0] || {},
      indexStats,
      recommendations: [] as string[]
    };

    // Generate recommendations
    if (tableStats[0]) {
      const seqScans = parseInt(tableStats[0].sequential_scans || '0');
      const idxScans = parseInt(tableStats[0].index_scans || '0');

      if (seqScans > idxScans * 2) {
        analysis.recommendations.push(
          'High number of sequential scans - consider adding indexes for frequent WHERE clauses'
        );
      }

      if (indexStats.length === 0) {
        analysis.recommendations.push('No indexes found - consider adding primary key and foreign key indexes');
      }

      indexStats.forEach((idx: any) => {
        if (parseInt(idx.scans || '0') === 0) {
          analysis.recommendations.push(`Index '${idx.indexname}' is never used - consider dropping it`);
        }
      });
    }

    return analysis;
  }

  // Compare query performance
  async compareQueries(queries: { name: string; query: string; params?: any[] }[]) {
    console.log('🔍 Comparing multiple query performances...');

    const results = [] as any[];
    for (const queryInfo of queries) {
      const analysis = await this.analyzeQuery(
        queryInfo.query,
        queryInfo.params || [],
        { buffers: true }
      );
      results.push({
        name: queryInfo.name,
        ...analysis
      });
    }

    // Sort by execution time
    results.sort((a, b) => a.executionTime - b.executionTime);

    const fastest = results[0];
    const slowest = results[results.length - 1];

    return {
      summary: {
        fastest: fastest.name,
        slowest: slowest.name,
        performanceGap: `${Math.round((slowest.executionTime / fastest.executionTime - 1) * 100)}% difference`
      },
      details: results,
      recommendations: [
        ...fastest.recommendations || [],
        `Consider optimizing '${slowest.name}' query - it's the slowest performer`
      ]
    };
  }

  // Analyze table statistics for optimization opportunities
  async analyzeTableStats(schemaName: string = 'perf_demo') {
    console.log('🔍 Analyzing table statistics for optimization opportunities...');

    const tableStatsQuery = `
      SELECT
        schemaname,
        tablename,
        n_live_tup as live_tuples,
        n_dead_tup as dead_tuples,
        last_vacuum,
        last_autovacuum,
        last_analyze,
        last_autoanalyze,
        seq_scan,
        seq_tup_read,
        idx_scan,
        idx_tup_fetch,
        n_tup_ins,
        n_tup_upd,
        n_tup_del
      FROM pg_stat_user_tables
      WHERE schemaname = $1
      ORDER BY seq_scan DESC, n_live_tup DESC
    `;

    const tables = await this.dataSource.query(tableStatsQuery, [schemaName]);
    const analysis = {
      schema: schemaName,
      tables,
      recommendations: [] as string[]
    };

    tables.forEach((table: any) => {
      const deadTuples = parseInt(table.dead_tuples || '0');
      const liveTuples = parseInt(table.live_tuples || '0');
      const deadRatio = liveTuples > 0 ? deadTuples / liveTuples : 0;

      if (deadRatio > 0.1) {
        analysis.recommendations.push(
          `Table '${table.tablename}' has ${Math.round(deadRatio * 100)}% dead tuples - consider VACUUM`
        );
      }

      const seqScans = parseInt(table.seq_scan || '0');
      const idxScans = parseInt(table.idx_scan || '0');

      if (seqScans > 1000 && seqScans > idxScans * 5) {
        analysis.recommendations.push(
          `Table '${table.tablename}' has many sequential scans (${seqScans}) - add indexes for common queries`
        );
      }

      if (!table.last_analyze && !table.last_autoanalyze) {
        analysis.recommendations.push(
          `Table '${table.tablename}' has never been analyzed - run ANALYZE for better query planning`
        );
      }
    });

    return analysis;
  }

  // Private helper methods
  private analyzePlan(plan: any): { indexUsage: string[]; recommendations: string[] } {
    const indexUsage: string[] = [];
    const recommendations: string[] = [];

    this.traversePlan(plan, (node) => {
      // Check for index usage
      if (node['Node Type']?.includes('Index')) {
        indexUsage.push(`${node['Node Type']} on ${node['Index Name'] || 'unknown'}`);
      }

      // Check for performance issues
      if (node['Node Type'] === 'Seq Scan') {
        recommendations.push(`Sequential scan detected on ${node['Relation Name']} - consider adding index`);
      }

      if (node['Actual Loops'] > 1000) {
        recommendations.push(`High loop count (${node['Actual Loops']}) - check for inefficient joins`);
      }

      if (node['Node Type'] === 'Sort' && node['Sort Method'] === 'external sort') {
        recommendations.push('External sort detected - consider increasing work_mem or optimizing query');
      }
    });

    return { indexUsage, recommendations };
  }

  private traversePlan(plan: any, callback: (node: any) => void) {
    callback(plan);
    if (plan.Plans) {
      plan.Plans.forEach((subPlan: any) => this.traversePlan(subPlan, callback));
    }
  }

  private extractBufferUsage(planData: any): string {
    if (planData.Plan && planData.Plan['Shared Hit Blocks']) {
      return `Shared Hit: ${planData.Plan['Shared Hit Blocks']}, Read: ${planData.Plan['Shared Read Blocks'] || 0}`;
    }
    return 'Buffer usage not available';
  }
}