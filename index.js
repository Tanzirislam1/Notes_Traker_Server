const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

/* mongoDb coonection code */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z4aagjz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     console.log('Db connected');
//     // perform actions on the collection object
//     client.close();
// });

async function run() {
    try {
        await client.connect();
        const notesCollection = client.db("notesTraker").collection("notes");
        console.log('connect to db');;


        /* get api read all notes */
        // http://localhost:5000/notes => get url  with out create data in client but useing postman and create our data....
        /* client body data formate
            {
                "name": "musa",
                "title": "don"
            }
        */
        app.get('/notes', async (req, res) => {
            const query = req.query;
            console.log(query);

            /* amra data ta k access korar shomoy find er moddhe amra {} empty object dile browser er moddhe shob gulo data k return kore amra jodi amra akta var er moddhe req.query ta k niye amra find() er moddhe set korle dile amra search o korte pari abar abar amader shob gulo data k return pai...karon backend e query ase kinto browser e query nai tai amra jodi query k set kori tahole amra shob gulo data pabo shate search query er kajtao kore feltase... */
            const cursor = notesCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        // http://localhost:5000/note
        /* POST data create notesTraker */
        app.post('/note', async (req, res) => {
            const data = req.body;
            console.log(data, 'client side POST api');
            const result = await notesCollection.insertOne(data);
            res.send(result);
        });

        /* update user update notesTraker */
        // http://localhost:5000/note/6329a99f4c2c42b3655b8c0f
        app.put('/note/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log(data, 'client side form field user data');
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ...data
                    // name: data.name,
                    // description: data.description
                },
            };
            const result = await notesCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        /* delete data */
        app.delete('/note/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await notesCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hello');
})

app.listen(port, () => {
    console.log('Listen to port', port);
});