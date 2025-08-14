import { Module } from '@nestjs/common'
import { CoreModule } from './core'
import { MemberModule } from './modules/member'
import { UserModule } from './modules/user'
import { WeatherModule } from './modules/weather/weather.module'
import { WorkspaceModule } from './modules/workspace'

@Module({
  imports: [
    CoreModule,
    UserModule,
    WorkspaceModule,
    MemberModule,
    WeatherModule,
  ],
})
export class AppModule {}
