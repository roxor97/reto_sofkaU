const express = require("express");
const sqlite3 = require("sqlite3");
var cors = require('cors')
const { loggerMiddleware } = require("./middleware/logger");
const path = require("path");
const staticPath = path.join(__dirname, "./public");

const puerto = process.env.port || 3535;

const app = express();
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 
  }
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(loggerMiddleware);

app.get("/", (req, res) => {});
const db = new sqlite3.Database("./path/data.ds", (err) => {
  if (err) {
    console.error("Erro opening database " + err.message);
  } else {
    db.run(
      "CREATE TABLE registros( \
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            nombre NVARCHAR(100)  NOT NULL,\
            edad INTEGER  NOT NULL,\
            email NVARCHAR(100),\
            puntaje INTEGER,\
            resultado  NVARCHAR(100)\
        )",
      (error) => {
        if (error) {
          console.log("Table already exists.");
        }
      }
    );
  }
});

app.get("/registros/:id", (req, res, next) => {
    let params = [req.params.id]
    console.log(params);
    db.get(`SELECT * FROM registros where registro_id = ?`, [req.params.id], (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json(row);
      });
});

app.get("/registros", (req, res, next) => {
    db.all("SELECT * FROM registros", [], (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json({rows});
      });
});

app.post("/registros/",cors(corsOptions), (req, res, next) => {
    var reqBody = req.body;
    db.run(`INSERT INTO registros (nombre, edad, email, puntaje, resultado) VALUES (?,?,?,?,?)`,
        [reqBody.nombre, reqBody.edad, reqBody.email, reqBody.puntaje, reqBody.resultado],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            }
            res.status(201).json({
                "registro_id": this.lastID
            })
        });
});

app.listen(puerto, () => {
  console.log(`Servidor andando en puerto: ${puerto}`);
});
