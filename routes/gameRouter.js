var gameResource = require('express').Router(),
	mongoose = require('mongoose'),
	Game = mongoose.model('Game'),
	Player = mongoose.model('Player'),
	gameController = require('../controllers/gameController'),
	async = require('async'); 
module.exports = function(){
	
	// ### GET: games/
	// `GET`ing games/ will return the full collection of games in the database.  All subdocuments for players and scores will 
	// be populated for your convenience. 
	// [Example Response](https://gist.github.com/ericf89/f1342430e7ae8d883d3e)
	gameResource.get('/', function(req, res, next){
		Game.find({})
		.populate('scores')
		.exec(function(err, games){
			if(err) return res.status(500).json(err);
			
			async.map(games, gameController.populatePlayersInGame, function(err, populatedGames){
				if(err) return res.status(500).json(err);
				populatedGames = populatedGames.map(function(populatedGame){ return populatedGame.toObject({virtuals: true});});
				return res.json(populatedGames);	
			});
		});
	});

	// ### POST: games/
	// This endpoint expects a simple json object with an array of players. It
	// will lookup/create a player object for each of those player names.
	// ```k
	// { 
	// 	"players": ["Carl", "Rick"]
	// }
	// ```
	//
	// If you properly format your json, and follow all the bowling rules, 
	// (0 < #ofPlayers < 7), you'll receive a response containing your new gameID, and ids of the scores objects for this game.
	// ```js
	// {
	// 	game: {
	// 		__v: 0,
	// 		_id: "5445cf08faf619d8af4dc8ba",
	// 		scores: [
	// 			"5445cf08faf619d8af4dc8bc",
	// 			"5445cf08faf619d8af4dc8bd",
	// 			"5445cf08faf619d8af4dc8be"
	// 		],
	// 		dateCreated: "2014-10-21T03:12:08.658Z"
	// 	}
	// }
	// ```
	gameResource.post('/', function(req, res, next){
		gameController.createGame(req.body.players, function(err, newGame){
			if(err) return res.status(400).json({err: err});
			return res.status(201).send(newGame.toJSON());
		});
	});

	// ### GET: games/:gameId
	// This endpoint expects a gameId in the url of the request, and returns 
	// the corresponding game object if it exists.  
	// ```url
	// http://localhost:3000/games/5447481b12d0a496dfa27bb3
	// ```
	// The associated score and player objects of this game will be populated for convenience.  
	// The score objects contain the player that score belongs to,  and the frame data  with 
	// that player's rolls this game.
	// ```js 
	// {
	//   "_id":"5447481b12d0a496dfa27bb3",
	//   "__v":0,
	//   "scores":[
	//     {
	//       "_id":"5447481b12d0a496dfa27bb5",
	//       "player":"5445cf08faf619d8af4dc8bb",
	//       "game":"5447481b12d0a496dfa27bb3",
	//       "dateCreated":"2014-10-22T06:00:59.483Z",
	//       "rolls":[
	//       ]
	//     },
	//     {
	//       "_id":"5447481b12d0a496dfa27bb6",
	//       "player":"5447481b12d0a496dfa27bb4",
	//       "game":"5447481b12d0a496dfa27bb3",
	//       "dateCreated":"2014-10-22T06:00:59.483Z",
	//       "rolls":[
	//       ]
	//     }
	//   ],
	//   "dateCreated":"2014-10-22T06:00:59.470Z"
	// }
	// ```
	// Returns 404 if the game doesn't exist.
	gameResource.get('/:gameId', function(req, res, next){
		Game.findOne({_id : req.param('gameId')})
		.populate('scores')
		.exec(function(err, game){
			if(err) return res.status(500).json({err: err});
			if(!game) return res.sendStatus(404); 
			gameController.populatePlayersInGame(game, function(err, populatedGame){
				if(err) return res.status(500).json({err: err});
				return res.send(game.toJSON({virtuals:true})); 
			});
		});
	});

	return gameResource;   	
};



