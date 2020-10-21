import faker from 'faker'
import AddressBook from '../../../Model/Addressbook'
import User from '../../../Model/User'
import Wallet from '../../../Model/Wallet'

class UserSeeder {

  constructor () {
    this.users = [...Array(2)].map((el) => ({
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      password: 'password',
      genre: faker.random.arrayElement(['man', 'woman', 'unknown'])
    }))

    this.addresses = [...Array(2)].map((el) => ({
      name: faker.name.findName(),
      lastname: faker.name.lastName(),
      country: faker.address.country(),
      location: faker.address.county(),
      state: faker.address.state(),
      postcode: faker.address.zipCode('#####'),
      mobile: faker.phone.phoneNumber('#########'),
      isDefault: false
    }))
    this.wallets = [...Array(2)].map((el) => ({
      creditCard: {
        type: faker.random.arrayElement(['credit', 'debit']),
        cardNumber: '5555 5555 5555 5555',
        valid: {
          month: faker.random.number({ min: 1, max: 12 }),
          year: faker.random.number({ min: 0, max: 99 })
        },
        balance: faker.finance.amount()
      }
    }))
  }

  async createUsers() {
    const user = await User.create(this.users).then((user) => {
      console.log('Generate: Users')
      return user
    })
    console.log('Generate: Address')
    this.addresses.map((el, index) => {
      el.userId = user[index].id
    })
    console.log('Generate: Wallet')
    this.wallets.map((el, index) => {
      el.creditCard.title = `${user[index].name} ${user[index].lastname}`
      el.userId = user[index].id
    })
    const address = await AddressBook.create(this.addresses).then(
      (address) => {
        console.log('Injected: Address')
        return address
      })
    const wallet = await Wallet.create(this.wallets).then((wallet) => {
      console.log('Injected: Wallet')
      return wallet
    })

    await user.forEach(async (el, index) => {
      await User.updateOne(
        { _id: el._id },
        { $push: { address: address[index]._id, wallet: wallet[index]._id } }
      ).then((res) => res)
    })
    console.log('Injected: Users')
  }

  async dropUsers() {
    await User.deleteMany().then((user) => {
      console.log('Drop: User')
      return user
    })
    await AddressBook.deleteMany().then((address) => {
      console.log('Drop: Address')
      return address
    })

    await Wallet.deleteMany().then((wallet) => {
      console.log('Drop: Wallet')
      return wallet
    })
  }
}

export default UserSeeder
