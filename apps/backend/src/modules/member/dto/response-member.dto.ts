import { ResponseUserDto } from '@app/modules/user'
import { Role } from '@generated/prisma'
import { Exclude, Expose, Type } from 'class-transformer'

@Exclude()
export class ResponseMemberDto {
  @Expose()
  uuid: string

  @Expose()
  role: Role

  @Expose()
  @Type(() => ResponseUserDto)
  user: ResponseUserDto
}
