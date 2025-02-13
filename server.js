//libreria express
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const http = require("http");
const multer = require('multer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

const path = require('path');
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/files", express.static(path.join(__dirname, "files")));

//libreria mysql2
const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('./public/conf.json'));
conf.ssl.ca = fs.readFileSync(__dirname + '/ca.pem');
const connection = mysql.createConnection(conf);

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "/files"));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (err, result) {
            if (err) {
                console.error(err);
                reject();     
            }   
            console.log('done');
            resolve(result);         
        });
    })
}

const createTable = () => {
    return executeQuery(`
    CREATE TABLE IF NOT EXISTS immagini
        ( id INT PRIMARY KEY AUTO_INCREMENT, 
          url VARCHAR(255) NOT NULL ) 
       `);      
}

const insert = (immagini) => {
    const template = `
    INSERT INTO immagini (url) VALUES ('$URL')
       `;
    let sql = template.replace("URL", immagini.url);
    return executeQuery(sql); 
}

const select = () => {
    const sql = `
    SELECT id, url FROM immagini 
       `;
    return executeQuery(sql); 
}

createTable().then(() => {
    insert({name: "test " + new Date().getTime(), completed: false}).then((result) => {
        select().then(console.log);
    });
});


let listaimmagini = [];

app.post("/immagini/add", (req, res) => {
   const immagini = req.body.immagini;
   immagini.id = "" + new Date().getTime();
   listaimmagini.push(immagini);
   res.json({result: "Ok"});
});

app.get("/immagini", (req, res) => {
   res.json({listaimmagini: listaimmagini});
   console.log("entra dentro get")
});

app.delete("/immagini/:id", (req, res) => {
    listaimmagini = listaimmagini.filter((element) => element.id !== req.params.id);
    res.json({result: "Ok"});  
})

const server = http.createServer(app);

server.listen(5500, () => {
  console.log("- server running");
});