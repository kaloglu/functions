const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

var db = functions.database;
var adminDb = admin.database();


/** Delete_Queue onDelete functions */
exports.delete_queue_onDelete = db.ref("/delete_queue/{tweetId}")
	.onDelete(function (event) {
		var tweetData = event.data.previous.val();
		console.log('removed on delete_queue => ' + tweetData.id);
		return CreateDeletedInstance(tweetData);
	});

function CreateDeletedInstance(tweetData) {
	return adminDb.ref('/deleted/' + tweetData.id).set(tweetData)
		.then(function () {
			console.log('created on deleted => ' + tweetData.id);
		});
}


/** Delete_Queue onWrite functions */
exports.delete_queue_onWrite = db.ref("/delete_queue/{tweetId}")
	.onWrite(function (event) {
		var tweetData = event.data.val();
		console.log('added on delete_queue => ' + tweetData.uid);
		return CreatePushQueueInstance(tweetData.uid, tweetData.userId);
	});

function CreatePushQueueInstance(uid, userId) {
	var pushQueueRef = adminDb.ref('/push_queue/' + userId);
	return pushQueueRef.once("value")
		.then(function (pushUserData) {
			console.log("check ref on push_queue => " + pushUserData.deviceToken)

			CreatePushUserData(uid, userId).then(function (userData) {
				pushUserData = userData
				console.log('created push_queue first', pushUserData)

				pushUserData.tweet_count += 1;
				pushQueueRef.set(pushUserData)
					.then(function () {
						console.log("increased push_queue count", pushUserData)
					})

				console.log('created on deleted => ' + tweetData.id);
			})

		});
}

function CreatePushUserData(uid, userId) {
	console.log("get data from twitter_accounts => " + uid + " , " + userId);
	adminDb.ref("/twitter_accounts/" + uid + "/" + userId).once("value").then(function(userData){
		return createPushUser(userData)
	})
};

function createPushUser(userData) {
	console.log("creating user object");
	var user = {
		uid: userData.uid,
		deviceToken: userData.deviceToken,
		tweet_count: 0
	}
	console.log("created user object => " + user);
	return user;
}


/** Deleted onWrite functions */
exports.deleted_onWrite = db.ref("/deleted/{tweetId}")
	.onWrite(function (event) {
		var tweetData = event.data.val();
		return CountUserTweets(tweetData);
	});

function CountUserTweets(tweetData) {
	var pushQueueRef = adminDb.ref('/push_queue/' + tweetData.userId);
	return pushQueueRef.once("value")
		.then(function (snap) {
				var pushQueueData = snap.val();
				if (pushQueueData == null) {
					console.log("data not found on push_queue => " + tweetData.userId)
					return;
				}

				console.log(' on push_queue => ' + pushQueueData);
				if (pushQueueData.tweet_count > 1) {
					pushQueueData.tweet_count -= 1;
					pushQueueRef.set(pushQueueData);
					console.log('checked on push_queue => ' + pushQueueData.tweet_count);
				} else {
					pushQueueRef.remove()
				}
			}
		).catch(function (err) {
			console.log('bişiy oldu', err)
		});
}


/** Push_Queue onDelete functions */
exports.push_queue_onDelete = db.ref("/push_queue/{userId}")
	.onDelete(function (event) {
		var userId = event.data.params.userId;
		var userData = event.data.previous.val();
		console.log('removed on push_queue => ' + userId);
		return sendPushNotification(userId, userData);
	});

function sendPushNotification(userId, userData) {
	return adminDb.ref('/twitter_accounts/' + userData.uId + "/" + userId + "/deviceToken").once("value")
		.then(function (deviceToken) {
			console.log('deviceToken message sent? => ' + deviceToken);
		});
}