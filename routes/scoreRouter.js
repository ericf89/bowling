var scoreResource = require('express').Router(),
	mongoose = require('mongoose'),
	Score = mongoose.model('Score'),
	scoreController = require('../controllers/scoreController'); 
module.exports = function(){
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



