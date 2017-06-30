var cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
app.use(bodyParser.json());
app.use(cors());

//start server---------------------------------------
app.listen(8088, function () {
    logMessage('======== TASKS SERVER started on port 8088 ========', true);
});

//connection database--------------------------------
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'master',
    database: 'task'
});

con.connect(function (err) {
    logMessage('>> Starting database connection...', true);
    if (err) {
        logMessage('Error connect to database! Error: ' + err);
    } else {
        logMessage('Database connection stablished with success!');
    }
});

//API TASK Services -----------------------------
app.get('/', function (req, res) {
    logMessage('>> TASK GET - ALL TASKS', true);

    var sql = 'SELECT * FROM tasks LIMIT 1000';

    con.query(sql, function (err, rows) {
        if (err) {
            res.status(404).send('SQL error');
            logMessage(err);
        } else {
            res.json(rows);
            logMessage('Returned ' + rows.length + ' rows.');
        }
    });
});

app.get('/:status', function (req, res) {
    logMessage('>> TASK GET - BY STATUS', true);

    var sql;
    if (req.params.status == 'open') {
        sql = 'SELECT * FROM tasks WHERE date_done IS NULL ORDER BY date_task ASC LIMIT 1000';
    } else if (req.params.status == 'close') {
        sql = 'SELECT * FROM tasks WHERE date_done IS NOT NULL ORDER BY date_task ASC LIMIT 1000';
    } else {
        sql = '';
    }

    con.query(sql, function (err, rows) {
        if (err) {
            res.status(404).send('SQL error');
            logMessage(err);
        } else {
            res.json(rows);
            logMessage('Returned ' + rows.length + ' rows.');
        }
    });
});

app.post('/', function (req, res) {
    logMessage('>> TASK POST', true);

    var task = {
        date_create: new Date(),
        description: req.body.description,
        date_task: req.body.date_task
    };

    var sql = 'INSERT INTO tasks SET ?';

    con.query(sql, task, function (err, result) {
        if (err) {
            res.status(404).send('SQL error');
            logMessage(err);
        } else {
            res.status(200).send('Inserted task id ' + result.insertId);
            logMessage('Inserted task id ' + result.insertId);
        }
    });
});

app.put('/', function (req, res) {
    logMessage('>> TASK PUT', true);

    var task = {
        id: req.body.id,
        description: req.body.description,
        date_task: req.body.date_task
    };
    if (req.body.date_done == 'now') {
        task.date_done = new Date();
    }

    var sql = 'UPDATE tasks SET ? WHERE id = ?';

    con.query(sql, [task, task.id], function (err, result) {
        if (err) {
            res.status(404).send('SQL error');
            logMessage(err);
        } else {
            res.status(200).send('Changed ' + result.changedRows + ' rows');
            logMessage('Changed ' + result.changedRows + ' rows');
        }
    });
});

app.delete('/:id', function (req, res) {
    logMessage('>> TASK DELETE SERVICE', true);

    var sql = 'DELETE FROM tasks WHERE id = ?';

    con.query(sql, [req.params.id], function (err, result) {
        if (err) {
            res.status(404).send('SQL error');
            logMessage(err);
        } else {
            res.status(200).send('Affected ' + result.affectedRows + ' rows');
            logMessage('Affected ' + result.affectedRows + ' rows');
        }
    });
});

//-----------------------------------------
function logMessage(message, newLine) {
    if (newLine) message = '\n' + message;
    console.log(message);
}
