const functions = require('firebase-functions');
const tables = require('./firebase_tables.js');
const dbHelper = require("./db_helper.js");

var db = functions.database;

const triggeredRef = db.ref("/" + tables.delete_queue + "/{key}");

exports.onDelete = triggeredRef.onDelete(event => {
	var eventData = event.data.previous.val()
	var userId = eventData.userId;
	var uid = eventData.uid;

	console.log("event",eventData)
	console.log("user",userId)
	console.log("uid",uid)
	return dbHelper.createNotification(uid, userId);
});
