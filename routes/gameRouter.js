var game = require('express').Router(),
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
	game.post('/', function(req, res, next){
		gameController.createGame(req.body.players, function(err, newGame){
			if(err) return res.status(400).send({err: err});
			return res.status(201).send({game: newGame});
		});
	});


	return game;   	
};



