
var _ = require('underscore');

var sum = function (a, b) { return a + b;}; 

exports.getScoreAtFrame = function(rollScoreArray, frameIndex){
	var score = 0 ; 
	for(var i = 0; i < frameIndex; i++){
		if(rollScoreArray[i] === 10){
			if(rollScoreArray.length < i+2) return null;
			score += _.reduce(rollScoreArray.slice(i, i+3), function(a, b){ return a+b;}); 
		}
	}


	for(var i = 0; i < throwsToCount; i++)
	{
		score += rollScoreArray[i]; 
	}
	return score;
}; 

exports.getTotalScore = function(rollScoreArray){
	return exports.getScoreAtFrame(rollScoreArray, Math.floor(rollScoreArray.length/2));
};