import { Module } from '@nestjs/common'
import { ILogger } from './interfaces/logger.interface'
import { PinoLogger } from './services/pino-logger.service'

@Module({
  providers: [
    {
      provide: ILogger,
      useClass: PinoLogger,
    },
  ],
  exports: [ILogger],
})
export class LogModule {}
