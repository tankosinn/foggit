import * as v from 'valibot'
import { workspaceSchema } from './base'

export const updateWorkspaceSchema = v.partial(workspaceSchema)

export type UpdateWorkspaceInput = v.InferInput<typeof updateWorkspaceSchema>
export type UpdateWorkspaceOutput = v.InferOutput<typeof updateWorkspaceSchema>

export type { UpdateWorkspaceOutput as UpdateWorkspace }
