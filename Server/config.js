// Author: Deen Aariff
// Date: Sat March 26, 2016
// Description: App Configurations
// Dependendencies: App, Handlers (food,users)

exports.db = {
   url: "mongodb://daariff:startup@ds061454.mongolab.com:61454/appdatabase",
   collections: ['users','transactionsList']
}
exports.port = 3000;
exports.base = "http://localhost:" + exports.port;
