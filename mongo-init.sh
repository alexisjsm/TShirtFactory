#!/bin/bash
set -e

mongo <<EOF
use $DB_DATABASE
db.createUser({
  user:  '$DB_USERNAME',
  pwd: '$DB_PASSWORD',
  roles: [{
    role: 'readWrite',
    db: '$DB_DATABASE'
  }]
})
db = db.getSiblingDB('$DB_DATABASE' + '_test' )
db.createUser({
  user:  '$DB_USERNAME',
  pwd: '$DB_PASSWORD',
  roles: [{
    role: 'readWrite',
    db: '$DB_DATABASE' + '_test'
  }]
})

EOF