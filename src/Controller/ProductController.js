import Product from '../Model/Product'
import mongoose from 'mongoose'
import Item from '../Model/Item'

const ProductController = {

  register: async (req, res) => {
    try {
      const { items, ...data } = req.body

      const product = new Product({ ...data, items: items.map(() => { return { _id: new mongoose.Types.ObjectId() } }) })
      await product.save((err, product) => {
        if (err) {
          res.status(500).json(err)
        } else {
          items.map((value, index) => {
            const item = new Item({ _id: product.items[index]._id, product: product._id, ...value })
            item.save((err) => {
              if (err) {
                res.status(500).json(err)
              } else {
                res.status(202).json({ message: 'Product created' + product.parent_sku })
              }
            })
          })
        }
      })
    } catch (error) {
      res.status(500).json({ message: 'We have a problem ' + error })
    }
  },
  findAll: (req, res) => {
    try {
      Product.find({}).populate('items', null, Item).lean().then(product => {
        if (product.length) {
          res.status(202).json(product)
        } else {
          res.status(404).json({ message: 'Not exists products' })
        }
      })
    } catch (error) {
      res.status(500).json(error)
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
