var mongoose = require('mongoose'),
	path = require('path');
require('../catwalk').walk(path.resolve(__dirname, '../models'), {quiet: true}); 
var playerController = require('../controllers/playerController.js');
var Player = mongoose.model('Player'); 


describe('The player controller', function(){
	beforeEach(function(done){
		mongoose.connect('localhost/bowling_test', done);
	}); 

	it('should return a new player, if getting by a new player name.', function(done){
		playerController.getPlayer('NewGuy', function(err, aNewPlayer){
			expect(err).toBe(null);
			expect(aNewPlayer).toBeDefined();
			expect(aNewPlayer._id).toBeDefined();
			expect(aNewPlayer.name).toBe('NewGuy'); 
			done();
		}); 
	});

	it('get an existing player by name.', function(done){
		Player.create({name: 'JoeRegular'}, function(err, existingPlayer){
			playerController.getPlayer('JoeRegular', function(err, testPlayer){
				expect(err).toBe(null);
				expect(testPlayer).toBeDefined(); 
				expect(testPlayer._id).toEqual(existingPlayer._id);
				expect(testPlayer.name).toBe(existingPlayer.name);
				done(); 
			});
		}); 
	});

	afterEach(function(done){
		mongoose.connection.db.dropDatabase();
		mongoose.disconnect(done);
	});
});