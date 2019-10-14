const
    express = require('express'),
    bodyParser = require('body-parser');

module.exports = function(){
    const app = express();

    app.use(bodyParser.json());

    require('../app/routes/auction.server.route.js')(app);
    require('../app/routes/user.server.route.js')(app);
    require('../app/routes/database.server.route.js')(app);
    require('../app/routes/photo.server.route.js')(app);
    require('../app/routes/bid.server.route')(app);

    return app;
};