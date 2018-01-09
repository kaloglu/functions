const functions = require('firebase-functions');
const admin = require('firebase-admin');


var db = functions.database;
var adminDb = admin.database();


exports.action = db.ref("/delete_queue/{tweetId}")
	.onWrite(event => {
		var tweetData = event.data.val();
		console.log('added on delete_queue => ' + tweetData.uid);

		return CreatePushQueueInstance(tweetData);
	});

function CreatePushQueueInstance(tweetData) {
	// var pushUserData = CreatePushUserData(tweetData, (data) => {
	// 	console.log('pushUserData', pushUserData)
	return adminDb.ref('/push_queue/' + tweetData.userId)
		.once("value").then(snap => {
			// snap.set(pushUserData)
			// 	.then(() => {
			// 		console.log('created on push_queue => ', pushUserData);
			// 	});
			console.log("ok ok ok ")
		}).catch(err => {
			console.error('something wrong', err)
		})

}


function CreatePushUserData(tweetData, cb) {
	var uid = tweetData.uid;
	var userId = tweetData.userId;
	console.log("get data from twitter_accounts => " + uid + " , " + userId);
	adminDb.ref("/twitter_accounts/" + uid + "/" + userId)
		.once("value", snap => {
			var userData = snap.val();
			createPushUser(userData, (data) => {
				return data
			})
		}).then(pushUserData => {
		cb(pushUserData);
	})
};

function createPushUser(userData, cb) {
	console.log("creating user object");
	let pushUserData = {
		"uid": userData.uid,
		"deviceToken": userData.deviceToken,
		"tweet_count": 0
	}
	console.log("created user object => ", JSON.stringify(pushUserData));
	cb(pushUserData);
}
