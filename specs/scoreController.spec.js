 var mongoose = require('mongoose'),
 	_ = require('underscore'),
 	path = require('path');
require('../catwalk').walk(path.resolve(__dirname, '../models'), {quiet: true}); 
var scoreController = require('../controllers/scoreController.js');

describe('In the scoreController', function(){
	describe('the canAcceptAnotherRoll method', function(){
		it('should return true for a set of valid rolls < 10 frames in length.', function(){
			var pinsKockedDown = [3, 4, 5, 5, 10, 0, 5, 5];
			expect(scoreController.canAcceptAnotherRoll(pinsKockedDown)).toBe(true);
		});

		it('should return false for a game that\'s already finished.', function(){
			var pinsKockedDown = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
			expect(scoreController.canAcceptAnotherRoll(pinsKockedDown)).toBe(false); 
		});

		it('should return false for a game with bad roll data.', function(){
			var pinsKockedDown = [6, 4, 3, 2, 5, 6, 5, 7];
			expect(scoreController.canAcceptAnotherRoll(pinsKockedDown)).toBe(false); 
		});

		it('should return true for a game in the 10th frame after a strike and a roll.', function(){
			var pinsKockedDown = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
			expect(scoreController.canAcceptAnotherRoll(pinsKockedDown)).toBe(true); 
			
			pinsKockedDown.push(10);
			expect(scoreController.canAcceptAnotherRoll(pinsKockedDown)).toBe(true);
		});

		it('should return true for a game in the 10th frame after a spare.', function(){
			var pinsKockedDown = [10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 6];
			expect(scoreController.canAcceptAnotherRoll(pinsKockedDown)).toBe(true); 
		});
	});
	
	describe('the getFrameByFrameScores method', function(){
		it('should correctly format a strike frame.', function(){
			var frames = scoreController.getFrameByFrameScores([10, 5, 4]);
			expect(frames.length).toBe(2); 
			expect(frames[0].firstRoll).toBe('X');
			expect(frames[0].secondRoll).toBe(''); 
			expect(frames[0].score).toBe(19);

			expect(frames[1].firstRoll).toBe('5');
			expect(frames[1].secondRoll).toBe('4'); 
			expect(frames[1].score).toBe(28);
		});

		it('should correctly format a spare frame.', function(){
			var frames = scoreController.getFrameByFrameScores([5, 5, 7]);
			expect(frames.length).toBe(2); 
			expect(frames[0].firstRoll).toBe('5');
			expect(frames[0].secondRoll).toBe('/'); 
			expect(frames[0].score).toBe(17);

			expect(frames[1].firstRoll).toBe('7');
			expect(frames[1].secondRoll).toBe(''); 
			expect(frames[1].score).toBe(null);
		});

		it('should correctly format a spare in the last frame.', function(){
			var frames = scoreController.getFrameByFrameScores([10, 10, 10, 10, 10, 10, 10, 10, 10, 8, 2, 5]);

			expect(frames.length).toBe(10); 
			expect(frames[9].firstRoll).toBe('8');
			expect(frames[9].secondRoll).toBe('/'); 
			expect(frames[9].thirdRoll).toBe('5');
			expect(frames[9].score).toBe(273); 

		}); 
		it('should correctly format a strike in the last frame.', function(){
			var frames = scoreController.getFrameByFrameScores([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 8]);
			expect(frames.length).toBe(10); 
			expect(frames[9].firstRoll).toBe('X');
			expect(frames[9].secondRoll).toBe('0'); 
			expect(frames[9].thirdRoll).toBe('8');
			expect(frames[9].score).toBe(278); 
		});
	});
});
