const Auction = require('../models/auction.server.model');
const Auth = require('../auth');

/*
    Fetches all auctions 
*/
exports.list = function(req, res){
    let valid_input = true;

    let user_data = {

        "startIndex": req.query.startIndex,
        "auctionCount": req.query.count,
        "searchString": req.query.q,
        "categoryId": req.query.categoryId,
        "sellerId": req.query.seller,
        "bidderId": req.query.bidder,
        "winnerId": req.query.winner
    };

    let int_input = [
        user_data.startIndex,
        user_data.categoryId,
        user_data.auctionCount,
        user_data.bidderId,
        user_data.winnerId,
        user_data.sellerId
    ];

    //check string input is of type string
    if(user_data.searchString != undefined) {

        if (typeof user_data.searchString != "string") {
            valid_input = false;
        }
    }

    //check int input is of type number
    for(let i = 0; i < int_input.length; i++){
        if(int_input[i] != undefined) {
            int_input[i] = parseInt(int_input[i]);
            if (isNaN(int_input[i])) {
                valid_input = false;
            }
        }
    }

    if(valid_input) {

        Auction.getAuctions(user_data, function (result) {
            res.status(result[0]);
            res.json(result[1]);
        });

    } else{

        res.statusMessage = "Bad request";
        res.sendStatus(400);

    }
};

/*
    Retreive a single auction
*/
exports.read = function(req, res){
    let id = req.params.aucId;
    let valid_input = true;

    id = parseInt(id);

    if(id == undefined){
        valid_input = false;
    }

    if(isNaN(id)){
        valid_input = false;
    }

    if(valid_input) {
        Auction.getSingleAuction(id, function (result) {
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
    Create a new auction
*/
exports.create = function(req, res){
    let valid_input = true;
    console.log(new Date(2018,4,22,14, 33, 0).getTime());
    var todaysDate = new Date();
    var ms = new Date(2018,3,22,14, 33, 0).getTime();


    let user_data = {
        "categoryId": req.body.categoryId,
        "title": req.body.title,
        "description": req.body.description,
        "startDateTime": req.body.startDateTime,
        "endDateTime": req.body.endDateTime,
        "reservePrice": req.body.reservePrice,
        "startingBid": req.body.startingBid
    };



    let categoryId = parseInt(user_data["categoryId"]);
    let title = user_data["title"];
    let description = user_data["description"];
    let startDateTime = parseInt(user_data["startDateTime"]);
    let endDateTime = parseInt(user_data["endDateTime"]);
    let reservePrice = parseInt(user_data["reservePrice"]);
    let startingBid = parseInt(user_data["startingBid"]);

    //- 2592000000 (1 month)
    var start = new Date(user_data.startDateTime);
    var end = new Date(user_data.endDateTime);

    let values = [
        [title],
        [categoryId],
        [description],
        [reservePrice],
        [startingBid],
        [start],
        [end]
    ];

    //Input validation
    if(title == undefined){
        valid_input = false;

        } else{
            if(typeof title != "string") {
                valid_input = false;
            }
        }

    if(description != undefined){
        if(typeof description != "string"){
            valid_input = false;
        }
    }

    if(reservePrice != undefined){
        if(isNaN(reservePrice)){
            valid_input = false;
        }
    }

    if(categoryId == undefined || startingBid == undefined){
        valid_input = false;
    } else {
        if(isNaN(categoryId)){
            valid_input = false
        } else {
            if(categoryId <= 0 || categoryId > 5){
                valid_input = false;
            }
        }

        if(isNaN(startingBid)){
            valid_input = false;
        } else {
            if(startingBid < 1){
                valid_input = false;
            }
        }
    }

    if(startDateTime == undefined){
        valid_input = false;
    }

    if(endDateTime == undefined){
        valid_input = false;
    }

    if(startDateTime < ms || endDateTime < ms){
        valid_input = false;
    }

    if(endDateTime <= startDateTime){
        valid_input = false;
    }
        //Validate user 
        Auth.isValidToken(req.get("X-Authorization"), function (valid) {

            if (valid) {
                if(valid_input) {

                    Auction.insertAuction(values, req.get("X-Authorization"), function (result) {
                        if(result[0] == 201) {
                            res.status(result[0]);
                            let auction_id = result[1];
                            res.send({"id" : auction_id});
                        } else {
                            res.statusMessage = result[1];
                            res.sendStatus(result[0]);
                        }
                    });
                } else{
                    res.status(400);
                    res.send({"400":"Bad request"});
                }
            } else {
                res.status(401);
                res.send({"401": "Unauthorized"});
            }
        })

};

/*
    Update auction
*/
exports.update = function(req, res){
    console.log("update called");
    let id = req.params.aucId;
    let valid_input = true;

    var ms = new Date(2018,3,22,14, 33, 0).getTime();

    id = parseInt(id);

    if(isNaN(id)){
        valid_input = false;
    }

    let user_data = {
        "categoryId": req.body.categoryId,
        "title": req.body.title,
        "description": req.body.description,
        "startDateTime": req.body.startDateTime,
        "endDateTime": req.body.endDateTime,
        "reservePrice": req.body.reservePrice,
        "startingBid": req.body.startingBid
    };

    let categoryId = user_data.categoryId;
    let title = user_data.title;
    let description = user_data.description;
    let startDateTime = user_data.startDateTime;
    let endDateTime = user_data.endDateTime;
    let reservePrice = user_data.reservePrice;
    let startingBid = user_data.startDateTime;

    let int_values = [
        categoryId,
        reservePrice,
        startingBid
    ];

    for(let i = 0; i < int_values.length; i++){
        if(int_values[i] != undefined){

            int_values[i] = parseInt(int_values[i]);

            if(isNaN(int_values[i])){

                valid_input = false;
            }
        }
    }

    if(startDateTime != undefined) {
        startDateTime = parseInt(startDateTime);
        if (startDateTime < ms) {
            valid_input = false;
        }
    }


    if(endDateTime != undefined) {
        endDateTime = parseInt(endDateTime);
        if (endDateTime < ms) {
            valid_input = false;
        }
    }

    //check expected strings
    if(title != undefined){
        if(typeof title != "string"){
            valid_input = false;
        }
    }

    if(description != undefined){
        if(typeof description != "string"){
            console.log("invalid description");
            valid_input = false;
        }
    }

    user_data.startDateTime = new Date(user_data.startDateTime);
    user_data.endDateTime = new Date(user_data.endDateTime);


    if(valid_input) {
        Auth.isValidToken(req.get("X-Authorization"), function (valid) {
            if (valid) {
                Auction.updateAuction(id, req.get("X-Authorization"), user_data, function (result) {
                    res.status(result[0]);
                    res.send(result[1]);
                });

            } else {
                //User not logged in
                res.status(401);
                res.send({"ERROR": "Unauthorized"});

            }
        });
    } else {
        //Invalid input
        res.statusMessage = "Bad request";
        res.sendStatus(400);
    }
};
