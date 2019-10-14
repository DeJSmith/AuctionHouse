const bids = require("../controllers/bid.server.controller");

module.exports = function(app){
    app.route('/api/v1/auctions/:aucId/bids')
        .get(bids.bid_history)
        .post(bids.bid);
};