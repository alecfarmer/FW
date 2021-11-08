// James Alec Farmer
window.onload = function() {
    this.displayPlayers();

    // ADD BUTTON POP OUT
    let addExeBtn = document.getElementById("adding-pop");
    let buttonA = this.document.getElementById("btn-add-pop");
    let btn = this.document.getElementById("btn-add-player");
    // DISPLAY POP OUT
    buttonA.onclick = function() {
        addExeBtn.style.display = "block";
    }
    // ADD PLAYER / CLOSE POP OUT
    btn.onclick = function() {
        addPlayer();
        setTimeout(() => { addExeBtn.style.display = "none"; }, 800);
    }
    // CLOSE POP OUT
    window.onclick = function(event) {
        if(event.target == addExeBtn) {
            addExeBtn.style.display = "none";
        }
    }
    // END ADD POP OUT
}

async function displayPlayers() {
    let response = await fetch('.././api/players/');
    let playersJSON = await response.json();
    let playersDiv = document.getElementById("player-list");
    playersDiv.innerHTML = "";
    let i;
    for(i in playersJSON) {
        let player = playersJSON[i];
        playersDiv.append(getPlayerInfo(player));
    }
}

function getPlayerInfo(player) {

    // MAIN DIV
    let mainDiv = document.createElement("div");
    mainDiv.classList.add("player");

    // INFO SECTION
    let infoSection = document.createElement("section");
    infoSection.classList.add("infoSection")
    mainDiv.append(infoSection);

    // TITLE
    let title = document.createElement("h2");
    title.textContent = `${player.name} - ${player.age}`;
    title.classList.add("playertexth2");
    infoSection.append(title);

    // COMMITMENT
    let commitment = document.createElement("p");
    commitment.textContent = `Commitment: ${player.commitment}`;
    commitment.classList.add("playertextp");
    infoSection.append(commitment);

    // POSITION
    let position = document.createElement("p");
    position.textContent = `position: ${player.position}`;
    position.classList.add("playertextp");
    infoSection.append(position);

    // BAT / THROW
    let batThrow = document.createElement("p");
    batThrow.textContent = `Bat / Throw: ${player.batThrow}`;
    batThrow.classList.add("playertextp");
    infoSection.append(batThrow);

    // GRAD YEAR
    let gradYear = document.createElement("p");
    gradYear.textContent = `Graduation Year: ${player.gradYear}`;
    gradYear.classList.add("playertextp");
    infoSection.append(gradYear);

    // GPA
    let gpa = document.createElement("p");
    gpa.textContent = `GPA: ${player.gpa}`;
    gpa.classList.add("playertextp");
    infoSection.append(gpa);

    // National Ranking
    let nationRanking = document.createElement("p");
    nationRanking.textContent = `National Rank: ${player.nationRanking}`;
    nationRanking.classList.add("playertextp");
    infoSection.append(nationRanking);

    // State Ranking
    let stateRanking = document.createElement("p");
    stateRanking.textContent = `State Rank: ${player.stateRanking}`;
    stateRanking.classList.add("playertextp");
    infoSection.append(stateRanking);

    return mainDiv;
}

async function showPlayerDetails(player) {
    let playerId = player._id
    let response = await fetch(`.././api/players/${playerId}`);

    if(response.status != 200) {
        // DISPLAY ERROR
        console.log("Error reciving player!");
        return;
    }

    player = await response.json();
    document.getElementById("player-id").textContent = playerId;
    document.getElementById("txt-name").value = player.name;
    document.getElementById("txt-age").value = player.age;
    document.getElementById("txt-position").value = player.position;
    document.getElementById("txt-bt").value = player.batThrow;
    document.getElementById("txt-commit").value = player.commitment;
    document.getElementById("txt-gradyear").value = player.gradYear;
    document.getElementById("txt-natrank").value = player.nationRanking;
    document.getElementById("txt-staterank").value = player.stateRanking;
    document.getElementById("txt-gpa").value = player.gpa;
}

async function addPlayer() {
    let playerName = document.getElementById("txt-add-name").value;
    let playerAge = document.getElementById("txt-add-age").value;
    let playerPosition = document.getElementById("txt-add-position").value;
    let playerBatThrow = document.getElementById("txt-add-bt").value;
    let playerCommitment = document.getElementById("txt-add-commit").value;
    let playerGradYear = document.getElementById("txt-add-gradyear").value;
    let playerNatRank = document.getElementById("txt-add-natrank").value;
    let playerStateRank = document.getElementById("txt-add-staterank").value;
    let playerGpa = document.getElementById("txt-add-gpa").value;

    let player = {"name":playerName, "age":playerAge, "position":playerPosition, "batThrow":playerBatThrow, "commitment":playerCommitment,
        "gradYear":playerGradYear, "nationRanking":playerNatRank, "stateRanking":playerStateRank, "gpa":playerGpa};
    
    let response = await fetch('.././api/players/', {
        method:"POST",
        headers:{
            'Content-Type':'application/json;charset=utf-8',
        },
        body:JSON.stringify(player),
    });

    if(response.status != 200) {
        let span = document.getElementById("notifyType");
        let note = document.getElementById("note");
        note.classList.toggle("active");
        span.classList.toggle("failure");

        setTimeout(function(){
            note.classList.remove("active");
            span.classList.remove("failure");
        }, 3000);
        return;
    } 
    else {
        let span = document.getElementById("notifyType");
        let note = document.getElementById("note");
        note.classList.toggle("active");
        span.classList.toggle("success");

        setTimeout(function() {
            note.classList.remove("active");
            span.classList.remove("success");
        }, 3000);
    }

    let result = await response.json();
    console.log(result);
    displayPlayers();
}