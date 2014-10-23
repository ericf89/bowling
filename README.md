#Bowling - à la node

###Prerequisites
1. Make sure you have node installed. 
2. Make sure you have mongodb installed and listening.

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
After a successful request, you'll receive a response containing the gameId, and a scoreId for each player. [See Example](http://bowling.freipe.com/gameRouter.html#section-2) 

2. Post new rolls to particular scoreIds:
Once you receive your scoreId, you can begin to POST new rolls to it.  These will be appended to the end of the specified score if valid.  If successful, 
you should receive your newly updated score object as a response. [See Example](http://bowling.freipe.com/scoreRouter.html#section-3)

#####Extra Docs
Additional docs have been generated from comments within the source.  You can view them [here.](http://bowling.freipe.com/gameRouter.html)

###Available Endpoints
- games/[:gameId]
	- `GET`: Get the full collection of games in the database, with all player and score info populated.
	- `GET/w gameId`:  Returns the model for the requested game.  Score/player objects for that game will be populated. 
	- `POST`: With an array of `playerNames` as a parameter, will create and return a new game object.   
- scores/:scoreId
	- `GET`: Returns the matching score.   Score frame totals will be populated, along with player data. 
	- `POST`: With an integer array of `newRolls`, will append the new rolls to the specified score object. Will return the updated score object if successful. 

###Possible Improvements
1. Due to tight coupling between my models and mongoose, some of my unit(integration) tests require a db connection to run.  It'd be nice to take more time and investigate solutions to this.  Perhaps [mockgoose](https://github.com/mccormicka/Mockgoose). 
2. There were a few endpoints I didn't get a chance to implement that would probably be useful.
	- `PUT` to scores/:scoreId to update roll data.
	- `GET` to players/[:playerId|:playerName].  The data is currently modeled in such a way that it'd be trivial to retrieve a certain players games, or their highest score.  
	- `DELETE`s to... any endpoint.  
3. Once all the endpoints are fully fleshed out, it'd be nice to write some full integration tests with something like [frisby.js](http://frisbyjs.com/).