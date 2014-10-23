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
});
