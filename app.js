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
mongoose.connect(connectionString);

catwalk.walk(__dirname + '/models');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views')); 
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');  
app.use(bodyParser.json());

var games = require('./routes/gameRouter')(),
	scores = require('./routes/scoreRouter')();
app.use('/games', games); 
app.use('/scores', scores); 

var markdown = require('marked'),
	fs = require('fs'); 
app.get('/', function(req, res, next){
	fs.readFile('./README.md', 'utf-8', function (err, data){
		if(err) return next(err); 
		return res.render('index', {content:markdown(data)});
	});
});

app.listen(app.get('port'), function(){
	console.log('Listening on ' + app.get('port') + ' ...'); 
});