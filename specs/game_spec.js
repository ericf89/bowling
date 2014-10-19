var mongoose = require('mongoose'),
	_ = require('underscore'),
	path = require('path');
require('../catwalk').walk(path.resolve(__dirname, '../models'), {quiet: true}); 
var gameController = require('../controllers/game_controller.js');

describe("A game", function(){
	beforeEach(function(done){
		mongoose.connect('localhost/bowling_test', done);
	}); 
	
	it('has a dateCreated property.', function(done){
		gameController.createGame(['a'], function(err, newGame){
			expect(newGame.dateCreated).toBeDefined(); 
			expect(newGame.dateCreated).toBeLessThan(Date.now());
			done(); 
		});
	});

	it('needs at least one player.', function(done){
		gameController.createGame([], function(err, newGame){
			expect(err).not.toBe(null); 
			done(); 
		});
	});

	it('can\'t have more than 6 players', function(done){
		gameController.createGame(['a', 'b', 'c', 'e', 'f', 'g', 'h'], function(err, newGame){
			expect(err).not.toBe(null); 
			done(); 
		});
	});

	it('has a playerScore for each player.', function(done){
		var playerNames = ['Alice', 'Bob', 'Carl'];
		gameController.createGame(playerNames, function(err, newGame){
			expect(newGame.playerScores).toBeDefined(); 
			var uniquePlayerScores = _.uniq(newGame.playerScores);
			expect(uniquePlayerScores.length).toBe(playerNames.length); 
			done();
		});
	});

	afterEach(function(done){
		mongoose.connection.db.dropDatabase();
		mongoose.disconnect(done);
	});
});
