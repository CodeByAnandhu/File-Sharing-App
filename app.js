 
const express = require("express");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4000; 

const bodyParser = require("body-parser"); 
const session = require('express-session');
const flash = require("connect-flash");
app.use(flash());


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.set("views", "./views");

const fileShare = require("./Router/fileShare");
app.use("/", fileShare);


app.use('/uploads', express.static(__dirname + "/uploads"));

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
