import { randomBytes } from 'node:crypto'
import defu from 'defu'

export interface TokenGeneratorOptions {
  length?: number
  segments?: number
  join?: string
}

const defaultOptions: Required<TokenGeneratorOptions> = {
  length: 3,
  segments: 2,
  join: '-',
}

export function generateToken(options?: TokenGeneratorOptions): string {
  const { length, segments, join } = defu(options, defaultOptions) as Required<TokenGeneratorOptions>

  return Array.from({ length: segments })
    .map(() => randomBytes(length).toString('hex').slice(0, length))
    .join(join)
}
