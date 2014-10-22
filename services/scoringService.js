
var _ = require('underscore');
var sum = function (a, b) { return a + b;}; // Sum should be pretty self explanatory.... 

// ###ScoreFrame(rolls)
// This object is used primarily for score calculation.
// Each frame is capable of calculating its score because it
// includes not only its own rolls, but also the rolls of
// future frames as necessary for strikes and spares. 
//
// If there there aren't enough rolls for the frame to calculate it's score,
// its isComplete() will return false; 

exports.ScoreFrame = function(rolls){
	this.rolls = rolls || []; 
	this.isComplete = function(){
		if(this.isStrike() || this.isSpare()) return this.rolls.length === 3;
		return this.rolls.length === 2; 
	};

	this.isStrike = function(){
		return this.rolls[0] === 10; 
	};

	this.isSpare = function(){
		return this.rolls[0] + this.rolls[1] === 10; 
	};
	this.score = function(){
		return _.reduce(this.rolls, sum); 
	};

	// #####.isValid()
	// This method is used extensively in validating new rolls that are posted
	// to the score endpoint.  First we iterate through the 1 to three rolls in this 
	// frame, and if  any aren't valid, we set invalid rolls to true.
	this.isValid = function(){
		var invalidRolls = _.some(this.rolls, function(roll){
			return (roll > 10 || roll < 0); 
		});
		if(invalidRolls) return false; //Return false if you have weird digits.
		
		// If your roll values are valid, and you've only rolled once, 
		// your frame is valid! (Though incomplete.) 
		if(!invalidRolls && this.rolls.length <=1) return true;  
		
		// If you've rolled more than once,  and your first roll and your
		// second roll are greater than 10, you're probably doing something wrong... 
		// (Ex. Rolling a 6, followed by an 8).
		if(this.rolls[0] < 10 && this.rolls[0] + this.rolls[1] > 10) return false;

		// ScoreFrames contain their following frames rolls for the purpose of 
		// score calculation.  So if this frame is a strike and is complete, it will 
		// have the following frame's 2 rolls.  
		//
		// This last if statement in this method essentially validates that the frame _following_
		// the strike doesn't exceed 10. (Unless the following frame is also strike
		// of course.)
		if(this.isStrike() && this.isComplete() && this.rolls[1] !== 10){
			return this.rolls[1] + this.rolls[2] <= 10 ;
		}

		return true; 
	};
};
var ScoreFrame = exports.ScoreFrame;
// ###getScoreAtFrame(rollScoreArray, frameIndex)
// This method gets the total score at a particular frame in the game,
// based on the score data that's passed in.  If no `frameIndex` is
// supplied,  the total score of the game so far is returned. 
exports.getScoreAtFrame = function(rollScoreArray, frameIndex){
	var score = 0,
		i = 0,
		frames = exports.importRollsToScoreFrames(rollScoreArray);
	
	frameIndex = frameIndex || frames.length;

	// First check to make sure that this is a valid frame get a score for.
	// If we don't have enough data for calculating score at the requested frame
	// because of strikes or spares,  we'll return null;
	
	if(!frames[frameIndex-1] || !frames[frameIndex-1].isComplete())
		return null; 
	

	// Now that we've ruled out those edge cases we can assume that we have enough data
	// to calculate the score at the frame requested, which is just an aggregation 
	// of each ScoreFrame's score() value up to the index.   
	for(i=0; i < frameIndex; i++){
		score += frames[i].score(); 
	}
	return score; 
}; 

exports.getTotalScore = function(rollScoreArray){ // Just an alias for readability.  
	return exports.getScoreAtFrame(rollScoreArray);
};


// ###importRollsToScoreFrames(rollScoreArray)
// This method accepts an array of rolls (the number of pins knocked down...).  
// It constructs an array of ScoreFrame objects from these rolls, so that they can
// be used to calculate score later.
//
// As mentioned before each score frame has all the data it needs to calculate its
// contribution to the game's total score.   
exports.importRollsToScoreFrames = function(rollScoreArray){
	var frames = []; 
	for(var i = 0; i < rollScoreArray.length;){ //Iterate over all available roll data!
		if(frames.length === 10) return frames; //This breaks us out when we reach the end of the game.
		if(rollScoreArray[i] === 10){ // If the roll is a strike, 
			frames.push(new ScoreFrame(rollScoreArray.slice(i, i+3)));// we need the next 2 rolls for this frame!
			i++;
			continue;
		}
		if(rollScoreArray[i] + rollScoreArray[i + 1] === 10){  //If this roll, plus the next roll is 10, you have a spare!
			frames.push(new ScoreFrame(rollScoreArray.slice(i, i+3))); //(Still i+3, because you need the two rolls that
			i+=2;													   //that make a spare, plus one more!)
			continue;
		}
		frames.push(new ScoreFrame(rollScoreArray.slice(i, i+2))); //Otherwise just an open frame. i+=2 to get to the next frame.
		i+=2;
	}
	return frames; 
};
