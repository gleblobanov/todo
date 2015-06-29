var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');

var connectionString = require(path.join(__dirname, '../', '../', 'config'));

var perFirstPage = 25;
var perPage = 5;

router.get('/', function(req, res, next) {

  res.render('index', { title: 'Todo List:' });

});



router.post('/api/v1/todos', function(req, res) {
    var results = [];
    var data = {text: req.body.text, complete: req.body.complete, date: req.body.date};

    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO items (text, complete, date) VALUES ($1, $2, $3) RETURNING id", [data.text, data.complete, data.date],
            function (err, result1) {
                if (err) {

                } else {
                    client.query("SELECT * FROM items WHERE id = ($1)", [result1.rows[0].id], function (err, result2) {
                        results.push(result2.rows[0]);
                        client.end();
                        return res.json(results);
                    });

                }
            });

        if (err) {
            console.log(err);
        }
    });
});


router.get('/api/v1/todos', function (req, res) {
    var results = [];

    pg.connect(connectionString, function (err, client, done) {
        var query = client.query("SELECT * FROM items ORDER BY id ASC LIMIT ($1);", [perFirstPage]);

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        if (err) {
            console.log(err);
        }
    })
});

router.post('/api/v1/todos/infinit', function (req, res) {
    var results = [];

    var offset = 0;
    if (req.body.offset) {
        offset = req.body.offset;
    }

    pg.connect(connectionString, function (err, client, done) {
        var query = client.query("SELECT * FROM items ORDER BY id ASC LIMIT ($1) OFFSET ($2);", [perPage, offset]);

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        if (err) {
            console.log(err);
        }
    })
});


router.put('/api/v1/todos/:todo_id', function(req, res) {
    var results = [];

    var id = req.params.todo_id;

    var data = {text: req.body.text, complete: req.body.complete};

    pg.connect(connectionString, function (err, client, done) {
        client.query("UPDATE items SET text = ($1), complete = ($2) WHERE id = ($3)", [data.text, data.complete, id]);

        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        query.on('row', function(row) {
           results.push(row);
        });

        query.on('end', function () {
            client.end();
            return res.json(results);
        });

        if (err) {
            console.log(err);
        }
    })
});

router.post('/api/v1/todos/complete', function(req, res) {
    var results = [];

    var id = req.body.id;
    var new_value = req.body.new_value;



    pg.connect(connectionString, function(err, client, done) {
        client.query("UPDATE items SET complete=($1) WHERE id=($2)", [new_value, id]);

        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        query.on('row', function (row) {
            results.push(row);
        });

        query.on('end', function() {
            client.end(req.params);
            return res.json(results);
        });

        if (err) {
            console.log(err);
        }
    });
});


router.delete('/api/v1/todos/:todo_id', function (req, res) {
    var results = [];

    var id = req.params.todo_id;

    pg.connect(connectionString, function(err, client, done) {
       client.query("DELETE FROM items WHERE id=($1)", [id]);

        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        query.on('row', function (row) {
            results.push(row);
        });

        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        if (err) {
            console.log(err);
        }
    });
});


module.exports = router;


