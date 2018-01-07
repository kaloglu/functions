const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

var db = functions.database;
exports.deleteQueue = db.ref("/delete_queue/{tweetId}")
	.onDelete(function (event) {
		const tweet = event.data.val();
		console.log("event", event)
		console.log("event.data", event.data)
		console.log("event.data.val", event.data.val())
		console.log("tweetID", event.params.tweetId)
		var tweetId = event.data.key;
		return db.ref('/deleted/${tweetId}').set(tweet)
	})


