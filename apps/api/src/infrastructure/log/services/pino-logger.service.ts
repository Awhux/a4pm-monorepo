import * as path from 'node:path'
import { Injectable, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import pino, { Logger } from 'pino'
import { ILogger } from '../interfaces/logger.interface'

@Injectable({ scope: Scope.TRANSIENT })
export class PinoLogger implements ILogger {
  private logger: Logger

  constructor(private readonly configService: ConfigService) {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production'

    this.logger = pino(
      isProduction
        ? {
            level: 'info',
            ...pino.destination(path.join(process.cwd(), 'production.log')),
          }
        : {
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                levelFirst: true,
                translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
                ignore: 'pid,hostname',
              },
            },
          },
    )
  }

  setContext(context: string) {
    this.logger = this.logger.child({ context })
  }

  log(message: string) {
    this.logger.info(message)
  }

  error(message: string, trace?: string) {
    if (trace) {
      this.logger.error({ trace }, message)
    } else {
      this.logger.error(message)
    }
  }

  warn(message: string) {
    this.logger.warn(message)
  }

  debug(message: string) {
    this.logger.debug(message)
  }

  verbose(message: string) {
    this.logger.trace(message)
  }
}
