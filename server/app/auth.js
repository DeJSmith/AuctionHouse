const db = require("../config/db");

/*
    Issues login token on successful user login
 */
exports.issueToken = function(userName){

    let token = makeToken();

    let values = [
        [token],
        [userName]
    ];

    db.get_pool().query("UPDATE auction_user SET user_token = ? WHERE user_username = ?", values, function(err, result){
        if(err) {
            return (err);

        } else {
            return ({"SUCCESS":"Token successfully issued"});

        }
    });

    return (values[0][0]);
};

/*
    Revoke login token on logout
 */
exports.revokeToken = function(username, done){

    let values = [
        [username]
    ];

    db.get_pool().query("UPDATE auction_user SET user_token = NULL WHERE user_username = ?", values, function(err, result){
        if(err){
            console.log(err);
            return done(err);
        } else {
            return done({"SUCCESS":"Token successfully revoked"});
        }

    });
};

/*
    check token is valid
*/
exports.isValidToken = function(token, done) {

    //no token in header
    if(token == ''){
        return done(false);
    }

    let values = [
        [token.toString()]
    ];

    db.get_pool().query("SELECT * FROM auction_user WHERE user_token = ?", values, function(err, result){
        if(err) {
            return done(false);
        } else {
            return done(true);
        }
    });

};

/*
    Checks a userId against a userId query'd via a user token
*/
exports.checkUserId = function(userId, user_token, done){

    db.get_pool().query("SELECT user_id FROM auction_user WHERE user_token = ?", user_token, function(err, result) {
        if (err) console.log(err);
        let other_id = result[0].user_id;

        if(other_id == userId){
            return done(true);
        } else {
            return done(false);
        }
    });


}

/*
    Generate login token
*/
function makeToken() {

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}