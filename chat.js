var mongoose = require("mongoose");



//Stock Schema================================================================
var chatSchema = new mongoose.Schema({
	created: Date,
	history: [{
        role: String,
        content: String,
    }]
});


module.exports = mongoose.model("chat", chatSchema);