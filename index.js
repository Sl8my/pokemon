const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
// Server express
const app = express();

// Server configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));


// Connection to db Sqlite
const db_name = path.join(__dirname, "data", "database.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("connected to database.db");
});

// Creation table Teams
const sql_create = `CREATE TABLE IF NOT EXISTS Teams (
  Team_ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Name VARCHAR(100) NOT NULL,
  Img VARCHAR(100),
  Tot_Exp INTEGER,
  Types VARCHAR(100)
);`;

db.run(sql_create, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Creation of teams table");
  // Feeding the table Teams
  const sql_insert = `INSERT INTO Teams (Team_ID, Name, Img, Tot_exp, Types) VALUES
  (1, 'Team Valore', 'img', '12', 'acqua, fuoco'),
  (2, 'Team Coraggio', 'img', '4', 'lotta'),
  (3, 'Team Speranza', 'img', '145', 'erba, psyco');`;
  db.run(sql_insert, err => {
    if (err) {
      return console.error("Already created : ", err.message);
    }
    console.log("feeding the table teams");
  });
});


// Creation table pokemons
const sql_create_pokemons = `CREATE TABLE IF NOT EXISTS Pokemons (
  Pokemon_ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Number_ID INTEGER,
  Name VARCHAR(100) NOT NULL,
  Exp INTEGER,
  Img VARCHAR(100),
  Abilities VARCHAR(100),
  Types VARCHAR(100)
);`;

db.run(sql_create_pokemons, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Creation of pokemons table");
  // feeding table pokemon
  const sql_insert_pokemons = `INSERT INTO Pokemons (Pokemon_ID, Number_ID, Name, Exp, Img, Abilities, Types) VALUES
  (1, '1', 'bulbasaur', '13', 'img', 'taglio', 'acqua'),
  (2, '4', 'charmender', '4', 'img', 'lanciafiamma', 'fuoco'),
  (3, '7', 'squirtle', '45', 'img', 'surf, tsunami', 'acqua');`;
  db.run(sql_insert_pokemons, err => {
    if (err) {
      return console.error("Already created : ", err.message);
    }
    console.log("feeding the table pokemons");
  });
});

// Connection to the server
app.listen(3000, () => {
    console.log("Connected to port http://localhost:3000/");
});

// ROUTING

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/teams", (req, res) => {
  const sql = "SELECT * FROM Teams ORDER BY Team_ID DESC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("teams", { model: rows });
  });
});

app.get("/create", (req, res) => {
  res.render("create", { model: {} });
});

app.post("/create", (req, res) => {
  const sql = "INSERT INTO Teams (Name, Img, Tot_Exp, Types) VALUES (?, ?, ?, ?)";
  const team = [req.body.Name, req.body.Img, req.body.Tot_Exp, req.body.Types];
  db.run(sql, team, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/teams");
  });
});

// app.post("/create", (req, res) => {
//   const sql = "INSERT INTO Pokemons (Number_ID, Name, Exp, Abilities, Types) VALUES (?, ?, ?, ?, ?)";
//   const pokemon = [req.body.Name, req.body.Name, req.body.Img, req.body.Tot_Exp, req.body.Types];
//   db.run(sql, pokemon, err => {
//     if (err) {
//       return console.error(err.message);
//     }
//     res.redirect("/teams");
//   });
// });

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Teams WHERE Team_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("edit", { model: row });
  });
});

app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const book = [req.body.Name, id];
  const sql = "UPDATE Teams SET Name = ? WHERE (Team_ID = ?)";
  db.run(sql, book, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/teams");
  });
});

// app.get("/delete/:id", (req, res) => {
//   const id = req.params.id;
//   const sql = "SELECT * FROM Teams WHERE Team_ID = ?";
//   db.get(sql, id, (err, row) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     res.render("/teams", { model: row });
//   });
// });

// app.post("/delete/:id", (req, res) => {
//   const id = req.params.id;
//   const sql = "DELETE FROM Teams WHERE Team_ID = ?";
//   db.run(sql, id, err => {
//     if (err) {
//       return console.error(err.message);
//     }
//     res.redirect("/teams");
//   });
// });
