// James Alec Farmer
require('dotenv/config')
const express = require("express");
const { string } = require('joi');
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

// Defining new schema
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

// Generating new schema
const Player = mongoose.model('Player', playerSchema);

// Getting the page where date requested is to be sent
app.get('/', (req, res) => {
    res.sendFile( __dirname + "/public/pages" + "players.html" );
});

// Getting players form database
app.get('/api/players', (req, res)=>{
    getPlayers(res);
});

async function getPlayers(res) {
    const players = await Player.find();
    console.log(players);
    res.send(players);
}

// Getting player from specifc id
app.get('/api/players/:id', (req,res)=>{
    getPlayer(req.params.id, res);
});

async function getPlayer(id, res) {
    const player = await Player.findOne({_id:id});
    console.log(player);
    res.send(player);
}

// Posting or adding new players when created
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

/*
 * COACH DATABASE
 */

const coachSchema = new mongoose.Schema ({
    name:String,
    tag:String,
    position:String,
    class:String,
    college:String,
    phone:String,
    email:String
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
    console.log(coaches)
    res.send(coaches);
}

app.get('/api/coaches/:id', (req, res) => {
    getCoache(req.params.id, res);
});

async function getCoach(id, res) {
    const coach = await Coach.findOne({_id:id});
    console.log(coach);
    res.send(coach)
}

app.post('/api/coaches', (req, res) => {
    const result = req.body;

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const coach = new Coach ({
        name:req.body.name,
        tag:req.body.tag,
        position:req.body.position,
        class:req.body.class,
        college:req.body.college,
        phone:req.body.phone,
        email:req.body.email
    });

    createCoach(coach, res);
});

async function createCoach(coach, res) {
    const result = await coach.save();
    console.log(result)
    res.send(coach);
}

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Listening on port 3000");
})