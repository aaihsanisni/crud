const express = require("express");
var cors = require('cors')
const app = express();
app.use(cors())
const bodyParser = require("body-parser");
const db = require("./db/cars");

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static('static'))

app.post("/cars", async (req, res) => {
    const results = await db.createCar(req.body);
    res.status(201).json({ id: results[0] });
});

app.get("/cars", async (req, res) => {
    const cars = await db.getAllCars();
    res.status(200).json({ cars });
});

app.patch("/cars/:id", async (req, res) => {
     const id = await db.updateCar(req.params.id, req.body);
     res.status(200).json({ id });
});

app.delete("/cars/:id", async (req, res) => {
    await db.deleteCar(req.params.id);
    req.status(200).json({ success: true});
});

app.get("/", async (req, res) => {
    res.sendFile('index.html');
})
 app.listen(1337, () => console.log("server is running on port 1337"));
 