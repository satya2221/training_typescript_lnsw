import { Injectable } from '@nestjs/common';
import { BadQueriesService } from './bad-queries.service';
import { OptimizedQueriesService } from './optimized-queries.service';
import { ExplainAnalyzeService } from './explain-analyze.service';

export interface BenchmarkResult {
  testName: string;
  badQuery: {
    executionTime: number;
    queryCount: number;
    details: any;
  };
  optimizedQuery: {
    executionTime: number;
    queryCount: number;
    details: any;
  };
  improvement: {
    timeReduction: number;
    percentageImprovement: number;
    queryReduction: number;
  };
}

@Injectable()
export class BenchmarkService {
  constructor(
    private badQueriesService: BadQueriesService,
    private optimizedQueriesService: OptimizedQueriesService,
    private explainAnalyzeService: ExplainAnalyzeService
  ) {}

  // Run comprehensive performance comparison
  async runFullBenchmark(): Promise<{
    summary: any;
    individual: BenchmarkResult[];
    recommendations: string[];
  }> {
    console.log('🏁 Starting comprehensive performance benchmark...');
    const startTime = Date.now();

    const benchmarks: BenchmarkResult[] = [];

    // 1. N+1 Problem Benchmark
    benchmarks.push(await this.benchmarkN1Problem());

    // 2. Search Performance Benchmark
    benchmarks.push(await this.benchmarkSearch());

    // 3. Statistics Query Benchmark
    benchmarks.push(await this.benchmarkStatistics());

    // 4. Data Loading Benchmark
    benchmarks.push(await this.benchmarkDataLoading());

    // 5. Pagination Benchmark
    benchmarks.push(await this.benchmarkPagination());

    const endTime = Date.now();

    // Calculate summary statistics
    const summary = this.calculateSummary(benchmarks, endTime - startTime);
    const recommendations = this.generateRecommendations(benchmarks);

    return {
      summary,
      individual: benchmarks,
      recommendations
    };
  }

  // Benchmark N+1 problem vs optimized JOIN
  private async benchmarkN1Problem(): Promise<BenchmarkResult> {
    console.log('🔄 Benchmarking N+1 problem...');

    const [badResult, optimizedResult] = await Promise.all([
      this.badQueriesService.getUsersWithOrdersBad(50),
      this.optimizedQueriesService.getUsersWithOrdersOptimized(50)
    ]);

    return {
      testName: 'N+1 Query Problem',
      badQuery: {
        executionTime: badResult.executionTime,
        queryCount: badResult.queryCount,
        details: badResult
      },
      optimizedQuery: {
        executionTime: optimizedResult.executionTime,
        queryCount: optimizedResult.queryCount,
        details: optimizedResult
      },
      improvement: this.calculateImprovement(badResult, optimizedResult)
    };
  }

  // Benchmark search performance
  private async benchmarkSearch(): Promise<BenchmarkResult> {
    console.log('🔄 Benchmarking search performance...');

    const searchTerm = 'laptop';
    const [badResult, optimizedResult] = await Promise.all([
      this.badQueriesService.searchProductsByNameBad(searchTerm, 30),
      this.optimizedQueriesService.searchProductsByNameOptimized(searchTerm, 30)
    ]);

    return {
      testName: 'Product Search',
      badQuery: {
        executionTime: badResult.executionTime,
        queryCount: 1,
        details: badResult
      },
      optimizedQuery: {
        executionTime: optimizedResult.executionTime,
        queryCount: 1,
        details: optimizedResult
      },
      improvement: this.calculateImprovement(badResult, optimizedResult)
    };
  }

  // Benchmark statistics queries
  private async benchmarkStatistics(): Promise<BenchmarkResult> {
    console.log('🔄 Benchmarking statistics queries...');

    const [badResult, optimizedResult] = await Promise.all([
      this.badQueriesService.getOrderStatisticsBad(),
      this.optimizedQueriesService.getOrderStatisticsOptimized()
    ]);

    return {
      testName: 'Order Statistics',
      badQuery: {
        executionTime: badResult.executionTime,
        queryCount: badResult.queryCount,
        details: badResult
      },
      optimizedQuery: {
        executionTime: optimizedResult.executionTime,
        queryCount: optimizedResult.queryCount,
        details: optimizedResult
      },
      improvement: this.calculateImprovement(badResult, optimizedResult)
    };
  }

