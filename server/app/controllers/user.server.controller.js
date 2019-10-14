const User = require('../models/user.server.model');
const Auth = require('../auth');

/*
    Create new user
*/
exports.create = function(req, res){

    let valid_input = true;

    let user_data = {
        "username": req.body.username,
        "givenName": req.body.givenName,
        "familyName": req.body.familyName,
        "email": req.body.email,
        "password": req.body.password
    };

    let username = user_data["username"];
    let givenname = user_data["givenName"];
    let familyname = user_data["familyName"];
    let email = user_data["email"];
    let password = user_data["password"];

    let values = [
        username,
        givenname,
        familyname,
        email,
        password
    ];


    if(!validateEmail(email)){
        valid_input = false;
    }

    for(let i = 0; i < values.length; i++){
        if(values[i] != undefined && values[i].length > 0){
            if(typeof values[i] != "string"){
                valid_input = false;
            }
        } else {
            valid_input = false;
        }
    }

    if(valid_input) {
        User.insertUser(values, function (result) {
            if(result[0] == 201) {
                console.log(result);
                res.status(result[0]);
                res.send({"id": result[1]});
            } else {
                res.statusMessage = result[1];
                res.sendStatus(result[0]);
            }
        });
    } else {
        res.statusMessage = "Bad request";
        res.sendStatus(400);
    }

};

/*
    Login and authenticate user with login token
*/
exports.login = function(req, res) {

    let userName = req.query.username;
    let userEmail = req.query.email;
    let userPwd = req.query.password;


    if (userPwd != undefined && userName != undefined) {
        User.userNameLogin(userName, userPwd, function (result) {
            res.status(result[0]);
            let userid = result[1];
            let login_token = result[2];
            res.send({
                "id": userid,
                "token": login_token});
        });
    } else if (userPwd != undefined && userEmail != undefined) {
        User.userEmailLogin(userEmail, userPwd, function (result) {
            res.status(result[0]);
            res.send(result[1]);
        });
    } else{
        res.status(400);
        res.send({"400":"Invalid username/email/password supplied"});
    }

};

/*
    Log out user and remove token
*/
exports.logout = function(req, res){
    Auth.isValidToken(req.get("X-Authorization"), function(valid){

        if(valid) {

            let user_token = req.header("X-Authorization");
            User.userLogout(user_token, function(result){
                if(result[0] == 200) {
                    res.statusMessage = result[1];
                    res.sendStatus(result[0]);
                } else {
                    res.statusMessage = result[1];
                    res.sendStatus(result[0]);
                }

            });

        } else {

            res.statusMessage = "Unauthorized";
            res.sendStatus(401);

        }
    });

};

/*
    Get user info
*/
exports.read = function(req, res){
    let id = req.params.userId;
    let valid_input = true;

    id = parseInt(id);


    if(isNaN(id)){
        valid_input = false;
    }

    if(valid_input) {
        Auth.isValidToken(req.get("X-Authorization"), function (valid) {
            if (valid) {

                User.getOneUser(id, req.get("X-Authorization"),  function (result) {
                    if(result[0] == 200) {
                        res.status(result[0]);
                        res.json(result[1]);
                    } else {
                        res.statusMessage = result[1];
                        res.sendStatus(result[0]);
                    }

                });

            } else {

                res.statusMessage = "Unauthorized";
                res.sendStatus(401);
            }
        });

    } else {

        res.statusMessage = "Not found";
        res.sendStatus(404);

    }
};

/*
    Update user information
*/
exports.alter = function(req, res){

    let id = req.params.userId;
    let valid_input = true;

    let user_data = {
        "username": req.body.username,
        "givenName": req.body.givenName,
        "familyName": req.body.familyName,
        "email": req.body.email,
        "password": req.body.password
    };

    values = [
        user_data.username,
        user_data.givenName,
        user_data.familyName,
        user_data.email,
        user_data.password
    ];


    //Input validation
    for(let i = 0; i < values.length ; i++){

        if(values[i] != undefined){

            if(typeof values[i] != "string"){

                valid_input = false;
            }
        }
    }


    if(valid_input) {
        let token = req.get("X-Authorization");

        if(token == undefined){
            res.statusMessage = "Unauthorized";
            res.sendStatus(401);
        } else {

            console.log("")
            Auth.isValidToken(token, function (valid) {
                if (valid) {
                    User.updateUser(id, req.get("X-Authorization"), user_data, function (result) {
                        res.statusMessage = result[1];
                        res.sendStatus(result[0]);
                    });
                } else {
                    res.statusMessage = "Unauthorized";
                    res.sendStatus(401);
                }
            });
        }

    } else {
        res.statusMessage = "Bad request";
        res.sendStatus(400);

    }

};

/*
    Uses a regular expression to validate input email 
*/
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log(email);
    console.log(re.test(String(email).toLowerCase()));
    return re.test(String(email).toLowerCase());
}