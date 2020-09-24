import request from 'supertest'
import mongoose from 'mongoose'
import { server } from '../bin/server'
import Product from '../Model/Product'
import Item from '../Model/Item'

const { DB_USERNAME, DB_PASSWORD, DB_HOSTNAME, DB_DATABASE } = process.env

describe('ProductController', () => {
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
  afterAll(async () => {
    await Item.deleteMany()
    await Product.deleteMany()
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
    const item =  {
      child_sku: 'CEERS',
      stock: 30,
      color: 'Negro',
      size: 'S'
    }
    it('Debe de añadir un articulo', async () => {

      const res = await request(server)
        .put('/products/add/item/5f67940fc155976374b99876')
        .send(item)
      expect(res.statusCode).toBe(201)
      expect(res.body.message).toBe('Add item on product')
    })

    it('Debe de dar un Error', async () => {
      const res = await request(server)
        .put('/products/add/item/5f67940fc155976374b99874')
        .send(item)

      expect(res.statusCode).toBe(404)
      expect(res.body.message).toBe('Not found product')
    })
  })
  describe('FIND', () => {
    
    it('Debe de devolver todos los products', async () => {
      const res = await request(server)
      .get('/products/')
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Find all product')
    })
    
    it('Debe de devolver un producto', async () => {
      const res = await request(server)
      .get('/products/product/5f67940fc155976374b99876')
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Find product')
      expect(res.body.product.parent_sku).toBe('CC00')
    })

    it('Debe de devolver un articulo', async () => {
      const res = await request(server)
      .get('/products/items/5f67940fc155976374b99877')
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Find item')
      expect(res.body.item.color).toBe('Verde')
    })

  })
})