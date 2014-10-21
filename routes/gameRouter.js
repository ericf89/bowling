var gameResource = require('express').Router(),
	mongoose = require('mongoose'),
	Game = mongoose.model('Game'),
	gameController = require('../controllers/gameController'); 
module.exports = function(){
	/*	This endpoint expects a simple json object with an array of players. It
		will lookup/create a player object for each of those player names.
		`{ 
			"players": ["Carl", "Rick"]
		}`

		It return for your efforts, if you properly format your json, and 
		follow all the bowling rules, (0 < #ofPlayers < 7),  you'll receive
		a response containing your new gameID, and ids of the scores objects for this game.
		`{
			game: {
				__v: 0,
				_id: "5445cf08faf619d8af4dc8ba",
				scores: [
					"5445cf08faf619d8af4dc8bc",
					"5445cf08faf619d8af4dc8bd",
					"5445cf08faf619d8af4dc8be"
				],
				dateCreated: "2014-10-21T03:12:08.658Z"
			}
		}`
	*/
	gameResource.post('/', function(req, res, next){
		gameController.createGame(req.body.players, function(err, newGame){
			if(err) return res.status(400).json({err: err});
			return res.status(201).json({game: newGame});
		});
	});

	/*	Expects a gameId as a queryString parameter, and returns the corresponding game object
		if it exists.  The associated score objects of this game will be populated for
		convenience.  They contain the playerId that score belongs to,  and the frame data 
		with that player's rolls this game. 

		Returns 404 if the game doesn't exist.
	*/ 
	gameResource.get('/:gameId', function(req, res, next){
		Game.findOne({_id : req.param('gameId')})
		.populate('scores')
		.exec(function(err, game){
			if(err) return res.status(400).json({err: err});
			if(!game) return res.sendStatus(404); 
			return res.send(game.toJSON()); 
		});
	});

	return gameResource;   	
};