  // Benchmark data loading
  private async benchmarkDataLoading(): Promise<BenchmarkResult> {
    console.log('🔄 Benchmarking data loading...');

    // Run sequentially to avoid potential conflicts
    const badResult = await this.badQueriesService.getProductsWithCategoriesBad(30);
    const optimizedResult = await this.optimizedQueriesService.getProductsWithCategoriesOptimized(30);

    return {
      testName: 'Product Data Loading',
      badQuery: {
        executionTime: badResult.executionTime,
        queryCount: 1,
        details: badResult
      },
      optimizedQuery: {
        executionTime: optimizedResult.executionTime,
        queryCount: 1,
        details: optimizedResult
      },
      improvement: this.calculateImprovement(badResult, optimizedResult)
    };
  }

  // Benchmark pagination
  private async benchmarkPagination(): Promise<BenchmarkResult> {
    console.log('🔄 Benchmarking pagination...');

    const [badResult, optimizedResult] = await Promise.all([
      this.badQueriesService.getPaginatedOrdersBad(100, 10),
      this.optimizedQueriesService.getPaginatedOrdersOptimized(undefined, 10)
    ]);

    return {
      testName: 'Order Pagination',
      badQuery: {
        executionTime: badResult.executionTime,
        queryCount: 1,
        details: badResult
      },
      optimizedQuery: {
        executionTime: optimizedResult.executionTime,
        queryCount: 1,
        details: optimizedResult
      },
      improvement: this.calculateImprovement(badResult, optimizedResult)
    };
  }

  // Run specific benchmark by name
  async runSpecificBenchmark(benchmarkName: string): Promise<BenchmarkResult> {
    switch (benchmarkName.toLowerCase()) {
      case 'n1':
      case 'n+1':
        return this.benchmarkN1Problem();
      case 'search':
        return this.benchmarkSearch();
      case 'statistics':
      case 'stats':
        return this.benchmarkStatistics();
      case 'loading':
      case 'data':
        return this.benchmarkDataLoading();
      case 'pagination':
      case 'paging':
        return this.benchmarkPagination();
      default:
        throw new Error(`Unknown benchmark: ${benchmarkName}`);
    }
  }

  // Performance stress test
  async runStressTest(iterations: number = 10): Promise<any> {
    console.log(`🔥 Running stress test with ${iterations} iterations...`);
    const startTime = Date.now();

    const results = {
      iterations,
      tests: [] as any[],
      averages: {} as any,
      summary: {} as any
    };

    for (let i = 0; i < iterations; i++) {
      console.log(`🔄 Stress test iteration ${i + 1}/${iterations}`);

      const iterationResult = {
        iteration: i + 1,
        n1Problem: await this.benchmarkN1Problem(),
        search: await this.benchmarkSearch(),
        timestamp: new Date().toISOString()
      };

      results.tests.push(iterationResult);
    }

    // Calculate averages
    const n1Times = results.tests.map(t => t.n1Problem.optimizedQuery.executionTime);
    const searchTimes = results.tests.map(t => t.search.optimizedQuery.executionTime);

    results.averages = {
      n1ProblemAverage: Math.round(n1Times.reduce((a, b) => a + b) / n1Times.length),
      searchAverage: Math.round(searchTimes.reduce((a, b) => a + b) / searchTimes.length),
      n1StandardDeviation: this.calculateStandardDeviation(n1Times),
      searchStandardDeviation: this.calculateStandardDeviation(searchTimes)
    };

    const endTime = Date.now();
    results.summary = {
      totalTime: endTime - startTime,
      averageIterationTime: Math.round((endTime - startTime) / iterations),
      consistency: {
        n1Problem: this.calculateConsistency(n1Times),
        search: this.calculateConsistency(searchTimes)
      }
    };

    return results;
  }

