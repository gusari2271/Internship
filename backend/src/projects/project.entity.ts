import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProjectImage } from './project-image.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'varchar', nullable: true })
  category?: string | null;

  @Column({ type: 'varchar', nullable: true })
  location?: string | null;

  @Column({ type: 'integer', nullable: true })
  year?: number | null;

  @Column({ type: 'varchar', nullable: true })
  thumbnailUrl?: string | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'integer', unique: true, nullable: true })
  cubeIndex?: number | null;

  @OneToMany(() => ProjectImage, (image) => image.project, { eager: true })
  images: ProjectImage[];
}
