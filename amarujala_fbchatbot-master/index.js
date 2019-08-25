var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var CronJob = require('cron').CronJob;
var app = express();
var USER_ACCESS_TOKEN = 'EAAXfWnTnzU4BAFICZA8UPzphm0gGM9uha4MozdhIQOtJhbgWeVKyEt9nUpf1LTtqwgQe3dLncGUbtjye9ftmUM8Yhq2f1R1GrGYeCOwhw0B0LAH5gw4lSZAkcVU4ADhqr1BZCDelVeIuj1xxJhMvlfjY2Xyv5RZCIzGiTYa80wZDZD'
// 
                            // EAAXfWnTnzU4BAOCOlZBhLnVuZAn0w4pZAx5m1vpOxLbWgZC8nl8mX9KAbEPRAC3RMHozk5dZCSsrZAqz5r0uM0GZAgHDgxZCSQNx0pJJtmPxe2Nc5MX3IYTla0PhIxlxhYcxsu9e6FRRyUWV2ElZCqOtipSeSz18iiCR3GC1Ijc1FGwZDZD

//n,jmv

var MongoClient = require('mongodb').MongoClient;
var mongo_db;
var url = 'mongodb://127.0.0.1/testbot';
MongoClient.connect(url, function(err, db) {
  console.log("Connected to server correctly.");
  mongo_db = db;
});

var ObjectId = require('mongodb').ObjectID;



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(express.static('/'));
app.listen(3333);





app.get('/assets/:id', function(req, res){
    var path = __dirname+"/assets/"+req.params.id;
    res.sendFile(path);
});





// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server2');
});





// Facebook Webhook
app.get('/webhook', function(req, res) {


    console.log("webhook get");
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'amarujala_fbchatbot_token') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  //res.send("Holaa");
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);    
  }  
});





// handler receiving messages
app.post('/webhook', function (req, res) {

    console.log("webhook post");
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            console.log(event.message.text);
    		if (!validMessage(event.sender.id, event.message.text))
                {   console.log("76");
                 search_by_tag(event.sender.id, event.message.text);
            }
	}
	else if (event.postback) {
    		
             console.log("postback received");
            // console.log(event.postback['payload']);

            if(event.postback['payload'] === "Latest Headlines")
                latest_stories(event.sender.id);

            if(event.postback['payload'] === "Popular News")
                popular_news(event.sender.id);

            if(event.postback['payload'] === "Subscriptions")
                show_subscriptions(event.sender.id);

            else
                {   console.log("This is 80");
                    console.log(event.postback['payload']);
                validMessage(event.sender.id, event.postback['payload']);
            }

            insert_db(event.sender.id, event.postback);
           
	}
	
    }
    res.sendStatus(200);
});











