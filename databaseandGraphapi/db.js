var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://127.0.0.1/testbot';

var catagories=["entertainment","indian_news","latest_news","top_stories"];


var mongo_db;


MongoClient.connect(url, function(err, db) {
  if(err){
    console.log("Error in connecting the data base");
  }
  if(db){
  console.log("MongoDB server Connected correctly.");
  mongo_db=db;
 getUsersList();
 db.close();
  }
});

function getUsersList(){
  for(var i=0;i<catagories.length-3;i++){
    
    var topic=catagories[i];
  
    var pop_coll = mongo_db.collection(catagories[i]);
    pop_coll.find().toArray(function(err,docs){
      console.log(docs.length)
      
    });
  }
  
}

