// require express, cors, mongoClient, dotenv
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// create express app
const app = express();

// server running on port
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb connection

// default route/api
app.get('/', (req, res) => {
  res.send('Niche Product server is running!!!');
});

// app listen port
app.listen(port, () => {
  console.log('Running server on port', port);
});