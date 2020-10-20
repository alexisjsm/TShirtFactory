import faker from 'faker'
import  mongoose  from 'mongoose'
import Item from '../../../Model/Item'
import Product from '../../../Model/Product'


const products = [...Array(10)].map(el => ({
  parent_sku: faker.random.alphaNumeric(4),
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: faker.commerce.price(),
  items: [...Array(5)].map(() => new mongoose.Types.ObjectId()),
  categories: [...Array(2)].map(() => faker.commerce.productAdjective())
}))

const items = [...Array(10)].map(el => ({
  item: [...Array(5)].map(() => ({
    child_sku: faker.random.alphaNumeric(4),
    stock: faker.random.number(99),
    color: faker.commerce.color(),
    size: faker.random.arrayElement(['XS', 'S','M', 'L', 'XL', 'XXL', 'XXL'])
  }))
})) 

class ProductSeeder {
  async createProducts () {
    console.log('Generate: products')
    const product = await Product.create(products).then(product => product)
    console.log('injected: Products')
    console.log('Generate: items')
    items.map((el,i) => {
      el.item.map((val, index) => {
      val._id = product[i].items[index]
      val.product = product[i]._id
      })
    })
    items.forEach(element => {
      element.item.forEach(async el => {
        await Item.create(el).then(item => {
        })
      })
    });
    console.log('injected: items')
  } 

  async dropProducts () {
    await Product.deleteMany().then(products => {
      if (products) console.log('drop: Products')
    })
    await Item.deleteMany().then(item => {
      if (item) console.log('drop: Item')
    })
  }
}

export default ProductSeeder


