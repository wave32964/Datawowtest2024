import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private dataSource: DataSource) {}

  async runSQLFile() {
    // Adjust the path based on the environment (development or production)
    let sqlFilePath: string;

    if (process.env.NODE_ENV === 'production') {
      // In production (when running the compiled code), the file will be inside the dist directory
      sqlFilePath = join(__dirname, '..', 'db', 'setup.sql');
    } else {
      // In development (during TypeScript compilation), the file will be inside the src directory
      sqlFilePath = join(__dirname, '..', '..', 'src', 'db', 'setup.sql');
    }

    const sql = readFileSync(sqlFilePath, 'utf-8');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // Execute SQL from the file
      await queryRunner.query(sql);

      // Commit the transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // If something goes wrong, roll back the transaction
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }

    console.log('Database setup complete!');
  }
}
