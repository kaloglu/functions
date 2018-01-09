const functions = require('firebase-functions');
const admin = require('firebase-admin');

var db = functions.database;
var adminDb = admin.database();

exports.action = db.ref("/push_queue/{userId}")
	.onDelete(event => {
		var userId = event.data.params.userId;
		var userData = event.data.previous.val();
		console.log('removed on push_queue => ' + userId);
		return sendPushNotification(userId, userData);
	});

function sendPushNotification(userId, userData) {
	const payload = {
		notification: {
			title: "işlem tamamlandı!",
			body: "valaaaaa",
			badge: 1,
			sound: "default",
		}
	};
	return adminDb.ref('/twitter_accounts/' + userData.uId + "/" + userId + "/deviceToken")
		.once("value", snap => {
			var devicetoken = snap.val();
			if (deviceToken) {
				console.log('deviceToken message sent? => ', deviceToken);
				admin.messaging().sendToDevice(deviceToken, payload).then(response => {
					console.log("send notification note: => ", response);
				})

			}
		});
}
