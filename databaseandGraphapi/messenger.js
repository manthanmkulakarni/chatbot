"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessengerClient = exports.MessengerService = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _crypto = _interopRequireDefault(require("crypto"));

var _express = require("express");

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const debug = DEBUG('channel-messenger');
const debugMessages = debug.sub('messages');
const debugHttp = debug.sub('http');
const debugWebhook = debugHttp.sub('webhook');
const debugHttpOut = debugHttp.sub('out');
const outgoingTypes = ['text', 'typing', 'login_prompt', 'carousel'];
var fbuserid;



//data base related
var MongoClient = require('mongodb').MongoClient;
var mongo_db;
var url = 'mongodb://127.0.0.1/testbot';
MongoClient.connect(url, function(err, db) {
  console.log("Connected to server correctly.");
  mongo_db = db;
});


var actions=["subscribe","unsubscribe"];
var catagories=["entertainment","indian_news","latest_news","top_stories"];
var channel=["facebook","telegram"];
var actionflg=[0,0,0,0];
var button=["subscribe","subscribe","subscribe","subscribe"]


//flag which is used for subscription
var subscriptionflg=0,subscriptionflg2=1;

class MessengerService {
  constructor(bp) {
    this.bp = bp;

    _defineProperty(this, "http", _axios.default.create({
      baseURL: 'https://graph.facebook.com/v3.2/me'
    }));

    _defineProperty(this, "mountedBots", []);

    _defineProperty(this, "router", void 0);

    _defineProperty(this, "appSecret", void 0);
  }

  async initialize() {
    const config = await this.bp.config.getModuleConfig('channel-messenger');

    if (!config.verifyToken || !config.verifyToken.length) {
      throw new Error('You need to set a non-empty value for "verifyToken" in data/global/config/channel-messenger.json');
    }

    if (!config.appSecret || !config.appSecret.length) {
      throw new Error(`You need to set a non-empty value for "appSecret" in data/global/config/channel-messenger.json`);
    }

    this.appSecret = config.appSecret;
    this.router = this.bp.http.createRouterForBot('channel-messenger', {
      checkAuthentication: false,
      enableJsonBodyParser: false // we use our custom json body parser instead, see below

    });
    this.router.getPublicPath().then(publicPath => {
      if (publicPath.indexOf('https://') !== 0) {
        this.bp.logger.warn('Messenger requires HTTPS to be setup to work properly. See EXTERNAL_URL botpress config.');
      }

      this.bp.logger.info(`Messenger Webhook URL is ${publicPath.replace('BOT_ID', '___')}/webhook`);
      
    });
    this.router.use((0, _express.json)({
      verify: this._verifySignature.bind(this)
    }));
    this.router.get('/webhook', this._setupWebhook.bind(this));
    this.router.post('/webhook', this._handleIncomingMessage.bind(this));
    this.bp.events.registerMiddleware({
      description: 'Sends outgoing messages for the messenger channel',
      direction: 'outgoing',
      handler: this._handleOutgoingEvent.bind(this),
      name: 'messenger.sendMessages',
      order: 200
    });
  }

  async mountBot(botId) {
    const config = await this.bp.config.getModuleConfigForBot('channel-messenger', botId);

    if (config.enabled) {
      if (!config.accessToken) {
        return this.bp.logger.forBot(botId).error('You need to configure an Access Token to enable it. Messenger Channel is disabled for this bot.');
      }

      const {
        data
      } = await this.http.get('/', {
        params: {
          access_token: config.accessToken
        }
      });

      if (!data || !data.id) {
        return this.bp.logger.forBot(botId).error('Could not register bot, are you sure your Access Token is valid? Messenger Channel is disabled for this bot.');
      }

      const pageId = data.id;
      const client = new MessengerClient(botId, this.bp, this.http);
      this.mountedBots.push({
        botId: botId,
        client,
        pageId
      });
      await client.setupGreeting();
      await client.setupGetStarted();
      await client.setupPersistentMenu();
    }
  }

  async unmountBot(botId) {
    this.mountedBots = _lodash.default.remove(this.mountedBots, x => x.botId === botId);
  }

  getMessengerClientByBotId(botId) {
    const entry = _lodash.default.find(this.mountedBots, x => x.botId === botId);

    if (!entry) {
      throw new Error(`Can't find a MessengerClient for bot "${botId}"`);
    }

    return entry.client;
  } // See: https://developers.facebook.com/docs/messenger-platform/webhook#security


  _verifySignature(req, res, buffer) {
    const signatureError = new Error("Couldn't validate the request signature.");

    if (!/^\/webhook/i.test(req.path)) {
      return;
    }

    const signature = req.headers['x-hub-signature'];

    if (!signature || !this.appSecret) {
      throw signatureError;
    } else {
      const [, hash] = signature.split('=');

      const expectedHash = _crypto.default.createHmac('sha1', this.appSecret).update(buffer).digest('hex');

      if (hash !== expectedHash) {
        debugWebhook('invalid signature', req.path);
        throw signatureError;
      } else {
        debugWebhook('signed', req.path);
      }
    }
  }

  async _handleIncomingMessage(req, res) {
    const body = req.body;

    if (body.object !== 'page') {// TODO: Handle other cases here
    } else {
      res.status(200).send('EVENT_RECEIVED');
    }

    for (const entry of body.entry) {
      const pageId = entry.id;
      const messages = entry.messaging;

     
      subscriptionflg2=1;

      const bot = _lodash.default.find(this.mountedBots, {
        pageId
      });

      if (!bot) {
        debugMessages('could not find a bot for page id =', pageId);
        continue;
      }

      for (const webhookEvent of messages) {
        if (!webhookEvent.sender) {
          return;
        }

        debugMessages('incoming', webhookEvent);
        const senderId = webhookEvent.sender.id;

        fbuserid=senderId;
        console.log("senders id is :"+senderId);
        console.log(messages[0]);

        //if user wants to subscribe some catagory

        if(messages[0].hasOwnProperty('message')&&messages[0]['message']['text']=='subscribe'){
          console.log("yesss subscription");
          subscriptionflg=1;
          subscriptionflg2=0;
          
        }
        else if(messages[0].hasOwnProperty('postback')){
          
          var temp=messages[0]['postback']['payload'];
          console.log(temp);
          for(var i=0;i<catagories.length;i++){
            if(temp.indexOf(catagories[i])!=-1){
                console.log(temp.indexOf(catagories[i]));
                updatedb(senderId,catagories[i]);
                break;
            }
        }
  
        }

        await bot.client.sendAction(senderId, 'mark_seen');
 
        if (webhookEvent.message) {
          await this._sendEvent(bot.botId, senderId, webhookEvent.message, {
            type: 'message'
          });
        } else if (webhookEvent.postback) {
          await this._sendEvent(bot.botId, senderId, {
            text: webhookEvent.postback.payload
          }, {
            type: 'callback'
          });
        }
      }
    }
  }

