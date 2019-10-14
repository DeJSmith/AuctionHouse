const db = require('../../config/db');
const auth = require('../auth');
const bid = require('../models/bid.server.model');


/*
    Get all auctions and return in order by start date
*/
exports.getAuctions = function(user_data, done){
    

    let param_flag = false;
    let query = " ";
    let query_select = "SELECT ";
    let query_feilds = "auction_id AS id, category_title AS categoryTitle, auction_categoryid AS categoryId, auction_title AS title, auction_reserveprice AS reservePrice, " +
                      "auction_startingdate AS startDateTime, auction_endingdate AS endDateTime, IF(MAX(bid_amount) != 'null', MAX(bid_amount), auction_startingprice) AS currentBid ";
    let query_join = "FROM (auction JOIN category ON auction_categoryid = category_id LEFT JOIN bid ON auction_id = bid_auctionid) ";
    let query_params = "WHERE ";

    if(user_data.winnerId != undefined){
        param_flag = true;
        query_params += "auction_endingdate < CURRENT_TIMESTAMP() AND bid_userid = " + user_data.winnerId + " AND ";

    } else {

        if (user_data.bidderId != undefined) {
            param_flag = true;
            query_params += "bid_userid = " + user_data.bidderId + " AND ";

        }
    }

    if(user_data.searchString != undefined){
        param_flag = true;
        query_params += "auction_title LIKE '%" ;
        query_params += user_data.searchString += "%' AND ";
    }
    if(user_data.categoryId != undefined){
        param_flag = true;
        query_params += "auction_categoryid = ";
        query_params += user_data.categoryId + " AND ";
    }
    if(user_data.sellerId != undefined){
        param_flag = true;
        query_params += "auction_userid = ";
        query_params += user_data.sellerId + " AND ";

    }

    console.log("Param flag = " + param_flag);

    if(!param_flag){ //no parameters specified, return all auctions

        query += query_select += query_feilds += query_join;

    } else { //parameters specified, return based on params

        query += query_select += query_feilds += query_join += query_params;
        query = query.slice(0, -4); //slice off last AND
    }

    query += " GROUP BY auction_userid ORDER BY auction_startingdate";


    db.get_pool().query(query, function(err, result){
        if(err){
            return done([[500]["Internal server error"]]);
        }

        if(user_data.startIndex != undefined){
            result = result.slice(user_data.startIndex, (result.length));
        }

        if(user_data.auctionCount != undefined){
            result = result.slice(0, user_data.auctionCount);
        }

        return done([200, result]);
    });

};

/*
    Get single auction based on auction id
*/
exports.getSingleAuction = function(aucId, done){

    db.get_pool().query("SELECT auction_startingprice, auction_categoryid, category.category_title, auction_title, auction_reserveprice," +
        " auction_startingdate, auction_endingdate, auction_description, auction_creationdate, auction_user.user_id," +
        " auction_user.user_username, auction_startingprice FROM (auction JOIN auction_user ON auction_userid = auction_user.user_id" +
        " JOIN category ON auction_categoryid = category.category_id) WHERE auction_id = " + aucId, function(err, auction){

        if(err) {
            return done([[500], ["Internal server error"]]);
        }


        if(auction[0] == undefined){
            return done([[404], ["Not found"]]);
        }

        bid.getBids(aucId, function(bids){
            let i = 0;
            let nobids = false;
            bids = bids.slice(1,bids.length);

            if(bids[0] == undefined){

                nobids = true;
                bids[0] = {
                    "amount": auction[0].auction_startingprice
                };

            } else{
                let i = bids.length - 1;
            }

            let return_string = {
                "categoryId": auction[0].auction_categoryid,
                "categoryTitle": auction[0].category_title,
                "Title": auction[0].auction_title,
                "reservePrice": auction[0].auction_reserveprice,
                "startDateTime": auction[0].auction_startingdate,
                "endDateTime": auction[0].auction_endingDate,
                "description": auction[0].auction_description,
                "creationDateTime": auction[0].auction_creationdate,
                "seller": {
                    "Id": auction[0].user_id,
                    "username": auction[0].user_username
                },
                "startingBid": auction[0].startingprice,
                "currentBid":bids[i].amount,
                "bids": bids
            };

            if(nobids){
                return_string.currentBid = 0;
                return_string.bids = bids.slice(0,0);
            }

            return done([[200], [return_string]]);
        })

    });

};

