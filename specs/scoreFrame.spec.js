
var ScoreFrame = require('../services/scoringService.js').ScoreFrame; 

describe('The scoreFrame\'s', function(){
	describe('isValid() method', function(){
		it('should return true for a frame with a single roll.', function(){
			var frame = new ScoreFrame([5]);
			expect(frame.isValid()).toBe(true); 
		});
		it('should return true for an open frame.', function(){
			var frame = new ScoreFrame([5, 4]);
			expect(frame.isValid()).toBe(true); 
		});

		it('should return true for a spare.', function(){
			var frame = new ScoreFrame([8, 2]);
			expect(frame.isValid()).toBe(true); 

			frame = new ScoreFrame([8, 2, 6]);
			expect(frame.isValid()).toBe(true); 
		});
		
		it('should return true for a strike.', function(){
			var frame = new ScoreFrame([10]);
			expect(frame.isValid()).toBe(true);

			frame = new ScoreFrame([10, 5, 5]);
			expect(frame.isValid()).toBe(true); 
		});

		it('should return false for invalid roll data.', function(){
			var frame = new ScoreFrame([11]); 
			expect(frame.isValid()).toBe(false);

			frame = new ScoreFrame([-3]);
			expect(frame.isValid()).toBe(false); 

			frame = new ScoreFrame([0, -3]);
			expect(frame.isValid()).toBe(false); 
		}); 

		it('should return false if first two rolls > 10.', function(){
			var frame = new ScoreFrame([7, 7]);
			expect(frame.isValid()).toBe(false); 
		});

		it('should return false, if the two rolls following a strike are > 10.', function(){
			var frame = new ScoreFrame([10, 7, 7]);
			expect(frame.isValid()).toBe(false); 
		});
	});
	
	describe('isStrike() method', function(){
		it('should return true if the first roll is a 10.', function(){
			var frame = new ScoreFrame([10]);
			expect(frame.isStrike()).toBe(true); 
			
			frame = new ScoreFrame([10, 8, 2]);
			expect(frame.isStrike()).toBe(true); 
		});

		it('should return false if the first roll isn\'t a 10.', function(){
			var frame = new ScoreFrame([8, 2]);
			expect(frame.isStrike()).toBe(false); 

			frame = new ScoreFrame([7, 3, 8]);
			expect(frame.isStrike()).toBe(false); 
		});

		it('should return false for an open frame.', function(){
			var frame = new ScoreFrame([3, 4]);
			expect(frame.isStrike()).toBe(false); 
		});
	});

	describe('isSpare() method', function(){
		it('should return true if the first two rolls sum to 10', function(){
			var frame = new ScoreFrame([4, 6]);
			expect(frame.isSpare()).toBe(true); 
		});
		it('should return false if the first roll is 10.', function(){
			var frame = new ScoreFrame([10]);
			expect(frame.isSpare()).toBe(false);
		});
		it('should return false for an open frame.', function(){
			var frame = new ScoreFrame([1, 6]);
			expect(frame.isSpare()).toBe(false);
		});
	});

	describe('score() method', function(){
		it('should return the sum of the rolls.', function(){
			var frame = new ScoreFrame([1,3]);
			expect(frame.score()).toBe(4);

			frame = new ScoreFrame([8, 2, 4]);
			expect(frame.score()).toBe(14);

			frame = new ScoreFrame([10, 5, 4]);
			expect(frame.score()).toBe(19);
		});
	});

	describe('isComplete() method', function(){
		it('should return true if a strike and has 3 rolls.', function(){
			var frame = new ScoreFrame([10, 10, 10]);
			expect(frame.isComplete()).toBe(true); 
		});

		it('should return true if a spare and has 3 rolls.', function(){
			var frame = new ScoreFrame([5, 5, 8]);
			expect(frame.isComplete()).toBe(true); 
		});

		it('should return true if open and has 2 rolls.', function(){
			var frame = new ScoreFrame([4, 4]);
			expect(frame.isComplete()).toBe(true); 
		});

		it('should return false if spare or strike without 3 rolls.', function(){
			var frame = new ScoreFrame([10, 1]); 
			expect(frame.isComplete()).toBe(false);

			frame = new ScoreFrame([5, 5]);
			expect(frame.isComplete()).toBe(false); 
		});

		it('should return false if open and has a single roll.', function(){
			var frame = new ScoreFrame([0]);
			expect(frame.isComplete()).toBe(false); 
		});
	});
});