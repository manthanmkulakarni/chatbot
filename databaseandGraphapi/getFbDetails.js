var fs = require('fs'),
    request = require('request');

var CronJob = require('cron').CronJob;

var MongoClient = require('mongodb').MongoClient;

var USER_ID="3461526617206941"
var ACCESS_TOKEN="EAAGBkRbsQVUBAA0zWRpsC5QnVdW41WMEhEBZB7aMOZBtihiSwkDYribZBui5PdMa17jWzPNy5ZBqrh13kdlLzbCBG2DB8NSUT31LAn8CgZCmiucXYJE4XoJW52LiIddtx1fFtDFa5nXBDYRmdfLottjpW9ZBFtR8iK1h0pwvedRof6slunT5gZB";
//var ACCESS_TOKEN="EAAIYywj57oABALDhO7bJ5EZC5GtZB94zJLhLq6ZARzxsSo8CBASmAKAS9ZBYLqMag4raZBhZCuiZBy8Eu3jY3Dm55gC0ZA8K3ZBr9H9BWoZCjueHiU6GXcCzoYoub8ZAF2zr7ZAZAjcVcq8f6YNwg4uZBZA32mnhRoevYi5knzfC0k7XhWsCZAS9idwAJOcp";
//var USER_ID="2386927404748388"

var url = 'mongodb://127.0.0.1/testbot';

//var catagories=["entertainment","indian_news","latest_news","top_stories"];
var catagories=["entertainment","indian_news","trending","top_stories","cricket","jobs","astro","automobile","lifestyle","technology"];

var mongo_db;

var job = new CronJob('*/2 * * * * *', function(){
    //getUsersList();
    MongoClient.connect(url, function(err, db) {
        if(err){
          console.log("Error in connecting the data base");
        }
        if(db){
        console.log("MongoDB server Connected correctly.");
        mongo_db=db;
        getUsersList();
        
        }
      });

});
job.start();





//get users list from data base

function getUsersList(){
 
    var pop_coll = mongo_db.collection(catagories[0]);
    pop_coll.find({},{fb_id:1,_id:0}).toArray(function(err,docs){
        if(err) throw err;

        if(docs){
            for(var i=0;i<docs.length;i++){
               
                //USER_ID=(parseInt(docs[i]['fb_id']))
                get_fb_details();
                latest_stories(USER_ID);
    
                 
            }
        }
    });/*
    var pop_coll = mongo_db.collection(catagories[1]);
    pop_coll.find({},{fb_id:1,_id:0}).toArray(function(err,docs){
        if(err) throw err;

        if(docs){
            for(var i=0;i<docs.length;i++){
               
                //USER_ID=(parseInt(docs[i]['fb_id']))
                get_fb_details();
                entertainment_stories(USER_ID);
    
                 
            }
        }
    });
    var pop_coll = mongo_db.collection(catagories[2]);
    pop_coll.find({},{fb_id:1,_id:0}).toArray(function(err,docs){
        if(err) throw err;

        if(docs){
            for(var i=0;i<docs.length;i++){
               
                //USER_ID=(parseInt(docs[i]['fb_id']))
                get_fb_details();
                top_stories(USER_ID);
    
                 
            }
        }
    });
    var pop_coll = mongo_db.collection(catagories[3]);
    pop_coll.find({},{fb_id:1,_id:0}).toArray(function(err,docs){
        if(err) throw err;

        if(docs){
            for(var i=0;i<docs.length;i++){
               
                //USER_ID=(parseInt(docs[i]['fb_id']))
                get_fb_details();
                indian_stories(USER_ID);
                 
            }
        }
    });

    var pop_coll = mongo_db.collection(catagories[4]);
    pop_coll.find({},{fb_id:1,_id:0}).toArray(function(err,docs){
        if(err) throw err;

        if(docs){
            for(var i=0;i<docs.length;i++){
               
                //USER_ID=(parseInt(docs[i]['fb_id']))
                get_fb_details();
                indian_stories(USER_ID);
                 
            }
        }
    });


    var pop_coll = mongo_db.collection(catagories[5]);
    pop_coll.find({},{fb_id:1,_id:0}).toArray(function(err,docs){
        if(err) throw err;

        if(docs){
            for(var i=0;i<docs.length;i++){
               
                //USER_ID=(parseInt(docs[i]['fb_id']))
                get_fb_details();
                indian_stories(USER_ID);
                 
            }
        }
    });

    var pop_coll = mongo_db.collection(catagories[6]);
    pop_coll.find({},{fb_id:1,_id:0}).toArray(function(err,docs){
        if(err) throw err;

        if(docs){
            for(var i=0;i<docs.length;i++){
               
                //USER_ID=(parseInt(docs[i]['fb_id']))
                get_fb_details();
                indian_stories(USER_ID);
                 
            }
        }
    });

    var pop_coll = mongo_db.collection(catagories[7]);
    pop_coll.find({},{fb_id:1,_id:0}).toArray(function(err,docs){
        if(err) throw err;

        if(docs){
            for(var i=0;i<docs.length;i++){
               
                //USER_ID=(parseInt(docs[i]['fb_id']))
                get_fb_details();
                indian_stories(USER_ID);
                 
            }
        }
    });

    var pop_coll = mongo_db.collection(catagories[8]);
    pop_coll.find({},{fb_id:1,_id:0}).toArray(function(err,docs){
        if(err) throw err;

        if(docs){
            for(var i=0;i<docs.length;i++){
               
                //USER_ID=(parseInt(docs[i]['fb_id']))
                get_fb_details();
                indian_stories(USER_ID);
                 
            }
        }
    });

    var pop_coll = mongo_db.collection(catagories[9]);
    pop_coll.find({},{fb_id:1,_id:0}).toArray(function(err,docs){
        if(err) throw err;

        if(docs){
            for(var i=0;i<docs.length;i++){
               
                //USER_ID=(parseInt(docs[i]['fb_id']))
                get_fb_details();
                indian_stories(USER_ID);
                 
            }
        }
    });
  */
}


