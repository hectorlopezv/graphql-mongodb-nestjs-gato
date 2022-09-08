import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Lesson {
  @ObjectIdColumn()
  _id: string;
  @PrimaryColumn({ unique: true })
  id: string;

  @Column()
  name: string;

  @Column()
  startDate: string;
  @Column()
  endDate: string;

  @Column()
  students: string[];
}
