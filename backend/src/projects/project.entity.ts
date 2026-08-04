import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  description: string;
}
