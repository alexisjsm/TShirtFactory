import request from 'supertest'
import server from '../bin/server'
import database from '../bin/database'
import Product from '../Model/Product'
import Item from '../Model/Item'
import User from '../Model/User'

describe('ProductController', () => {
  beforeAll(async () => {
    const seller = new User({
      name: 'Maria',
      lastname: 'Rodriguez',
      email: 'mariarodriguez@gmail.com',
      password: 'password',
      role: 'seller',
      genre: 'woman'
    })
    seller.save()
    const user = new User({
      name: 'Jorge',
      lastname: 'Aries',
      email: 'jorgearies@gmail.com',
      password: 'password',
      genre: 'man'
    })
    user.save()
  })

  let tokenSeller, tokenUser

  beforeEach(async () => {
    const resSeller = await request(server)
      .post('/auth/login')
      .send({
        email: 'mariarodriguez@gmail.com',
        password: 'password'
      })
    tokenSeller = resSeller.body.refresh_token

    const resUser = await request(server)
      .post('/auth/login')
      .send({
        email: 'jorgearies@gmail.com',
        password: 'password'
      })
    tokenUser = resUser.body.refresh_token
  })

  afterAll(async () => {
    await Product.deleteMany()
    await User.deleteMany()
    await server.close()
    await database.close()
  })

  describe('CREATE', () => {
    const product = {
      parent_sku: 'CENE00',
      title: 'CAMISA ESTAMPA DE NAVE ESPACIAL',
      description: 'Camisa de algodón',
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

    it('Debe de denegar el acceso al usuario con rol `user`', async () => {
      const res = await request(server)
        .post('/products/register')
        .set('Authorization', `${tokenUser}`)
        .send(product)
      expect(res.statusCode).toBe(401)
      expect(res.body.message).toBe("You don't have access")
    })

    it('Debe de crear el product con usuario seller', async () => {
      const res = await request(server)
        .post('/products/register')
        .set('Authorization', `${tokenSeller}`)
        .send(product)
      expect(res.statusCode).toBe(201)
      expect(res.body.message).toBe(`Product saved ${product.parent_sku}`)
    })
    it('Debería de devolver un 409', async () => {
      const res = await request(server)
        .post('/products/register')
        .set('Authorization', `${tokenSeller}`)
        .send(product)
      expect(res.statusCode).toBe(409)
      expect(res.body.message).toBe('duplicate key error collection')
    })
  })

  describe('UPDATE', () => {
    beforeAll(async () => {
      await Product.insertMany({
        _id: '5f67940fc155976374b99876',
        parent_sku: 'CC00',
        title: 'Camisa de cuadritos',
        description: 'Camisa de algodón con cuadritos de colores',
        price: 7.99,
        categories: ['Camisa'],
        items: ['5f67940fc155976374b99877', '5f7b7e012d206f932b45a295']
      })

      await Item.insertMany([
        {
          _id: '5f67940fc155976374b99877',
          child_sku: 'CCVM',
          stock: 19,
          color: 'Rojo',
          size: 'M',
          product: '5f67940fc155976374b99876'
        },
        {
          _id: '5f7b7e012d206f932b45a295',
          child_sku: 'CCAMM',
          stock: 19,
          color: 'Amarillo',
          size: 'M',
          product: '5f67940fc155976374b99876'
        }
      ])
    })

    it('Debe de actualizar el titulo de un producto', async () => {
      const res = await request(server)
        .put('/products/change/product/5f67940fc155976374b99876')
        .set('Authorization', `${tokenSeller}`)
        .send({
          title: 'Camisa de Cuadros'
        })
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('product updated')
      expect(res.body.product.title).toBe('Camisa de Cuadros')
    })
    it('Debe de intentar de actualizar el titulo de un producto y devolver un error de autenticación', async () => {
      const res = await request(server)
        .put('/products/change/product/5f67940fc155976374b99876')
        .set('Authorization', `${tokenUser}`)
        .send({
          title: 'Camisa de Cuadros'
        })
      expect(res.statusCode).toBe(401)
      expect(res.body.message).toBe("You don't have access")
    })

    it('Debe de actualizar el color de un articulo', async () => {
      const res = await request(server)
        .put('/products/change/item/5f67940fc155976374b99877')
        .set('Authorization', `${tokenSeller}`)
        .send({
          color: 'Verde'
        })
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Item updated')
      expect(res.body.item.color).toBe('Verde')
    })
  })

  describe('ADD', () => {
    const item = {
      child_sku: 'CEERS',
      stock: 30,
      color: 'Negro',
      size: 'S'
    }
    it('Debe de añadir un articulo', async () => {
      const res = await request(server)
        .put('/products/add/item/5f67940fc155976374b99876')
        .set('Authorization', `${tokenSeller}`)
        .send(item)
      expect(res.statusCode).toBe(201)
      expect(res.body.message).toBe('Add item on product')
    })

    it('Debe de dar un Error', async () => {
      const res = await request(server)
        .put('/products/add/item/5f67940fc155976374b99874')
        .set('Authorization', `${tokenSeller}`)
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

    it('Debe de devolver un error al devolver un producto', async () => {
      const res = await request(server)
        .get('/products/product/5f67940fc155976374b99879')
      expect(res.statusCode).toBe(404)
      expect(res.body.message).toBe('Not found product')
    })

    it('Debe de devolver un error al devolver un articulo', async () => {
      const res = await request(server)
        .get('/products/items/5f67940fc155976374b99881')
      expect(res.statusCode).toBe(404)
      expect(res.body.message).toBe('Not found Item on product')
    })
    it('Debe de devolver el product por el title NAVE', async () => {
      const res = await request(server)
        .get('/products/search/title?q=Nave')
      expect(res.statusCode).toBe(200)
      expect(res.body.products).toHaveLength(1)
    })
    it('Debe de devolver el producto por categorias', async () => {
      const res = await request(server)
        .get('/products/search?categories=Camisa')
      expect(res.statusCode).toBe(200)
      expect(res.body.products).toHaveLength(2)
    })

    it('Debe de devolver el producto por parent_sku', async () => {
      const res = await request(server)
        .get('/products/search?parentsku=CENE00')
      expect(res.statusCode).toBe(200)
      expect(res.body.products).toHaveLength(1)
    })
  })

  describe('DELETE', () => {
    it('Debe de eliminar un articulo del producto indicado', async () => {
      const res = await request(server)
        .delete('/products/remove/item')
        .set('Authorization', `${tokenSeller}`)
        .send({
          itemId: '5f7b7e012d206f932b45a295'
        })
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Removed item on product')
    })
    it('Debe de de eliminar el productos indicado', async () => {
      const res = await request(server)
        .delete('/products/remove/product/')
        .set('Authorization', `${tokenSeller}`)
        .send({
          products: ['5f67940fc155976374b99876']
        })
      expect(res.statusCode).toBe(200)
      expect(res.body.product).toMatchObject({
        n: 1,
        ok: 1,
        deletedCount: 1
      })
    })
  })

  describe('CHECK ERROR', () => {
    beforeAll(async () => {
      await Product.deleteMany()
      await Item.deleteMany()
    })
    it('Debe de devolver un error', async () => {
      const res = await request(server)
        .get('/products/')
      expect(res.statusCode).toBe(404)
      expect(res.body.message).toBe('Not found Product')
    })
  })
})
