import { Controller, Get, Query, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { BadQueriesService } from './performance/bad-queries.service';
import { OptimizedQueriesService } from './performance/optimized-queries.service';
import { ExplainAnalyzeService } from './performance/explain-analyze.service';
import { BenchmarkService } from './performance/benchmark.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly badQueriesService: BadQueriesService,
    private readonly optimizedQueriesService: OptimizedQueriesService,
    private readonly explainAnalyzeService: ExplainAnalyzeService,
    private readonly benchmarkService: BenchmarkService
  ) {}

  @Get()
  getHello(): string {
    return 'Query Optimization Demo - Port 3007';
  }

  // Bad Queries Endpoints
  @Get('bad/n1-problem')
  async badN1Problem(@Query('limit') limit?: string) {
    return this.badQueriesService.getUsersWithOrdersBad(parseInt(limit || '50') || 50);
  }

  @Get('bad/search')
  async badSearch(@Query('term') term: string = 'laptop', @Query('limit') limit?: string) {
    return this.badQueriesService.searchProductsByNameBad(term, parseInt(limit || '30') || 30);
  }

  @Get('bad/statistics')
  async badStatistics() {
    return this.badQueriesService.getOrderStatisticsBad();
  }

  @Get('bad/all')
  async runAllBadQueries() {
    return this.badQueriesService.runAllBadQueries();
  }

  // Optimized Queries Endpoints
  @Get('optimized/n1-problem')
  async optimizedN1Problem(@Query('limit') limit?: string) {
    return this.optimizedQueriesService.getUsersWithOrdersOptimized(parseInt(limit || '50') || 50);
  }

  @Get('optimized/search')
  async optimizedSearch(@Query('term') term: string = 'laptop', @Query('limit') limit?: string) {
    return this.optimizedQueriesService.searchProductsByNameOptimized(term, parseInt(limit || '30') || 30);
  }

  @Get('optimized/statistics')
  async optimizedStatistics() {
    return this.optimizedQueriesService.getOrderStatisticsOptimized();
  }

  @Get('optimized/all')
  async runAllOptimizedQueries() {
    return this.optimizedQueriesService.runAllOptimizedQueries();
  }

  // Benchmark Endpoints
  @Get('benchmark/full')
  async runFullBenchmark(): Promise<any> {
    return this.benchmarkService.runFullBenchmark();
  }

  @Get('benchmark/:test')
  async runSpecificBenchmark(@Param('test') test: string): Promise<any> {
    return this.benchmarkService.runSpecificBenchmark(test);
  }

  // Summary and Info Endpoints
  @Get('info')
  getInfo() {
    return {
      name: 'Query Optimization Demo',
      version: '1.0.0',
      description: 'Performance analysis and query optimization demonstration',
      port: 3007,
      endpoints: {
        bad: 'Demonstrates poorly performing queries',
        optimized: 'Shows optimized versions of queries',
        benchmark: 'Performance comparison and benchmarking'
      },
      usage: {
        badQueries: 'GET /bad/{n1-problem|search|statistics|all}',
        optimizedQueries: 'GET /optimized/{n1-problem|search|statistics|all}',
        benchmarks: 'GET /benchmark/{full|n1|search|statistics}'
      },
      datasetInfo: {
        note: 'Run seeding first: npx ts-node src/seeds/large-dataset.seed.ts',
        users: '50,000',
        products: '100,000',
        orders: '200,000',
        orderItems: '800,000',
        total: '~850,000 records'
      }
    };
  }
}