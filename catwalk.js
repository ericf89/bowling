var fs = require('fs'); 

exports.walk = function(path, opts) {
    opts = opts || {}; 
    if(!opts.quiet)console.log("Models Directory: " + path);
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
                if(!opts.quiet)console.log("Requiring " + newPath + " model");
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
