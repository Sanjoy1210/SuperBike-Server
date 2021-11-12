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
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wirgo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// connect to mongoDb
async function run() {
  try {
    await client.connect();
    console.log('connect to mongodb');

    // create database
    const database = client.db('bicycle_shop');

    // create collection
    const productsCollection = database.collection('products');
    // const reviewsCollection = database.collection('reviews');
    // const ordersCollection = database.collection('orders');
    const usersCollection = database.collection('users');

    // add product api
    app.post('/addProducts', async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.json(result);
    });

    // load products api
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // add user
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    // update user 
    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };

      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    // get user
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    })

    // make admin
    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      // const requester = user.email;
      // if (requester) {
      //   const requesterAccount = await usersCollection.findOne({ email: requester });
      //   if (requesterAccount.role === 'admin') {
      //     const filter = { email: user.email };
      //     const updateDoc = { $set: { role: 'admin' } };
      //     const result = await usersCollection.updateOne(filter, updateDoc);
      //     res.json(result);
      //   }
      // }
      // else {
      //   res.status(403).json({ message: 'you do not have access to make admin' });
      // }
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);

    })
  }
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

// default route/api
app.get('/', (req, res) => {
  res.send('Niche Product server is running!!!');
});

// app listen port
app.listen(port, () => {
  console.log('Running server on port', port);
});