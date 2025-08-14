import type { PipeTransform } from '@nestjs/common'
import { UnprocessableEntityException } from '@nestjs/common'
import * as v from 'valibot'

export class ValidationPipe<T extends v.GenericSchema> implements PipeTransform {
  constructor(private schema: T) {}

  transform(value: unknown): v.InferOutput<T> {
    try {
      return v.parse(this.schema, value)
    }
    catch (error) {
      throw new UnprocessableEntityException(error)
    }
  }
}
