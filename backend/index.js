const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const users = require("./data/users.json");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Auten
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("req.body",req.body)
  if (!(username && password)) {
    return res.send(400);
  }
  if (username == "admin" && password == "password") {
    const access_token = jwtGenerate(username);

    res.json({ token: access_token });
    res.sendStatus(200);
  } else {
    return res.send(401);
  }
});

const jwtGenerate = (username) => {
  const accessToken = jwt.sign({username:username}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
    algorithm: "HS256",
  });

  return accessToken;
};

const jwtValidate = (req, res, next) => {
  try {
    if (!req.headers["authorization"]) return res.sendStatus(401);

    const token = req.headers["authorization"].replace("Bearer ", "");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) throw new Error(error);
    });
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

app.get("/users", jwtValidate, (req, res) => {
  res.json(users);
});

app.get("/users/:id", jwtValidate, (req, res) => {
  try {
    if (users && users.users)
      res.json(users.users.find((user) => user.id === Number(req.params.id)));
    else res.json({});
  } catch (error) {
    res.json({});
  }
});

app.post("/users/:id", jwtValidate, (req, res) => {
  const updateIndex = users.findIndex(
    (user) => user.id === Number(req.params.id)
  );
  res.send(`Update user id: '${users[updateIndex].id}' completed.`);
});

app.delete("/users/:id", jwtValidate, (req, res) => {
  const deletedIndex = users.users.findIndex(
    (user) => user.id === Number(req.params.id)
  );
  res.send({'MESSAGE':'OK'});
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log("Starting node.js at port " + port);
});
