import { inject, injectable } from 'tsyringe'
import { DataSource, Repository } from 'typeorm'

import { Product } from '../entities'
import { ProductDto } from '../types/response'
import { UpdateProductRequest } from '../types/request'
import { createLogger } from '@libs/log'
import { EntityNotFoundError, ValidationError } from '@libs/error'

const log = createLogger('ProductService')

@injectable()
class ProductService {
  private productRepo: Repository<Product>

  constructor(@inject('AppDataSource') dataSource: DataSource) {
    this.productRepo = dataSource.getRepository(Product)
  }

  async getAll(): Promise<ProductDto[]> {
    const products = await this.productRepo.find()

    return products.map(this.mapProductToProductDto)
  }

  async getById(id: number): Promise<ProductDto | null> {
    const product = await this.productRepo.findOneBy({ id })

    if (!product) {
      return null
    }

    return this.mapProductToProductDto(product)
  }

  async updateById(id: number, request: UpdateProductRequest): Promise<ProductDto> {
    const product = await this.productRepo.findOneBy({ id })
    if (!product) {
      throw new EntityNotFoundError(`Product with id ${id} was not found.`)
    }

    if(!Object.values(request).length) {
      throw new ValidationError(`At least one of the following properties is required: name, description, price`)
    }

    if(request.name !== undefined) {
      product.name = request.name
    }
    if(request.description !== undefined) {
      product.description = request.description
    }
    if(request.price !== undefined) {
      product.price = request.price
    }

    await this.productRepo.save(product)

    return this.mapProductToProductDto(product)
  }

  async deleteById(id: number): Promise<boolean> {
    const product = await this.productRepo.findOneBy({ id })
    if (!product) {
      throw new EntityNotFoundError(`Product with id ${id} was not found.`)
    }

    const result = await this.productRepo.delete(id)

    return result.affected !== 0
  }

  private mapProductToProductDto(product: Product): ProductDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price
    }
  }
}

export default ProductService
