import type { ClassConstructor, ClassTransformOptions } from 'class-transformer'

export interface ClassTransformerOptions extends ClassTransformOptions {
  instance: ClassConstructor<unknown>
}
