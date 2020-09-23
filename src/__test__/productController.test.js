import request from 'supertest'
import mongoose from 'mongoose'
import { server } from '../bin/server'
import Product from '../Model/Product'
import Item from '../Model/Item'

const { DB_USERNAME, DB_PASSWORD, DB_HOSTNAME, DB_DATABASE } = process.env

describe('POST productController:register', () => {
  beforeEach(async () => {
    await mongoose.connect(`mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOSTNAME}:27017/${DB_DATABASE}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    await server.listen(3000)
  })
  afterEach(async () => {
    await server.close()
  })

  describe('CREATE', () => {
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
    afterAll(async () => {
      await Item.deleteMany()
      await Product.deleteMany()
    })
    it('Debería de devolver una 201 un mensaje', async () => {
      const res = await request(server)
        .post('/products/register')
        .send(product)
      expect(res.statusCode).toBe(201)
      expect(res.body.message).toBe(`Product saved ${product.parent_sku}`)
    })
    it('Debería de devolver un 409', async () => {
      const res = await request(server)
        .post('/products/register')
        .send(product)
      expect(res.statusCode).toBe(409)
      expect(res.body.message).toBe('duplicate key error collection')
    })
  })

  describe('UPDATE', () => {
    beforeAll(async () => {
      const product = await Product.create({
        _id: '5f67940fc155976374b99876',
        parent_sku: 'CC00',
        title: 'Camisa de cuadritos',
        description: 'Camisa de algodón con cuadritos de colores',
        price: 7.99,
        categories: ['Camisa'],
        items: ['5f67940fc155976374b99877']
      })
      product.save()
      const item = await Item({
        _id: '5f67940fc155976374b99877',
        child_sku: 'CCVM',
        stock: 19,
        color: 'Rojo',
        size: 'M',
        product: '5f67940fc155976374b99876'
      })
      item.save()
    })
    afterAll(async () => {
      await Product.deleteMany()
      await Item.deleteMany()
    })

    it('Debe de actualizar el titulo de un producto', async () => {
      const res = await request(server)
        .put('/products/change/product/5f67940fc155976374b99876')
        .send({
          title: 'Camisa de Cuadros'
        })
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('product updated')
      expect(res.body.product.title).toBe('Camisa de Cuadros')
    })

    it('Debe de actualizar el color de un articulo', async () => {
      const res = await request(server)
        .put('/products/change/item/5f67940fc155976374b99877')
        .send({
          color: 'Verde'
        })
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Item updated')
      expect(res.body.item.color).toBe('Verde')
    })
  })

  describe('ADD', () => {
    it('Debe de añadir un articulo', async () => {
      const item = {
        _id: '5f67940fc155976374b99878',
        child_sku: 'CINS',
        stock: 99,
        color: 'Negro',
        size: 'S',
        product: '5f67940fc155976374b99876'
      }
      const res = await request(server)
        .put('/add/item/5f67940fc155976374b99876')
        .send(item)
      expect(res.statusCode).toBe(201)
      expect(res.body.message).toBe('Item add on Product')
    })
  })
})
