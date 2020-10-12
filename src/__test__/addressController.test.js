import server from '../bin/server'
import database from '../bin/database'
import request from  'supertest'
import User from '../Model/User'

describe('AddressController', () => {
  let tokenUser, addressId
  
  beforeAll(async () => {

    const user = await request(server)
    .post('/users/register')
    .send({
      name: 'Raquel',
      lastname: 'Ortiz',
      genre: 'woman',
      email: 'raquelortiz@gmail.com',
      password: 'password'
    })

    const  login = await request(server)
    .post('/auth/login')
    .send({
      email: 'raquelortiz@gmail.com',
      password: 'password'
    })
    tokenUser = login.body.refresh_token
  })

  afterAll(async () => {
    await User.deleteMany()
    await database.close()
    await server.close()
  })
 
  describe('CREATE', () => {
    it('Debe crear una dirección', async () => {
      const res = await request(server)
      .post('/addressbook/register')
      .set('Authorization', tokenUser)
      .send({
        name: 'Raquel',
        lastname: 'Ortiz',
        country: 'España',
        location: 'Alicante',
        state: 'Valencia',
        postcode: '03001',
        mobile: '660454748',
        isDefault: true
      })
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Address add')
      expect(res.body).toHaveProperty('address.mobile')
      addressId = res.body.address._id
    })

    it('Debe de lanzar un error al indicar que hay otra dirección por defecto', async () => {
      const res = await request(server)
      .post('/addressbook/register')
      .set('Authorization', tokenUser)
      .send({
        name: 'Raquel',
        lastname: 'Ortiz',
        country: 'España',
        location: 'Alicante',
        state: 'Valencia',
        postcode: '03001',
        mobile: '660454748',
        isDefault: true
      })
      expect(res.statusCode).toBe(409)
      expect(res.body.message).toBe('This address can not be default')
    })
    it('Debe de lanzar un error por un introducir mas de un caracter en el postcode', async () => {
      const res = await request(server)
      .post('/addressbook/register')
      .set('Authorization', tokenUser)
      .send({
        name: 'Raquel',
        lastname: 'Ortiz',
        country: 'España',
        location: 'Alicante',
        state: 'Valencia',
        postcode: '030011',
        mobile: '660454748',
      })
      expect(res.statusCode).toBe(409)
    })
    it('Debe de lanzar un error por un introducir mas de un caracter en el mobile', async () => {
      const res = await request(server)
      .post('/addressbook/register')
      .set('Authorization', tokenUser)
      .send({
        name: 'Raquel',
        lastname: 'Ortiz',
        country: 'España',
        location: 'Alicante',
        state: 'Valencia',
        postcode: '030011',
        mobile: '6604547489',
      })
      expect(res.statusCode).toBe(409)
    })
  })

  describe('UPDATE', () => {
    it('Debe de actualizar la localidad de la dirección', async () => {
      const res = await request(server)
      .put(`/addressbook/update/${addressId}`)
      .set('Authorization', tokenUser)
      .send({
        location: 'Valencia'
      })
      expect(res.statusCode).toBe(200)
      expect(res.body.address.location).toBe('Valencia')
    })
   
    it('Debe de indicar que la dirección no se encuentra', async () => {
      const res = await request(server)
      .put(`/addressbook/update/5f843d052eee8cb97a82da5b`)
      .set('Authorization', tokenUser)
      .send({
        location: 'Valencia'
      })
      expect(res.statusCode).toBe(404)
      expect(res.body.message).toBe('Not found address')
    })

    it('Debe de indicar que hay otra dirección por defecto', async () => {
      const res = await request(server)
      .put(`/addressbook/update/${addressId}`)
      .set('Authorization', tokenUser)
      .send({
        isDefault: true
      })
      expect(res.statusCode).toBe(409)
      expect(res.body.message).toBe('This address can not be default')
    })

    it('Debe de lanzar un error por un introducir mas de un caracter en el telephone', async () => {
      const res = await request(server)
      .put(`/addressbook/update/${addressId}`)
      .set('Authorization', tokenUser)
      .send({
        telephone: "961555555a"
      })
      expect(res.statusCode).toBe(400)
    })
  })

  describe('FIND', () => {
    it('Debe de obtener la direccion', async () => {
      const res = await request(server)
      .get('/addressbook/')
      .set('Authorization', tokenUser)
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('All addresses')
    })
  })

  describe('REMOVE', () => {
    it('Debe de eliminar la dirección', async () => {
      const res = await request(server)
      .delete(`/addressbook/remove/${addressId}`)
      .set('Authorization', tokenUser)
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Remove address')
    })
    it('Debe de lanzar un error al eliminar la dirección', async () => {
      const res = await request(server)
      .delete(`/addressbook/remove/${addressId}`)
      .set('Authorization', tokenUser)
      expect(res.statusCode).toBe(404)
      expect(res.body.message).toBe('Not found address')
    })
  })

})
