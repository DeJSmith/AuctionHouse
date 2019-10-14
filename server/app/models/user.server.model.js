const db = require("../../config/db");
const token = require("../auth");

/*
    Fetch info for a given user from db
*/
exports.getOneUser = function(id, user_token, done){

    let current_user_query = "SELECT user_username AS username, user_givenname AS givenName, user_familyname AS familyName, user_email AS email," +
                             " user_accountbalance AS accountBalance FROM auction_user WHERE user_id = "+ id;
    let other_user_query = "SELECT user_username AS username, user_givenname AS givenName, user_familyname AS familyName FROM auction_user WHERE user_id = "+ id;
    let query = "";


    db.get_pool().query("SELECT user_id FROM auction_user WHERE user_token = " + "'" + user_token + "'", function(err, result){

        if(err) console.log(err);
        let userid = result[0].user_id;

        if(userid == id){
            query = current_user_query;
        } else {
            query = other_user_query;
        }

        db.get_pool().query(query , function(err, rows){
            if(err){
                return done([[404], ["Not found"]]);
            } else {
                if(rows[0] == undefined){
                    return done([[404], ["Not found"]]);
                }
                return done([200, rows[0]]);
            }
        });
    });

};

/*
    Insert new user data into db
*/
exports.insertUser = function(values, done){

    db.get_pool().query("INSERT INTO auction_user (user_username, user_givenname, user_familyname, user_email, user_password) VALUES (?,?,?,?,?)", values, function(err, result){
        if(err){
            return done([[400], ["Malformed request"]]);
        }


        db.get_pool().query("SELECT user_id FROM auction_user WHERE user_username = " + "'" + values[0] + "'", function(err, id){
            if(err){
                return done([[400], ["Malformed request"]]);
            } else {
                let user_id = id[0].user_id;
                return done([201, user_id]);
            }
        })

    });

};

/*
    Update existing user record in db
*/
exports.updateUser = function(id, token, values, done) {
    
    //Check the user is not attempting to change another users data
    db.get_pool().query("SELECT user_id FROM auction_user WHERE user_token = " + "'" + token + "'", function(err, result){
        if(err){
            return done([[500], ["Internal server error"]]);
        }

        let correct_id = result[0].user_id;

        if(id == correct_id){

            let query = "UPDATE auction_user SET ";
            let query_fields = [];
            let query_parameters = [];

            if(values.username != undefined){
                query_fields.push("user_username");
                query_parameters.push(values.username);
            }

            if(values.givenName != undefined){
                query_fields.push("user_givenname");
                query_parameters.push(values.givenName);
            }

            if(values.familyName != undefined){
                query_fields.push("user_familyname");
                query_parameters.push(values.familyName);
            }

            if(values.email != undefined){
                query_fields.push("user_email");
                query_parameters.push(values.email);
            }

            if(values.password != undefined){
                query_fields.push("user_password");
                query_parameters.push(values.password);
            }

            let i = 0;
            while(i < query_fields.length){
                query += query_fields.pop() + " = ";
                query += "'" + query_parameters.pop() + "', ";
            }

            query = query.slice(0, -2);
            query += " WHERE user_id = " + id;
            db.get_pool().query(query, function(err, result){
                if(err) {
                    if(err.errno == 1062){
                        return done([[400], ["Bad request"]]);
                    }

                    console.log(err);
                    return done([[500], ["Internal Server error"]]);
                }

                return done([[201], ["OK"]]);
            });
        } else {
            return done([[401], ["Unauthorized"]]);
        }

    })

};

/*
    Validate suer login with username and issue login token
*/
exports.userNameLogin = function(userName, userPwd, done) {

    let values = [
        [userName]
    ];

    db.get_pool().query("SELECT user_password, user_id FROM auction_user WHERE (user_username = ?);",values ,function(err, result){

       if(result[0] == undefined){
           return done([[400], ["Invalid username/email/password supplied"]]);

       } else {

           let correct_pwd = result[0].user_password;

           if (userPwd == correct_pwd) {
               let userid = result[0].user_id;
               let login_token = token.issueToken(userName);
               return done([200, userid, login_token]);

           } else {
               return done([[400], ["Invalid username/email/password supplied"]]);

           }
       }
    });
};

/*
    Validate user login with email address and issue login token
*/
exports.userEmailLogin = function(userEmail, userPwd, done) {

    let values = [
        [userEmail]
    ];

    db.get_pool().query("SELECT user_password, user_id FROM auction_user WHERE (user_email = ?);",values[0][0] ,function(err, result1){

        if(result1[0] == null){
            return done([[400],[{"400":"Invalid username/email/password supplied"}]]);

        } else {

            let correct_pwd = result1[0].user_password;

            if (userPwd == correct_pwd) {
                db.get_pool().query("SELECT user_username FROM auction_user WHERE (user_email = ?);", values[0][0], function(err, result2){
                    if(err) return done(err)


                    let userName = result2[0].user_username;
                    let login_token = token.issueToken(userName);
                    let userid = result1[0].user_id;
                    return done([[200], [{
                        "id": userid,
                        "Token": login_token}]])

                });
            } else {
                return done([[400], [{"400":"Invalid username/email/password supplied"}]]);
            }
        }
    });
};

/*
    Logout user and remove login token from db
*/
exports.userLogout = function(user_token, done){


    let values = [
        [user_token.toString()]
    ];

    db.get_pool().query("SELECT user_username FROM auction_user WHERE user_token = " + "'" + user_token + "'", function(err, result){

        if(err){
            return done([[401], ["Unauthorized"]]);

        }

        if(result[0] == undefined){
            return done([[401], ["Unauthorized"]]);
        } else {

            let username = result[0].user_username;
            token.revokeToken(username, function (result) {
                return done([[200], ["OK"]]);
            });
        }



    });

};


