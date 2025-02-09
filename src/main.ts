import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with proper configuration
  app.enableCors({
    origin: '*', // In production, specify your actual origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: false // Changed to false for mobile app
  });

  await app.listen(3000, '0.0.0.0'); // Listen on all network interfaces
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
