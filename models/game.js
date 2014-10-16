var mongoose = require('mongoose'),
	Schema = mongoose.Schema;  

var gameSchema = new Schema({
	dateCreated: {type: Date, default: Date.now},
	playerScores: [{type: Schema.Types.ObjectId, ref: 'Score'}]
});

mongoose.model('Game', gameSchema);