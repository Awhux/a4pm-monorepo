import { Global, Module } from '@nestjs/common'
import { DatabaseModule } from './database/database.module'
import { LogModule } from './log/log.module'

@Global()
@Module({
  imports: [DatabaseModule, LogModule],
  providers: [],
  exports: [DatabaseModule, LogModule],
})
export class InfrastructureModule {}
