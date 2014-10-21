
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

		it('should return false if you enter invalid roll data.', function(){
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

		});
	});
});