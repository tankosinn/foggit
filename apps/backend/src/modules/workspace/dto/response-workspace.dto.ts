import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class ResponseWorkspaceDto {
  @Expose()
  uuid: string

  @Expose()
  name: string
}
