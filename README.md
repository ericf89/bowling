#Bowling - à la *n*ode

###Prerequisites
1. Make sure you have node installed. 
2. Make sure you have mongo installed and running.

###Installation
After cloning the repo, you should be able to
```sh
npm install
node app.js
```
to start the server.  It's as easy as that!

###Tests
Tests are located in the /specs directory, and can be run with [jasmine-node](https://github.com/mhevery/jasmine-node). If you're on a unix-y machine, you can run them directly from the repo with `npm test`.  If on windows, it's probably best to:

```sh
npm install -g jasmine-node
jasmine-node specs/ --verbose
```

The output should look like something along the lines of: 

![Test Results](http://i.imgur.com/rwbFrZ3.png)

###Basic Usage
1. Make a new game:
This is accomplished by making a POST to the /games endpoint, with an array of playerNames.  The only header necessary should be `Content-Type: application/json` 
After a successful request, you'll receive a response containing the gameId, and a scoreId for each player. [Example](http://bowling.freipe.com/gameRouter.html#section-2) 
2. Post new rolls to particular scoreIds:
Once you receive your scoreId, you can begin to POST new rolls to it.  These will be appended to the end of the specified score if valid.  If successful, 
you should receive your newly updated score object as a response. [Example](http://bowling.freipe.com/scoreRouter.html#section-3)
