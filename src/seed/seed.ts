const { NestFactory } = require('@nestjs/core');
const { SeedModule } = require('./seed.module');
const { SeedService } = require('./seed.service');

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeedModule);
  const seedService = appContext.get(SeedService);

  // Run the seeding logic
  await seedService.seed();

  // Close the application context
  await appContext.close();
}

bootstrap();
