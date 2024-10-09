require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routers/router");

const app = express();
const PORT = 3000;
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/highon";

mongoose.connect(DB_URL,{ useNewUrlParser: true, useUnifiedTopology: true, dbName: "testDb" })
    .then(()=> console.log("Database Connected Successfully"))
    .catch((err)=> console.log("Error connecting to the Database ",err))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use('/', router);

app.listen(PORT, () => console.log("Server Started on PORT ",PORT));