//Get Started Button
request({
        url: 'https://graph.facebook.com/v2.6/me/thread_settings',
        qs: {access_token: USER_ACCESS_TOKEN},
        //qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        //qs: {fields: "first_name,last_name,profile_pic,locale,timezone,gender",access_token: "EAALlQ2OEzrUBAPtETHrpvZBWiP3vbxobRtrGEfHuuTFmQZCOPt3OK1DqzvlyZBeNvZC5QbA3eASUvBcJArBNNAoc403PkZBZCA0iD4LmTNzCRvRytpu00rQECZByYdQZAiRIl20ZCRY8dK1wiPBXQPf72SkQtvAx8DXrZBclXnlb4xVgZDZD"},
        method: 'POST',
        json: {
            setting_type: "call_to_actions",
            thread_state: "new_thread",
            call_to_actions: [{
            	payload: "Get Started"
            }]
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (!error && response.statusCode == 200) {
            // console.log("121 + "+body);
        }
    });














//Persistent Menu
request({
        url: 'https://graph.facebook.com/v2.6/me/thread_settings',
        qs: {access_token: USER_ACCESS_TOKEN},
        //qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        //qs: {fields: "first_name,last_name,profile_pic,locale,timezone,gender",access_token: "EAALlQ2OEzrUBAPtETHrpvZBWiP3vbxobRtrGEfHuuTFmQZCOPt3OK1DqzvlyZBeNvZC5QbA3eASUvBcJArBNNAoc403PkZBZCA0iD4LmTNzCRvRytpu00rQECZByYdQZAiRIl20ZCRY8dK1wiPBXQPf72SkQtvAx8DXrZBclXnlb4xVgZDZD"},
        method: 'POST',
        json: {
            setting_type: "call_to_actions",
            thread_state: "existing_thread",
            call_to_actions: [
            {   type: "postback",
                title: "Menu",
                payload: "Menu"
            },
            {
                type: "postback",
                title: "Subscriptions",
                payload: "Subscriptions"
            },
            {
                type: "postback",
                title: "Start Over",
                payload: "Get Started"
            }   
            ]
        }
    }, function(error, response, body) {
        if (error) {
            console.log('172 Error sending message: ', error);
        } else if (!error && response.statusCode == 200) {
            // console.log("174 + "+body);
        }
    });
















//Greeting Text
request({
    url:'https://graph.facebook.com/v2.6/me/thread_settings',
        qs: {access_token: USER_ACCESS_TOKEN},
    method: 'POST',
    json: {
        setting_type: 'greeting',
        greeting:
        {
            text: 'Hi {{user_first_name}}, Welcome to Amarujala News Messenger - A leading media house empowering people by providing unbiased news with courage of conviction, commitment, transparency and creativity.'
        }

    }
    }, function(error, response, body) {
        if (error) {
            console.log('172 Error sending message: ', error);
        } else if (!error && response.statusCode == 200) {
             console.log("207 + "+body);
        }
    });

















//Bot is typing
request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: USER_ACCESS_TOKEN},
    method: 'POST',
    json: {
        sender_action: 'typing_on'
    }
},  function(error, response, body) {
    if(error)
        console.log(error);
    // else if(!error && response.statusCode === 200)
        // console.log('Typing on');
}
);













//daily feeds
var job = new CronJob('25 00 */4 * * *', function(){
        var pop_coll = mongo_db.collection('popular');
        pop_coll.find({},{fb_id:1, _id:0}).toArray(function(err, docs){
            if(err)
                console.log("87 Error");
            else
                {
                    //console.log("daily feeds:"+docs[0]['fb_id']);
                    send_daily_feeds(docs);
                }

            });

    });
job.start();













//daily facebook feeds
function send_daily_feeds(recipientId)
{
	for (var index in recipientId)
	{
        sendMessage(recipientId[index]['fb_id'],{text: "Latest Headlines"});
        latest_stories(recipientId[index]['fb_id']);

	}
}
















//insertion into db
function insert_db(recipientId, message){
	
	if(message['payload'].substring(0,9).toLowerCase() === 'subscribe')
	{


        var tag_to_be_added = message['payload'].substring(10).toLowerCase();
        //console.log("334 + "+ tag_to_be_added);

      
        		var pop_coll = mongo_db.collection('popular');



                pop_coll.findOne({"fb_id":recipientId},{_id:1}, function(err, docs){

                    if(err)
                        console.log(err);
                    if(docs){

                            console.log("_id found");
                            console.log(docs['_id']);
                            var tag = {};
                            tag[tag_to_be_added] = true;

                            pop_coll.update({'_id':docs['_id']},{$set: tag});
                            sendMessage(recipientId, {text: "Subscribed"});
                            sendMessage(recipientId, {text: "Now you'll be updated every 4 hours. And remember you can type anything, I'll find it out for you..."});
                        


                    }
                    else //this occurs when query returns empty brackets
                    {   
                        get_fb_details(recipientId, tag_to_be_added ,function(callback){


                        pop_coll.insert(
                                        callback, function (err, doc) {
                                            if (err) {
                                        console.log(err);
                                        }
                                        else {
                                        // And forward to success page
                                        console.log("Popular added!!!!!!!!!!!!!!!!!!1");
                                        }

                                    }
                                    );
                           });
                        sendMessage(recipientId, {text: "Subscribed"});
                        sendMessage(recipientId, {text: "Now you'll be updated every 4 hours. And remember you can type anything, I'll find it out for you..."});
                        
                        
                    }


        });


	}




    if(message['payload'].substring(0,11).toLowerCase() === 'unsubscribe')
		{
            console.log("reached to unsubscribe");
            var tag_to_be_removed = message['payload'].substring(12).toLowerCase();

            var pop_coll = mongo_db.collection('popular');

            pop_coll.findOne({"fb_id":recipientId}, {"_id": 1}, function(err, docs){
                if(err)
                    console.log(err);
                if (docs)
                {
                    var tag = {};
                    tag[tag_to_be_removed] = true;
                    pop_coll.update({"_id": docs['_id']},{$unset: tag});
                    sendMessage(recipientId, {text: "Unsubscribed"});
                }

            });

        }
}















