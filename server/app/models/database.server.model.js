const db = require("../../config/db");
const path = require("path");
const fs = require("fs");

const create_db_sql = path.join(__dirname, '../database/create_database.sql');
const load_data_sql = path.join(__dirname, '../database/sample_database.sql');


exports.resetDatabase = function(done){
    let query_sql = fs.readFileSync(create_db_sql, 'utf8');

    if(query_sql != undefined) {
        db.get_pool().query(query_sql, function (err, result) {
            if (err) {
                return done([[500], ["Internal server error"]]);
            }

            return done([[200], ["OK"]]);
        });
    } else {
        return done([[400], ["Bad request"]]);
    }
};

exports.resampleDatabase = function(done){
    let query_sql = fs.readFileSync(load_data_sql, 'utf8');

    if(query_sql != undefined) {
        db.get_pool().query(query_sql, function (err, result) {
            if (err) {
                return done([[500], ["Internal server error"]]);
            }

            return done([[201], ["Sample data has been reloaded"]]);
        });
    } else {
        return done([[400], ["Bad request"]]);
    }

};