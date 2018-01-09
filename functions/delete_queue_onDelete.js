const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

var db = functions.database;
var adminDb = admin.database();

exports.action = db.ref("/delete_queue/{tweetId}").onDelete(event => {
	var tweetData = event.data.previous.val();
	console.log('removed on delete_queue => ' + tweetData.id);
	return CreateDeletedInstance(tweetData);
});

function CreateDeletedInstance(tweetData) {
	return adminDb.ref('/deleted/' + tweetData.id)
		.set(tweetData)
		.then(() => {
			console.log('created on deleted => ' + tweetData.id);
		});
}
