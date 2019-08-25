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
                if(0){
                  user.stopflg=0;
                }
                else{
                var i=0;
    
               
                  i=parseInt(user.newsflg);
                
                
                
            
            console.log(i)
    
                var imageurl1=res['data'][i+0]['image'];
                var newssynopsys1=res['data'][i+0]['synopsis'];
                var newsheadlines1=res['data'][i+0]['title_hn'];

    
                      
                user.newsurl1=decodeURIComponent(res['data'][i+0]['web_url'])  
                
    
                user.imageurl1=imageurl1;
                user.newsheadlines1=newsheadlines1;
                user.newssynopsys1=newssynopsys1;  
                
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
   
                

                  
            user.newsurl1=decodeURIComponent(res['news'][i+0]['Share_URL'])  


	    user.imageurl1=imageurl1;
            user.newsheadlines1=newsheadlines1;
            user.newssynopsys1=newssynopsys1;  

            
            
            console.log(user.newssynopsys1);
            console.log(user.newsheadlines1);


            
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



fetchnews();

