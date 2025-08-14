import type { AppSubjects } from '../casl-ability.factory'
import type { Action } from '../constants'

export type Policy = [Action: Action, Subject: AppSubjects]
