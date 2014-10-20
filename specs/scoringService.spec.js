var scoringService = require('../services/scoringService.js');

describe('The scoring service', function(){
	
	it('should correctly score an open frame.', function (){
		var pinsKnockedDown = [3, 4]; 
		expect(scoringService.getTotalScore(pinsKnockedDown)).toBe(7);
	});

	it('should correctly score a series of open frames.', function(){
		var pinsKnockedDown = [3, 4, 5, 4]; 
		expect(scoringService.getTotalScore(pinsKnockedDown)).toBe(16);
	});

	xit('should correctly score a spare.', function(){
		var pinsKnockedDown = [3, 7, 5, 4];
		expect(scoringService.getTotalScore(pinsKnockedDown)).toBe(16);
	});

});