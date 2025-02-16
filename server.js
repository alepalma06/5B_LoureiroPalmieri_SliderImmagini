const express = require("express");//varie librerie che mi servono per farlo funzionare
const http = require('http');
const path = require('path');
const app = express();
const multer  = require('multer');
const database = require("./database");//importo database 
database.createTable();
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "files"));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = multer({ storage: storage}).single('file');

app.use("/", express.static(path.join(__dirname, "public")));//uso la cartella public


app.use("/files", express.static(path.join(__dirname, "files")));//uso la cartella file


app.post("/upload", multer({ storage: storage}).single('file'), async (req, res) => {//per caricare foto
  await database.insert("./files/" + req.file.originalname);
  res.json({result: "ok" });  
});


app.get('/images', async (req, res) => {//per mostrare le foto
    //restituisce le immagini
    const list = await database.select();
    res.json(list);
});


app.delete('/delete/:id', async (req, res) => {//per cancellare le foto
  //cancello in base a id
  await database.delete(req.params.id);
  res.json({result: "ok"});
})


const server = http.createServer(app);//creo il server
server.listen(5600, () => {//avvio server alla porta 5600 di localhost
  console.log("- server running");
});