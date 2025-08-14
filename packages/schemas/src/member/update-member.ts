import * as v from 'valibot'

export const updateMemberSchema = v.object({
  role: v.picklist(['ADMIN', 'MEMBER']),
})

export type UpdateMemberInput = v.InferInput<typeof updateMemberSchema>
export type UpdateMemberOutput = v.InferOutput<typeof updateMemberSchema>

export type { UpdateMemberOutput as UpdateMember }