function get_fb_details ()
{

    MongoClient.connect(url, function(err, db) {
        if(err){
          console.log("Error in connecting the data base");
        }
        if(db){
        console.log("MongoDB server Connected correctly.");
        mongo_db=db;
       
        
        }
      });
  
    
    request({
        url: "https://graph.facebook.com/v2.6/"+USER_ID+"?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token="+ACCESS_TOKEN,
        method: 'GET'
    },function(error, response, body){
        if(error)
            console.log("589 erorr");
        else
        {

          

            var res = JSON.parse(body);
            console.log(res)
            console.log(res["first_name"]);
            console.log(res["last_name"]);
            console.log(res["locale"]);
            console.log(res["id"]);

           
            //Storing the users details in data base

            var pop_coll=mongo_db.collection("users_data");
            pop_coll.findOne({"id":USER_ID},function(err,docs){
                
                if(err){
                    throw err;
                }
                if(docs==null){
                   pop_coll.insertOne(res,function(err,res){
                       if(err)
                      throw err;
                       if(res){
                           console.log("Inserted")
                       }
                   });
                }
                else{
                    console.log("user present");
                }
                
            })

            
        }

    });
}


function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        //qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        qs: {fields: "first_name,last_name,profile_pic,locale,timezone,gender",access_token:ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } 
        else{
            console.log(response)
        }
    });
};


function latest_stories (recipientId)
{



    request({
        
        url: 'https://api.amarujala.com/v3/search?keyword=latest',
        
        method: 'GET',
        headers: {
            propertykey: '57398d264f1c1b0016ac7a02',
            clientkey: '57398d264f1c1b0016ac7a05'
        }
    },function(error, response, body){
        if(error)
            console.log("589 erorr");
        else
        {
            
            var res = JSON.parse(body);
            console.log(res)
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
            sendMessage(USER_ID,message);

/*
            message = {
                
                
                    "type": "element_share",
                    "share_contents": { 
                      "attachment": {
                        "type": "template",
                        "payload": {
                          "template_type": "generic",
                          "elements": [
                            {
                              "title": res['data'][5]['title_hn'],
                              "subtitle":res['data'][5]['synopsis'],
                              "image_url": res['data'][5]['image'],
                              "default_action": {
                                "type": "web_url",
                                "url": res['data'][5]['web_url']
                              },
                              "buttons": [
                                {
                                  "type": "web_url",
                                  "url": "<BUTTON_URL>", 
                                  "title": "button1"
                                }
                              ]
                            }
                          ]
                        }
                      }
                    }
                  }
        */
    

            sendMessage(recipientId, message);

            return true;

        }

    });
}



function trending (recipientId)
{



    request({
        url: 'http://api.amarujala.com/v1/search?keywords=topstories',
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
            sendMessage(USER_ID,message);


    

            sendMessage(recipientId, message);

            return true;

        }

    });
}


function cricket (recipientId)
{



    request({
        url: 'http://api.amarujala.com/v1/search?keywords=cricket',
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
            sendMessage(USER_ID,message);


    

            sendMessage(recipientId, message);

            return true;

        }

    });
}



function jobs (recipientId)
{



    request({
        url: 'http://api.amarujala.com/v1/search?keywords=jobs',
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
            sendMessage(USER_ID,message);


    

            sendMessage(recipientId, message);

            return true;

        }

    });
}



function astro (recipientId)
{



    request({
        url: 'http://api.amarujala.com/v1/search?keywords=astrology',
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
            sendMessage(USER_ID,message);


    

            sendMessage(recipientId, message);

            return true;

        }

    });
}



