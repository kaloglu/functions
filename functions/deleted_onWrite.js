const functions = require('firebase-functions');
const admin = require('firebase-admin');


var db = functions.database;
var adminDb = admin.database();

exports.action = db.ref("/deleted/{tweetId}")
	.onWrite(event => {
		var tweetData = event.data.val();
		return CountUserTweets(tweetData);
	});

function CountUserTweets(tweetData) {
	var pushQueueRef = adminDb.ref('/push_queue/' + tweetData.userId);
	return pushQueueRef.once("value", snap => {
		var pushQueueData = snap.val();

		if (pushQueueData != null) {
			console.log(' on push_queue => ' + pushQueueData);
			if (pushQueueData.tweet_count > 1) {
				pushQueueData.tweet_count--;
				pushQueueRef.set(pushQueueData);
				console.log('checked on push_queue => ' + pushQueueData.tweet_count);
			} else {
				pushQueueRef.remove()
			}
		} else {
			console.log("data not found on push_queue => " + tweetData.userId)
		}
	});
}
