var mongoose = require('mongoose'),
	Score = mongoose.model('Score'),
	scoringService = require('../services/scoringService'),
	_ = require('underscore');

var canAcceptAnotherRoll = function (rollArray){
	var frames = scoringService.importRollsToScoreFrames(rollArray);
	// If we have any invalid frames, we shouldn't accept more data;
	if(!(_.every(frames, function(frame){return frame.isValid;}))) return false; 
	
	// Otherwise, if we're not in the last frame, or we're in the last frame and need more data,
	// accept more rolls!
	return frames.length < 10 || !frames[9].isComplete();
	
};

exports.appendNewRollsToScore = function(scoreId, rolls, next){
	Score.findOne({_id: scoreId}, function(err, score){
		if(err) return next(err);
		if(!score) return next(null, null);

		if(!canAcceptAnotherRoll(score.rolls)) return next({msg:'This game looks like it\'s already finished'});

		for(var i = 0; i < rolls.length; i++){
			if(canAcceptAnotherRoll(score.rolls)){
				score.rolls.push(rolls[i]);
			}else{
				return next({msg: 'Incompatible roll data...'});
			}
		}
		score.save(function(err){
			if(err) return next(err); 
			return next(null, score); 
		});
	});
};

