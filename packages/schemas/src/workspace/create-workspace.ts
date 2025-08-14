import type * as v from 'valibot'
import { workspaceSchema } from './base'

export const createWorkspaceSchema = workspaceSchema

export type CreateWorkspaceInput = v.InferInput<typeof createWorkspaceSchema>
export type CreateWorkspaceOutput = v.InferOutput<typeof createWorkspaceSchema>

export type { CreateWorkspaceOutput as CreateWorkspace }
