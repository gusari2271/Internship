import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { ContactModule } from './contact/contact.module';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: join(__dirname, '..', 'db.sqlite'),
      autoLoadEntities: true,
      synchronize: true, // Auto-creates tables from entities — perfect for dev!
    }),
    ProjectsModule,
    ContactModule,
  ],
})
export class AppModule {}
