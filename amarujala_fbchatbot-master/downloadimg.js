var fs = require('fs'),
    request = require('request');


var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

function latest_stories ()
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
            var imageurl=res['news'][0]['image'];
            var newssynopsys=res['news'][0]['News-Synopsis'];
            var newsheadlines=res['news'][1]['Hindi-Headline'];
            var imagefilepath='/Users/manthanmkulakarni/Desktop/botpress-v11_9_3-darwin-x64/images/'+'img1.jpeg';
            download(imageurl, imagefilepath, function(){
                console.log('done');
              });
            console.log(newssynopsys);
            console.log(newsheadlines);  
        }

    });
}
latest_stories();