function automobile (recipientId)
{



    request({
        url: 'http://api.amarujala.com/v1/search?keywords=automobile',
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
            sendMessage(USER_ID,message);


    

            sendMessage(recipientId, message);

            return true;

        }

    });
}



function lifestyle (recipientId)
{



    request({
        url: 'http://api.amarujala.com/v1/search?keywords=lifestyle',
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
            sendMessage(USER_ID,message);


    

            sendMessage(recipientId, message);

            return true;

        }

    });
}



function  technology(recipientId)
{



    request({
        url: 'http://api.amarujala.com/v1/search?keywords=technology',
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
            sendMessage(USER_ID,message);


    

            sendMessage(recipientId, message);

            return true;

        }

    });
}

function entertainment_stories (recipientId)
{



    request({
        url: 'http://api.amarujala.com/v1/search?keywords=entertainment',
        method: 'GET'
    },function(error, response, body){
        if(error)
            console.log("589 erorr");
        else
        {
            var res = JSON.parse(body);

            message = {
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


/*
            message = {
                
                
                    "type": "element_share",
                    "share_contents": { 
                      "attachment": {
                        "type": "template",
                        "payload": {
                          "template_type": "generic",
                          "elements": [
                            {
                              "title": res['data'][5]['title_hn'],
                              "subtitle":res['data'][5]['synopsis'],
                              "image_url": res['data'][5]['image'],
                              "default_action": {
                                "type": "web_url",
                                "url": res['data'][5]['web_url']
                              },
                              "buttons": [
                                {
                                  "type": "web_url",
                                  "url": "<BUTTON_URL>", 
                                  "title": "button1"
                                }
                              ]
                            }
                          ]
                        }
                      }
                    }
                  }
        */
    

            sendMessage(recipientId, message);

            return true;

        }

    });
}

function top_stories (recipientId)
{



    request({
        url: 'http://api.amarujala.com/v1/search?keywords=topstories',
        method: 'GET'
    },function(error, response, body){
        if(error)
            console.log("589 erorr");
        else
        {
            var res = JSON.parse(body);

            message = {
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


/*
            message = {
                
                
                    "type": "element_share",
                    "share_contents": { 
                      "attachment": {
                        "type": "template",
                        "payload": {
                          "template_type": "generic",
                          "elements": [
                            {
                              "title": res['data'][5]['title_hn'],
                              "subtitle":res['data'][5]['synopsis'],
                              "image_url": res['data'][5]['image'],
                              "default_action": {
                                "type": "web_url",
                                "url": res['data'][5]['web_url']
                              },
                              "buttons": [
                                {
                                  "type": "web_url",
                                  "url": "<BUTTON_URL>", 
                                  "title": "button1"
                                }
                              ]
                            }
                          ]
                        }
                      }
                    }
                  }
        */
    

            sendMessage(recipientId, message);

            return true;

        }

    });
}


function indian_stories (recipientId)
{



    request({
        url: 'http://api.amarujala.com/v1/search?keywords=india',
        method: 'GET'
    },function(error, response, body){
        if(error)
            console.log("589 erorr");
        else
        {
            var res = JSON.parse(body);

            message = {
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


/*
            message = {
                
                
                    "type": "element_share",
                    "share_contents": { 
                      "attachment": {
                        "type": "template",
                        "payload": {
                          "template_type": "generic",
                          "elements": [
                            {
                              "title": res['data'][5]['title_hn'],
                              "subtitle":res['data'][5]['synopsis'],
                              "image_url": res['data'][5]['image'],
                              "default_action": {
                                "type": "web_url",
                                "url": res['data'][5]['web_url']
                              },
                              "buttons": [
                                {
                                  "type": "web_url",
                                  "url": "<BUTTON_URL>", 
                                  "title": "button1"
                                }
                              ]
                            }
                          ]
                        }
                      }
                    }
                  }
        */
    

            sendMessage(recipientId, message);

            return true;

        }

    });
}


function sendNews(recipientId){
    latest_stories(recipientId);
    entertainment_stories(recipientId);
    top_stories(recipientId);
    indian_stories(recipientId);
}

var job = new CronJob('*/2 * * * * *', function(){
    //getUsersList();
    latest_stories(USER_ID);

});
//job.start();


/*

message = {
    // "text": "Hi!! Welcome to Amarujala chatbot!! To get a hang of things, try these Latest Stories that we have and subscribe them",
        "attachment" : {
            "type" : "template",
            "payload": {
                "template_type": "button",
                "text": "To get started, tap on Menu for latest and most popular news around the globe and subscribe them to stay connected.",
                    "buttons": [{
                        "type":"postback",
                        "title": "Menu",
                        "payload": "Menu_get_started",
                    }, {
                        "type": "postback",
                        "title": "Subscribe",
                        "payload": "Subscribe Latest",
                        }
                    ]
                }
                

            
        }
    }
    */

//get_fb_details();
//latest_stories(USER_ID);
