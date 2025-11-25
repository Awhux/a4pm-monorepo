import { LoggerService as NestLoggerService } from '@nestjs/common'

export interface ILogger extends NestLoggerService {
  setContext(context: string): void
}

export const ILogger = Symbol('ILogger')
