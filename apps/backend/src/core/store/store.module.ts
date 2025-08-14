import { MemberModule, MemberStore } from '@app/modules/member'
import { UserModule } from '@app/modules/user'
import { UserStore } from '@app/modules/user/store'
import { WorkspaceModule } from '@app/modules/workspace'
import { WorkspaceStore } from '@app/modules/workspace/store'
import { Module } from '@nestjs/common'
import { ClsModule } from 'nestjs-cls'
import { CaslAbilityStore, CaslModule } from '../casl'

@Module({
  imports: [
    ClsModule.forFeatureAsync({
      imports: [UserModule],
      useClass: UserStore,
      global: true,
    }),
    ClsModule.forFeatureAsync({
      imports: [MemberModule],
      useClass: MemberStore,
      global: true,
    }),
    ClsModule.forFeatureAsync({
      imports: [CaslModule],
      useClass: CaslAbilityStore,
      global: true,
    }),
    ClsModule.forFeatureAsync({
      imports: [WorkspaceModule],
      useClass: WorkspaceStore,
      global: true,
    }),
  ],
})
export class StoreModule {}
