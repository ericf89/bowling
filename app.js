var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	server = require('http').Server(app),
	path = require('path'),
	fs = require('fs');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views')); 
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade'); 
app.use(bodyParser.json());

var models_path = __dirname + '/models';
console.log("Models Directory: " + __dirname);
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
                console.log("Requiring " + newPath + " model");
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);


app.listen(app.get('port'), function(){
	console.log('Listening on ' + app.get('port') + ' ...'); 
});