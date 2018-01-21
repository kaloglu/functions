const functions = require('firebase-functions');
const tables = require('./firebase_tables.js');
const dbHelper = require("./db_helper.js");

var db = functions.database;

const triggeredRef = db.ref("/" + tables.queue_table + "/{key}");

exports.onDelete = triggeredRef.onDelete(event => {
	var key = event.params.key;
	var deletedObject = event.data.previous.val();
	const parentRef = event.data.ref.parent;

	if (deletedObject.rejectDelete) {
		return parentRef.child(key).set(deletedObject)
			.then(() => {
				console.error("Bu obje silinemez! => [Rejecting Deletion :" + deletedObject.rejectDelete + "]");
			});

	} else {
		return dbHelper.addObjectToTable(tables.deleted_table, key, deletedObject)
			.then(() => {
				return parentRef.parent.ref
					.child("profiles/" + deletedObject.uid + "/users/" + deletedObject.userId)
					.child("deviceTokens")
					.once("value", snap => {
						let keys = snap.val();
						keys.forEach(str => {
							dbHelper.addMessageToPushQueue(parentRef.path, tables.push_messages_table, str);
						})
					});
			});
	}
});


exports.sendPush = db.ref("/push_messages/{token}").onWrite(event => {
	var token = event.params.token;
	var newObject = event.data.val();
	var adminRef = event.data.adminRef;
	console.log("params => " + token);

	dbHelper.sendNotification(token, newObject).then(() => {
		console.log("sent !!!");
		adminRef.remove()
			.then(() => {
				console.log("burdan geçti");
				return adminRef.parent.parent.ref.child("sent_messages/" + token).set(newObject);
			}).then(() => console.log("ok"));
	});
});
