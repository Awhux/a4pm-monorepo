import { ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import compression from 'compression'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { ILogger } from './infrastructure/log/interfaces/logger.interface'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    snapshot: true,
    bufferLogs: true,
    forceCloseConnections: true,
  })

  const logger = await app.resolve(ILogger)
  app.useLogger(logger)

  const appConfig = app.get(ConfigService)
  const appPort = appConfig.get<number>('API_PORT', 8000)
  const appUrl = appConfig.get<string>('API_URL', `http://localhost:${appPort}`)

  const appCorsAllowedOrigins: string[] = appConfig
    .get<string>('CORS_ALLOWED_ORIGINS', 'http://localhost:5173')
    .split(',')

  app.disable('x-powered-by')
  app.use(cookieParser())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  )

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })

  app.enableCors({
    origin: appCorsAllowedOrigins,
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  })

  app.set('trust proxy', 'loopback')

  app.use(compression())

  const config = new DocumentBuilder()
    .setTitle('Receitas API')
    .setDescription('API para gestão de receitas culinárias')
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.listen(appPort)
  logger.log(`Application is running on: ${appUrl}`)
  logger.log(`Swagger is running on: ${appUrl}/docs`)
}

void bootstrap()
