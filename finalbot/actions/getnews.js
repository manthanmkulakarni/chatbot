var fs = require('fs'),
    request = require('request');

function fetch (api_url)
{
      user.stopflg=1;
      //console.log(user.newscat)
        
        request({
            url: api_url,
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
                var count = Object.keys(res['data']).length;
                //If no search result was found
                console.log(count)
                if(count ==0){
                  user.stopflg=0;
                }
                else{
                var i=0;
    
                if(user.newsflg<=count-5){
                  i=parseInt(user.newsflg);
                }
            else{
                user.newsflg='0'
            }    
                
            
            console.log(i)
    
                var imageurl1=res['data'][i+0]['image'];
                var newssynopsys1=res['data'][i+0]['synopsis'];
                var newsheadlines1=res['data'][i+0]['title_hn'];
                
                
                
    
                 var imageurl2=res['data'][i+1]['image'];
                  var newssynopsys2=res['data'][i+1]['synopsis'];
                  var newsheadlines2=res['data'][i+1]['title_hn'];
                  
                 
                     var imageurl3=res['data'][i+2]['image'];
                var newssynopsys3=res['data'][i+2]['synopsis'];
                var newsheadlines3=res['data'][i+2]['title_hn'];
    
    
             var imageurl4=res['data'][i+3]['image'];
                var newssynopsys4=res['data'][i+3]['synopsis'];
                var newsheadlines4=res['data'][i+3]['title_hn'];
    
             var imageurl5=res['data'][i+4]['image'];
                var newssynopsys5=res['data'][i+4]['synopsis'];
                var newsheadlines5=res['data'][i+4]['title_hn'];
                    
    
                      
                user.newsurl1=decodeURIComponent(res['data'][i+0]['web_url'])  
                user.newsurl2=decodeURIComponent(res['data'][i+1]['web_url'])  
                  
    
            user.newsurl3=decodeURIComponent(res['data'][i+2]['web_url'])
            user.newsurl4=decodeURIComponent(res['data'][i+3]['web_url'])
            user.newsurl5=decodeURIComponent(res['data'][i+4]['web_url'])
    
            user.imageurl1=imageurl1;
                user.newsheadlines1=newsheadlines1;
                user.newssynopsys1=newssynopsys1;  
    
            user.imageurl2=imageurl2;
                user.newsheadlines2=newsheadlines2;
                user.newssynopsys2=newssynopsys2;  
        
                        user.imageurl5=imageurl5;
                user.newsheadlines5=newsheadlines5;
                user.newssynopsys5=newssynopsys5;
    
                        user.imageurl3=imageurl3;
                user.newsheadlines3=newsheadlines3;
                user.newssynopsys3=newssynopsys3;
    
                        user.imageurl4=imageurl4;
                user.newsheadlines4=newsheadlines4;
                user.newssynopsys4=newssynopsys4;
                 
                
              
    
                
            }
          }
    
        });
}
function oldfetch(api_url){
  user.stopflg=1;
  console.log(user.newscat)
    
    request({
        url: api_url,
        method: 'GET'
    },function(error, response, body){
        if(error)
            console.log("589 erorr");
        else
        {

          

            var res = JSON.parse(body);
            var count = Object.keys(res['news']).length;
            //If no search result was found
            if(count ==0){
              user.stopflg=0;
            }
            else{
            var i=0;

            if(user.newsflg<count-5){
              i=parseInt(user.newsflg);
            }
	    else{
		    user.newsflg='0'
	    }    
        	
		
		console.log(i)

            var imageurl1=res['news'][i+0]['image'];
            var newssynopsys1=res['news'][i+0]['News-Synopsis'];
            var newsheadlines1=res['news'][i+0]['Hindi-Headline'];
            
            
            

             var imageurl2=res['news'][i+1]['image'];
              var newssynopsys2=res['news'][i+1]['News-Synopsis'];
              var newsheadlines2=res['news'][i+1]['Hindi-Headline'];
              
             
                 var imageurl3=res['news'][i+2]['image'];
            var newssynopsys3=res['news'][i+2]['News-Synopsis'];
            var newsheadlines3=res['news'][i+2]['Hindi-Headline'];


		 var imageurl4=res['news'][i+3]['image'];
            var newssynopsys4=res['news'][i+3]['News-Synopsis'];
            var newsheadlines4=res['news'][i+3]['Hindi-Headline'];

		 var imageurl5=res['news'][i+4]['image'];
            var newssynopsys5=res['news'][i+4]['News-Synopsis'];
            var newsheadlines5=res['news'][i+4]['Hindi-Headline'];
                

                  
            user.newsurl1=decodeURIComponent(res['news'][i+0]['Share_URL'])  
            user.newsurl2=decodeURIComponent(res['news'][i+1]['Share_URL'])  
              

		user.newsurl3=decodeURIComponent(res['news'][i+2]['Share_URL'])
		user.newsurl4=decodeURIComponent(res['news'][i+3]['Share_URL'])
		user.newsurl5=decodeURIComponent(res['news'][i+4]['Share_URL'])

	    user.imageurl1=imageurl1;
            user.newsheadlines1=newsheadlines1;
            user.newssynopsys1=newssynopsys1;  

		user.imageurl2=imageurl2;
            user.newsheadlines2=newsheadlines2;
            user.newssynopsys2=newssynopsys2;  
	
		            user.imageurl5=imageurl5;
            user.newsheadlines5=newsheadlines5;
            user.newssynopsys5=newssynopsys5;

		            user.imageurl3=imageurl3;
            user.newsheadlines3=newsheadlines3;
            user.newssynopsys3=newssynopsys3;

		            user.imageurl4=imageurl4;
            user.newsheadlines4=newsheadlines4;
            user.newssynopsys4=newssynopsys4;
             
            
            
            console.log(user.newssynopsys1);
            console.log(user.newsheadlines1);

            console.log(user.newssynopsys2);
            console.log(user.newsheadlines2);

            
        }
      }

    });

}

function fetchnews(){
    var api_url='';
    if(user.newscat=='trending'){
        api_url='http://api.amarujala.com/v1/tranding-stories';
        oldfetch(api_url);
    }
    else if(user.newscat=='latest'){
        api_url='https://api.amarujala.com/v3/contentpriorities?slug=%20live-news';
        fetch(api_url);
    }
    else{
        api_url='https://api.amarujala.com/v3/stories?category='+user.newscat;
        fetch(api_url);
    }
    
}

function top_stories (recipientId)
{
    request({
        url: 'https://api.amarujala.com/v3/contentpriorities?slug=%20live-news',
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

fetchnews();

