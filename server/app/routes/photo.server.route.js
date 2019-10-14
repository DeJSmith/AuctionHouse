const photos = require("../controllers/photo.server.controller");

module.exports = function(app) {
    app.route('/api/v1/auctions/:aucId/photos')
        .get(photos.auctionPhotos)
        .post(photos.addPhoto)
        .delete(photos.removePhoto);
};