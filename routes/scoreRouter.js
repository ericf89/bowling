var scoreResource = require('express').Router(),
	mongoose = require('mongoose'),
	Score = mongoose.model('Score'),
	scoreController = require('../controllers/scoreController'); 
module.exports = function(){
	// ### GET: /scores/:scoreId
	// This endpoint expects nothing but a valid scoreId in the request parameters. 
	// ```url
	// http://localhost:3000/scores/5447481b12d0a496dfa27bb5
	// ``` 
	// In return you'll receive a score object containing the score's id, the player
	// object this score belongs to, the game id of the game this score belongs to, 
	// and a 'rolls' property.  The rolls property is an ordered integer array of all 
	// the pins knocked down per roll starting from the first roll, to the most recent.
	// ```
	// {
	//   "_id":"5447481b12d0a496dfa27bb5",
	//   "player":{
	//     "_id":"5445cf08faf619d8af4dc8bb",
	//     "name":"Carl",
	//     "__v":0,
	//     "dateCreated":"2014-10-21T03:12:08.659Z"
	//   },
	//   "game":"5447481b12d0a496dfa27bb3",
	//   "__v":1,
	//   "dateCreated":"2014-10-22T06:00:59.483Z",
	//   "rolls":[ 4, 5, 10, 4, 4, 5, 5, 2, 0 ],
	//   "frames":[
	//     {
	//       "firstRoll":"4",
	//       "secondRoll":"5",
	//       "score":9
	//     },
	//     {
	//       "firstRoll":"X",
	//       "secondRoll":"",
	//       "score":27
	//     },
	//     {
	//       "firstRoll":"4",
	//       "secondRoll":"4",
	//       "score":35
	//     },
	//     {
	//       "firstRoll":"5",
	//       "secondRoll":"/",
	//       "score":47
	//     },
	//     {
	//       "firstRoll":"2",
	//       "secondRoll":"0",
	//       "score":49
	//     }
	//   ]
	// }
	// ```
	scoreResource.get('/:scoreId', function(req, res, next){
		Score.findOne({_id : req.param('scoreId')})
		.populate('player')
		.exec(function(err, score){
			if(err) return res.status(500).json({err: err});
			if(!score) return res.sendStatus(404);
			return res.status(200).send(score.toJSON({virtuals: true}));
		});
	});
	// ### POST: /scores/:scoreId
	// As of now, new score objects can't be created outside of initial game creation. 
	// This endpoint instead expects a simple object containing a newRolls array in the
	// POST request.  This	newRolls array should consist of integers from ranging from 
	// 0 - 10, ordered from oldest rolls to newest.
	// ```
	// { "newRolls": [ 4, 5, 10, 4, 4, 5, 5, 2, 0 ]}
	// ```
	// Each new roll will be appended onto the end of rolls currently on the score and 
	// validated one at a time.  If any roll produces an invalid game state, the entirety
	// of the new data will be thrown away and a 'bad request' will be returned.
	//  
	// If all goes well, you'll receive the new updated score object as a response.
	// ```js
	// {
	//   "_id":"5447481b12d0a496dfa27bb5",
	//   "player":{
	//     "_id":"5445cf08faf619d8af4dc8bb",
	//     "name":"Carl",
	//     "__v":0,
	//     "dateCreated":"2014-10-21T03:12:08.659Z"
	//   },
	//   "game":"5447481b12d0a496dfa27bb3",
	//   "__v":1,
	//   "dateCreated":"2014-10-22T06:00:59.483Z",
	//   "rolls":[ 4, 5, 10, 4, 4, 5, 5, 2, 0 ],
	//   "frames":[
	//     {
	//       "firstRoll":"4",
	//       "secondRoll":"5",
	//       "score":9
	//     },
	//     {
	//       "firstRoll":"X",
	//       "secondRoll":"",
	//       "score":27
	//     },
	//     {
	//       "firstRoll":"4",
	//       "secondRoll":"4",
	//       "score":35
	//     },
	//     {
	//       "firstRoll":"5",
	//       "secondRoll":"/",
	//       "score":47
	//     },
	//     {
	//       "firstRoll":"2",
	//       "secondRoll":"0",
	//       "score":49
	//     }
	//   ]
	// }
	// ```    
	scoreResource.post('/:scoreId', function(req, res, next){
		var newRolls = req.body.newRolls;
		if(!newRolls || !Array.isArray(newRolls)) return res.sendStatus(400); 
		scoreController.appendNewRollsToScore(req.param('scoreId'), newRolls, function(err, updatedScore){
			if(err) return res.status(400).json({err: err});
			if(!updatedScore) return res.sendStatus(404); 
			return res.status(200).send(updatedScore.toJSON({virtuals:true})); 
		});
	});
	return scoreResource;   	
};