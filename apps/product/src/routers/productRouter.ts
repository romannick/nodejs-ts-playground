import { Router } from 'express'
import { container } from 'tsyringe'

import ProductService from '../services/productService'
import { ProductDto } from '../types/response'
import { UpdateProductRequest } from '../types/request'
import { EntityNotFoundError } from '@libs/error'
import { AuthRequest, IdParams } from '@libs/types'

const router = Router()
const productService = container.resolve(ProductService)

router.get('/', async (req: AuthRequest<{}, ProductDto[], void>, res) => {
  const products = await productService.getAll()

  res.json(products)
})

router.get('/:id', async (req: AuthRequest<IdParams, ProductDto, void>, res) => {
  const id = req.params.id!
  const product = await productService.getById(id)

  if (!product) {
    throw new EntityNotFoundError(`'Product with id=${id} was not found'`)
  }

  res.json(product)
})

router.put(
  '/:id',
  async (req: AuthRequest<IdParams, ProductDto, UpdateProductRequest>, res) => {
    const id = req.params.id!
    const product = await productService.updateById(id, req.body)

    if (!product) {
      throw new EntityNotFoundError(`'Product with id=${id} was not found'`)
    }

    res.json(product)
  },
)

router.delete(
  '/:id',
  async (req: AuthRequest<IdParams, void, void>, res) => {
    const id = req.params.id!
    await productService.deleteById(id)

    res.status(204).send()
  },
)

export default router
