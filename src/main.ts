import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as schedule from 'node-schedule';
import { ReportService } from './report/report.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    // .addBearerAuth()
    .setTitle('Films API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  app.enableCors();
  await app.listen(3000);

  const reportService = app.get(ReportService);

  schedule.scheduleJob('*/2 * * * *', () => {
    reportService.generateReport();
  });
}
bootstrap();
