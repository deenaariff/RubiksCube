import subprocess
from pymongo import MongoClient
c = MongoClient()

print 'Installing NPM Dependendencies'
subprocess.call(['npm','install'])
subprocess.call(['cd', '..'])
print 'Configuring Database'
db = c.RubiksCubeDBAariffDeen
collection = db.users
collection.insert_one(
    {
        "test": "test"
    }
)
print 'Run Server'
subprocess.call(['nodemon', 'index.js'])
