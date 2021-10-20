const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json());

app.listen(3000, ()=>{
    console.log("Listening on port 3004");
})