import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { StudentService } from 'src/student/student.service';
import { assignStudetsToLessonInput } from './Assign-studets-to-lesson.Input';
import { Lesson } from './lesson.entity';
import { createLessonInput } from './lesson.input';
import { LessonService } from './lesson.service';
import { LessonType } from './lesson.type';

@Resolver((type) => LessonType)
export class LessonResolver {
  constructor(
    private lessonService: LessonService,
    private studentService: StudentService,
  ) {}
  //define queries, mutations, and subscriptions

  @Query((returns) => LessonType)
  lesson(@Args('id') id: string) {
    return this.lessonService.getLesson(id);
  }
  @Query((returns) => [LessonType])
  lessons() {
    return this.lessonService.getAllLessons();
  }

  @Mutation((returns) => LessonType)
  createLesson(
    @Args('createLessonInput') createLessonInput: createLessonInput,
  ) {
    return this.lessonService.createLesson(createLessonInput);
  }

  @Mutation((returns) => LessonType)
  assignStudentsToLesson(
    @Args('assignStudetsToLessonInput')
    assignStudetsToLessonInput: assignStudetsToLessonInput,
  ) {
    const { lessonId, studentIds } = assignStudetsToLessonInput;
    return this.lessonService.assignStudentsToLesson(lessonId, studentIds);
  }

  @ResolveField()
  async students(@Parent() lesson: Lesson) {
    return this.studentService.getManyStudents(lesson.students);
  }
}
