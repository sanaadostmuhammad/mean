//setup 

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://127.0.0.1:27017');     // connect to mongoDB database on modulus.io
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

// application -------------------------------------------------------------


//listen 
app.listen(8080);
console.log("App listening on port 8080");


//api
//get all means
var Mean = mongoose.model('mean', {
    text: String
});

app.get('/api/means', function (req, res) {
    Mean.find(function (err, means) {

        if (err)
            res.send(err);
        res.json(means);
    });
});


//create 
app.post('/api/means', function (req, res) {
    Mean.create({
        text: req.body.text,
        done: false
    }, function (err, mean) {

        if (err)
            res.send(err);

        Mean.find(function (err, means) {
            if (err)
                res.send(err);

            res.json(means);
        });
    });
});


app.delete('/api/means/:mean_id', function (req, res) {
    Mean.remove({
        _id: req.params.mean_id
    },
    function (err, mean) {
        if (err)
            res.send(err);

        Mean.find(function (err, means) {
            if (err)
                res.send(err);

            res.json(means);
        });
    });

});
app.get('*', function (req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