  async _sendEvent(botId, senderId, message, args) {
    this.bp.events.sendEvent(this.bp.IO.Event({
      botId,
      channel: 'messenger',
      direction: 'incoming',
      payload: message,
      preview: message.text,
      target: senderId,
      ...args
    }));
  }

  async _setupWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const config = await this.bp.config.getModuleConfig('channel-messenger');

    if (mode && token && mode === 'subscribe' && token === config.verifyToken) {
      this.bp.logger.debug('Webhook Verified');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }

  async _handleOutgoingEvent(event, next) {
    if (event.channel !== 'messenger') {
      return next();
    }

    const messageType = event.type === 'default' ? 'text' : event.type;
    const messenger = this.getMessengerClientByBotId(event.botId);

    if (!_lodash.default.includes(outgoingTypes, messageType)) {
      return next(new Error('Unsupported event type: ' + event.type));
    }

    if (messageType === 'typing') {

      //added by manthan for testing 
     

      const typing = parseTyping(event.payload.value);
      await messenger.sendAction(event.target, 'typing_on');
      await Promise.delay(typing);
      await messenger.sendAction(event.target, 'typing_off');
    }
    else if (subscriptionflg) {

      
      var payload;
      //get actual value if present to set buttonss as subscribe or unsubscribe.
      for(var i=0;i<catagories.length;i++){
        
       
      }
      var pop_coll = mongo_db.collection(catagories[0]);
        pop_coll.findOne({"fb_id" : fbuserid},async function(err,docs){
          
          if(err)
            console.log("851 Error");
          //If data is found for the given facebook-usedid
          if(docs){
            //console.log(docs);
            //["entertainment","indian_news","latest_news","top_stories"]
           button[0]="Unsubscribe";
           
          }
          else{
            button[0]="Subscribe";
            
          }

        });

        var pop_coll = mongo_db.collection(catagories[1]);
        pop_coll.findOne({"fb_id" : fbuserid},async function(err,docs){
          
          if(err)
            console.log("851 Error");
          //If data is found for the given facebook-usedid
          if(docs){
            //console.log(docs);
            //["entertainment","indian_news","latest_news","top_stories"]
           button[1]="Unsubscribe";
           
          }
          else{
            button[1]="Subscribe";
            
          }

        });

        var pop_coll = mongo_db.collection(catagories[2]);
        pop_coll.findOne({"fb_id" : fbuserid},async function(err,docs){
          
          if(err)
            console.log("851 Error");
          //If data is found for the given facebook-usedid
          if(docs){
            //console.log(docs);
            //["entertainment","indian_news","latest_news","top_stories"]
           button[2]="Unsubscribe";
           
          }
          else{
            button[2]="Subscribe";
            
          }

        });

        var pop_coll = mongo_db.collection(catagories[3]);
        pop_coll.findOne({"fb_id" : fbuserid},async function(err,docs){
          
          if(err)
            console.log("851 Error");
          //If data is found for the given facebook-usedid
          if(docs){
            //console.log(docs);
            //["entertainment","indian_news","latest_news","top_stories"]
           button[3]="Unsubscribe";
           
          }
          else{
            button[3]="Subscribe";
            
          }

        });

        var pop_coll = mongo_db.collection(catagories[0]);
        

      
        await Promise.delay(1000);
        payload = {
          "attachment": {
              "type": "template",
              "payload": {
                  "template_type" : "generic",
                  "elements": [{
                      "title": "Entertainment",
                     
                      "buttons": [{
                          "type":"postback",
                          "title": button[0]+" entertainment",
                          "payload": "entertainment",
                      },
                      ]
                  },
                  {
                    "title": "Indian_news",
                   
                    "buttons": [{
                        "type":"postback",
                        "title": button[1]+" indian_news",
                        "payload": "indian_news",
                    },
                    ]
                },
                {
                  "title": "Latest_news",
                 
                  "buttons": [{
                      "type":"postback",
                      "title": button[2]+" latest_news",
                      "payload": "latest_news",
                  },
                  ]
              },{
                "title": "Top_stories",
               
                "buttons": [{
                    "type":"postback",
                    "title": button[3]+" top_stories",
                    "payload": "top_stories",
                },
                ]
            } 
                  ],
                  
              }
          }
      }
      
        messenger.sendTextMessage(event.target, payload);  
    subscriptionflg=0;

    } 

    else{
    
    if (messageType === 'text' || messageType === 'carousel') {
      await messenger.sendTextMessage(event.target, event.payload);
    } else {
      // TODO We don't support sending files, location requests (and probably more) yet
      throw new Error(`Message type "${messageType}" not implemented yet`);
    }

  }

    next(undefined, false);
  }

}

exports.MessengerService = MessengerService;

class MessengerClient {
  constructor(botId, bp, http) {
    this.botId = botId;
    this.bp = bp;
    this.http = http;

    _defineProperty(this, "config", void 0);
  }

  async getConfig() {
    if (this.config) {
      return this.config;
    }

    const config = await this.bp.config.getModuleConfigForBot('channel-messenger', this.botId);

    if (!config) {
      throw new Error(`Could not find channel-messenger.json config file for ${this.botId}.`);
    }

    return config;
  }

