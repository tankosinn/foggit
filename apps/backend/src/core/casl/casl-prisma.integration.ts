// https://casl.js.org/v6/en/package/casl-prisma#custom-prisma-client-output-path
import type { hkt } from '@casl/ability'
import type { ExtractModelName, Model } from '@casl/prisma/runtime'
import type { Prisma, PrismaClient } from '@generated/prisma'
import { createAbilityFactory, createAccessibleByFactory } from '@casl/prisma/runtime'

type ModelName = Prisma.ModelName
type ModelWhereInput = {
  [K in Prisma.ModelName]: Uncapitalize<K> extends keyof PrismaClient
    ? Extract<Parameters<PrismaClient[Uncapitalize<K>]['findFirst']>[0], { where?: any }>['where']
    : never
}

type WhereInput<TModelName extends Prisma.ModelName> = Extract<ModelWhereInput[TModelName], Record<any, any>>

interface PrismaQueryTypeFactory extends hkt.GenericFactory {
  produce: WhereInput<ExtractModelName<this[0], ModelName>>
}

type PrismaModel = Model<Record<string, any>, string>
// Higher Order type that allows to infer passed in Prisma Model name
export type PrismaQuery<T extends PrismaModel = PrismaModel>
  = WhereInput<ExtractModelName<T, ModelName>> & hkt.Container<PrismaQueryTypeFactory>

type WhereInputPerModel = {
  [K in ModelName]: WhereInput<K>;
}

export const createPrismaAbility = createAbilityFactory<ModelName, PrismaQuery>()

export const accessibleBy = createAccessibleByFactory<WhereInputPerModel, PrismaQuery>()
