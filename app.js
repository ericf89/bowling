// ##Bowling App
// This is a pretty boiler plate express app. I'm using: 
// - Express: For routing!  
// - Body-parser: A module that parses out the raw body of the request into a usable js object. 
// - Path:  Used for resolving file paths.
// - Catwalk: A little recursive loader for the Mongoose models. 
// - Mongoose:  Mongo ODM.
var express = require('express'),  
	app = express(),
	bodyParser = require('body-parser'),  
	path = require('path'),
	catwalk = require('./catwalk'),
	mongoose = require('mongoose');

var connectionString = process.env.MONGO_URL || 'localhost/bowling';
mongoose.connect(connectionString);  // Connection to the DB!

catwalk.walk(__dirname + '/models');  // Load our Schemas!

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views')); 
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');  
app.use(bodyParser.json()); //Boiler plate stuff....

// These 4 lines load our two routers, and set up requests to 
// the /games and /scores endpoints to be routed correctly. 

var games = require('./routes/gameRouter')(),
	scores = require('./routes/scoreRouter')();
app.use('/games', games); 
app.use('/scores', scores); 


app.listen(app.get('port'), function(){
	console.log('Listening on ' + app.get('port') + ' ...'); 
});