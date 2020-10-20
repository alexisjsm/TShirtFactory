import program from 'commander'
import Seeder from './SeederInit'

const seeder = new Seeder()

program
  .command('charge')
  .description('Charge data on database')
  .action(async () => {
    await seeder.charge()
    process.exit(0)
  })

program
  .command('drop')
  .description('Drop data on database')
  .action(async () => {
    await seeder.drop()
    process.exit(0)
  })

program.parse(process.argv)
