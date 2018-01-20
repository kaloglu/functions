const functions = require('firebase-functions');
const tables = require('./firebase_tables.js');
const dbHelper = require("./db_helper.js");

var db = functions.database;

const triggeredRef = db.ref("/" + tables.queue_table + "/{key}");
const countRef = db.ref("/" + tables.queue_table + "/queue_size");

exports.onDelete = triggeredRef.onDelete(event => {
	var key = event.params.key;
	var deletedObject = event.data.previous.val();
	const parentRef = event.data.ref.parent;
	parentRef.once("value").then(messagesData => parentRef.child("count").set(messagesData.numChildren()));

	return dbHelper.addObjectToTable(tables.deleted_table, key, deletedObject);
});


// Keeps track of the length of the 'likes' child list in a separate property.
exports.queueSize = triggeredRef.onWrite(event => {
	const collectionRef = event.data.ref.parent;
	const countRef = collectionRef.parent.child('queue_size');

	// Return the promise from countRef.transaction() so our function
	// waits for this async event to complete before it exits.
	return countRef.transaction(current => {
		if (event.data.exists() && !event.data.previous.exists()) {
			console.log("bişi eklendi");
			return (current || 0) + 1;
		}
		else if (!event.data.exists() && event.data.previous.exists()) {
			console.log("bişi silindi.");
			return (current || 0) - 1;
		}
	}).then(data => {
		// countRef.set(data.snapshot.numChildren());
		console.log('Counter updated.', data.snapshot.numChildren());
	});
});

// If the number of likes gets deleted, recount the number of likes
exports.reCountSize = countRef.onWrite(event => {
	if (!event.data.exists()) {
		const counterRef = event.data.ref;
		const collectionRef = counterRef.parent;

		// Return the promise from counterRef.set() so our function
		// waits for this async event to complete before it exits.
		console.log("a", messagesData.numChildren())
		return counterRef.once('value')
			.then(messagesData => counterRef.set(messagesData.numChildren()));
	}
});
