require('../models/game.js');
var gameController = require('../controllers/game_controller.js'),
	mongoose = require('mongoose');
	Game = mongoose.model('Game'); 


describe("A game", function(){
	beforeEach(function(done){
		mongoose.connect('localhost/bowling_test', done);
	}); 
	it('needs at least one player.', function(done){
		gameController.createGame(0, function(err, newGame){
			expect(err).not.toBe(null); 
			done(); 
		});
	});
	it('has an id for each player\'s score.', function(done){
		gameController.createGame(3, function(err, newGame){
			expect(newGame.playerScores).toBeDefined(); 
			expect(newGame.playerScores.length).toBe(3); 

			done();
		});
	});
	it('can\'t have more than 6 players', function(done){
		gameController.createGame(6, function(err, newGame){
			expect(err).not.toBe(null); 
			done(); 
		});
	});
	afterEach(function(done){
		Game.remove({}, function(){
			mongoose.connection.db.dropDatabase();
			mongoose.disconnect(done);
		});
	});
});
