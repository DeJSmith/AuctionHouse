const Photo = require('../models/photo.server.model');
const Auth = require("../auth");
const fs = require("fs");
const path = require("path");

/*
    Add a photo to a given auction
*/
exports.addPhoto = function(req, res){
    let id = req.params.aucId;
    let type = "";

    if(req.get("Content-Type") == "image/jpeg"){
        type = '.jpeg';
    }
    if(req.get("Content-Type") == "image/png"){
        type = '.png';
    }

    let photoStorage = path.join(__dirname, '../auction_photos/' + id + type);

    let values = [
        [id],
        [photoStorage]
    ];

    // Validate user
    Auth.isValidToken(req.get("X-Authorization"), function(valid){
        if(valid){
            if(req.get("Content-Type") == "image/jpeg" || req.get("Content-Type") == "image/png"){
                req.pipe(fs.createWriteStream(photoStorage));

                Photo.insertPhoto(values, function(result){
                    res.statusMessage = result[1];
                    res.sendStatus(result[0]);
                })

            } else {
                res.status(400);
                res.statusMessage = "Bad Request";
                res.send({"400":"Bad Request"});
            }

        } else {
            res.status(401);
            res.statusMessage = "Unauthorized"
            res.send({"401":"Unauthorized"});
        }
    })

};


/*
    Retreive auction photos
*/
exports.auctionPhotos = function(req, res){
    let id = req.params.aucId;
    let valid_input = true;

    id = parseInt(id);

    if(isNaN(id)){
        valid_input = false;
    }
    if(valid_input) {
        let photoPath = path.join(__dirname, '../auction_photos/' + id + '.jpeg');
 
        if (fs.existsSync(photoPath)) {
            Photo.getAuctionPhotos(id, function(result) {
                res.status(result[0]);
                res.statusMessage = result[1];
                res.sendFile(photoPath);
            })

        } else {
            let photoPath = path.join(__dirname, '../auction_photos/' + id + '.png');

            if (fs.existsSync(photoPath)) {
                Photo.getAuctionPhotos(id, function (result) {
                    res.status(result[0]);
                    res.statusMessage = result[1];
                    res.sendFile(photoPath);
                })
            } else {
                let photoPath = path.join(__dirname, '../auction_photos/default.jpeg');
                res.status(200);
                res.statusMessage = "Not found";
                res.sendFile(photoPath);
            }
        }
    } else {
        res.statusMessage = "Bad request";
        res.status(400);
        res.send({"400":"Bad request"});
    }
};

/*
    Remove a photo from an auction
*/
exports.removePhoto = function(req, res){
    let id = req.params.aucId;



    Photo.deletePhoto(id, function(result){
        if(result[0] == 201) {
            let path = result[2];
            console.log(path);
            console.log(result);

            if (fs.existsSync(path)) {
                if (result[0] == 201) {
                    fs.unlink(path);
                    res.status(result[0]);
                    res.statusMessage = result[1];
                    res.send({"201": "OK"});
                } else {
                    res.statusMessage = result[1];
                    res.sendStatus(result[0]);
                }
            } else {
                res.status(404);
                res.statusMessage = "Not found";
                res.send({"404": "Not found"});
            }
        }
    });


};