  async setupGetStarted() {
    const config = await this.getConfig();

    if (!config.getStarted) {
      return;
    }

    await this.sendProfile({
      get_started: {
        payload: config.getStarted
      }
    });
  }

  async setupGreeting() {
    const config = await this.getConfig();

    if (!config.greeting) {
      await this.deleteProfileFields(['greeting']);
      return;
    }

    await this.sendProfile({
      greeting: [{
        locale: 'default',
        text: config.greeting
      }]
    });
  }

  async setupPersistentMenu() {
    const config = await this.getConfig();

    if (!config.persistentMenu || !config.persistentMenu.length) {
      await this.deleteProfileFields(['persistent_menu']);
      return;
    }

    await this.sendProfile({
      persistent_menu: config.persistentMenu
    });
  }

  async sendAction(senderId, action) {
    const body = {
      recipient: {
        id: senderId
      },
      sender_action: action
    };
    debugMessages('outgoing action', {
      senderId,
      action,
      body
    });
    await this._callEndpoint('/messages', body);
  }

  async sendTextMessage(senderId, message) {

    
    const body = {
      recipient: {
        id: senderId
      },
      message
    };
    debugMessages('outgoing text message', {
      senderId,
      message,
      body
    });
    await this._callEndpoint('/messages', body);
  }

  async deleteProfileFields(fields) {
    const endpoint = '/messenger_profile';
    const config = await this.getConfig();
    debugHttpOut(endpoint, fields);
    await this.http.delete(endpoint, {
      params: {
        access_token: config.accessToken
      },
      data: {
        fields
      }
    });
  }

  async sendProfile(message) {
    await this._callEndpoint('/messenger_profile', message);
  }

  async _callEndpoint(endpoint, body) {
    const config = await this.getConfig();
    debugHttpOut(endpoint, body);
    await this.http.post(endpoint, body, {
      params: {
        access_token: config.accessToken
      }
    });
  }

}

exports.MessengerClient = MessengerClient;

function parseTyping(typing) {
  if (isNaN(typing)) {
    return 1000;
  }

  return Math.max(typing, 500);
}
function parseReceiving(typing) {
  if (isNaN(typing)) {
    return 5000;
  }

  return Math.max(typing, 5000);
}

