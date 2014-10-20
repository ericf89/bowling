var scoringService = require('../services/scoringService.js'),
	_ = require('underscore');

describe('In the scoring service,', function(){
	describe('the importRollsToScoreFrames method', function(){
		it('should import a series of open frames.', function(){
			var pinsKnockedDown = [2, 3, 3, 6];
			var frames = scoringService.importRollsToScoreFrames(pinsKnockedDown);
			expect(frames.length).toBe(2);
			_.each(frames, validateOpenFrame);
		});
		it('should import a series of frames with a spare.', function(){
			var pinsKnockedDown = [7, 3, 3, 6, 3, 3];
			var frames = scoringService.importRollsToScoreFrames(pinsKnockedDown);
			expect(frames.length).toBe(3);
			expect(frames[0].isComplete() && frames[0].isSpare()).toBe(true);
			_.each(frames.slice(1, 3), validateOpenFrame); 
		});
		it('should import a series of frames with a strike.', function(){
			var pinsKnockedDown = [10, 3, 6];
			var frames = scoringService.importRollsToScoreFrames(pinsKnockedDown);
			expect(frames.length).toBe(2); 
			expect(frames[0].isComplete() && frames[0].isStrike()).toBe(true); 
			validateOpenFrame(frames[1]);
		});
		it('should import a series of frames with strikes and spares', function(){
			var pinsKnockedDown = [3, 7, 3, 2, 10, 3, 6, 10, 10, 3, 7];
			var frames = scoringService.importRollsToScoreFrames(pinsKnockedDown);
			expect(frames.length).toBe(7);
			_.each([0, 6], function(i){
				expect(frames[i].isSpare()).toBe(true);
			});
			_.each([2, 4, 5], function(i){
				expect(frames[i].isStrike()).toBe(true);
				expect(frames[i].isComplete()).toBe(true);
			});
			expect(frames[6].isComplete()).toBe(false); 
		});
		it('should import the frames in a perfect game.', function(){
			var pinsKnockedDown = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
			var frames = scoringService.importRollsToScoreFrames(pinsKnockedDown);
			expect(frames.length).toBe(10); 
			_.each(frames, function(frame){
				expect(frame.isComplete() && frame.isStrike()).toBe(true); 
				expect(frame.isSpare()).toBe(false); 
			});
		});
		it('should import a series of frames with a spare in the 10th frame.', function(){
			var	pinsKnockedDown = [10, 10, 10, 10, 10, 10, 10, 10, 10, 3, 7, 5];
			var frames = scoringService.importRollsToScoreFrames(pinsKnockedDown);
			expect(frames.length).toBe(10);
			_.each(frames.slice(0, 9), function(frame){
				expect(frame.isComplete() && frame.isStrike()).toBe(true); 
				expect(frame.isSpare()).toBe(false); 
			});
			expect(frames[9].isSpare() && frames[9].isComplete()).toBe(true); 
		});
	});

	describe('the getTotalScore method', function(){
		it('should correctly score an open frame.', function (){
			var pinsKnockedDown = [3, 4]; 
			expect(scoringService.getTotalScore(pinsKnockedDown)).toBe(7);
		});

		it('should correctly score a series of open frames.', function(){
			var pinsKnockedDown = [3, 4, 5, 4]; 
			expect(scoringService.getTotalScore(pinsKnockedDown)).toBe(16);
		});

		it('should correctly score a spare.', function(){
			var pinsKnockedDown = [3, 7, 5, 4];
			expect(scoringService.getTotalScore(pinsKnockedDown)).toBe(24);
		});

		it('should correctly score a strike.', function(){
			var pinsKnockedDown = [10, 3, 6];
			expect(scoringService.getTotalScore(pinsKnockedDown)).toBe(28); 
		});

		it('should correctly score a perfect game.', function(){
			var pinsKnockedDown = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]; 
			expect(scoringService.getTotalScore(pinsKnockedDown)).toBe(300); 
		});

		it('should correctly score all spares.', function(){
			var pinsKnockedDown = [];
			for(var i = 0; i < 21; i++) pinsKnockedDown.push(5);
			expect(scoringService.getTotalScore(pinsKnockedDown)).toBe(150); 
		});

		it('should correctly score spares and strikes.', function(){
			var pinsKnockedDown = [3, 6, 5, 5, 10, 4, 4, 10, 10, 3, 6, 5, 5, 4, 4];
			expect(scoringService.getTotalScore(pinsKnockedDown)).toBe(128); 
		});

		it('should return the same value for the most recent frame.', function(){
			var pinsKnockedDown = [3, 6]; 
			expect(scoringService.getTotalScore(pinsKnockedDown)).toBe(9); 
			expect(scoringService.getScoreAtFrame(pinsKnockedDown, 1)).toBe(9);
			expect(scoringService.getScoreAtFrame(pinsKnockedDown, 2)).toBe(null);
		}); 
	});

	describe('the getScoreAtFrame method', function(){
		it('should return null when requesting a frame without data', function(){
			var pinsKnockedDown = [3, 5]; 
			expect(scoringService.getScoreAtFrame(pinsKnockedDown, 5)).toBe(null);
		});
		it('should return null when requesting the score for a strike without data.', function(){
			var pinsKnockedDown = [3, 5, 3, 6, 10];
			expect(scoringService.getScoreAtFrame(pinsKnockedDown, 1)).toBe(8);
			expect(scoringService.getScoreAtFrame(pinsKnockedDown, 2)).toBe(17);
			expect(scoringService.getScoreAtFrame(pinsKnockedDown, 3)).toBe(null);
		});
	});
});

function validateOpenFrame(frame){
	expect(frame.isComplete()).toBe(true);
	expect(frame.isSpare() || frame.isStrike()).toBe(false);
}