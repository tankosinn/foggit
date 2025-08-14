import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class ResponseUserDto {
  @Expose()
  uuid: string

  @Expose()
  fullName: string

  @Expose()
  email: string
}
