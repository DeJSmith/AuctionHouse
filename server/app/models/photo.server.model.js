const db = require("../../config/db");
const fs = require("fs");
const path = require("path");

/*
    Fetch all photos for a given auction
*/
exports.getAuctionPhotos= function(aucId, done){
    console.log("\nget auction photo called");

    db.get_pool().query("SELECT photo_image_URI FROM photo WHERE photo_auctionid = " + aucId, function(err, result){
        if(err){
            return done([[500], ["Internal server error"]]);
        }
        return done([200, "OK"]);
    })

};

/*
    Insert a photo for a given auction
*/
exports.insertPhoto = function(values, done){
    console.log("\ninsert photo called");

    console.log(values);

    db.get_pool().query("INSERT INTO photo (photo_auctionid, photo_image_URI) VALUES(?,?)", values, function (err, result) {
        if (err) {
            console.log(err);
            return done([500, "Internal server error"]);
            console.log(err);
        } else {
            return done([201, "OK"]);
            }
    });

};

/*
    Remove a photo for a given auction
*/
exports.deletePhoto = function(aucId, done){
    console.log("delete photo called");
    let uri = "";

    db.get_pool().query("SELECT MAX(bid_amount) FROM (auction JOIN bid ON bid_auctionid = auction_id) WHERE auction_id = " + aucId, function(err, result){
        console.log(result);
        if(result[0].bid_amount != undefined){
            return done([400, "Bad request"]);
        } else {
            db.get_pool().query("SELECT photo_image_URI FROM photo WHERE photo_auctionid = " + aucId, function(err, results){
                if(err) console.log(err);

                console.log(results);
                console.log(results.photo_image_URI);
                uri = results[0].photo_image_URI;
            });

            if(uri != undefined) {
                db.get_pool().query("DELETE FROM photo WHERE photo_auctionid = " + aucId, function (err, result) {
                    if (err) {
                        return done([[500], ["Internal server error"]]);
                        console.log(err);
                    }
                    return done([201, "OK", uri]);
                });
            }
        }
    });

}