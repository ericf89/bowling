var mongoose = require('mongoose'),
	Game = mongoose.model('Game'),
	Score = mongoose.model('Score'); 
	_ = require('underscore');

exports.createGame = function(playerNames, next){
	var newGame = new Game();
	var scores = playerNames.map(function(name){
		return {playerName: name};
	});
	Score.collection.insert(scores, function(err, scoreModels){
		if(err) return next(err); 
		newGame.playerScores = scoreModels.map(function(model){
			return model._id; 
		});
		newGame.save(function(err){
			if(err) return next(err); 
			return next(null, newGame); 
		}); 
	});
	
};