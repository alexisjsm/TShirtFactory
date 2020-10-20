import faker from 'faker'
import AddressBook from '../../../Model/Addressbook'
import User from '../../../Model/User'
import Wallet from '../../../Model/Wallet'


const users = [...Array(2)].map(el => ({
  name: faker.name.firstName(),
  lastname: faker.name.lastName(),
  email: faker.internet.email(),
  password: 'password',
  genre: faker.random.arrayElement(['man', 'woman', 'unknown'])
}))

const addresses = [...Array(2)].map(el => ({
  name: faker.name.findName(),
  lastname: faker.name.lastName(),
  country: faker.address.country(),
  location: faker.address.county(),
  state: faker.address.state(),
  postcode: faker.address.zipCode("#####"),
  mobile: faker.phone.phoneNumber("#########"),
  isDefault: false
}))

const wallets = [...Array(2)].map(el => ({
  creditCard: {
    type: faker.random.arrayElement(['credit', 'debit']),
    cardNumber: "5555 5555 5555 5555",
    valid:{
      month: faker.random.number({min: 1, max: 12}),
      year:  faker.random.number({min: 0, max: 99})
    },
    balance: faker.finance.amount() 
  }
}))

class UserSeeder {
  async createUsers () {
    console.log('Generate: Users')
    const user = await User.create(users)
    .then(user => user)
    console.log('Generate: Address')
    addresses.map((el, index) => {
      el.userId = user[index].id
    })
    console.log('Generate Wallet')
    wallets.map((el, index) => {
      el.creditCard.title = `${user[index].name} ${user[index].lastname}`
      el.userId = user[index].id
    })
    console.log('Injected: Address')
    const address = await AddressBook.create(addresses).then(address => address)
    console.log('Injected: Wallet')
    const wallet  = await Wallet.create(wallets).then(wallet => wallet)
    
    await user.forEach(async (el,index) => {
      await User.updateOne({_id: el._id}, {$push: {address: address[index]._id, wallet: wallet[index]._id}}).then(res => res)
    })
    console.log('Injected: Users')
}

  async dropUsers () {
    await User.deleteMany().then(user => {
      if (user) console.log('Drop: User')
    })
    await AddressBook.deleteMany().then(address =>{
      if(address) console.log('Drop: AddressBook')
    })

    await Wallet.deleteMany().then(wallet => {
      if (wallet) console.log('Drop: Wallet')
    })
  }

}

export default UserSeeder



