var mongoose = require('mongoose');
var Player = mongoose.model('Player'); 

/* Attempts to find an existing player by this name, otherwise
	creates a new one. 
*/
exports.getPlayer = function(playerName, next){
	Player.findOne({name: playerName}, function(err, existingPlayer){
		if(err || existingPlayer) return next(err, existingPlayer); 
		Player.create({name: playerName}, function(err, newPlayer){
			return next(err, newPlayer);
		});
	}); 
};