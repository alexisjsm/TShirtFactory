
db.createUser({
  user: "admin",
  pwd: "password",
  roles: [
    {
      role: "readWrite",
      db: "tshirtFactoryDB"
    }]
})

db = db.getSiblingDB("tshirtFactoryDB_test")

db.createUser({
  user: "admin",
  pwd: "password",
  roles: [
    {
      role: "readWrite",
      db: "tshirtFactoryDB_test"
    }]
})