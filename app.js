
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const NodeCouchDb = require('node-couchdb');

const couch = new NodeCouchDb({
     auth: {
        user: 'Meshack',
        pass: 'Kimanthi8815'
     }
});

const dbName = 'myschool';
const viewUrl = '_design/all_myschool/_view/all';


couch.listDatabases().then(function(dbs){
    console.log(dbs);
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
    couch.get(dbName, viewUrl).then(
        function( data, headers, status){
            console.log(data.data.rows);
            res.render('index',{
                myschool:data.data.rows
            });
        },
        function(err){
            res.send(err);
        });
});

app.post('/myschool/add', function(req,res){
    const name = req.body.name;
    const course = req.body.course;
    const age = req.body.age;
    
    couch.uniqid().then(function(ids){
        const id = ids[0];

        couch.insert('myschool',{
            _id: id,
            name: name,
            course: course,
            age: age
        }).then (
            function(){
                res.redirect('/')
            },
            function(err){
                res.send(err);
            });
    });
});

app.post('/myschool/delete/:id', function(req, res){
    const id = req.params.id;
    const rev = req.body.rev;

    couch.del(dbName, id, rev).then (
        function(data, headers, status){
            res.redirect('/');
        },
        function(err){
            res.send(err);
        });
});

app.listen(3000, function(){
    console.log('Server Started On Port 3000');
});