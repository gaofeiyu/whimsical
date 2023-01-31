import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import sql from './sql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackerModule } from './module/tracker/index.module';

// Why not ormconfig https://typeorm.io/changelog#deprecations
@Module({
  imports: [TypeOrmModule.forRoot(sql as TypeOrmModuleOptions), TrackerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
