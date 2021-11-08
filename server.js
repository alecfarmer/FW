// James Alec Farmer
require('dotenv/config')
const express = require("express");
const app = express();
const Joi = require("joi");
app.use(express.static("public"));
app.use(express.json());
const mongoose = require("mongoose");

// CONNECT TO DATABASE
mongoose.connect(process.env.DATABASE_LINK,
    {useUnifiedTopology:true, useNewUrlParser:true})
    .then(()=>console.log("Successfully connected to mongo database!"))
    .catch(err => console.error("Couldn't connect to mongo database!", err));

/*
 * PLAYER DATABASE
 */

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

/*
 * COACH DATABASE
 */

const coachSchema = new mongoose.Schema ({
    name:String,
    org:String,
    Team:String
});

const Coach = mongoose.model('Coach', coachSchema);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/pages" + "coaches.html");
});

app.get('/api/coaches', (req, res) => {
    getCoaches(res);
});

async function getCoaches(res) {
    const coaches = await Coach.find();
    console.log(coaches);
    res.send(coaches);
}

app.post('/api/coaches', (req, res) => {
    const result = req.body;

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const coach = new Coach({

    });

    createCoach(coach, res);
});

async function createCoach(coach, res) {
    const result = await coach.save();
    console.log(result);
    res.send(coach);
}

app.put('/api/coachs/:id', (req, res)=>{
    const result = validateCoach(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updateCoach(res, req.params.id, req.body.name, reg.body.org, reg.body.team);
});

async function updateCoach(res, id, name, org, team) {
    const result = await Coach.updateOne({_id:id}, {
        $set:{
            name:name,
            org:org,
            team:team
        }
    })

    res.send(result);
}

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Listening on port 3000");
})