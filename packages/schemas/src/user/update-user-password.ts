import * as v from 'valibot'

const rules = v.pipe(
  v.string(),
  v.minLength(8, 'Your password is too short'),
  v.maxLength(30, 'Your password is too long'),
  v.regex(/[a-z]/, 'Your password must contain a lowercase letter'),
  v.regex(/[A-Z]/, 'Your password must contain an uppercase letter'),
  v.regex(/\d/, 'Your password must contain a number'),
  v.regex(/[^a-z0-9]/i, 'Your password must contain a special character'),
)

function checkPasswordMatch<T extends { newPassword: string, confirmPassword: string }>() {
  return v.rawCheck<T>(({ dataset, addIssue }) => {
    if (dataset.typed) {
      if (dataset.value.newPassword !== dataset.value.confirmPassword) {
        addIssue({
          message: 'Passwords do not match',
          path: [{
            type: 'object',
            origin: 'value',
            key: 'confirmPassword',
            input: dataset.value,
            value: dataset.value.confirmPassword,
          }],
        })
      }
    }
  })
}

const setPasswordSchema = v.pipe(
  v.object({
    type: v.literal('SET'),
    newPassword: rules,
    confirmPassword: v.string(),
  }),
  checkPasswordMatch(),
)

const resetPasswordSchema = v.pipe(
  v.object({
    ...setPasswordSchema.entries,
    type: v.literal('RESET'),
    currentPassword: v.pipe(v.string(), v.minLength(1)),
  }),
  checkPasswordMatch(),
  v.rawCheck(
    ({ dataset, addIssue }) => {
      if (dataset.typed) {
        if (dataset.value.newPassword === dataset.value.currentPassword) {
          addIssue({
            message: 'New password must be different from current password',
            path: [{
              type: 'object',
              origin: 'value',
              key: 'newPassword',
              input: dataset.value,
              value: dataset.value.newPassword,
            }],
          })
        }
      }
    },
  ),
)

const removePasswordSchema = v.pipe(
  v.object({
    type: v.literal('REMOVE'),
    currentPassword: v.pipe(v.string(), v.minLength(1)),
  }),
)

export const updateUserPasswordSchema = v.variant('type', [
  setPasswordSchema,
  resetPasswordSchema,
  removePasswordSchema,
])

export type UpdateUserPasswordInput = v.InferInput<typeof updateUserPasswordSchema>
export type UpdateUserPasswordOutput = v.InferOutput<typeof updateUserPasswordSchema>

export type { UpdateUserPasswordOutput as UpdateUserPassword }
