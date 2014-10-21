var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;
var scoreSchema = new Schema({	
	player: {type: Schema.Types.ObjectId, ref: 'Player', required: true},
	game: {type: Schema.Types.ObjectId, ref: 'Game', required: true} ,
	frames: [{type: Number}],
	dateCreated: {type: Date, default: Date.now}
});

mongoose.model('Score', scoreSchema); 