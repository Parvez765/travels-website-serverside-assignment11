const express = require("express")
const app = express()
const port = process.env.PORT || 5000

const jwt = require('jsonwebtoken')


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

function verifyJwt(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({message: "UnAuthorized Access"})
    }
    const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).send({message: "UnAuthorized Access"})
        }
        req.decoded = decoded
        next()
    })
}

// MiddleWare

const cors = require("cors");


app.use(cors())
app.use(express.json())
require("dotenv").config()

// Database Setup


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xu0oole.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db("travelsCare").collection("services")
        const reviewCollection = client.db("travelsCare").collection("reviews")

        // For 3 Services
        app.get("/services", async(req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })

        // For All Services
        app.get("/allservices", async(req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // Service Detail Api With Dynamic Id

        app.get("/allservices/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.findOne(query)
            
            res.send(result)
        })

        // Service Review
        app.get("/allservices/:id", async(req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.findOne(query)
            
            res.send(result)
        })

        // Getting Data From Review Form

        app.get("/customreview", verifyJwt, async (req, res) => {

            const decoded = req.decoded
            if (decoded.email !== req.query.email) {
               res.status(403).send({message: "Forbidden Access"})
           } 
           
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)

        })


        // JWT Token Api 
        app.post("/jwt", (req, res) => {
            const user = req.body
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
            res.send({token})
        })

        app.post("/customreview/:id", async(req, res)=>{
            const data = req.body
            
            console.log(data)
            const result = await reviewCollection.insertOne(data)
            
            console.log(result)
            res.send(result)
        })

        app.patch("/myreview/:id", async(req, res) => {
            const id = req.params.id
            const review = req.body.review
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    review: review
                }
            }
            const result = await reviewCollection(query, updatedDoc)
            res.send(result)
       })

        app.delete("/myreview/:id", async(req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
        })
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