/*
    Insert auction into db
*/  
exports.insertAuction = function(values, token, done){

    token = "'" + token + "'";

    db.get_pool().query("SELECT user_id FROM auction_user WHERE user_token = " + token, function(err, row){

        values[7] = [row[0].user_id];
        db.get_pool().query("INSERT INTO auction (auction_title, auction_categoryid, auction_description, auction_reserveprice, auction_startingprice, auction_startingdate, auction_endingdate, auction_userid) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", values, function(err, result){

            if(err) {
                return done([500, {"500":"Internal server error"}]);

            } else {
                //Good request return result
                let title = values[0];
                let query = "SELECT auction_id FROM auction WHERE auction_title = " + '"' + title + '"';
                db.get_pool().query(query, function(err, id){
                    if(err){
                    } else {
                        let auction_id = id[0].auction_id;
                        return done([201, auction_id]);
                    }
                });

            }
        });
    });
};

/*
    Update existing auction db record
*/
exports.updateAuction = function(aucId, token, values, done){

    let data = [
        [aucId]
    ];

    //Check user is updating their own auction
    db.get_pool().query("SELECT auction_userid FROM auction WHERE auction_id = " + aucId, function(err, result1){
        if(err) {
        }
        let auction_user_id = result1[0].auction_userid;

        //check to see if bidding has begun
        db.get_pool().query("SELECT MAX(bid_amount) FROM auction JOIN bid ON bid_auctionid = auction_id WHERE auction_id = " + aucId, function(err, result2){
            if(err){
                //Server error
                return done([[500], [{"500":"Internal server error"}]]);
            }

        if(result2[0].bid_amount == undefined) {
            auth.checkUserId(auction_user_id, token, function (result) {
                if (result) {
                    let query = "UPDATE auction SET ";
                    let query_fields = [];
                    let query_parameters = [];
                    let dates = [];

                    if (values.categoryId != undefined) {
                        query_fields.push("auction_categoryid");
                        query_parameters.push(values.categoryId);
                    }

                    if (values.title != undefined) {
                        query_fields.push("auction_title");
                        query_parameters.push(values.title.toString());
                    }

                    if (values.description != undefined) {
                        query_fields.push("auction_description");
                        query_parameters.push(values.description);
                    }

                    if (!isNaN(values.startDateTime)) {
                        query += "auction_startingdate = ?, ";
                        dates.push(values.startDateTime);
                    }

                    if (!isNaN(values.endDateTime)) {
                        query += "auction_endingdate = ?, ";
                        dates.push(values.endDateTime);
                    }

                    if (values.reservePrice != undefined) {
                        query_fields.push("auction_reserveprice");
                        query_parameters.push(values.reservePrice);
                    }

                    if (values.startingBid != undefined) {
                        query_fields.push("auction_startingprice");
                        query_parameters.push(values.startingBid);
                    }

                    let i = 0;
                    while (i < query_fields.length) {
                        query += query_fields.pop() + " = '" + query_parameters.pop() + "', ";
                        i++;
                    }

                    query = query.slice(0, -2);

                    query += " WHERE auction_id = " + aucId;

                    db.get_pool().query(query, dates, function (err, result) {
                        if (err){
                            //Server error
                            return done([[500], [{"500":"Internal server error"}]]);
                        }
                        //Good request return result
                        return done([[201], ["OK"]]);
                    });
                } else {
                    //User trying to update other auction
                    return done([[404], [{"404":"Not found"}]]);
                }

            });
        } else{
                //User attempting to update running auction
                return done([[403], [{"403":"Forbidden - bidding has begun on the auction."}]]);
        }
        });

    });

   };

