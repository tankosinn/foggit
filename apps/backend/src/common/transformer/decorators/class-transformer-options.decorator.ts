import type { ClassTransformerOptions } from '../types'
import { SetMetadata } from '@nestjs/common'

export const CLASS_TRANSFORMER_OPTIONS = 'class-transformer-options'
export const TransformerOptions = (options: ClassTransformerOptions) => SetMetadata(CLASS_TRANSFORMER_OPTIONS, options)
