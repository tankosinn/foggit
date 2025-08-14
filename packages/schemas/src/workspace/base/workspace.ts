import * as v from 'valibot'

export const workspaceSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
})
