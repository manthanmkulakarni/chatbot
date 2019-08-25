var getClientID=require('../../../../modules/channel-telegram/dist/backend/client')
var telegramuserid;
var actions=["subscribe","unsubscribe"];
var catagories=["entertainment","indian_news","trending","top_stories","cricket","jobs","astro","automobile","lifestyle","technology"];
var channel=["facebook","telegram"];
var actionflg=[0,0,0,0];
var button=["subscribe","subscribe","subscribe","subscribe","subscribe","subscribe","subscribe","subscribe","subscribe","subscribe"]
user.actionflg=0
user.telegramid=getClientID.clientID;


function getSubscriptiondetails(){

  //data base related
  var MongoClient = require('mongodb').MongoClient;
  var mongo_db;
  var url = 'mongodb://127.0.0.1/testbot/telegramdb';
  MongoClient.connect(url, function(err, db) {
    console.log("Connected to server correctly.");
    mongo_db = db;
  });

  for(var i=0;i<10;i++){
    var pop_coll=mongo_db.collection(catagories[i]);
    pop_coll.findOne({"telegram_id" : telegramuserid},function(err,docs){
      if(err)
      console.log("851 error")
      if(docs)
      {
        button[i]="Unsubscribe";
      }
      else{
        button[i]="Subscribe";
      }
    });
  }
  updatedb(getClientID.clientID,user.subcat);


}









function updatedb(userid,catagory){

    var pop_coll=mongo_db.collection(catagory);
    
  
    pop_coll.findOne({"telegram_id" : userid}, function(err,docs){
      if(err)
        console.log("851 Error");
      //If data is found for the given facebook-usedid
      if(docs){
        //If already subscribed then unsubscribe the catagory
        user.actionflg=0;
          pop_coll.remove({"telegram_id" : userid},function(err,doc){
            if(err){
              console.log("Error in unsubscribing");
            }
            else{
              
              console.log("Unsubscribed");
            }
          });
        
      }
        //If not subscribed then add into the data base
        else{
          user.actionflg=1;
          var myobject={"telegram_id" : userid }
            pop_coll.insert(myobject,function(err,doc){
              if(err){
                console.log("Erro in inserting to db for id : "+userid);
              }
              else{

                console.log("Inserted to db for id : "+userid);
                console.log("Subscribed");
              }
            });
        }
      
      
      
    });
  
  }