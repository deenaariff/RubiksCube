import subprocess
from pymongo import MongoClient
c = MongoClient()

print 'Installing NPM Dependendencies'
subprocess.call(['npm','install'])
print 'Configuring Database'
db = c.RubiksCubeDBAariffDeen
collection = db.users
collection.insert_one(
    {
        "test": "test"
    }
)
print 'Running Server'
subprocess.call(['nodemon', 'index.js'])
