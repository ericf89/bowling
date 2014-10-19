var mongoose = require('mongoose'),
	Schema = mongoose.Schema;  

var gameSchema = new Schema({
	dateCreated: {type: Date, default: Date.now},
	playerScores: [{type: Schema.Types.ObjectId, ref: 'Score'}]
});


var playerLimitValidation = function(array){
	return array.length > 0 && array.length < 7; 
};
gameSchema.path('playerScores').validate(playerLimitValidation, 'Invalid number of players...'); 

mongoose.model('Game', gameSchema);