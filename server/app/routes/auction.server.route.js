const auctions = require('../controllers/auction.server.controller');

module.exports = function(app){
    app.route('/api/v1/auctions')
        .get(auctions.list)
        .post(auctions.create);

    app.route('/api/v1/auctions/:aucId')
        .get(auctions.read)
        .patch(auctions.update);

};