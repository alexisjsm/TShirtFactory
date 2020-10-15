import mongoose from 'mongoose'
import debug from 'debug'
debug('tshirtFactory:database')


const { DB_USERNAME, DB_PASSWORD, DB_HOSTNAME, DB_DATABASE } = process.env

mongoose.connect(`mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOSTNAME}:27017/${DB_DATABASE}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .catch(err => { console.log(`We have been a error ${err}`) })

const database = mongoose.connection

export default database
