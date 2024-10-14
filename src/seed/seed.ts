import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeedModule);
  const seedService = appContext.get(SeedService);

  // Run the seeding logic
  await seedService.seed();

  // Close the application context
  await appContext.close();
}

bootstrap();