//api call for fb_details
function get_fb_details(recipientId, tag_to_be_added ,callback)
{
	
	request({
		url: 'https://graph.facebook.com/v2.8/'+recipientId,
		qs: {access_token: USER_ACCESS_TOKEN},
		method: 'GET'
	}, function(error, response, body) {
		if (error) {
			console.log('Error 176 message: ', error);
		}
		else {    

			var res = JSON.parse(body);
            res['fb_id'] = recipientId;

           
            res[tag_to_be_added] = true;
            console.log(res);

            // delete res_arr['popular'];
           

            callback(res);
		}
	} );



}










function get_first_name(recipientId, callback)
{
    request({
        url: 'https://graph.facebook.com/v2.8/'+recipientId,
        qs: {access_token: USER_ACCESS_TOKEN},
        method: 'GET'
    }, function(error, response, body){
        if(error)
            console.log("Error 474");  
    else
    {
        var res = JSON.parse(body);
        console.log(res['first_name']);
        callback(res['first_name']);

    }
    });
}













// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        //qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        qs: {fields: "first_name,last_name,profile_pic,locale,timezone,gender",access_token: USER_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } 
    });
};










// send rich message validMessage
function validMessage(recipientId, text) {

    console.log("validMessage");
    
    text = text || "";
    var values = text.split(' ');

    if (values.length === 1 && values[0].toLowerCase() === 'menu') 
    {

    		message = {
    			"attachment" : {
    				"type" : "template",
    				"payload": {
    					"template_type": "generic",
    					"elements": [{
    						"title": "\"Most Popular\" News on Amarujala",
    						"image_url": "http://chatbot.amarujala.com/assets/chatbot-popular.jpg",
    						// "image_url": "www.amarujala.com/amp/lucknow/ram-gopal-yadav-says-sp-clash-is-not-going-to-end-now",
                            "buttons": [{
    							"type":"postback",
    							"title": "Show Stories",
    							"payload": "Popular News",
    						}, {
    							"type": "postback",
    							"title": "Subscribe",
    							"payload": "Subscribe Popular",
    							}
    						]
    					}, {
    						"title": "\"Latest News\" on Amarujala",
    						"image_url": "http://chatbot.amarujala.com/assets/chatbot-latest.jpg",
    						"buttons": [{
    							"type":"postback",
    							"title": "Show Stories",
    							"payload": "Latest Headlines",
    						}, {
    							"type": "postback",
    							"title": "Subscribe",
    							"payload": "Subscribe Latest",
    						}
    						]
    					}
    					]

    				}
    			}
    		}

    		sendMessage(recipientId, message);

    		return true;
    }







    if (values.length === 1 && values[0].toLowerCase() === 'menu_get_started') 
    {

        sendMessage(recipientId,  {text: "We've a main menu where you can find latest and most popular stories" });
        sendMessage(recipientId,  {text: "You can even access it by typing \"Menu\" " });

            message = {
                "attachment" : {
                    "type" : "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "\"Most Popular\" News on Amarujala",
                            "image_url": "http://chatbot.amarujala.com/assets/chatbot-popular.jpg",
                            "buttons": [{
                                "type":"postback",
                                "title": "Show Stories",
                                "payload": "Popular News",
                            }, {
                                "type": "postback",
                                "title": "Subscribe",
                                "payload": "Subscribe Popular",
                                }
                            ]
                        }, {
                            "title": "\"Latest News\" on Amarujala",
                            "image_url": "http://chatbot.amarujala.com/assets/chatbot-latest.jpg",
                            "buttons": [{
                                "type":"postback",
                                "title": "Show Stories",
                                "payload": "Latest Headlines",
                            }, {
                                "type": "postback",
                                "title": "Subscribe",
                                "payload": "Subscribe Latest",
                            }
                            ]
                        }
                        ]

                    }
                }
            }

            sendMessage(recipientId, message);



        sendMessage(recipientId,  {text: "You can read the news and subscribe them" })

            return true;
    }
















    if (values.length === 1 && values[0].toLowerCase() === 'about')
    {
        sendMessage(recipientId, {text: "About Chatbot" });
        return true;
    }

    if (values.length === 1 && values[0].toLowerCase() === 'help')
    {
        sendMessage(recipientId, {text: "Help Chatbot" });
        return true;
    } 
    
    if (values.length === 2 && values[0] === 'Get' && values[1] === 'Started')
    {

        get_first_name(recipientId, function(callback) {


        // message2 = {
        //             // "text": "Hi!! Welcome to Amarujala chatbot!! To get a hang of things, try these Latest Stories that we have and subscribe them",
        //                 "attachment" : {
        //                     "type" : "template",
        //                     "payload": {
        //                         "template_type": "button",
        //                         "text": "Hi "+callback+"!! I'm Amarujala News-Bot, here to help you!! You can read news on any topic just by typing here."                                }
                                
                           
        //                 }
        //             }

        sendMessage(recipientId, {text: "Hi "+callback+"!! I'm Amarujala News Messenger, here you can type anything and we'll search it for you."} );



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

        sendMessage(recipientId, message);





        
        });
        return true;

    }   

    return false;
    
};












