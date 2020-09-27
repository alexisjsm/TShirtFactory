import mongoose from 'mongoose'
import { server } from '../bin/server'
import User from '../Model/User'
import request from 'supertest'

const { DB_USERNAME, DB_PASSWORD, DB_HOSTNAME, DB_DATABASE } = process.env

describe('UserController', () => {
  let token, tokenAdmin
  beforeAll(async () => {
    await mongoose.connect(`mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOSTNAME}:27017/${DB_DATABASE}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    await server.listen(3000)
    const userAdmin = new User({
      name: 'admin',
      lastname: 'username',
      email: 'admin@gmail.com',
      password: 'password',
      role: 'admin'
    })
    userAdmin.save()
  })
  beforeEach(async () => {
    const resAdmin = await request(server)
      .post('/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: 'password'
      })
    tokenAdmin = resAdmin.body.refresh_token

    const res = await request(server)
      .post('/auth/login')
      .send({
        email: 'frankroger@gmail.com',
        password: 'password'
      })
    token = res.body.refresh_token
  })
  afterAll(async () => {
    await User.deleteMany()
    await server.close()
  })

  describe('CREATE', () => {
    const userCreate = {
      name: 'Frank',
      lastname: 'Roger',
      email: 'frankroger@gmail.com',
      password: 'password',
      genre: 'man'
    }

    it('Debe de crear un un usuario', async () => {
      const res = await request(server)
        .post('/users/register')
        .send(userCreate)

      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('User created')
    })
    it('Debe de lanzar un error al crear el usuario', async () => {
      const res = await request(server)
        .post('/users/register')
        .send(userCreate)

      expect(res.statusCode).toBe(409)
      expect(res.body.message).toBe('This user exists')
    })
  })

  describe('UPDATE', () => {
    const userCreate = {
      _id: '5f6df853f4b195c54e00341f',
      name: 'Roger',
      lastname: 'Jackson',
      email: 'rogerjackson@gmail.com',
      genre: 'man',
      password: 'password'
    }
    beforeAll(async () => {
      const user = new User(userCreate)
      user.save()
    })

    it('Debe de modificar el nombre del usuario', async () => {
      const res = await request(server)
        .put('/users/change/5f6df853f4b195c54e00341f')
        .send({
          name: 'Felix'
        })
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('User updated')
    })

    it('Debe de modificar el rol', async () => {
      const res = await request(server)
        .put('/users/change/role/5f6df853f4b195c54e00341f')
        .set('Authorization', `${tokenAdmin}`)
        .send({
          role: 'seller'
        })
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('the user email rogerjackson@gmail.com change to role seller')
    })

    it('Debe de lanzar un error por email duplicado', async () => {
      const res = await request(server)
        .put('/users/change/5f6df853f4b195c54e00341f')
        .send({
          email: 'frankroger@gmail.com'
        })
      expect(res.statusCode).toBe(409)
      expect(res.body.message).toBe('duplicate key error collection')
    })

    it('Debe de lanzar un error por conflicto de genero', async () => {
      const res = await request(server)
        .put('/users/change/5f6df853f4b195c54e00341f')
        .send({
          genre: 'dog'
        })
      expect(res.statusCode).toBe(409)
      expect(res.body.message).toBe('Validation failed: genre: `dog` is not a valid enum value for path `genre`.')
    })
  })

  describe('DELETE', () => {
    it('Debe de lanzar un error al intentar eliminar un usuario sin permiso', async () => {
      const res = await request(server)
        .delete('/users/remove/5f6df853f4b195c54e00341f')
        .set('Authorization', `${token}`)
      expect(res.statusCode).toBe(401)
      expect(res.body.message).toBe("You don't have access")
    })

    it('Debe de eliminar un usuario siendo administrador', async () => {
      const res = await request(server)
        .delete('/users/remove/5f6df853f4b195c54e00341f')
        .set('Authorization', `${tokenAdmin}`)
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Deleted user')
    })
  })

  describe('FIND', () => {
    let token

    beforeAll(async () => {
      const res = await request(server)
        .post('/auth/login')
        .send(
          {
            email: 'frankroger@gmail.com',
            password: 'password'
          }
        )
      token = res.body.refresh_token
    })

    it('Debe de obtener el perfil del usuario', async () => {
      const res = await request(server)
        .get('/users/profile')
        .set('Authorization', `${token}`)
      expect(res.statusCode).toBe(200)
      expect(res.body.user).toMatchObject({
        name: 'Frank',
        lastname: 'Roger',
        email: 'frankroger@gmail.com',
        genre: 'man'
      })
    })
  })
})
