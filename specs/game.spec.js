var mongoose = require('mongoose'),
	_ = require('underscore'),
	path = require('path');
require('../catwalk').walk(path.resolve(__dirname, '../models'), {quiet: true}); 
var gameController = require('../controllers/gameController.js');
var playerController = require('../controllers/playerController.js');

describe("In the gameController", function(){
	beforeEach(function(done){
		mongoose.connect('localhost/bowling_test', done);
	}); 
	describe('the createGame method', function(){
		it('should return a game with a dateCreated property.', function(done){
			gameController.createGame(['a'], function(err, newGame){
				expect(newGame.dateCreated).toBeDefined(); 
				expect(newGame.dateCreated).toBeLessThan(Date.now());
				done(); 
			});
		});

		it('needs at least one player to make a game.', function(done){
			gameController.createGame([], function(err, game){
				expect(err).not.toBe(null); 
				done(); 
			});
		});

		it('can\'t have more than 6 players per game.', function(done){
			gameController.createGame(['a', 'b', 'c', 'e', 'f', 'g', 'h'], function(err){
				expect(err).not.toBe(null); 
				done(); 
			});
		});

		it('should create has a score for each player.', function(done){
			var playerNames = ['Alice', 'Bob', 'Carl'];
			gameController.createGame(playerNames, function(err, newGame){
				expect(newGame.scores).toBeDefined(); 
				var uniquePlayerScores = _.uniq(newGame.scores);
				expect(uniquePlayerScores.length).toBe(playerNames.length); 
				done();
			});
		});
	});
	afterEach(function(done){
		mongoose.connection.db.dropDatabase();
		mongoose.disconnect(done);
	});
});
