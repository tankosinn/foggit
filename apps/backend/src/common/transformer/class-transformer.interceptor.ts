import { CallHandler, ExecutionContext, Injectable, NestInterceptor, StreamableFile } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { plainToInstance } from 'class-transformer'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { CLASS_TRANSFORMER_OPTIONS } from './decorators/class-transformer-options.decorator'
import { ClassTransformerOptions } from './types'

@Injectable()
export class ClassTransformerInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.reflector.getAllAndOverride<ClassTransformerOptions | undefined>(CLASS_TRANSFORMER_OPTIONS, [
      context.getHandler(),
      context.getClass(),
    ])

    return next
      .handle()
      .pipe(
        map((res: unknown) => this.transform(res, options)),
      )
  }

  transform(res: unknown, options?: ClassTransformerOptions) {
    if (res instanceof StreamableFile || options == null || options.instance == null) {
      return res
    }

    return plainToInstance(options.instance, res, options)
  }
}
