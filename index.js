
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

var db = functions.database;
exports.deleteQueue = db
	.ref("/delete_queue/{tweetId}")
    .onDelete(function (event) {
        const tweet = event.data.previous.val();
        console.log("event.data tweet", tweet);
        console.log("tweetID", event.params.tweetId);
        
        var tweetId = event.params.tweetId;
             
	return admin.database()
	.ref('/deleted/'+tweetId)
	.set(tweet).then(()=>{
		console.log('it is done');
	});
});
