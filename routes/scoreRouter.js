var scoreResource = require('express').Router(),
	mongoose = require('mongoose'),
	Score = mongoose.model('Score'),
	scoreController = require('../controllers/scoreController'); 
module.exports = function(){
	/*	This endpoint expects nothing but a valid scoreId in the request parameters. 

		In return you'll receive a score object containing the score's id, the player
		object this score belongs to, the game id of the game this score belongs to, 
		and a 'rolls' property.  The rolls property is an ordered integer array of all 
		the pins knocked down per roll starting from the first roll, to the most recent.

		Requesting ?pretty=true will return you a formatted score object, with roll data
		broken down into frames, and each containing a running score as the game progresses.
	*/
	scoreResource.get('/:scoreId', function(req, res, next){
		Score.findOne({_id : req.param('scoreId')})
		.populate('player')
		.exec(function(err, score){
			if(err) return res.status(500).json({err: err});
			if(!score) return res.sendStatus(404);
			if(req.query.pretty){
				var prettyScore = {};
				prettyScore.playerName = score.player.name;
				prettyScore.frames = scoreController.getFrameByFrameScores(score.rolls); 
				return res.send(JSON.stringify(prettyScore, null, '\t'));
			} 
			return res.send(score.toJSON());
		});
	});
	/*	As of now, new score objects can't be created outside of initial game creation. 
		This endpoint instead expects a simple object containing a newRolls array in the
		POST request.  This	newRolls array should consist of integers from ranging from 
		0 - 10, ordered from oldest rolls to newest.

		Each new roll will be appended onto the end of rolls currently on the score and 
		validated one at a time.  If any roll produces an invalid game state, the entirety
		of the new data will be thrown away and a 'bad request' will be returned.  

		If all goes well, you'll receive the new updated score object as a response.    
	*/
	scoreResource.post('/:scoreId', function(req, res, next){
		var newRolls = req.body.newRolls;
		if(!newRolls || !Array.isArray(newRolls)) return res.sendStatus(400); 
		scoreController.appendNewRollsToScore(req.param('scoreId'), newRolls, function(err, updatedScore){
			if(err) return res.status(400).json({err: err});
			if(!updatedScore) return res.sendStatus(404); 

			return res.status(200).send(updatedScore.toJSON()); 
		});
	});
	return scoreResource;   	
};