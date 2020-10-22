import User from '../../../Model/User'

class UserRolesSeeder {

  constructor () {
    this.admin = [...Array(1)].map((el) => ({
      name: 'Jerry',
      lastname: 'Smith',
      email: 'jerryshmith@admin.com',
      password: 'password',
      genre: 'man',
      role: 'admin'
    }))
    this.seller = [...Array(1)].map((el) => ({
       name: 'Glootie',
       lastname: 'unknown',
       email: 'glootie@seller.com',
       password:'password',
       genre: 'unknown',
       role: 'seller'
    }))
  }

  async createUsers() {
    const admin = await User.create(this.admin).then((admin) => {
      console.log('Generate: admin')
      return admin
   })
   const seller = await User.create(this.seller).then(seller => {
     console.log('Generate: seller')
     return seller
   })

   if(admin && seller) console.log('Injected: admin & seller')

}

  async dropUsers() {
    await User.deleteMany().then((user) => {
      console.log('Drop: UserRolesSeeder')
      return user
    })
  }
}

export default UserRolesSeeder
