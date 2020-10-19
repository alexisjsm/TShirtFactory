import server from '../bin/server'
import database from '../bin/database'
import request from 'supertest'
import Wallet from '../Model/Wallet'
import User from '../Model/User'

describe('WalletController', () => {
  let tokenUser, creditCardId
  beforeAll(async () => {
    await request(server).post('/users/register/').send({
      name: 'Oscar',
      lastname: 'Perez',
      genre: 'man',
      email: 'oscarperez@gmail.com',
      password: 'abc123.'
    })
    const res = await request(server).post('/auth/login').send({
      email: 'oscarperez@gmail.com',
      password: 'abc123.'
    })
    tokenUser = res.body.refresh_token
  })

  afterAll(async () => {
    await User.deleteMany()
    await Wallet.deleteMany()
    await database.close()
    await server.close()
  })

  describe('CREATE', () => {
    it('Debe de añadir una tarjeta en la billetera', async () => {
      const res = await request(server)
        .post('/wallet/register')
        .set('Authorization', tokenUser)
        .send({
          type: 'debit',
          title: 'Oscar Perez',
          cardNumber: '5555 5555 5555 5555',
          valid: {
            month: 1,
            year: 0
          },
          balance: 0
        })

      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('creditCard add')
      expect(res.body).toHaveProperty('wallet')
      creditCardId = res.body.wallet._id
    })

    it('Debe de lanzar un error al introducir una tarjeta en la billetera', async () => {
      const res = await request(server)
        .post('/wallet/register')
        .set('Authorization', tokenUser)
        .send({
          type: 'debit',
          title: 'Oscar Perez',
          cardNumber: '5555 5555 5555 55554',
          valid: {
            month: 1,
            year: 0
          }
        })
      expect(res.statusCode).toBe(400)
    })
  })

  describe('UPDATE', () => {
    it('Debe de actualizar la tarjeta', async () => {
      const res = await request(server)
        .put(`/wallet/update/${creditCardId}`)
        .set('Authorization', tokenUser)
        .send({
          title: 'Maria Rodriguez',
          cardNumber: '3455 5555 5555 5531',
          balance: 20.0
        })
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('updated credit card')
      expect(res.body).toHaveProperty('creditcard')
    })
    it('Debe de lanzar un error al actualizar una tarjeta inexistente', async () => {
      const res = await request(server)
        .put('/wallet/update/5f85ba134f4148cfd1903aab')
        .set('Authorization', tokenUser)
        .send({
          title: 'Maria Rodriguez',
          cardNumber: '3455 5555 5555 5531',
          balance: 20.0
        })
      expect(res.statusCode).toBe(404)
      expect(res.body.message).toBe('Not found credit card')
    })
  })

  describe('FIND', () => {
    it('Debe obtener todas la tarjetas del usuario', async () => {
      const res = await request(server)
        .get('/wallet/')
        .set('Authorization', tokenUser)
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Wallet')
      expect(res.body.wallet).toHaveLength(1)
    })
  })

  describe('REMOVE', () => {
    it('Debe eliminar la tarjeta', async () => {
      const res = await request(server)
        .delete(`/wallet/remove/${creditCardId}`)
        .set('Authorization', tokenUser)

      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Removed credit card')
    })

    it('Debe de lanzar un error al intentar eliminar la tarjeta', async () => {
      const res = await request(server)
        .delete(`/wallet/remove/${creditCardId}`)
        .set('Authorization', tokenUser)

      expect(res.statusCode).toBe(404)
      expect(res.body.message).toBe('Not found credit card')
    })
  })
})
