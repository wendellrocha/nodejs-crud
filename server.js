const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const app = express();

const uri = 'mongodb://localhost:27017/nodejs-crud';

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');
app.use('/src', express.static(__dirname + '/src'));

console.info("Conectando no MongoDB...");
MongoClient.connect(uri, {
    useNewUrlParser: true
}, (err, client) => {
    if (err) return console.log(err)
    db = client.db('nodejs-crud')

    app.listen(3000, function () {
        console.log('server running on port 3000')
    });
});

app.route('/') //setado a rota, e abaixo as ações a serem tomadas dentro desta rota
    .get(function (req, res) {
        const cursor = db.collection('data').find()
        res.render('index.ejs')
    })

    .post((req, res) => {
        db.collection('data').save(req.body, (err, result) => {
            if (err) return console.log(err)

            console.log('Salvo no Banco de Dados')
            res.redirect('/show')
        })
    })

app.route('/show')
    .get((req, res) => {
        db.collection('data').find().toArray((err, results) => {
            if (err) return console.log(err)
            res.render('show.ejs', {
                data: results
            })
        })
    })

app.route('/edit/:id')
    .get((req, res) => {
        var id = req.params.id

        db.collection('data').find(ObjectId(id)).toArray((err, result) => {
            if (err) return res.send(err)
            res.render('edit.ejs', {
                data: result
            })
        })
    })
    .post((req, res) => {
        var id = req.params.id
        var name = req.body.name
        var surname = req.body.surname

        db.collection('data').updateOne({
            _id: ObjectId(id)
        }, {
            $set: {
                name: name,
                surname: surname
            }
        }, (err, result) => {
            if (err) return res.send(err)
            res.redirect('/show')
        })
    });

app.route('/delete/:id')
    .get((req, res) => {
        var id = req.params.id

        db.collection('data').deleteOne({
            _id: ObjectId(id)
        }, (err, result) => {
            if (err) return res.send(500, err)
            res.redirect('/show')
        })
    });