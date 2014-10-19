var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var playerSchema = new Schema({
	name: {type: String, required: true},
	dateCreate: {type: Date, default: Date.now}
});

mongoose.model('Player', playerSchema);