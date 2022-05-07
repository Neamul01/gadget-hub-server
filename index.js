const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();

//midleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zybsh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemCollection = client.db('GadgetHub').collection('items');

        //services apis
        app.get('/items', async (req, res) => {
            const query = {};
            const items = itemCollection.find(query);
            const result = await items.toArray();
            res.send(result);
        })

        //get item by id
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            // console.log(id)
            const item = await itemCollection.findOne(query);
            res.send(item)
        })

        app.post('/items/:id', async (req, res) => {
            const quantity = req.query.newQuantity;
            const updateQuantity = Number(Number(quantity) - 1);
            const id = req.params.id;
            const newQuantity = {
                $set: {
                    quantity: updateQuantity
                }
            }
            console.log(newQuantity)
            const filter = { _id: ObjectId(id) };
            const oprions = { upsert: true };
            const result = await itemCollection.updateOne(filter, newQuantity, oprions);
            res.send(result)
        })

        // get new item
        app.post('/items', async (req, res) => {
            const newItem = req.body;
            console.log(req.body)
            const result = await itemCollection.insertOne(newItem);
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Gadget Hub Server Running....!!!')
})

app.listen(port, () => {
    console.log('Gadget Hub Server Running at port: ', port)
})