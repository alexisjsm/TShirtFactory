import request from 'supertest'
import server from '../bin/server'
import database from '../bin/database'
import Product from '../Model/Product'
import Item from '../Model/Item'
import ShoppingCart from '../Model/ShoppingCart'

describe('ShoppingCart Controller', () => {
  let cartId, subcartId

  beforeAll(async () => {
    await Product.insertMany([
      {
        _id: '5f7a02ca2d206f932b45a28a',
        parent_sku: 'PO00',
        title: 'Product One',
        description: 'it is a product one',
        categories: ['test', 'product'],
        price: 19.99,
        items: ['5f7a036e2d206f932b45a28b', '5f7a037a2d206f932b45a28c', '5f7a03802d206f932b45a28d', '5f7a03872d206f932b45a28e']
      },
      {
        _id: '5f7a07582d206f932b45a28f',
        parent_sku: 'PT00',
        title: 'Product Two',
        description: 'it is a product two',
        categories: ['test', 'product'],
        price: 12.99,
        items: ['5f7a07622d206f932b45a290', '5f7a07672d206f932b45a291', '5f7a076b2d206f932b45a292', '5f7a07702d206f932b45a293']
      }
    ])
    await Item.insertMany([
      {
        _id: '5f7a036e2d206f932b45a28b',
        child_sku: 'PORS',
        stock: 20,
        color: 'Rojo',
        size: 'S',
        product: '5f7a02ca2d206f932b45a28a'

      },
      {
        _id: '5f7a037a2d206f932b45a28c',
        child_sku: 'POVM',
        color: 'Verde',
        stock: 10,
        size: 'M',
        product: '5f7a02ca2d206f932b45a28a'

      },
      {
        _id: '5f7a03802d206f932b45a28d',
        child_sku: 'PORAM',
        color: 'Rosa',
        stock: 20,
        size: 'M',
        product: '5f7a02ca2d206f932b45a28a'

      },
      {
        _id: '5f7a03872d206f932b45a28e',
        child_sku: 'POAMXL',
        color: 'Amarillo',
        stock: 10,
        size: 'XL',
        product: '5f7a02ca2d206f932b45a28a'
      },
      {
        _id: '5f7a07622d206f932b45a290',
        child_sku: 'PTAMXL',
        color: 'Amarillo',
        stock: 10,
        size: 'XL',
        product: '5f7a07582d206f932b45a28f'
      },
      {
        _id: '5f7a07672d206f932b45a291',
        child_sku: 'PTRXL',
        color: 'Rojo',
        stock: 10,
        size: 'XL',
        product: '5f7a07582d206f932b45a28f'
      },
      {
        _id: '5f7a076b2d206f932b45a292',
        child_sku: 'PTAM',
        color: 'Azul',
        stock: 30,
        size: 'M',
        product: '5f7a07582d206f932b45a28f'
      }
    ])
  })
  afterAll(async () => {
    await Product.deleteMany()
    await Item.deleteMany()
    await ShoppingCart.deleteMany()
    await server.close()
    await database.close()
  })

  describe('ADD', () => {
    test('Debe de añadir un producto a la cesta', async () => {
      const res = await request(server)
        .post('/cart/add')
        .send({
          productId: '5f7a02ca2d206f932b45a28a',
          itemId: '5f7a036e2d206f932b45a28b'
        })
      cartId = res.body.cart._id
      expect(res.statusCode).toBe(201)
      expect(res.body.message).toBe('Product in cart')
    })
    test('Debe de añadir otro articulo del mismo producto a la cesta', async () => {
      const res = await request(server)
        .patch(`/cart/push/${cartId}`)
        .send({
          productId: '5f7a02ca2d206f932b45a28a',
          itemId: '5f7a03872d206f932b45a28e',
          quantity: 2
        })
      subcartId = res.body.cart.products.find(value => value.itemId === '5f7a03872d206f932b45a28e' ? value._id : null)
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Add cart')
      expect(res.body.cart).toMatchObject({
        total_price: 59.97
      })
    })
    test('Debe de añadir otro product a la cesta', async () => {
      const res = await request(server)
        .patch(`/cart/push/${cartId}`)
        .send({
          productId: '5f7a07582d206f932b45a28f',
          itemId: '5f7a07672d206f932b45a291',
          quantity: 1
        })
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Add cart')
      expect(res.body.cart).toMatchObject({
        total_price: 72.96
      })
    })
    test('Debe de eliminar un producto de la cesta', async () => {
      const res = await request(server)
        .patch(`/cart/pull/${cartId}`)
        .send({
          subcartId
        })
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('removed item on cart')
      expect(res.body.cart).toMatchObject({
        total_price: 32.98
      })
    })

    test('Debe de lanzar un error al añadir un product si el articulo no existe', async () => {
      const res = await request(server)
        .post('/cart/add/')
        .send({
          productId: '5f7a07582d206f932b45a28f',
          itemId: '5f7a07702d206f932b45a293'
        })
      expect(res.statusCode).toBe(404)
      expect(res.body.message).toBe('Not found item')
    })
  })

  describe('FIND', () => {
    test('Debe de devolver la cesta', async () => {
      const res = await request(server)
        .get(`/cart/${cartId}`)
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Find cart')
    })
  })

  describe('DELETE', () => {
    test('Debe eliminar la cesta', async () => {
      const res = await request(server)
        .delete(`/cart/remove/${cartId}`)
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Removed cart')
    })

    test('Debe de lanzar un error al intentar eliminar una lista', async () => {
      const res = await request(server)
        .delete(`/cart/remove/${cartId}`)
      expect(res.statusCode).toBe(404)
      expect(res.body.message).toBe('Not found cart')
    })
  })
})
