
var _ = require('underscore');
// Sum should be pretty self explanatory.... 
var sum = function (a, b) { return a + b;}; 

/*	This object is used primarily for score calculation.
	Each frame is capable of calculating its score because it
	includes not only its own rolls, but also the rolls of
	future frames if necessary for calculation. 

	If there there aren't enough rolls for the frame to calculate it's score,
	its isComplete() will return false; 
*/
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

	this.isValid = function(){
		var invalidRolls = _.some(this.rolls, function(roll){
			return (roll > 10 || roll < 0); 
		});
		// As long as you've only rolled once this frame, you should be ok with any
		// number between 0 and 10.
		if(invalidRolls) return false;   
		if(!invalidRolls && this.rolls.length <=1) return true;  
		
		// If you've rolled more than once,  and your first roll and your
		// second roll are greater than 10, you're probably doing something wrong... 
		if(this.rolls[0] < 10 && this.rolls[0] + this.rolls[1] > 10) return false;

		//If your first roll is a strike, and the frame is complete, 
		if(this.isStrike() && this.isComplete() && this.rolls[1] !== 10){
			console.log(this.rolls[2]);
			return this.rolls[1] + this.rolls[2] <= 10 ;
		}

		return true; 
	};
};
var ScoreFrame = exports.ScoreFrame;
exports.getScoreAtFrame = function(rollScoreArray, frameIndex){
	var score = 0,
		i = 0,
		frames = exports.importRollsToScoreFrames(rollScoreArray);
	
	frameIndex = frameIndex || frames.length;

	/*	Let's first check to make sure that this is a valid frame get a score for.
		If we don't have enough data for calculating score at the requested frame
		because of strikes or spares,  we'll return null;
	*/
	if(!frames[frameIndex-1] || !frames[frameIndex-1].isComplete())
		return null; 
	

	/*	Now that we've ruled out those edge cases we can assume that we have enough data
		to calculate the score at the frame requested.  
	*/ 
	for(i=0; i < frameIndex; i++){
		score += frames[i].score(); 
	}
 
	return score; 

}; 

exports.getTotalScore = function(rollScoreArray){
	return exports.getScoreAtFrame(rollScoreArray);
};


/*	This method accepts an array of rolls, (the number of pins knocked down...).  
	It constructs an array of frames from these rolls, so that they can
	be used to calculate score later.  
*/ 
exports.importRollsToScoreFrames = function(rollScoreArray){
	var frames = []; 
	//Iterate over all available roll data!
	for(var i = 0; i < rollScoreArray.length;){
		if(frames.length === 10) return frames; //This breaks us out when we reach the end of the game.
		if(rollScoreArray[i] === 10){
			frames.push(new ScoreFrame(rollScoreArray.slice(i, i+3)));// If value is a strike, we need the next 2 rolls for this frame!
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
