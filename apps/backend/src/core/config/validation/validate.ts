import * as v from 'valibot'
import { environmentSchema } from './schema'

export function validate(config: Record<string, unknown>) {
  const parsedConfig = v.safeParse(environmentSchema, config)

  if (!parsedConfig.success) {
    const message = [
      'Configuration validation failed with the following issues:',
      ...parsedConfig.issues.map((issue, i) => `  ${i + 1}. Path: ${v.getDotPath(issue)}\n     Message: ${issue.message}`,
      ),
    ].join('\n')

    throw new Error(message)
  }

  return parsedConfig.output
}
