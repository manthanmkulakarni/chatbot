var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = { name: user.userName, address: "Chat bot2" };
  dbo.collection("botpress1").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log(user.userName);
    db.close();
  });
});