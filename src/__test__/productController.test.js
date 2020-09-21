import request from 'supertest'
import mongoose from 'mongoose'
import { server as app } from '../bin/server'
import Product from '../Model/Product'
import Item from '../Model/Item'

const product = {
  parent_sku: 'CENE00',
  title: 'CAMISA ESTAMPA DE NAVE ESPACIAL',
  description: 'Camisa de algodon',
  price: 12.99,
  categories: ['Camisa', 'Con Estampa'],
  items: [
    {
      child_sku: 'CENERS',
      stock: 30,
      color: 'rojo',
      size: 'S'
    },
    {
      child_sku: 'CENEAS',
      stock: 30,
      color: 'azul',
      size: 'S'
    },
    {
      child_sku: 'CENEMM',
      stock: 15,
      color: 'Amarillo',
      size: 'M'
    }

  ]
}

describe('Post Create product', () => {
  afterAll(async () => {
    await Item.collection.drop()
    await Product.collection.drop()
    await mongoose.disconnect()
    app.close()
  })

  it('product create', async () => {
    const res = await request(app)
      .post('/products/register')
      .send(product)
    expect(res.statusCode).toBe(201)
    expect(res.body.message).toBe(`Product saved ${product.parent_sku}`)
  })
})
