import faker from 'faker'
import mongoose from 'mongoose'
import Item from '../../../Model/Item'
import Product from '../../../Model/Product'

class ProductSeeder {
  constructor () {
    this.products = [...Array(10)].map((el) => ({
      parent_sku: faker.random.alphaNumeric(4),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      items: [...Array(5)].map(() => new mongoose.Types.ObjectId()),
      categories: [...Array(2)].map(() => faker.commerce.productAdjective())
    }))
    this.items = [...Array(10)].map((el) => ({
      item: [...Array(5)].map(() => ({
        child_sku: faker.random.alphaNumeric(4),
        stock: faker.random.number(99),
        color: faker.commerce.color(),
        size: faker.random.arrayElement(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXL'])
      }))
    }))
  }

  async createProducts() {
    console.log('Generate: products')
    const product = await Product.create(this.products).then((product) => {
      console.log('injected: Products')
      return product
    })
    console.log('Generate: items')
    this.items.map((el, i) => {
       el.item.map((val, index) => {
        val._id = product[i].items[index]
        val.product = product[i]._id
      })
    })

    this.items = this.items.flatMap(val => val.item)
    await Item.create(this.items).then(items => {
      console.log('injected: items')
      return items
    })
  }

  async dropProducts() {
    await Product.deleteMany().then((products) => {
      console.log('drop: Products')
      return products
    })
    .catch(error => console.log(error))
    await Item.deleteMany().then((item) => {
      console.log('drop: Item')
      return item
    })
    .catch(error => console.log(error))
  }
}

export default ProductSeeder
