var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;
var scoreSchema = new Schema({	
	playerName: {type: String, required: true}, 
	frames: [{type: Schema.Types.ObjectId, ref:'Frame'}],
	dateCreated: {type: Date, default: Date.now}
});

mongoose.model('Score', scoreSchema); 