//Function to update database based on user response (subscription / unsubscription)
function updatedb(userid,catagory){

  var pop_coll=mongo_db.collection(catagory);

  pop_coll.findOne({"fb_id" : userid}, function(err,docs){
    if(err)
      console.log("851 Error");
    //If data is found for the given facebook-usedid
    if(docs){
      //If already subscribed then unsubscribe the catagory
      
        pop_coll.remove({"fb_id" : userid},function(err,doc){
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
        var myobject={"fb_id" : userid }
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lc3Nlbmdlci50cyJdLCJuYW1lcyI6WyJkZWJ1ZyIsIkRFQlVHIiwiZGVidWdNZXNzYWdlcyIsInN1YiIsImRlYnVnSHR0cCIsImRlYnVnV2ViaG9vayIsImRlYnVnSHR0cE91dCIsIm91dGdvaW5nVHlwZXMiLCJNZXNzZW5nZXJTZXJ2aWNlIiwiY29uc3RydWN0b3IiLCJicCIsImF4aW9zIiwiY3JlYXRlIiwiYmFzZVVSTCIsImluaXRpYWxpemUiLCJjb25maWciLCJnZXRNb2R1bGVDb25maWciLCJ2ZXJpZnlUb2tlbiIsImxlbmd0aCIsIkVycm9yIiwiYXBwU2VjcmV0Iiwicm91dGVyIiwiaHR0cCIsImNyZWF0ZVJvdXRlckZvckJvdCIsImNoZWNrQXV0aGVudGljYXRpb24iLCJlbmFibGVKc29uQm9keVBhcnNlciIsImdldFB1YmxpY1BhdGgiLCJ0aGVuIiwicHVibGljUGF0aCIsImluZGV4T2YiLCJsb2dnZXIiLCJ3YXJuIiwiaW5mbyIsInJlcGxhY2UiLCJ1c2UiLCJ2ZXJpZnkiLCJfdmVyaWZ5U2lnbmF0dXJlIiwiYmluZCIsImdldCIsIl9zZXR1cFdlYmhvb2siLCJwb3N0IiwiX2hhbmRsZUluY29taW5nTWVzc2FnZSIsImV2ZW50cyIsInJlZ2lzdGVyTWlkZGxld2FyZSIsImRlc2NyaXB0aW9uIiwiZGlyZWN0aW9uIiwiaGFuZGxlciIsIl9oYW5kbGVPdXRnb2luZ0V2ZW50IiwibmFtZSIsIm9yZGVyIiwibW91bnRCb3QiLCJib3RJZCIsImdldE1vZHVsZUNvbmZpZ0ZvckJvdCIsImVuYWJsZWQiLCJhY2Nlc3NUb2tlbiIsImZvckJvdCIsImVycm9yIiwiZGF0YSIsInBhcmFtcyIsImFjY2Vzc190b2tlbiIsImlkIiwicGFnZUlkIiwiY2xpZW50IiwiTWVzc2VuZ2VyQ2xpZW50IiwibW91bnRlZEJvdHMiLCJwdXNoIiwic2V0dXBHcmVldGluZyIsInNldHVwR2V0U3RhcnRlZCIsInNldHVwUGVyc2lzdGVudE1lbnUiLCJ1bm1vdW50Qm90IiwiXyIsInJlbW92ZSIsIngiLCJnZXRNZXNzZW5nZXJDbGllbnRCeUJvdElkIiwiZW50cnkiLCJmaW5kIiwicmVxIiwicmVzIiwiYnVmZmVyIiwic2lnbmF0dXJlRXJyb3IiLCJ0ZXN0IiwicGF0aCIsInNpZ25hdHVyZSIsImhlYWRlcnMiLCJoYXNoIiwic3BsaXQiLCJleHBlY3RlZEhhc2giLCJjcnlwdG8iLCJjcmVhdGVIbWFjIiwidXBkYXRlIiwiZGlnZXN0IiwiYm9keSIsIm9iamVjdCIsInN0YXR1cyIsInNlbmQiLCJtZXNzYWdlcyIsIm1lc3NhZ2luZyIsImJvdCIsIndlYmhvb2tFdmVudCIsInNlbmRlciIsInNlbmRlcklkIiwic2VuZEFjdGlvbiIsIm1lc3NhZ2UiLCJfc2VuZEV2ZW50IiwidHlwZSIsInBvc3RiYWNrIiwidGV4dCIsInBheWxvYWQiLCJhcmdzIiwic2VuZEV2ZW50IiwiSU8iLCJFdmVudCIsImNoYW5uZWwiLCJwcmV2aWV3IiwidGFyZ2V0IiwibW9kZSIsInF1ZXJ5IiwidG9rZW4iLCJjaGFsbGVuZ2UiLCJzZW5kU3RhdHVzIiwiZXZlbnQiLCJuZXh0IiwibWVzc2FnZVR5cGUiLCJtZXNzZW5nZXIiLCJpbmNsdWRlcyIsInR5cGluZyIsInBhcnNlVHlwaW5nIiwidmFsdWUiLCJQcm9taXNlIiwiZGVsYXkiLCJzZW5kVGV4dE1lc3NhZ2UiLCJ1bmRlZmluZWQiLCJnZXRDb25maWciLCJnZXRTdGFydGVkIiwic2VuZFByb2ZpbGUiLCJnZXRfc3RhcnRlZCIsImdyZWV0aW5nIiwiZGVsZXRlUHJvZmlsZUZpZWxkcyIsImxvY2FsZSIsInBlcnNpc3RlbnRNZW51IiwicGVyc2lzdGVudF9tZW51IiwiYWN0aW9uIiwicmVjaXBpZW50Iiwic2VuZGVyX2FjdGlvbiIsIl9jYWxsRW5kcG9pbnQiLCJmaWVsZHMiLCJlbmRwb2ludCIsImRlbGV0ZSIsImlzTmFOIiwiTWF0aCIsIm1heCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7QUFJQSxNQUFN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b3VyY2VSb290IjoiL3Zhci9saWIvamVua2lucy93b3Jrc3BhY2UvYnVpbGQtbWFjL21vZHVsZXMvY2hhbm5lbC1tZXNzZW5nZXIvc3JjL2JhY2tlbmQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgQXhpb3NJbnN0YW5jZSB9IGZyb20gJ2F4aW9zJ1xuaW1wb3J0ICogYXMgc2RrIGZyb20gJ2JvdHByZXNzL3NkaydcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJ1xuaW1wb3J0IHsganNvbiBhcyBleHByZXNzSnNvbiwgUm91dGVyIH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcblxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJ1xuXG5jb25zdCBkZWJ1ZyA9IERFQlVHKCdjaGFubmVsLW1lc3NlbmdlcicpXG5jb25zdCBkZWJ1Z01lc3NhZ2VzID0gZGVidWcuc3ViKCdtZXNzYWdlcycpXG5jb25zdCBkZWJ1Z0h0dHAgPSBkZWJ1Zy5zdWIoJ2h0dHAnKVxuY29uc3QgZGVidWdXZWJob29rID0gZGVidWdIdHRwLnN1Yignd2ViaG9vaycpXG5jb25zdCBkZWJ1Z0h0dHBPdXQgPSBkZWJ1Z0h0dHAuc3ViKCdvdXQnKVxuXG5jb25zdCBvdXRnb2luZ1R5cGVzID0gWyd0ZXh0JywgJ3R5cGluZycsICdsb2dpbl9wcm9tcHQnLCAnY2Fyb3VzZWwnXVxudHlwZSBNZXNzZW5nZXJBY3Rpb24gPSAndHlwaW5nX29uJyB8ICd0eXBpbmdfb2ZmJyB8ICdtYXJrX3NlZW4nXG5cbnR5cGUgTW91bnRlZEJvdCA9IHsgcGFnZUlkOiBzdHJpbmc7IGJvdElkOiBzdHJpbmc7IGNsaWVudDogTWVzc2VuZ2VyQ2xpZW50IH1cblxuZXhwb3J0IGNsYXNzIE1lc3NlbmdlclNlcnZpY2Uge1xuICBwcml2YXRlIHJlYWRvbmx5IGh0dHAgPSBheGlvcy5jcmVhdGUoeyBiYXNlVVJMOiAnaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vdjMuMi9tZScgfSlcbiAgcHJpdmF0ZSBtb3VudGVkQm90czogTW91bnRlZEJvdFtdID0gW11cbiAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciAmIHNkay5odHRwLlJvdXRlckV4dGVuc2lvblxuICBwcml2YXRlIGFwcFNlY3JldDogc3RyaW5nXG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBicDogdHlwZW9mIHNkaykge31cblxuICBhc3luYyBpbml0aWFsaXplKCkge1xuICAgIGNvbnN0IGNvbmZpZyA9IChhd2FpdCB0aGlzLmJwLmNvbmZpZy5nZXRNb2R1bGVDb25maWcoJ2NoYW5uZWwtbWVzc2VuZ2VyJykpIGFzIENvbmZpZ1xuXG4gICAgaWYgKCFjb25maWcudmVyaWZ5VG9rZW4gfHwgIWNvbmZpZy52ZXJpZnlUb2tlbi5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1lvdSBuZWVkIHRvIHNldCBhIG5vbi1lbXB0eSB2YWx1ZSBmb3IgXCJ2ZXJpZnlUb2tlblwiIGluIGRhdGEvZ2xvYmFsL2NvbmZpZy9jaGFubmVsLW1lc3Nlbmdlci5qc29uJ1xuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghY29uZmlnLmFwcFNlY3JldCB8fCAhY29uZmlnLmFwcFNlY3JldC5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgWW91IG5lZWQgdG8gc2V0IGEgbm9uLWVtcHR5IHZhbHVlIGZvciBcImFwcFNlY3JldFwiIGluIGRhdGEvZ2xvYmFsL2NvbmZpZy9jaGFubmVsLW1lc3Nlbmdlci5qc29uYClcbiAgICB9XG5cbiAgICB0aGlzLmFwcFNlY3JldCA9IGNvbmZpZy5hcHBTZWNyZXRcblxuICAgIHRoaXMucm91dGVyID0gdGhpcy5icC5odHRwLmNyZWF0ZVJvdXRlckZvckJvdCgnY2hhbm5lbC1tZXNzZW5nZXInLCB7XG4gICAgICBjaGVja0F1dGhlbnRpY2F0aW9uOiBmYWxzZSxcbiAgICAgIGVuYWJsZUpzb25Cb2R5UGFyc2VyOiBmYWxzZSAvLyB3ZSB1c2Ugb3VyIGN1c3RvbSBqc29uIGJvZHkgcGFyc2VyIGluc3RlYWQsIHNlZSBiZWxvd1xuICAgIH0pXG5cbiAgICB0aGlzLnJvdXRlci5nZXRQdWJsaWNQYXRoKCkudGhlbihwdWJsaWNQYXRoID0+IHtcbiAgICAgIGlmIChwdWJsaWNQYXRoLmluZGV4T2YoJ2h0dHBzOi8vJykgIT09IDApIHtcbiAgICAgICAgdGhpcy5icC5sb2dnZXIud2FybignTWVzc2VuZ2VyIHJlcXVpcmVzIEhUVFBTIHRvIGJlIHNldHVwIHRvIHdvcmsgcHJvcGVybHkuIFNlZSBFWFRFUk5BTF9VUkwgYm90cHJlc3MgY29uZmlnLicpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuYnAubG9nZ2VyLmluZm8oYE1lc3NlbmdlciBXZWJob29rIFVSTCBpcyAke3B1YmxpY1BhdGgucmVwbGFjZSgnQk9UX0lEJywgJ19fXycpfS93ZWJob29rYClcbiAgICB9KVxuXG4gICAgdGhpcy5yb3V0ZXIudXNlKFxuICAgICAgZXhwcmVzc0pzb24oe1xuICAgICAgICB2ZXJpZnk6IHRoaXMuX3ZlcmlmeVNpZ25hdHVyZS5iaW5kKHRoaXMpXG4gICAgICB9KVxuICAgIClcblxuICAgIHRoaXMucm91dGVyLmdldCgnL3dlYmhvb2snLCB0aGlzLl9zZXR1cFdlYmhvb2suYmluZCh0aGlzKSlcbiAgICB0aGlzLnJvdXRlci5wb3N0KCcvd2ViaG9vaycsIHRoaXMuX2hhbmRsZUluY29taW5nTWVzc2FnZS5iaW5kKHRoaXMpKVxuXG4gICAgdGhpcy5icC5ldmVudHMucmVnaXN0ZXJNaWRkbGV3YXJlKHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2VuZHMgb3V0Z29pbmcgbWVzc2FnZXMgZm9yIHRoZSBtZXNzZW5nZXIgY2hhbm5lbCcsXG4gICAgICBkaXJlY3Rpb246ICdvdXRnb2luZycsXG4gICAgICBoYW5kbGVyOiB0aGlzLl9oYW5kbGVPdXRnb2luZ0V2ZW50LmJpbmQodGhpcyksXG4gICAgICBuYW1lOiAnbWVzc2VuZ2VyLnNlbmRNZXNzYWdlcycsXG4gICAgICBvcmRlcjogMjAwXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIG1vdW50Qm90KGJvdElkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjb25maWcgPSAoYXdhaXQgdGhpcy5icC5jb25maWcuZ2V0TW9kdWxlQ29uZmlnRm9yQm90KCdjaGFubmVsLW1lc3NlbmdlcicsIGJvdElkKSkgYXMgQ29uZmlnXG4gICAgaWYgKGNvbmZpZy5lbmFibGVkKSB7XG4gICAgICBpZiAoIWNvbmZpZy5hY2Nlc3NUb2tlbikge1xuICAgICAgICByZXR1cm4gdGhpcy5icC5sb2dnZXJcbiAgICAgICAgICAuZm9yQm90KGJvdElkKVxuICAgICAgICAgIC5lcnJvcignWW91IG5lZWQgdG8gY29uZmlndXJlIGFuIEFjY2VzcyBUb2tlbiB0byBlbmFibGUgaXQuIE1lc3NlbmdlciBDaGFubmVsIGlzIGRpc2FibGVkIGZvciB0aGlzIGJvdC4nKVxuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuaHR0cC5nZXQoJy8nLCB7IHBhcmFtczogeyBhY2Nlc3NfdG9rZW46IGNvbmZpZy5hY2Nlc3NUb2tlbiB9IH0pXG5cbiAgICAgIGlmICghZGF0YSB8fCAhZGF0YS5pZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5icC5sb2dnZXJcbiAgICAgICAgICAuZm9yQm90KGJvdElkKVxuICAgICAgICAgIC5lcnJvcihcbiAgICAgICAgICAgICdDb3VsZCBub3QgcmVnaXN0ZXIgYm90LCBhcmUgeW91IHN1cmUgeW91ciBBY2Nlc3MgVG9rZW4gaXMgdmFsaWQ/IE1lc3NlbmdlciBDaGFubmVsIGlzIGRpc2FibGVkIGZvciB0aGlzIGJvdC4nXG4gICAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBwYWdlSWQgPSBkYXRhLmlkXG4gICAgICBjb25zdCBjbGllbnQgPSBuZXcgTWVzc2VuZ2VyQ2xpZW50KGJvdElkLCB0aGlzLmJwLCB0aGlzLmh0dHApXG4gICAgICB0aGlzLm1vdW50ZWRCb3RzLnB1c2goeyBib3RJZDogYm90SWQsIGNsaWVudCwgcGFnZUlkIH0pXG5cbiAgICAgIGF3YWl0IGNsaWVudC5zZXR1cEdyZWV0aW5nKClcbiAgICAgIGF3YWl0IGNsaWVudC5zZXR1cEdldFN0YXJ0ZWQoKVxuICAgICAgYXdhaXQgY2xpZW50LnNldHVwUGVyc2lzdGVudE1lbnUoKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHVubW91bnRCb3QoYm90SWQ6IHN0cmluZykge1xuICAgIHRoaXMubW91bnRlZEJvdHMgPSBfLnJlbW92ZSh0aGlzLm1vdW50ZWRCb3RzLCB4ID0+IHguYm90SWQgPT09IGJvdElkKVxuICB9XG5cbiAgZ2V0TWVzc2VuZ2VyQ2xpZW50QnlCb3RJZChib3RJZDogc3RyaW5nKTogTWVzc2VuZ2VyQ2xpZW50IHtcbiAgICBjb25zdCBlbnRyeSA9IF8uZmluZCh0aGlzLm1vdW50ZWRCb3RzLCB4ID0+IHguYm90SWQgPT09IGJvdElkKVxuXG4gICAgaWYgKCFlbnRyeSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW4ndCBmaW5kIGEgTWVzc2VuZ2VyQ2xpZW50IGZvciBib3QgXCIke2JvdElkfVwiYClcbiAgICB9XG5cbiAgICByZXR1cm4gZW50cnkuY2xpZW50XG4gIH1cblxuICAvLyBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVycy5mYWNlYm9vay5jb20vZG9jcy9tZXNzZW5nZXItcGxhdGZvcm0vd2ViaG9vayNzZWN1cml0eVxuICBwcml2YXRlIF92ZXJpZnlTaWduYXR1cmUocmVxLCByZXMsIGJ1ZmZlcikge1xuICAgIGNvbnN0IHNpZ25hdHVyZUVycm9yID0gbmV3IEVycm9yKFwiQ291bGRuJ3QgdmFsaWRhdGUgdGhlIHJlcXVlc3Qgc2lnbmF0dXJlLlwiKVxuXG4gICAgaWYgKCEvXlxcL3dlYmhvb2svaS50ZXN0KHJlcS5wYXRoKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgc2lnbmF0dXJlID0gcmVxLmhlYWRlcnNbJ3gtaHViLXNpZ25hdHVyZSddXG4gICAgaWYgKCFzaWduYXR1cmUgfHwgIXRoaXMuYXBwU2VjcmV0KSB7XG4gICAgICB0aHJvdyBzaWduYXR1cmVFcnJvclxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBbLCBoYXNoXSA9IHNpZ25hdHVyZS5zcGxpdCgnPScpXG5cbiAgICAgIGNvbnN0IGV4cGVjdGVkSGFzaCA9IGNyeXB0b1xuICAgICAgICAuY3JlYXRlSG1hYygnc2hhMScsIHRoaXMuYXBwU2VjcmV0KVxuICAgICAgICAudXBkYXRlKGJ1ZmZlcilcbiAgICAgICAgLmRpZ2VzdCgnaGV4JylcblxuICAgICAgaWYgKGhhc2ggIT09IGV4cGVjdGVkSGFzaCkge1xuICAgICAgICBkZWJ1Z1dlYmhvb2soJ2ludmFsaWQgc2lnbmF0dXJlJywgcmVxLnBhdGgpXG4gICAgICAgIHRocm93IHNpZ25hdHVyZUVycm9yXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWJ1Z1dlYmhvb2soJ3NpZ25lZCcsIHJlcS5wYXRoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX2hhbmRsZUluY29taW5nTWVzc2FnZShyZXEsIHJlcykge1xuICAgIGNvbnN0IGJvZHkgPSByZXEuYm9keVxuXG4gICAgaWYgKGJvZHkub2JqZWN0ICE9PSAncGFnZScpIHtcbiAgICAgIC8vIFRPRE86IEhhbmRsZSBvdGhlciBjYXNlcyBoZXJlXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKCdFVkVOVF9SRUNFSVZFRCcpXG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBib2R5LmVudHJ5KSB7XG4gICAgICBjb25zdCBwYWdlSWQgPSBlbnRyeS5pZFxuICAgICAgY29uc3QgbWVzc2FnZXMgPSBlbnRyeS5tZXNzYWdpbmdcblxuICAgICAgY29uc3QgYm90ID0gXy5maW5kPE1vdW50ZWRCb3Q+KHRoaXMubW91bnRlZEJvdHMsIHsgcGFnZUlkIH0pXG4gICAgICBpZiAoIWJvdCkge1xuICAgICAgICBkZWJ1Z01lc3NhZ2VzKCdjb3VsZCBub3QgZmluZCBhIGJvdCBmb3IgcGFnZSBpZCA9JywgcGFnZUlkKVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBmb3IgKGNvbnN0IHdlYmhvb2tFdmVudCBvZiBtZXNzYWdlcykge1xuICAgICAgICBpZiAoIXdlYmhvb2tFdmVudC5zZW5kZXIpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGRlYnVnTWVzc2FnZXMoJ2luY29taW5nJywgd2ViaG9va0V2ZW50KVxuICAgICAgICBjb25zdCBzZW5kZXJJZCA9IHdlYmhvb2tFdmVudC5zZW5kZXIuaWRcblxuICAgICAgICBhd2FpdCBib3QuY2xpZW50LnNlbmRBY3Rpb24oc2VuZGVySWQsICdtYXJrX3NlZW4nKVxuXG4gICAgICAgIGlmICh3ZWJob29rRXZlbnQubWVzc2FnZSkge1xuICAgICAgICAgIGF3YWl0IHRoaXMuX3NlbmRFdmVudChib3QuYm90SWQsIHNlbmRlcklkLCB3ZWJob29rRXZlbnQubWVzc2FnZSwgeyB0eXBlOiAnbWVzc2FnZScgfSlcbiAgICAgICAgfSBlbHNlIGlmICh3ZWJob29rRXZlbnQucG9zdGJhY2spIHtcbiAgICAgICAgICBhd2FpdCB0aGlzLl9zZW5kRXZlbnQoYm90LmJvdElkLCBzZW5kZXJJZCwgeyB0ZXh0OiB3ZWJob29rRXZlbnQucG9zdGJhY2sucGF5bG9hZCB9LCB7IHR5cGU6ICdjYWxsYmFjaycgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX3NlbmRFdmVudChib3RJZDogc3RyaW5nLCBzZW5kZXJJZDogc3RyaW5nLCBtZXNzYWdlLCBhcmdzOiB7IHR5cGU6IHN0cmluZyB9KSB7XG4gICAgdGhpcy5icC5ldmVudHMuc2VuZEV2ZW50KFxuICAgICAgdGhpcy5icC5JTy5FdmVudCh7XG4gICAgICAgIGJvdElkLFxuICAgICAgICBjaGFubmVsOiAnbWVzc2VuZ2VyJyxcbiAgICAgICAgZGlyZWN0aW9uOiAnaW5jb21pbmcnLFxuICAgICAgICBwYXlsb2FkOiBtZXNzYWdlLFxuICAgICAgICBwcmV2aWV3OiBtZXNzYWdlLnRleHQsXG4gICAgICAgIHRhcmdldDogc2VuZGVySWQsXG4gICAgICAgIC4uLmFyZ3NcbiAgICAgIH0pXG4gICAgKVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfc2V0dXBXZWJob29rKHJlcSwgcmVzKSB7XG4gICAgY29uc3QgbW9kZSA9IHJlcS5xdWVyeVsnaHViLm1vZGUnXVxuICAgIGNvbnN0IHRva2VuID0gcmVxLnF1ZXJ5WydodWIudmVyaWZ5X3Rva2VuJ11cbiAgICBjb25zdCBjaGFsbGVuZ2UgPSByZXEucXVlcnlbJ2h1Yi5jaGFsbGVuZ2UnXVxuXG4gICAgY29uc3QgY29uZmlnID0gKGF3YWl0IHRoaXMuYnAuY29uZmlnLmdldE1vZHVsZUNvbmZpZygnY2hhbm5lbC1tZXNzZW5nZXInKSkgYXMgQ29uZmlnXG5cbiAgICBpZiAobW9kZSAmJiB0b2tlbiAmJiBtb2RlID09PSAnc3Vic2NyaWJlJyAmJiB0b2tlbiA9PT0gY29uZmlnLnZlcmlmeVRva2VuKSB7XG4gICAgICB0aGlzLmJwLmxvZ2dlci5kZWJ1ZygnV2ViaG9vayBWZXJpZmllZCcpXG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChjaGFsbGVuZ2UpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy5zZW5kU3RhdHVzKDQwMylcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9oYW5kbGVPdXRnb2luZ0V2ZW50KGV2ZW50OiBzZGsuSU8uRXZlbnQsIG5leHQ6IHNkay5JTy5NaWRkbGV3YXJlTmV4dENhbGxiYWNrKSB7XG4gICAgaWYgKGV2ZW50LmNoYW5uZWwgIT09ICdtZXNzZW5nZXInKSB7XG4gICAgICByZXR1cm4gbmV4dCgpXG4gICAgfVxuXG4gICAgY29uc3QgbWVzc2FnZVR5cGUgPSBldmVudC50eXBlID09PSAnZGVmYXVsdCcgPyAndGV4dCcgOiBldmVudC50eXBlXG4gICAgY29uc3QgbWVzc2VuZ2VyID0gdGhpcy5nZXRNZXNzZW5nZXJDbGllbnRCeUJvdElkKGV2ZW50LmJvdElkKVxuXG4gICAgaWYgKCFfLmluY2x1ZGVzKG91dGdvaW5nVHlwZXMsIG1lc3NhZ2VUeXBlKSkge1xuICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9yKCdVbnN1cHBvcnRlZCBldmVudCB0eXBlOiAnICsgZXZlbnQudHlwZSkpXG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2VUeXBlID09PSAndHlwaW5nJykge1xuICAgICAgY29uc3QgdHlwaW5nID0gcGFyc2VUeXBpbmcoZXZlbnQucGF5bG9hZC52YWx1ZSlcbiAgICAgIGF3YWl0IG1lc3Nlbmdlci5zZW5kQWN0aW9uKGV2ZW50LnRhcmdldCwgJ3R5cGluZ19vbicpXG4gICAgICBhd2FpdCBQcm9taXNlLmRlbGF5KHR5cGluZylcbiAgICAgIGF3YWl0IG1lc3Nlbmdlci5zZW5kQWN0aW9uKGV2ZW50LnRhcmdldCwgJ3R5cGluZ19vZmYnKVxuICAgIH0gZWxzZSBpZiAobWVzc2FnZVR5cGUgPT09ICd0ZXh0JyB8fCBtZXNzYWdlVHlwZSA9PT0gJ2Nhcm91c2VsJykge1xuICAgICAgYXdhaXQgbWVzc2VuZ2VyLnNlbmRUZXh0TWVzc2FnZShldmVudC50YXJnZXQsIGV2ZW50LnBheWxvYWQpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRPRE8gV2UgZG9uJ3Qgc3VwcG9ydCBzZW5kaW5nIGZpbGVzLCBsb2NhdGlvbiByZXF1ZXN0cyAoYW5kIHByb2JhYmx5IG1vcmUpIHlldFxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNZXNzYWdlIHR5cGUgXCIke21lc3NhZ2VUeXBlfVwiIG5vdCBpbXBsZW1lbnRlZCB5ZXRgKVxuICAgIH1cblxuICAgIG5leHQodW5kZWZpbmVkLCBmYWxzZSlcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTWVzc2VuZ2VyQ2xpZW50IHtcbiAgcHJpdmF0ZSBjb25maWc6IENvbmZpZ1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYm90SWQ6IHN0cmluZywgcHJpdmF0ZSBicDogdHlwZW9mIHNkaywgcHJpdmF0ZSBodHRwOiBBeGlvc0luc3RhbmNlKSB7fVxuXG4gIGFzeW5jIGdldENvbmZpZygpOiBQcm9taXNlPENvbmZpZz4ge1xuICAgIGlmICh0aGlzLmNvbmZpZykge1xuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnXG4gICAgfVxuXG4gICAgY29uc3QgY29uZmlnID0gKGF3YWl0IHRoaXMuYnAuY29uZmlnLmdldE1vZHVsZUNvbmZpZ0ZvckJvdCgnY2hhbm5lbC1tZXNzZW5nZXInLCB0aGlzLmJvdElkKSkgYXMgQ29uZmlnXG4gICAgaWYgKCFjb25maWcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgY2hhbm5lbC1tZXNzZW5nZXIuanNvbiBjb25maWcgZmlsZSBmb3IgJHt0aGlzLmJvdElkfS5gKVxuICAgIH1cblxuICAgIHJldHVybiBjb25maWdcbiAgfVxuXG4gIGFzeW5jIHNldHVwR2V0U3RhcnRlZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBjb25maWcgPSBhd2FpdCB0aGlzLmdldENvbmZpZygpXG4gICAgaWYgKCFjb25maWcuZ2V0U3RhcnRlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5zZW5kUHJvZmlsZSh7XG4gICAgICBnZXRfc3RhcnRlZDoge1xuICAgICAgICBwYXlsb2FkOiBjb25maWcuZ2V0U3RhcnRlZFxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBhc3luYyBzZXR1cEdyZWV0aW5nKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlnKClcbiAgICBpZiAoIWNvbmZpZy5ncmVldGluZykge1xuICAgICAgYXdhaXQgdGhpcy5kZWxldGVQcm9maWxlRmllbGRzKFsnZ3JlZXRpbmcnXSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuc2VuZFByb2ZpbGUoe1xuICAgICAgZ3JlZXRpbmc6IFtcbiAgICAgICAge1xuICAgICAgICAgIGxvY2FsZTogJ2RlZmF1bHQnLFxuICAgICAgICAgIHRleHQ6IGNvbmZpZy5ncmVldGluZ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIHNldHVwUGVyc2lzdGVudE1lbnUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY29uZmlnID0gYXdhaXQgdGhpcy5nZXRDb25maWcoKVxuICAgIGlmICghY29uZmlnLnBlcnNpc3RlbnRNZW51IHx8ICFjb25maWcucGVyc2lzdGVudE1lbnUubGVuZ3RoKSB7XG4gICAgICBhd2FpdCB0aGlzLmRlbGV0ZVByb2ZpbGVGaWVsZHMoWydwZXJzaXN0ZW50X21lbnUnXSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuc2VuZFByb2ZpbGUoeyBwZXJzaXN0ZW50X21lbnU6IGNvbmZpZy5wZXJzaXN0ZW50TWVudSB9KVxuICB9XG5cbiAgYXN5bmMgc2VuZEFjdGlvbihzZW5kZXJJZDogc3RyaW5nLCBhY3Rpb246IE1lc3NlbmdlckFjdGlvbikge1xuICAgIGNvbnN0IGJvZHkgPSB7XG4gICAgICByZWNpcGllbnQ6IHtcbiAgICAgICAgaWQ6IHNlbmRlcklkXG4gICAgICB9LFxuICAgICAgc2VuZGVyX2FjdGlvbjogYWN0aW9uXG4gICAgfVxuICAgIGRlYnVnTWVzc2FnZXMoJ291dGdvaW5nIGFjdGlvbicsIHsgc2VuZGVySWQsIGFjdGlvbiwgYm9keSB9KVxuICAgIGF3YWl0IHRoaXMuX2NhbGxFbmRwb2ludCgnL21lc3NhZ2VzJywgYm9keSlcbiAgfVxuXG4gIGFzeW5jIHNlbmRUZXh0TWVzc2FnZShzZW5kZXJJZDogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBib2R5ID0ge1xuICAgICAgcmVjaXBpZW50OiB7XG4gICAgICAgIGlkOiBzZW5kZXJJZFxuICAgICAgfSxcbiAgICAgIG1lc3NhZ2VcbiAgICB9XG5cbiAgICBkZWJ1Z01lc3NhZ2VzKCdvdXRnb2luZyB0ZXh0IG1lc3NhZ2UnLCB7IHNlbmRlcklkLCBtZXNzYWdlLCBib2R5IH0pXG4gICAgYXdhaXQgdGhpcy5fY2FsbEVuZHBvaW50KCcvbWVzc2FnZXMnLCBib2R5KVxuICB9XG5cbiAgYXN5bmMgZGVsZXRlUHJvZmlsZUZpZWxkcyhmaWVsZHM6IHN0cmluZ1tdKSB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSAnL21lc3Nlbmdlcl9wcm9maWxlJ1xuICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlnKClcbiAgICBkZWJ1Z0h0dHBPdXQoZW5kcG9pbnQsIGZpZWxkcylcbiAgICBhd2FpdCB0aGlzLmh0dHAuZGVsZXRlKGVuZHBvaW50LCB7IHBhcmFtczogeyBhY2Nlc3NfdG9rZW46IGNvbmZpZy5hY2Nlc3NUb2tlbiB9LCBkYXRhOiB7IGZpZWxkcyB9IH0pXG4gIH1cblxuICBhc3luYyBzZW5kUHJvZmlsZShtZXNzYWdlKSB7XG4gICAgYXdhaXQgdGhpcy5fY2FsbEVuZHBvaW50KCcvbWVzc2VuZ2VyX3Byb2ZpbGUnLCBtZXNzYWdlKVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfY2FsbEVuZHBvaW50KGVuZHBvaW50OiBzdHJpbmcsIGJvZHkpIHtcbiAgICBjb25zdCBjb25maWcgPSBhd2FpdCB0aGlzLmdldENvbmZpZygpXG4gICAgZGVidWdIdHRwT3V0KGVuZHBvaW50LCBib2R5KVxuICAgIGF3YWl0IHRoaXMuaHR0cC5wb3N0KGVuZHBvaW50LCBib2R5LCB7IHBhcmFtczogeyBhY2Nlc3NfdG9rZW46IGNvbmZpZy5hY2Nlc3NUb2tlbiB9IH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VUeXBpbmcodHlwaW5nKSB7XG4gIGlmIChpc05hTih0eXBpbmcpKSB7XG4gICAgcmV0dXJuIDEwMDBcbiAgfVxuXG4gIHJldHVybiBNYXRoLm1heCh0eXBpbmcsIDUwMClcbn1cbiJdfQ==