import { Logger, QueryRunner } from 'typeorm'
import { categorizeQuery, dbQueryHistogram } from './promMetrics'

export class PrometheusLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const type = categorizeQuery(query);

    const end = dbQueryHistogram.startTimer({ query_type: type });
    end();
  }

  logQueryError(error: string | Error, query?: string, parameters?: any[], queryRunner?: QueryRunner) {
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
  }
}
