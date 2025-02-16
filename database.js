const fs = require('fs');//richiedo le librerie
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('./public/conf.json'));//leggo il conf

let dbconfig = conf;

dbconfig.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem')
};

const connection = mysql.createConnection(dbconfig);

const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {      
          connection.query(sql, function (err, result) {
             if (err) {
                console.error(err);
                reject(err);     
             }   
             console.log('ok');
             resolve(result);         
       });
    })
 }

 const database = {
    createTable: () => {//creo tabella solo se nn esiste gia
        return executeQuery(`
        CREATE TABLE IF NOT EXISTS images
           ( id INT PRIMARY KEY AUTO_INCREMENT, 
              name VARCHAR(255) NOT NULL)              
           `);      
     },
     insert: (name) => {//insert immagini nella tabella
        let sql = `
        INSERT INTO images (name) VALUES ('$NAME')
           `;
        sql = sql.replace("$NAME", name);
        return executeQuery(sql); 
     },
     select: () => {//select per vedere immagini nella tabella
        const sql = `
        SELECT id, name FROM images 
           `;
        return executeQuery(sql); 
     },
     delete: (id) => {//delete per cancellare immagini nella tabella
        let sql = `
        DELETE FROM images
        WHERE id=$ID
           `;
        sql = sql.replace("$ID", id);
        return executeQuery(sql); 
     },
     truncate: () => {//truncate per cancellare tutto
        const sql = `
        TRUNCATE TABLE images"
           `;
        return executeQuery(sql); 
     }

 }

 module.exports = database;//esporto database