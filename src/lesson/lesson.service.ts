import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Lesson } from './lesson.entity';
import { createLessonInput } from './lesson.input';
@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async getLesson(id: string): Promise<Lesson> {
    return this.lessonRepository.findOne({ where: { id } });
  }
  async getAllLessons(): Promise<Lesson[]> {
    return this.lessonRepository.find();
  }
  async createLesson(createLessonInput: createLessonInput): Promise<Lesson> {
    const lesson = this.lessonRepository.create({
      id: uuidv4(),
      ...createLessonInput,
    });
    return this.lessonRepository.save(lesson);
  }

  async assignStudentsToLesson(
    lessonId: string,
    studentIds: string[],
  ): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
    });

    //combine the arrays with duplicates included
    const studentsWithDuplicates = [...lesson.students, ...studentIds];

    //convert it to a set which will remove duplicates
    //AND destructure back into an array
    const students = [...new Set(studentsWithDuplicates)];

    //assign the destructured set back to the lesson entity
    lesson.students = students;
    const updatedLesson = await this.lessonRepository.save(lesson);
    return updatedLesson;
  }
}
