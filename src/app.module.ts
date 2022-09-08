import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from './config/config.schema';
import { LessonModule } from './lesson/lesson.module';
import { StudentModule } from './student/student.module';
@Module({
  imports: [
    GraphQLModule.forRootAsync({
      driver: ApolloDriver, // <--- "driver" should be here, as shown in the docs
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          autoSchemaFile: true,
          sortSchema: true,
          path: '/graphql',
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';

        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'mongodb',
          autoLoadEntities: true,
          entities: [__dirname + '/../**/*.entity.{js}'],
          url: 'mongodb://localhost/school',
          synchronize: true,
        };
      },
    }),
    LessonModule,
    StudentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
