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


app.listen(app.get('port'), function(){
	console.log('Listening on ' + app.get('port') + ' ...'); 
});