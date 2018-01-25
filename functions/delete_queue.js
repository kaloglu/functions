const functions = require('firebase-functions');
const tables = require('./firebase_tables.js');
const dbHelper = require("./db_helper.js");

var db = functions.database;

const triggeredRef = db.ref("/" + tables.delete_queue + "/{key}");

exports.onDelete = triggeredRef.onDelete(event => {
	var keys = event.params.key.split("__");
	var userId = keys[0];
	var uid = keys[1];
	return dbHelper.createNotification(uid, userId);
});
