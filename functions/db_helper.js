const functions = require('firebase-functions');
const admin = require('firebase-admin');
const tables = require('./firebase_tables.js');
admin.initializeApp(functions.config().firebase)

var db = admin.database();

module.exports = {
	createNotification: createNotification,
	sendNotification: sendNotification
}

function sendNotification(tokens, payload) {
	return admin.messaging().sendToDevice(tokens, payload);
}

function createNotification(uid, userId) {
	const payload = {
		notification: {
			body: "Deleted all of your selected tweets"
		},
	};

	let userKey = uid + "/" + userId;


	const tokenRef = db.ref("/" + tables.device_tokens + "/" + userKey);
	const profileRef = db.ref("/" + tables.profiles + "/" + userKey);


	return tokenRef.once("value").then(tokenSnap => {
		let token = tokenSnap.val();

			console.log("token",tokenSnap)
			console.log("userKey",userKey)
			console.log("path","/" + tables.profiles + "/" + userKey)

		return profileRef.once("value").then(userSnap => {
			console.log(userSnap)
			let user = userSnap.val();
			payload.notification.title = user.name;
			payload.notification.icon = user.profilePic;

			return sendNotification(token, payload);
		})
	});
}