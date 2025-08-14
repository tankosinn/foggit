import { PrismaService } from '@app/core/database'
import { User, Workspace } from '@generated/prisma'
import { Injectable } from '@nestjs/common'
import { CreateWorkspace, UpdateWorkspace } from 'schemas'

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User, createWorkspace: CreateWorkspace) {
    return this.prisma.workspace.create({
      data: {
        ...createWorkspace,
        members: {
          create: {
            userId: user.id,
            role: 'ADMIN',
          },
        },
      },
    })
  }

  async findAll(user: User) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    })
  }

  async findOne(uuid: string, user: User) {
    return this.prisma.workspace.findUnique({
      where: {
        uuid,
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    })
  }

  async update(workspace: Workspace, updateWorkspace: UpdateWorkspace) {
    return this.prisma.workspace.update({
      where: { id: workspace.id },
      data: updateWorkspace,
    })
  }

  async remove(workspace: Workspace) {
    await this.prisma.workspace.delete({
      where: { id: workspace.id },
    })
  }
}
