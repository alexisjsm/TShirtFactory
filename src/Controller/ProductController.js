import Product from '../Model/Product'
import mongoose from 'mongoose'
import Item from '../Model/Item'
import { ErrorHandle } from '../bin/ErrorHandle'

const ProductController = {
  register: async (req, res, next) => {
    const { items, ...data } = req.body
    const { role } = req.user
    try {
      if (role === 'user') throw new ErrorHandle(401, "You don't have access")
      if (!items) throw new ErrorHandle(409, 'Product need a item')
      const product = await Product.create({
        ...data,
        items: items.map(() => {
          return new mongoose.Types.ObjectId()
        })
      }).then((product) => {
        if (!product) {
          throw new ErrorHandle(409, product)
        }
        return product
      })
      items.forEach(async (value, index) => {
        await Item.findOneAndRemove({ child_sku: value.child_sku })
        await Item.create({
          _id: product.items[index],
          ...value,
          product: product.id
        }).then((item) => {
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
      await Product.find({})
        .populate('items', null, Item)
        .lean()
        .then((product) => {
          if (product.length) {
            res.status(200).json({ message: 'Find all product', product })
          } else {
            throw new ErrorHandle(404, 'Not found Product')
          }
        })
    } catch (error) {
      next(error)
    }
  },

  findByTitle: async (req, res, next) => {
    const { q } = req.query
    try {
      await Product.find({
        title: {
          $regex: q,
          $options: 'i'
        }
      })
        .lean()
        .populate('items', null, Item)
        .then((products) => {
          if (products.length <= 0) throw new ErrorHandle(404, 'Not found')
          res.status(200).json({ message: 'Found product', products })
        })
    } catch (error) {
      next(error)
    }
  },
  findByFilter: async (req, res, next) => {
    const { categories, parentsku } = req.query
    try {
      await Product.find({
        $or: [
          {
            categories: {
              $in: categories
            }
          },
          {
            parent_sku: parentsku
          }
        ]
      })
        .lean()
        .populate('items', null, Item)
        .then((products) => {
          if (products.length <= 0)
            throw new ErrorHandle(404, 'Not found products')
          res.status(200).json({ message: 'Found products', products })
        })
    } catch (error) {
      next(error)
    }
  },

  findProductById: async (req, res, next) => {
    const { id } = req.params
    try {
      await Product.findById(id)
        .populate('items', null, Item)
        .lean()
        .then((product) => {
          if (!product) throw new ErrorHandle(404, 'Not found product')
          res.status(200).json({ message: 'Find product', product })
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
      }).then(async (product) => {
        if (!product) {
          throw new ErrorHandle(404, 'Not found Item on product')
        }
        await Item.findById(itemId).then((item) => {
          if (!item) {
            throw new ErrorHandle(404, 'Not found Item')
          }
          res.status(200).json({ message: 'Find item', item })
        })
      })
    } catch (error) {
      next(error)
    }
  },
  addItem: async (req, res, next) => {
    const { id } = req.params
    const { role } = req.user
    try {
      if (role === 'user') throw new ErrorHandle(401, "You don't have access")
      await Product.findById(id).then(async (product) => {
        if (!product) {
          throw new ErrorHandle(404, 'Not found product')
        }
        await Item.create({ ...req.body, product: product.id }).then(
          async (item) => {
            await Product.updateOne(
              { _id: id },
              {
                $push: {
                  items: item.id
                }
              }
            ).then((product) => {
              if (!product) {
                throw new ErrorHandle(400, 'Something is wrong')
              }
              res.status(201).json({ message: 'Add item on product', item })
            })
          }
        )
      })
    } catch (error) {
      next(error)
    }
  },
  updateProduct: async (req, res, next) => {
    const { id } = req.params
    const { items, ...data } = req.body
    const { role } = req.user
    try {
      if (role === 'user') throw new ErrorHandle(401, "You don't have access")
      await Product.findOneAndUpdate({ _id: id }, data, {
        new: true,
        runValidators: true
      })
        .select('-items')
        .then((product) => {
          if (product) {
            res.status(200).json({ message: 'product updated', product })
          } else {
            res.status(404).json({ message: 'Not found product' })
          }
        })
    } catch (error) {
      next(error)
    }
  },
  updateItem: async (req, res, next) => {
    const { itemId } = req.params
    const { role } = req.user
    try {
      if (role === 'user') throw new ErrorHandle(401, "You don't have access")
      await Item.findOneAndUpdate({ _id: itemId }, req.body, {
        new: true,
        runValidators: true
      }).then((item) => {
        if (!item) throw new ErrorHandle(404, 'Not found item')
        res.status(200).json({ message: 'Item updated', item })
      })
    } catch (error) {
      next(error)
    }
  },

  removeItem: async (req, res, next) => {
    const { role } = req.user
    const { itemId } = req.body
    try {
      if (role === 'user') throw new ErrorHandle(404, "You don't have access")
      const products = await Product.updateMany({items: {$in: itemId}},{$pull:{items: itemId}})
      console.log(products)
      const item = await Item.deleteMany({_id: {$in: itemId}})
      
      if (item && products)
        res.status(200).json({ message: 'Removed item on product' , item, products})
    } catch (error) {
      next(error)
    }
  },

  remove: async (req, res, next) => {
    const { role } = req.user
    const { products } = req.body
    try {
      if (role === 'user') throw new ErrorHandle(401, "You don't have access")
      const product = await Product.deleteMany({ _id: { $in: products } }).then(
        (product) => {
          if (!product) throw new ErrorHandle(404, 'Not found product')
          return product
        }
      )
      const item = await Item.deleteMany({ product: { $in: products } }).then(
        (item) => {
          if (!item) throw new ErrorHandle(404, 'Not found item')
          return item
        }
      )
      res.status(200).json({ product, item })
    } catch (error) {
      next(error)
    }
  }
}

export default ProductController