//latest headlines
function latest_stories (recipientId)
{



    request({
        url: 'http://api.amarujala.com/v1/recentnews/',
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
                            "title": res['news'][0]['Hindi-Headline'] ,
                            "subtitle": res['news'][0]['News-Synopsis'],
                            "image_url": res['news'][0]['image'],
                            // "default_action": {
                            //     "type": "web_url",
                            //     "url": "http://amarujala.com/lucknow/ram-gopal-yadav-says-sp-clash-is-not-going-to-end-now",
                            //     "webview_height_ratio": "tall",
                            //     "fallback_url": "http://amarujala.com"

                            // },
                            "buttons": [{
                                "type": "web_url",
                                "url": res['news'][0]['Share_URL'],
                                "title": "Read this"

                            }]
                        },
                        {
                            "title": res['news'][1]['Hindi-Headline'] ,
                            "subtitle": res['news'][1]['News-Synopsis'],
                            "image_url": res['news'][1]['image'],
                            "buttons": [{
                                "type": "web_url",
                                "url": res['news'][1]['Share_URL'],
                                "title": "Read this"

                            }]
                        },
                         {
                            "title": res['news'][2]['Hindi-Headline'] ,
                            "subtitle": res['news'][2]['News-Synopsis'],
                            "image_url": res['news'][2]['image'],
                            "buttons": [{
                                "type": "web_url",
                                "url": res['news'][2]['Share_URL'],
                                "title": "Read this"

                            }]
                        },
                         {
                            "title": res['news'][3]['Hindi-Headline'] ,
                            "subtitle": res['news'][4]['News-Synopsis'],
                            "image_url": res['news'][4]['image'],
                            "buttons": [{
                                "type": "web_url",
                                "url": res['news'][4]['Share_URL'],
                                "title": "Read this"

                            }]
                        },
                         {
                            "title": res['news'][5]['Hindi-Headline'] ,
                            "subtitle": res['news'][5]['News-Synopsis'],
                            "image_url": res['news'][5]['image'],
                            "buttons": [{
                                "type": "web_url",
                                "url": res['news'][5]['Share_URL'],
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

















//popular news
function popular_news (recipientId)
{


    request({
        url: 'http://api.amarujala.com/v1/tranding-stories',
        method: 'GET'
    },function(error, response, body){
        if(error)
            console.log("695 erorr");
        else
        {
            var res = JSON.parse(body);

           /* message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": res['news'][0]['Hindi-Headline'] ,
                            "subtitle": res['news'][0]['News-Synopsis'],
                            "image_url": res['news'][0]['image'],
                            "buttons": [{
                                "type": "web_url",
                                "url": res['news'][0]['Share_URL'],
                                "title": "Read this"

                            }],
                            "buttons": [
                                {
                                  "type": "web_url",
                                  "url": res['news'][0]['Share_URL'], 
                                  "title": "Share"
                                }
                              ]
                        },
                        {
                            "title": res['news'][1]['Hindi-Headline'] ,
                            "subtitle": res['news'][1]['News-Synopsis'],
                            "image_url": res['news'][1]['image'],
                            "buttons": [{
                                "type": "web_url",
                                "url": res['news'][1]['Share_URL'],
                                "title": "Read this"

                            }]
                        },
                         {
                            "title": res['news'][2]['Hindi-Headline'] ,
                            "subtitle": res['news'][2]['News-Synopsis'],
                            "image_url": res['news'][2]['image'],
                            "buttons": [{
                                "type": "web_url",
                                "url": res['news'][2]['Share_URL'],
                                "title": "Read this"

                            }]
                        },
                         {
                            "title": res['news'][3]['Hindi-Headline'] ,
                            "subtitle": res['news'][4]['News-Synopsis'],
                            "image_url": res['news'][4]['image'],
                            "buttons": [{
                                "type": "web_url",
                                "url": res['news'][4]['Share_URL'],
                                "title": "Read this"

                            }]
                        },
                         {
                            "title": res['news'][5]['Hindi-Headline'] ,
                            "subtitle": res['news'][5]['News-Synopsis'],
                            "image_url": res['news'][5]['image'],
                            "buttons": [{
                                "type": "web_url",
                                "url": res['news'][5]['Share_URL'],
                                "title": "Read this"

                            }]
                        }
                        ]
                    }
                }
            }*/
            

            sendMessage(recipientId, message);

            return true;

        }

    });
}











function search_by_tag (recipientId, typed_word)
{

    console.log("952");
     sendMessage(recipientId,  {text: "Just a sec, looking that up..." });



    request({
        url: 'http://api.amarujala.com/v1/search',
        qs: {keywords: typed_word},
        method: 'GET'
    },function(error, response, body){
        if(error)
            console.log("797 erorr");
        else
        {
            var res = JSON.parse(body);

            //console.log(JSON.stringify(res));

            var emptee = "{\"news\":[]}";
            console.log(emptee);

            if(JSON.stringify(res) !=  emptee  )
            {
            message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": res['news'][0]['Hindi-Headline'] ,
                            "subtitle": res['news'][0]['News-Synopsis'],
                            "image_url": res['news'][0]['image'],
                            "buttons": [{
                                "type": "web_url",
                                "url": res['news'][0]['Share_URL'],
                                "title": "Read this"

                            }]
                        },
                        {
                            "title": res['news'][1]['Hindi-Headline'] ,
                            "subtitle": res['news'][1]['News-Synopsis'],
                            "image_url": res['news'][1]['image'],
                            "buttons": [{
                                "type": "web_url",
                                "url": res['news'][1]['Share_URL'],
                                "title": "Read this"

                            }]
                        },
                         {
                            "title": res['news'][2]['Hindi-Headline'] ,
                            "subtitle": res['news'][2]['News-Synopsis'],
                            "image_url": res['news'][2]['image'],
                            "buttons": [{
                                "type": "web_url",
                                "url": res['news'][2]['Share_URL'],
                                "title": "Read this"

                            }]
                        },
                         {
                            "title": res['news'][3]['Hindi-Headline'] ,
                            "subtitle": res['news'][4]['News-Synopsis'],
                            "image_url": res['news'][4]['image'],
                            "buttons": [{
                                "type": "web_url",
                                "url": res['news'][4]['Share_URL'],
                                "title": "Read this"

                            }]
                        },
                         {
                            "title": res['news'][5]['Hindi-Headline'] ,
                            "subtitle": res['news'][5]['News-Synopsis'],
                            "image_url": res['news'][5]['image'],
                            "buttons": [{
                                "type": "web_url",
                                "url": res['news'][5]['Share_URL'],
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

        else
            sendMessage(recipientId,  {text: "Sorry, we got nothing on this!!" });

        }

    });
}








function show_subscriptions(recipientId)
{
    var pop_coll = mongo_db.collection('popular');
    pop_coll.findOne({"fb_id" : recipientId }, function (err, docs){
        if(err)
            console.log("851 Error");
        if(docs)
        {
            if(docs['popular'] === true && docs['latest'] === true)
            {
                console.log("If 1");

                message = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": [{
                                "title": "\"Most Popular\" News on Amarujala",
                                "image_url": "http://chatbot.amarujala.com/assets/chatbot-popular.jpg",
                                "buttons": [{
                                    "type": "postback",
                                    "title": "Unsubscribe",
                                    "payload": "Unsubscribe Popular"
                                },
                                {
                                    "type": "postback",
                                    "title": "Show Stories",
                                    "payload": "Popular News"
                                }
                                ]
                            },
                            {
                                "title": "\"Latest News\" on Amarujala",
                                "image_url": "http://chatbot.amarujala.com/assets/chatbot-latest.jpg",
                                "buttons": [{
                                    "type":"postback",
                                    "title": "Unsubscribe",
                                    "payload": "Unsubscribe Latest",
                                }, {
                                    "type": "postback",
                                    "title": "Show Stories",
                                    "payload": "Latest Headlines",
                                }
                                ]
                            }
                            ]
                        }

                    }
                }

                sendMessage(recipientId, message);

            }





            else if (docs['popular'] === true)
            {
                console.log("if 2");

                message = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type" : "generic",
                            "elements": [{
                                "title": "\"Most Popular\" News on Amarujala",
                                "image_url": "http://chatbot.amarujala.com/assets/chatbot-popular.jpg",
                                "buttons": [{
                                    "type": "postback",
                                    "title": "Unsubscribe",
                                    "payload": "Unsubscribe Popular"
                                },
                                {
                                    "type": "postback",
                                    "title": "Show Stories",
                                    "payload": "Popular News"
                                }
                                ]
                            }
                            
                            ]

                        }
                    }
                }

                    sendMessage(recipientId, message);
                
            }




            else if (docs['latest'] ===  true)
            {
                console.log("if 3");

                message = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type" : "generic",
                            "elements": [{
                                "title": "\"Latest News\" on Amarujala",
                                "image_url": "http://chatbot.amarujala.com/assets/chatbot-latest.jpg",
                                "buttons": [{
                                    "type":"postback",
                                    "title": "Unsubscribe",
                                    "payload": "Unsubscribe Latest",
                                }, {
                                    "type": "postback",
                                    "title": "Show Stories",
                                    "payload": "Latest Headlines",
                                }
                                ]
                            }
                            
                            ]

                        }
                    }
                }

                    sendMessage(recipientId, message);


            }





            else
                sendMessage(recipientId, {text: "It seems like you haven't subscribed anything." });

        }
        else  //this occurs when query returns empty brackets
        {
            sendMessage(recipientId, {text: "It seems like you haven't subscribed anything." });

        }
    });
}
