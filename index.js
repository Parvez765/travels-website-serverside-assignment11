const express = require("express")
const app = express()
const port = process.env.PORT || 5000




app.get("/", (req, res) => {
    res.send("Node Server Is Sunning")
})

app.listen(port, () => {
    console.log("Port is Running At", port)
})