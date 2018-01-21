const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase)

var db = admin.database();

module.exports = {
	addObjectToTable: function (table_name, key, object, onComplete) {
		return addObjectToTable(table_name, key, object, onComplete);
	},
	addMessageToPushQueue: function (path, table_name, key, onComplete) {
		return addMessageToPushQueue(path, table_name, key, onComplete);
	},
	sendNotification: function (tokens, payload) {
		return sendNotification(tokens, payload);
	}
}

function addObjectToTable(table_name, key, object, onComplete) {
	const table_ref = db.ref("/" + table_name + "/" + key);
	return table_ref.set(object, onComplete);
}

function addMessageToPushQueue(path, table_name, key, onComplete) {
	const ref = db.ref(path);
	ref.once("value").then(messagesData => {
		const numChildren = messagesData.numChildren() - 1;
		ref.child("count").set(numChildren).then(() => {
			// if (numChildren <= 1) {
			const payload = {
				notification: {
					title: "Deleting process completed!",
					body: "Deleted all of your selected tweets"
				},
			};
			return addObjectToTable(table_name, key, payload, onComplete);
			// }
		});

	});
}

function sendNotification(tokens, payload) {
	console.log("tokens=>",tokens)
	return admin.messaging().sendToDevice(tokens, payload);
}