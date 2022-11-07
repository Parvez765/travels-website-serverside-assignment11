const express = require("express")
const app = express()
const port = process.env.PORT || 5000

const { MongoClient, ServerApiVersion } = require('mongodb');

// MiddleWare

const cors = require("cors")

app.use(cors())
app.use(express.json())
require("dotenv").config()

// Database Setup


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xu0oole.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        
    }
    finally {
        
    }
}
run().catch(err=> console.log(err))



app.get("/", (req, res) => {
    res.send("Node Server Is Sunning")
})

app.listen(port, () => {
    console.log("Port is Running At", port)
})