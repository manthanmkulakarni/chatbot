const token = '935131139:AAGOIrs4C28pa1uO1IUSzxnKm-Swmzv3l2M';
var chatid=685730473;
var CroneJob=require('cron').CronJob
var telegram = require('telegram-bot-api');

var requets=require('request')
var url="https://api.telegram.org/bot"+token+"/getUpdates"
function getUpdates(){
    requets({url:url,method:'GET'},function(error,response,body){
        if(error) console.log("error 589")

        else{
            var response=JSON.parse(body);
            console.log(response.result);
        }
    });
}

var TelegramBot = require('telegrambot');
var api = new TelegramBot(token);

// You can either use getUpdates or setWebHook to retrieve updates.
// getUpdates needs to be done on an interval and will contain all the 
// latest messages send to your bot.

// Update the offset to the last receive update_id + 1


var teljob=new CroneJob('*/5 * * * * *',function(){

    api.invoke('getUpdates', { offset: 0 }, function (err, updates) {
        if (err) throw err;
        console.log(updates);
    });
    
    // The chat_id received in the message update
   test()
})

function test()
{
    console.log("called")
    updates: {
        enabled: true
}
var api = new telegram({
    token: token,

});
api.on('message', function(message)
{
    api.getMe()
    .then(function(data)
    {
        console.log(data);
    })
    .catch(function(err)
    {
        console.log(err);
    });
});
}
teljob.start();
//test();


//getUpdates();


