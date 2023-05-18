const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


// database connection 

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.50l1tkw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toydbCollection = client.db('toyDb').collection('toy')
    const postedToyCollection = client.db('toyDb').collection('postedToy')

    app.get('/toys', async (req, res) => {
      const result = await toydbCollection.find().toArray()
      res.send(result)
    })
   
    app.get('/toys/:category', async (req, res) => {
      
    const result = await toydbCollection.find({
      category : req.params.category}).toArray();
      res.send(result)
    });

    // posted toy 
    app.post ('/postedToy', async(req,res)=> {
      const booking = req.body
      const result = await postedToyCollection.insertOne(booking)
      res.send(result)

    })

    app.get('/postedToy', async(req,res)=> {
      const result = await postedToyCollection.find().toArray()
      res.send(result)
    } )

    // specific log user data who posted with prarams or do query email
    app.get('/myPosted/:email',async(req,res)=>{
      console.log(req.params.email)
      const result = await postedToyCollection.find({email: req.params.email}).toArray();
      res.send(result)
    })
  
    
   
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('toy is okay')
})

app.listen(port, () => {
  console.log(port, 'is running');
})