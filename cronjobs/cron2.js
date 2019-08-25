var fs = require('fs'),
    request = require('request');
const delay = require('delay');
var CronJob = require('cron').CronJob;

var MongoClient = require('mongodb').MongoClient;

//var USER_ID="3461526617206941"
var USER_ID
var ACCESS_TOKEN="EAAGBkRbsQVUBAA0zWRpsC5QnVdW41WMEhEBZB7aMOZBtihiSwkDYribZBui5PdMa17jWzPNy5ZBqrh13kdlLzbCBG2DB8NSUT31LAn8CgZCmiucXYJE4XoJW52LiIddtx1fFtDFa5nXBDYRmdfLottjpW9ZBFtR8iK1h0pwvedRof6slunT5gZB";
//var ACCESS_TOKEN="EAAIYywj57oABALDhO7bJ5EZC5GtZB94zJLhLq6ZARzxsSo8CBASmAKAS9ZBYLqMag4raZBhZCuiZBy8Eu3jY3Dm55gC0ZA8K3ZBr9H9BWoZCjueHiU6GXcCzoYoub8ZAF2zr7ZAZAjcVcq8f6YNwg4uZBZA32mnhRoevYi5knzfC0k7XhWsCZAS9idwAJOcp";
//var USER_ID="2386927404748388"

var url = 'mongodb://root:AUchatbot_101@127.0.0.1:27017/';

//var catagories=["entertainment","indian_news","latest_news","top_stories"];
var catagories=["entertainment","indian_news","trending","top_stories","cricket","jobs","astro","automobile","lifestyle","technology"];

var mongo_db;

var job = new CronJob('*/30 *  * * * *', function(){
    //getUsersList();
    MongoClient.connect(url, function(err, db) {
        if(err){
          console.log("Error in connecting the data base");
        }
        if(db){
        console.log("MongoDB server Connected correctly.");
        mongo_db=db.db('testbot');
        getUsersList();

        }
      });

});
job.start();
function getUsersList(){
  var pop_coll = mongo_db.collection(catagories[2]);
    pop_coll.find({},{fb_id:1,_id:0}).toArray(function(err,docs){
        if(err) console.log("error");

        if(docs){
            for(var i=0;i<docs.length;i++){

                USER_ID=(parseInt(docs[i]['fb_id']))
            
                trending(USER_ID);


            }
        }
    });
}

function trending (recipientId)
{



    request({
        url: 'http://api.amarujala.com/v1/tranding-stories',
        method: 'GET'
    },function(error, response, body){
        if(error)
            console.log("589 erorr");
        else
        {
            var res = JSON.parse(body);

            message = 
            {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": res['data'][0]['title_hn'] ,
                            "subtitle": res['data'][0]['synopsis'],
                            "image_url": res['data'][0]['image'],
                                
                            "buttons":[{    
                            "type":"element_share"
                            },
                            {
                                "type": "web_url",
                                "url": res['data'][0]['web_url'],
                                "title": "Read this"

                            }]
                            
                            },
                        {
                            "title": res['data'][1]['title_hn'] ,
                            "subtitle": res['data'][1]['synopsis'],
                            "image_url": res['data'][1]['image'],
                                
                            "buttons":[{    
                            "type":"element_share"
                            },
                            {
                                "type": "web_url",
                                "url": res['data'][1]['web_url'],
                                "title": "Read this"

                            }]
                            
                            },
                        {
                            "title": res['data'][2]['title_hn'] ,
                            "subtitle": res['data'][2]['synopsis'],
                            "image_url": res['data'][2]['image'],
                                
                            "buttons":[{    
                            "type":"element_share"
                            },
                            {
                                "type": "web_url",
                                "url": res['data'][2]['web_url'],
                                "title": "Read this"

                            }]
                            
                            },
                        {
                            "title": res['data'][3]['title_hn'] ,
                            "subtitle": res['data'][3]['synopsis'],
                            "image_url": res['data'][3]['image'],
                                
                            "buttons":[{    
                            "type":"element_share"
                            },
                            {
                                "type": "web_url",
                                "url": res['data'][3]['web_url'],
                                "title": "Read this"

                            }]
                            
                            },
                         {
                            "title": res['data'][4]['title_hn'] ,
                            "subtitle": res['data'][4]['synopsis'],
                            "image_url": res['data'][4]['image'],
                                
                            "buttons":[{    
                            "type":"element_share"
                            },
                            {
                                "type": "web_url",
                                "url": res['data'][4]['web_url'],
                                "title": "Read this"

                            }]
                            
                            }
                        
                        ]
                    }
                }
            }
            

            sendMessage(recipientId, message);

            return true;

        }

    });
}