import database from '../database'
import ProductSeeder from './generate/ProductSeeder'
import UserSeeder from './generate/UserSeeder'

class Seeder {

  constructor() {

    database.once('open', () => {
      console.log('INFO: Database connected')
    })
    
  }

   async charge () {
    await new UserSeeder().createUsers()
    await new ProductSeeder().createProducts()
  }

  async drop() {
    await new UserSeeder().dropUsers()
    await new ProductSeeder().dropProducts()
  }
}

export default Seeder

