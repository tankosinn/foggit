import type { User, Workspace } from '@generated/prisma'
import type { CreateWorkspace, UpdateWorkspace } from 'schemas'
import { ValidationPipe } from '@app/common/pipes'
import { TransformerOptions } from '@app/common/transformer'
import { Action } from '@app/core/casl'
import { CheckPolicies } from '@app/core/casl/decorators'
import { UseStore } from '@app/core/store'
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common'
import { createWorkspaceSchema, updateWorkspaceSchema } from 'schemas'
import { UserStore } from '../user'
import { ResponseWorkspaceDto } from './dto'
import { WorkspaceStore } from './store'
import { WorkspaceService } from './workspace.service'

@TransformerOptions({ instance: ResponseWorkspaceDto })
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(
    @UseStore(UserStore) user: User,
    @Body(new ValidationPipe(createWorkspaceSchema)) createWorkspace: CreateWorkspace,
  ) {
    return this.workspaceService.create(user, createWorkspace)
  }

  @Get()
  async findAll(@UseStore(UserStore) user: User) {
    return this.workspaceService.findAll(user)
  }

  @Get(':uuid')
  async findOne(
    @UseStore(UserStore) user: User,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.workspaceService.findOne(uuid, user)
  }

  @Patch()
  @CheckPolicies([Action.Update, 'Workspace'])
  async update(
    @UseStore(WorkspaceStore) workspace: Workspace,
    @Body(new ValidationPipe(updateWorkspaceSchema)) updateWorkspace: UpdateWorkspace,
  ) {
    return this.workspaceService.update(workspace, updateWorkspace)
  }

  @Delete()
  @CheckPolicies([Action.Delete, 'Workspace'])
  async remove(@UseStore(WorkspaceStore) workspace: Workspace) {
    return this.workspaceService.remove(workspace)
  }
}
