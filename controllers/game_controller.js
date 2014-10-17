var mongoose = require('mongoose'),
	Game = mongoose.model('Game');

exports.createGame = function(numberOfPlayers, next){
	var newGame = new Game(); 
	for(var i = 0; i < numberOfPlayers; i++){
		//make playerScores
	}
	newGame.save(function(err){
		if(err) return next(err); 
		return next(null, newGame); 
	}); 
};