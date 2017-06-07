//Include all the dependicies
var twit=require('twit');
var config=require('./config.js'); 
var Twitter=new twit(config); // Passing token to twit

var retweet=function() { 
	//Defines a filter for the retweet
	var params= { 
	q:'#Nodejs, #Javascript, #Bot', //Mention the hashtags or queries you want to filter
	result_type:'recent', //Selects recent tweets after the bot has started
	lang:'en'
}
	//Connect to the REST end point
	Twitter.get('search/tweets',params,function(err,data) {
		if(!err)
		{
			//Retrieve the id of the bit with our mentioned filters
			var retweetId=data.statuses[0].id_str;
			//Post the tweet using twitter api's post function
			Twitter.post('statuses/retweet/:id',{
				id:retweetId
			},function(err,response) {
				if(response) {
					console.log('Retweeted successfully !!!');
          }
				//Duplicate tweets won't be retweeted
				if(err) {
					console.log('Something went wrong. Might be duplication');
          }
			});
		}
		//in case no tweet is found
		else {
			console.log('Something went wrong while seaching...!');
      }
	});
}
retweet();
//Retweet after every 15 min. 
setInterval(retweet,900000);

//************ Tweet a thanks message when someone follows you ****************
var stream=Twitter.stream('user');

stream.on('follow',function(event) {
	var name=event.source.name; //Name
	var screenName=event.source.screen_name; //Username or Twitter handle
	tweetNow('@' + screenName + ' Thanks for following'); // Sets up the tweet message
	console.log('Thank you @'+screenName+" for following me");
});
function tweetNow(tweetTxt) {
	 var tweet = {
        status: tweetTxt
    }
// Posts a tweet on your bot account tagging the user that followed you.
    Twitter.post('statuses/update', tweet, function(err, data, response) {
      if(err){
        console.log("Error in Replying");
      }
      else{
        console.log("Tweeted successfully");
      }
    });
}
