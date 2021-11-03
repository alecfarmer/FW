// James Alec Farmer
const express = require("express");
const app = express();
const Joi = require("joi");
app.use(express.static("public"));
app.use(express.json());
const mongoose = require("mongoose");

// CONNECT TO DATABASE
mongoose.connect("mongodb+srv://jarvis_admin:r8Du9Df2J3Pw63XP@jarvis.svqkj.mongodb.net/fwProject?retryWrites=true&w=majority", {useUnifiedTopology:true, useNewUrlParser:true})
    .then(()=>console.log("Successfully connected to mongo database!"))
    .catch(err => console.error("Couldn't connect to mongo database!", err));

// DATABASE LAYOUT
const playerSchema = new mongoose.Schema ({
    name:String,
    age:Number,
    position:String,
    batThrow:String,
    commitment:String,
    gradYear:String,
    nationRanking:Number,
    stateRanking:Number,
    gpa:Number
});

console.log(__dirname + "/public/pages/players");

const Player = mongoose.model('Player', playerSchema);

app.get('/', (req, res) => {
    res.sendFile( __dirname + "/public/pages" + "players.html" );
    console.log("found")``
});

app.get('/api/players', (req, res)=>{
    getPlayers(res);
});

async function getPlayers(res) {
    const players = await Player.find();
    console.log(players);
    res.send(players);
}

app.get('/api/players/:id', (req,res)=>{
    getPlayer(req.params.id, res);
});

async function getPlayer(id, res) {
    const player = await Player.findOne({_id:id});
    console.log(player);
    res.send(player);
}

app.post('/api/players', (req, res)=>{
    const result = req.body;

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const player = new Player({
        name:req.body.name,
        age:req.body.age,
        position:req.body.position,
        batThrow:req.body.batThrow,
        commitment:req.body.commitment,
        gradYear:req.body.gradYear,
        nationRanking:req.body.nationRanking,
        stateRanking:req.body.stateRanking,
        gpa:req.body.gpa
    });

    createPlayer(player, res);
});

async function createPlayer(player, res) {
    const result = await player.save();
    console.log(result);
    res.send(player);
}

app.put('/api/players/:id', (req, res)=>{
    const result = validatePlayer(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updatePlayer(res, req.params.id, req.body.name, req.body.age, req.body.position, req.body.batThrow, req.body.commitment,
        req.body.gradYear, req.body.nationRanking, req.body.stateRanking, req.body.gpa);
});

async function updatePlayer(res, id, name, age, position, batThrow, commitment, gradYear, nationRanking, stateRanking, gpa) {
    const result = await Player.updateOne({_id:id}, {
        $set:{
            name:name,
            age:age,
            position:position,
            batThrow:batThrow,
            commitment:commitment,
            gradYear:gradYear,
            nationRanking:nationRanking,
            stateRanking:stateRanking,
            gpa:gpa
        }
    })

    res.send(result);
}

app.delete('/api/players/:id', (req, res)=>{
    removePlayer(res, req.params.id);
});

async function removePlayer(res, id) {
    const player = await Player.findByIdAndRemove(id);
    res.send(player);
}

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Listening on port 3000");
})