  // Private helper methods
  private calculateImprovement(badResult: any, optimizedResult: any) {
    const timeReduction = badResult.executionTime - optimizedResult.executionTime;
    const percentageImprovement = Math.round((timeReduction / badResult.executionTime) * 100);
    const queryReduction = (badResult.queryCount || 1) - (optimizedResult.queryCount || 1);

    return {
      timeReduction,
      percentageImprovement,
      queryReduction
    };
  }

  private calculateSummary(benchmarks: BenchmarkResult[], totalTime: number) {
    const totalBadTime = benchmarks.reduce((sum, b) => sum + b.badQuery.executionTime, 0);
    const totalOptimizedTime = benchmarks.reduce((sum, b) => sum + b.optimizedQuery.executionTime, 0);
    const totalTimeSaved = totalBadTime - totalOptimizedTime;
    const overallImprovement = Math.round((totalTimeSaved / totalBadTime) * 100);

    const bestImprovement = benchmarks.reduce((best, current) =>
      current.improvement.percentageImprovement > best.improvement.percentageImprovement ? current : best
    );

    const worstImprovement = benchmarks.reduce((worst, current) =>
      current.improvement.percentageImprovement < worst.improvement.percentageImprovement ? current : worst
    );

    return {
      totalBenchmarkTime: totalTime,
      testsRun: benchmarks.length,
      overallImprovement: `${overallImprovement}%`,
      totalTimeSaved: `${totalTimeSaved}ms`,
      bestImprovement: {
        test: bestImprovement.testName,
        improvement: `${bestImprovement.improvement.percentageImprovement}%`
      },
      worstImprovement: {
        test: worstImprovement.testName,
        improvement: `${worstImprovement.improvement.percentageImprovement}%`
      },
      averageImprovement: Math.round(
        benchmarks.reduce((sum, b) => sum + b.improvement.percentageImprovement, 0) / benchmarks.length
      ) + '%'
    };
  }

  private generateRecommendations(benchmarks: BenchmarkResult[]): string[] {
    const recommendations = [
      'Performance Optimization Recommendations:',
      '',
      '🔧 Database Optimizations:'
    ];

    benchmarks.forEach(benchmark => {
      if (benchmark.improvement.percentageImprovement > 50) {
        recommendations.push(
          `✅ ${benchmark.testName}: Excellent ${benchmark.improvement.percentageImprovement}% improvement achieved`
        );
      } else if (benchmark.improvement.percentageImprovement > 0) {
        recommendations.push(
          `⚠️ ${benchmark.testName}: Moderate ${benchmark.improvement.percentageImprovement}% improvement - consider further optimization`
        );
      } else {
        recommendations.push(
          `❌ ${benchmark.testName}: No improvement detected - review query optimization strategy`
        );
      }
    });

    recommendations.push('');
    recommendations.push('🎯 General Recommendations:');
    recommendations.push('• Use proper indexes for frequent WHERE clauses');
    recommendations.push('• Avoid N+1 queries by using JOINs or batch loading');
    recommendations.push('• Use cursor-based pagination for large datasets');
    recommendations.push('• Select only necessary columns to reduce data transfer');
    recommendations.push('• Use connection pooling and query result caching');
    recommendations.push('• Monitor query performance with EXPLAIN ANALYZE');

    return recommendations;
  }

  private calculateStandardDeviation(values: number[]): number {
    const avg = values.reduce((a, b) => a + b) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  }

  private calculateConsistency(values: number[]): string {
    const std = this.calculateStandardDeviation(values);
    const avg = values.reduce((a, b) => a + b) / values.length;
    const coefficient = (std / avg) * 100;

    if (coefficient < 10) return 'Excellent';
    if (coefficient < 20) return 'Good';
    if (coefficient < 30) return 'Fair';
    return 'Poor';
  }
}