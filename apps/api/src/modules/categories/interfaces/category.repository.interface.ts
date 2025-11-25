import { Category } from '@a4pm-receitas/database'

export interface ICategoryRepository {
  findAll(): Promise<Category[]>
  findById(id: number): Promise<Category | null>
}

export const ICategoryRepository = Symbol('ICategoryRepository')
