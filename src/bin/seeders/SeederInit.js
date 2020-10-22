import database from '../database'
import ProductSeeder from './generate/ProductSeeder'
import UserSeeder from './generate/UserSeeder'
import UserRolesSeeder from './generate/UsersRolesSeeder'

class SeederInit {
  constructor() {
    database.once('open', () => {
      console.log('INFO: Database connected')
    })
  }

  async charge() {
    await new UserSeeder().createUsers()
    await new UserRolesSeeder().createUsers()
    await new ProductSeeder().createProducts()
    await database.close(err => {
      throw new Error(err)
    })
  }

  async drop() {
    await new UserSeeder().dropUsers()
    await new ProductSeeder().dropProducts()
    await database.close(err => {
      throw new Error(err)
    })
  }
}

export default SeederInit
