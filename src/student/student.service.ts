import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { createStudentInput } from './create-student.input';
import { Student } from './student.entity';
@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async createStudent(
    createStudentInput: createStudentInput,
  ): Promise<Student> {
    const student = this.studentRepository.create(createStudentInput);
    student.id = uuidv4();
    return this.studentRepository.save(student);
  }

  async getStudents(): Promise<Student[]> {
    return this.studentRepository.find();
  }
  async getStudent(id: string): Promise<Student> {
    return this.studentRepository.findOne({ where: { id } });
  }

  async getManyStudents(studentIds: string[]): Promise<Student[]> {
    return this.studentRepository.find({
      where: {
        id: {
          $in: [...studentIds],
        } as any,
      },
    });
  }
}
