import { AbilityBuilder, PureAbility } from '@casl/ability'
import { Subjects } from '@casl/prisma'
import { User, WeatherLog, Workspace, WorkspaceMember } from '@generated/prisma'
import { Injectable } from '@nestjs/common'
import { createPrismaAbility, PrismaQuery } from './casl-prisma.integration'
import { Action } from './constants'

export type AppSubjects = 'all' | Subjects<{
  User: User
  Workspace: Workspace
  WorkspaceMember: WorkspaceMember
  WeatherLog: WeatherLog
}>

export type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>

@Injectable()
export class CaslAbilityFactory {
  createForMember(member: WorkspaceMember) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility)

    if (member.role === 'ADMIN') {
      can(Action.Manage, 'all')
    }
    else {
      can(Action.Read, 'all')
      can(Action.Read, 'WeatherLog', { workspaceMemberId: member.id })
    }

    cannot(Action.Manage, 'Workspace', { id: { not: member.workspaceId } })
    cannot(Action.Manage, 'WorkspaceMember', { workspaceId: { not: member.workspaceId } })
    cannot(Action.Manage, 'WeatherLog', { workspaceMember: { workspaceId: { not: member.workspaceId } } })

    return build()
  }
}
