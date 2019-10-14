const Database = require("../models/database.server.model");

/*
    Wipe database and rebuild tables
*/
exports.reset = function(req, res){

    Database.resetDatabase(function(result){

        res.statusMessage = result[1];
        res.sendStatus(result[0]);
    });
}

/*
    Insert dummy data basck into databse
*/
exports.resample = function(req, res){

    Database.resampleDatabase(function(result){

        res.statusMessage = result[1];
        res.sendStatus(result[0]);
    });

}