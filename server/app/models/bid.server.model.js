const db = require('../../config/db');

/*
    Fetch all bids for a given auction from db
*/
exports.getBids = function (aucId, done) {

    let query = "SELECT bid_amount AS amount, bid_datetime AS datetime, bid_userId AS buyerId," +
        " auction_user.user_username AS buyerUsername FROM (bid LEFT JOIN auction_user ON bid_userid = auction_user.user_id)" +
        " WHERE bid_auctionid = " + aucId;

    query += " GROUP BY bid_datetime";


    db.get_pool().query(query, function(err, rows){

            if(err) {
                return done([[500],["Internal server error"]]);
            }

            if(rows == undefined){
                return done([[404],["Not found"]]);
            }

            return done([200, rows]);
    });
};

/*
    Insert bid for a given auction in db
*/
exports.makeBid = function (aucId, amount, user_token, done){
    let valid_bid = true;
    let token = "'" + user_token + "'";
    var ms = new Date(2018,3,22,14, 33, 0).getTime();

    db.get_pool().query("SELECT MAX(bid_amount) AS max_bid FROM bid WHERE bid_auctionid = " + aucId, function(err, result){
        if(err) console.log(err);
        let current_bid = result[0].max_bid;
        if(current_bid != undefined){
            if(amount < current_bid){
                valid_bid = false;

            }
        }
    })


    db.get_pool().query("SELECT user_id FROM auction_user WHERE user_token = " + token, function(err, result){
        if(result[0] == undefined){
            return done([[401], ["Unauthorized"]]);
        }

        let user_id = result[0].user_id;
        let values = [
            [user_id],
            [aucId],
            [amount]
        ];

        let auct_id = values[1];

        //check auction is still running
        db.get_pool().query("SELECT auction_id FROM auction WHERE auction_endingdate > CURRENT_TIMESTAMP() AND auction_id = " + auct_id, function(err, validAuction){
            if(err){
                console.log(err);
                return done([[500], ["Internal server error"]]);
            }

            //if auction running insert bid
            if(validAuction[0] != undefined && valid_bid){
                db.get_pool().query("INSERT INTO bid (bid_userid, bid_auctionid, bid_amount) VALUES(?,?,?)", values, function(err, result){
                    if(err) {
                        console.log(err);
                        return done([[500], ["Internal server error"]]);
                    } else {
                        return done([[201],["OK"]]);
                    }
                });

            } else {
                return done([[404], ["Not found"]]);
            }
        })

    });
};