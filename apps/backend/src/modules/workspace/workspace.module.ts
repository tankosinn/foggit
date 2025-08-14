import { Module } from '@nestjs/common'
import { WorkspaceCache } from './cache'
import { WorkspaceController } from './workspace.controller'
import { WorkspaceService } from './workspace.service'

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceCache],
  exports: [WorkspaceService, WorkspaceCache],
})
export class WorkspaceModule {}
