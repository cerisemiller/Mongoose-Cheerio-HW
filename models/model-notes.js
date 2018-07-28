var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new mongoose.Schema({
	articleId: {
		type: String
	},
	comment: {
		type: String
	},
	createdAt: {
		type: Date, 
		default: Date.now
	}
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;