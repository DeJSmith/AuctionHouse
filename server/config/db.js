const mysql = require('mysql');

let state = {
    pool: null
};

exports.connect = function(done){
    state.pool = mysql.createPool({
        multipleStatements: true,
        host: process.env.SENG365_MYSQL_HOST || 'mysql3.csse.canterbury.ac.nz',
        port: process.env.SENG365_MYSQL_PORT || 3306,
        user: 'dsm106',
        password: '15904794',
        database: 'dsm106'
    });
    done();
};

exports.get_pool = function() {
    return state.pool;
};