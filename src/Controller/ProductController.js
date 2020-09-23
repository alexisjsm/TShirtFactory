import Product from '../Model/Product'
import mongoose from 'mongoose'
import Item from '../Model/Item'
import { ErrorHandle, handleError } from '../bin/ErrorHandle'

const ProductController = {

  register: async (req, res, next) => {
    try {
      const { items, ...data } = req.body

      if (!items) throw new ErrorHandle(409, 'Product need a item')

      const product = await Product.create({ ...data, items: items.map(() => { return new mongoose.Types.ObjectId() }) })
        .then(product => {
          if (!product) {
            throw new ErrorHandle(409, product)
          }
          return product
        })
      items.forEach(async (value, index) => {
        await Item.findOneAndRemove({ child_sku: value.child_sku })
        await Item.create({ _id: product.items[index], ...value, product: product.id })
          .then(item => {
            if (!item) {
              throw new ErrorHandle(409, item)
            }
            return item
          })
      })
      res.status(201).json({ message: `Product saved ${product.parent_sku}` })
    } catch (error) {
      next(error)
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
    } catch (error) {
      next(error)
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
  findItemById: async (req, res, next) => {
    const { itemId } = req.params
    try {
      await Product.findOne({
        items: {
          $in: [itemId]
        }
      }).then(async product => {
        if (!product) {
          throw new ErrorHandle(404, 'Not found Item on product')
        }
        await Item.findById(itemId).then(item => {
          if (!item) {
            throw new ErrorHandle(404, 'Not found Item')
          }
          res.status(201).json({ message: 'Find item', item })
        })
      })
    } catch (error) {
      next(error)
    }
  },
  updateParent: async (req, res, next) => {
    const { id } = req.params
    const { items, ...data } = req.body
    try {
      await Product.findOneAndUpdate({ _id: id }, data, { new: true, runValidators: true }).select('-items')
        .then(product => {
          if (product) {
            res.status(200).json({ message: 'product updated', product })
          } else {
            res.status(404).json({ message: 'Not found product' })
          }
        })
    } catch (error) {
      next()
    }
  },
  addItem: async (req, res, next) => {
    const { id } = req.params
    try {
      await Product.findById(id).then(async product => {
        if (!product) throw new ErrorHandle(404, 'Not found product')
        await Item.create({ ...req.body, product: product.id })
          .then(async item => {
            await Product.updateOne({ _id: id }, {
              $push: {
                items: item.id
              }
            }).then(product => {
              if (!product) throw new ErrorHandle(400, 'Something is wrong')
              res.status(201).json({ message: 'Add item on product', item })
            })
          })
      })
    } catch (error) {
      next(error)
    }
  },
  updateItems: async (req, res) => {
    const { itemId } = req.params
    try {
      await Item.findOneAndUpdate({ _id: itemId }, req.body, { new: true, runValidators: true })
        .then(item => {
          if (item) {
            res.status(200).json({ message: 'Item updated', item })
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
