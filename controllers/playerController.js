var mongoose = require('mongoose');
var Player = mongoose.model('Player'); 

// ###getPlayer()
// This method attempts to find an existing player by this name, otherwise creates a new one. 
exports.getPlayer = function(playerName, next){
	Player.findOne({name: playerName}, function(err, existingPlayer){
		if(err || existingPlayer) return next(err, existingPlayer); 
		Player.create({name: playerName}, function(err, newPlayer){
			return next(err, newPlayer);
		});
	}); 
};

// Player objects are pretty light.  Just a name basically. Not too much going on here.....