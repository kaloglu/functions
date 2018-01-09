var delete_queue_onDelete = require("./delete_queue_onDelete.js");
var delete_queue_onWrite = require("./delete_queue_onWrite.js");
var deleted_onWrite = require("./deleted_onWrite.js");
var push_queue_onDelete = require("./push_queue_onDelete.js");

/** Delete_Queue onDelete functions */
exports.delete_queue_onDelete = delete_queue_onDelete.action

/** Delete_Queue onWrite functions */
exports.delete_queue_onWrite = delete_queue_onWrite.action

// /** Deleted onWrite functions */
exports.deleted_onWrite = deleted_onWrite.action

// /** Push_Queue onDelete functions */
exports.push_queue_onDelete = push_queue_onDelete.action