import Product from '../Model/Product'
import mongoose from 'mongoose'
import Item from '../Model/Item'
import { ErrorHandle } from '../bin/ErrorHandle'

const ProductController = {

  register: async (req, res) => {
    try {
      const { items, ...data } = req.body

      const product = await Product.create({ ...data, items: items.map(() => { return new mongoose.Types.ObjectId() }) })
        .then(product => {
          if (!product) {
            throw new ErrorHandle(409, product)
          }
          return product
        })
      items.forEach(async (value, index) => {
        await Item.create({ ...value, product: product.items[index] })
          .then(item => {
            if (!item) {
              throw new ErrorHandle(409, item)
            }
            return item
          })
      })
      res.status(201).json({ message: `Product saved ${product.parent_sku}` })
    } catch (error) {
      res.status(500).json(error)
    }
  },
  findAll: async (req, res, next) => {
    try {
      await Product.find({}).populate('items', null, Item)
        .lean()
        .then(product => {
          if (product.length) {
            res.status(202).json(product)
          } else {
            throw new ErrorHandle(404, 'Not found Product')
          }
        })
      next()
    } catch (err) {
      next(err)
    }
  },

  findProductById: async (req, res, next) => {
    const { id } = req.params
    try {
      await Product.findById(id).populate('items', null, Item)
        .lean()
        .then(product => {
          if (!product) throw new ErrorHandle(404, 'Not found product')
          res.status(202).json({ message: 'Find the product', product })
        })
      next()
    } catch (error) {
      next(error)
    }
  },
  findItemById: async (req, res) => {
    const { id } = req.params

    try {
      await Product.findOne({
        items: {
          $in: [id]
        }
      })
        .then(async product => {
          if (product) {
            await Item.findById(id).populate('product', '-items')
              .lean()
              .then(item => {
                if (item) {
                  res.status(202).json({ message: 'We find Item', item })
                } else {
                  res.status(404).json({ message: 'Not found Item' })
                }
              })
          } else {
            res.status(404).json({ message: 'Not found Item on Product' })
          }
        })
    } catch (error) {
      res.status(202).json({ message: 'We have been a problem ', error })
    }
  },
  updateParent: async (req, res) => {
    const { id } = req.params
    const { items, ...data } = req.body
    try {
      await Product.findOneAndUpdate({ _id: id }, data, { new: true, runValidators: true }).select('-items')
        .then(product => {
          if (product) {
            res.status(202).json({ message: 'product updated', product })
          } else {
            res.status(404).json({ message: 'Not found product' })
          }
        })
    } catch (error) {
      res.status(500).json({ message: 'We have a problem ' })
    }
  },
  addItem: async (req, res) => {
    try {
      const { id } = req.params
      await Product.findById(id).then(product => {
        if (product) {
          Item.create({ ...req.body, product: id })
            .then(async item => {
              if (item) {
                res.json(item)
              } else {
                await Product.updateOne({ _id: id }, {
                  $push: {
                    items: item.id
                  }
                }, { new: true, runValidators: true })
                  .then(product => {
                    res.status(202).json(product)
                  })
              }
            }).catch(err => {
              res.status(404).json(err)
            })
        } else {
          res.status(404).json({ message: 'Not found product' })
        }
      })
    } catch (error) {
      res.status(500).json({ message: error })
    }
  },
  updateItems: async (req, res) => {
    const { itemId } = req.params
    try {
      await Item.findOneAndUpdate({ _id: itemId }, req.body, { new: true, runValidators: true })
        .then(item => {
          if (item) {
            res.status(202).json({ message: 'Updated', item })
          } else {
            res.status(404).json({ message: 'Not found item' })
          }
        })
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

export default ProductController
