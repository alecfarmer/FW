// Written by James Farmer
window.onload = function() {
    this.displayCoaches();

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
        addCoach();
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

// Display all coaches in database
async function displayCoaches() {
    let response = await fetch('.././api/coaches/');
    let coachesJSON = await response.json();
    let coachesDiv = document.getElementById("player-list");
    coachesDiv.innerHTML = "";
    let i;
    for(i in coachesJSON) {
        let coach = coachesJSON[i];
        coachesDiv.append(getCoachInfo(coach));
    }
}

// Generate coach list
function getCoachInfo(coach) {

    // MAIN DIV
    let mainDiv = document.createElement("div");
    mainDiv.classList.add("player");

    // INFO SECTION
    let infoSection = document.createElement("section");
    infoSection.classList.add("infoSection")
    mainDiv.append(infoSection);

    // TITLE
    let title = document.createElement("h2");
    title.textContent = `${coach.name} - ${coach.tag}`;
    title.classList.add("playertexth2");
    infoSection.append(title);

    // POSITION
    let position = document.createElement("p");
    position.textContent = `Position: ${coach.position}`;
    position.classList.add("playertextp");
    infoSection.append(position);

    // COLLEGE
    let college = document.createElement("p");
    college.textContent = `College: ${coach.college} - ${coach.class}`;
    college.classList.add("playertextp");
    infoSection.append(college);

    // EMAIL
    let email = document.createElement("p");
    email.textContent = `Email: ${coach.email}`;
    email.classList.add("playertextp");
    infoSection.append(email);

    // PHONE
    let phone = document.createElement("p");
    phone.textContent = `Phone #: ${coach.phone}`;
    phone.classList.add("playertextp");
    infoSection.append(phone);

    return mainDiv;
}

// Load coach details from database
async function showCoachDetails(coach) {
    let coachId = coach._id
    let response = await fetch(`.././api/coach/${coachId}`);

    if(response.status != 200) {
        // DISPLAY ERROR
        console.log("Error reciving coach!");
        return;
    }

    coach = await response.json();
    document.getElementById("coach-id").textContent = coachId;
    document.getElementById("txt-name").value = coach.name;
    document.getElementById("txt-tag").value = coach.tag;
    document.getElementById("txt-position").value = coach.position;
    document.getElementById("txt-class").value = coach.class;
    document.getElementById("txt-college").textContent = coach.college;
    document.getElementById("txt-phone").textContent = coach.phone;
    document.getElementById("txt-email").textContent = coach.email;
}


// Adding a coach
async function addCoach() {
    let coachName = document.getElementById("txt-add-name").value;
    let coachTag = document.getElementById("txt-add-tag").value;
    let coachPosition = document.getElementById("txt-add-position").value;
    let coachClass = document.getElementById("txt-add-class").value;
    let coachCollege = document.getElementById("txt-add-college").value;
    let coachPhone = document.getElementById("txt-add-phone").value;
    let coachEmail = document.getElementById("txt-add-email").value;

    let coach = {"name":coachName, "tag":coachTag, "position":coachPosition, "class":coachClass,
        "college":coachCollege, "phone":coachPhone, "email":coachEmail};

    let response = await fetch('.././api/coaches/', {
        method:"POST",
        headers:{
            'Content-Type':'application/json;charset=utf-8',
        },
        body:JSON.stringify(coach),
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
    displayCoaches();
}