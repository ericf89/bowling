var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;
	scoringService = require('../services/scoringService'); 
var scoreSchema = new Schema({	
	player: {type: Schema.Types.ObjectId, ref: 'Player', required: true},
	game: {type: Schema.Types.ObjectId, ref: 'Game', required: true} ,
	rolls: [{type: Number}],
	dateCreated: {type: Date, default: Date.now}
}, {id: false});
scoreSchema.virtual('frames').get(function(){
	return scoringService.getFrameByFrameScores(this.rolls); 
});
mongoose.model('Score', scoreSchema); 