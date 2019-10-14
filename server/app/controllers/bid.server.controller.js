const Bid = require("../models/bid.server.model");
const Auth = require("../auth");

/*
    Retreive bid histroy for a given auction
*/
exports.bid_history = function(req, res){
    let id = req.params.aucId;
    let valid_input = true;

    id = parseInt(id);

    //check id is a number
    if(isNaN(id)){
        valid_input = false;
    }

    if(valid_input) {

        Bid.getBids(id, function (result) {
            if(result[0] == 200) {

                res.status(result[0]);
                res.json(result[1]);
            } else {
                res.statusMessage = result[1];
                res.sendStatus(result[0]);
            }

        });

    } else {


        res.statusMessage = "Bad request";
        res.sendStatus(400);
    }
};

/*
    Place a bid on an auction
*/
exports.bid = function(req, res){

    let valid_input = true;
    let user_token = req.get("X-Authorization");
    let auction_id = req.params.aucId;
    let amount = req.query.amount;


    amount = parseInt(amount);

    if(isNaN(amount)){
        valid_input = false;
    }

    if(valid_input) {
        Auth.isValidToken(req.get("X-Authorization"), function (valid) {

            if (valid) {

                Bid.makeBid(auction_id, amount, user_token, function (result) {

                    res.statusMessage = result[1];
                    res.sendStatus(result[0]);

                });

            } else {
                res.statusMessage = "Unauthorized";
                res.sendStatus(401);
            }
        });
    } else{
        res.statusMessage = "Bad request";
        res.sendStatus(400);

    }
};