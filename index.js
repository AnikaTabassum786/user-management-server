require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q12amc9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const userCollection = client.db('user_management_DB').collection('users')

        app.get('/users', async(req,res)=>{
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/users/:id',async (req,res)=>{
            const id =req.params.id
            const query={_id: new ObjectId(id)}
            const result= await userCollection.findOne(query)
            res.send(result)
        })

        app.post('/add-user',async (req,res)=>{
            const newUser = req.body;
            const result= await userCollection.insertOne(newUser)
            res.send(result)
        })

        app.delete('/user/:id',async(req,res)=>{
            const id = req.params.id
           
            const query = { _id: new ObjectId(id) };
            const result= await userCollection.deleteOne(query)
            res.send(result)
        })

        app.put('/users/:id',async(req,res)=>{
            const id = req.params.id;
            const filter={_id: new ObjectId(id)}
            const updatedUser =req.body
            const updateDoc={
                $set:updatedUser
            }
            const result = await userCollection.updateOne(filter,updateDoc)
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
    res.send('User Management Server Side!')
})

app.listen(port, () => {
    console.log(`User Management  ${port}`)
})
