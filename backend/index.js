const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const users = require("./data/users.json");
const bodyParser = require("body-parser");
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Auten
const adminLoginData = [
  {username :"admin",password:"1234"},
  {username :"admin01",password:"1234"},
  {username :"admin02",password:"1234"},
  {username :"admin03",password:"1234"}
]
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("req.body",req.body)
  if (!(username && password)) {
    return res.send(400);
  }
  let resultCheckUsername = checkUsername(username,password)
  console.log("resultCheckUsername",resultCheckUsername)
  if (resultCheckUsername) {
    const access_token = jwtGenerate(username);

    res.json({ token: access_token });
  } else {
    res.status(401).json({ ERROR: "can not find" });
  }
});

const checkUsername = (username,password) => {
  let result = false
  if(username){
    let user = adminLoginData.filter(arg=>arg.username == username)
    console.log("user",user)
    if(user&&user.length>0){
        let passwordSuccess = user.filter(arg=>arg.password == password)
        console.log("passwordSuccess",passwordSuccess)
        if(passwordSuccess&&passwordSuccess.length>0){
          result = true
        }else{
            result = false
        }
    }else{
      result = false
    }
  }

  return result;
};

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
  res.status(200).json(users);
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

app.post("/users", jwtValidate, (req, res) => {
  console.log("req",req.body)
  if(req.body){
    if(!(req.body.contracts &&req.body.contracts.length > 0 &&req.body.contracts.length < 4) ){
      res.status(400).send({"ERROR":"There are only 1 to 3 contracts"});
      return
    }
    if(!verifyCreateUser(req.body)){
      res.status(400).send({"ERROR":"Data not in the right format"});
      return
    }
    let createId = Math.floor(Math.random() * 9999) + 1;
    let createData = {id:createId,
      ...req.body
    }
    let allData = users
    allData.users.push(createData)
    fs.writeFile('./data/users.json', JSON.stringify(allData), 'utf8', function(err) {
      if (err) throw err;
      console.log('complete');
      });
    res.status(201).send({"ID":createId});
  }else{
    res.status(400).send({"ERROR":"not find data in body"});
  }
});

const verifyCreateUser = (data) => {
  try {
    if('name' in data && 'zip' in data && 'street' in data) return true
    return false
  } catch (error) {
    return res.sendStatus(400);
  }
};


app.delete("/users/:id", jwtValidate, (req, res) => {
  let isNumber = /^\d+$/.test(req.params.id);
  if(!isNumber){
    res.status(400).send({"ERROR":"id is not number"});
    return
  }
  const deletedIndex = users.users.findIndex(
    (user) => user.id === Number(req.params.id)
  );
  if(deletedIndex!=-1){
    let allData = users
    let currentDataDelete = allData.users[deletedIndex]
    allData.users.splice(deletedIndex, 1);
    fs.writeFile('./data/users.json', JSON.stringify(allData), 'utf8', function(err) {
      if (err) throw err;
      console.log('complete');
      });
    res.status(200).send({'MESSAGE':'OK'});
  }else{
    res.status(404).send({"ERROR":"not found"});
    return
  }
});

app.listen(port, () => {
  console.log("Starting node.js at port " + port);
});
