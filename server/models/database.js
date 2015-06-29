var pg = require('pg');
var path = require('path');
var async = require('async');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));

var client = new pg.Client(connectionString);
client.connect();
//var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');

//query.on('end', function() { client.end(); });

var i = 0;
var j = 0;

function my_q() {

    if ( i < 10000000) {
        i++;
        j++;
        if (j == 1000000) {

            console.log(j);
            j = 0;
        }

        if (i % 2 === 0) {
            client.query("INSERT INTO items (text, complete, date) VALUES ('task', true, '2015-01-08 19:25:00+02' );", [], function(err, result) {
                my_q();
            });
        }
        else {
            client.query("INSERT INTO items (text, complete, date) VALUES ('task', false, '2015-01-08 19:25:00+02' );", [], function(err, result) {
                my_q();
            });
        }
    }
    else {
        client.end();
    }
}

my_q();


//
//client.connect(function(err) {
// for (var i = 0; i < 100; ++i) {
// client.query("INSERT INTO items (text, complete) VALUES ('task', false );", [], function(err, result) {
//
// });
//
//}
//
//});
