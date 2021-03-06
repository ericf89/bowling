var mongoose = require('mongoose'),
	Game = mongoose.model('Game'),
	Score = mongoose.model('Score'),
	async = require('async');

var playerController = require('./playerController.js'); 

// ###createGame()
// Creates a new game from an array of player names.
exports.createGame = function(playerNames, next){
	if(!playerNames || playerNames.length < 1 || playerNames.length > 6)
		return next({msg: 'You need 1 to 6 players names for a game of bowling!'});

	var newGame = new Game({}); // This will generate the game id that all the score objects need.

	// This passes each player name to the player controller to fetch a
	// matching player.  If a player doesn't exist matching the name, 
	// a new one is created.   
	async.map(playerNames, playerController.getPlayer, function(err, players){
		if(err) return next(err); 
		
		// Now that we have our players, we can make a new score object for each one.
		// (Calling .toObject() flattens out the new Score object by removing extraneous
		// Mongoose methods. This means we can bulk insert the scores later instead 
		// of calling 'save' on each)
		var scores = players.map(function(player){
			return new Score({
				player: player._id,
				game: newGame._id,
			}).toObject();
		});
		
		Score.collection.insert(scores, function(err, scoreModels){
			if(err) return next(err); 
			newGame.scores = scoreModels.map(function(model){
				return model._id; 
			});
			newGame.save(function(err){
				if(err) return next(err); 
				return next(null, newGame); 
			}); 
		});
	});
};
// ###populatePlayersInGame(game, next)
// This function takes in a mongoose game object and populates the player property
// in each of the scores before passing it along.   
exports.populatePlayersInGame = function(game, next){
	async.each(game.scores, function(score, done){
		Score.populate(score, {
			path: 'player',
			model: mongoose.model('Player')
		}, done);	
	}, function(err){
		return next(err, game); 
	});
};