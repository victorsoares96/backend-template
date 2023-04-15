import { Logger, QueryRunner } from 'typeorm';

export class ORMLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const requestUrl =
      queryRunner && queryRunner.data.request
        ? `(${queryRunner.data.request.url}) `
        : '';
    console.log(`${requestUrl} executing query: ${query}`);
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    const requestUrl =
      queryRunner && queryRunner.data.request
        ? `(${queryRunner.data.request.url}) `
        : '';
    console.log(
      `logQuerySlow: ${time} ${requestUrl} executing query: ${query}`,
    );
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    const requestUrl =
      queryRunner && queryRunner.data.request
        ? `(${queryRunner.data.request.url}) `
        : '';
    console.log(`logQueryError: ${requestUrl} executing query: ${query}`);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    const requestUrl =
      queryRunner && queryRunner.data.request
        ? `(${queryRunner.data.request.url}) `
        : '';
    console.log(`logSchemaBuild: ${requestUrl} executing query: ${message}`);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    const requestUrl =
      queryRunner && queryRunner.data.request
        ? `(${queryRunner.data.request.url}) `
        : '';
    console.log(`logMigration: ${requestUrl} executing query: ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    const requestUrl =
      queryRunner && queryRunner.data.request
        ? `(${queryRunner.data.request.url}) `
        : '';
    console.log(`log: ${level} ${requestUrl} executing query: ${message}`);
  }
}
