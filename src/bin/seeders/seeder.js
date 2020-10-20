import program from'commander'
import Seeder from './Seeder'

const seeder = new Seeder()

program
.command('charge')
.alias('c')
.description('Charge data on database')
.action(async () => {
  await seeder.charge()
  process.exit(0)
})

program
.command('drop')
.alias('d')
.description('Drop data on database')
.action(async () => {
  await seeder.drop()
  process.exit(0)
})

program.parse(process.argv)

