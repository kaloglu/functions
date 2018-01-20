const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase)

var db = admin.database();

module.exports = {
	addObjectToTable: function (table_name, key, object, onComplete) {
		return addObjectToTable(table_name, key, object, onComplete);
	}
}

function addObjectToTable(table_name, key, object, onComplete) {
	const table_ref = db.ref("/" + table_name + "/" + key);
	return table_ref.set(object, onComplete);
}