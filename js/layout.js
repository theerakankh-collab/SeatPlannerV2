/*==========================================================
  Seat Planner Professional v3.2
  layout.js
==========================================================*/

"use strict";

/*==========================================================
 Global
==========================================================*/

const seatMapElement =
document.getElementById("seatMap");

let seatLayout=[];

let selectedSeat=null;

let dragSeat=null;


/*==========================================================
 Initialize
==========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

initializeLayout();

}

);


/*==========================================================
 Initialize Layout
==========================================================*/

function initializeLayout(){

const btnCreate=

document.getElementById(

"createLayout"

);

if(btnCreate){

btnCreate.addEventListener(

"click",

createLayout

);

}

}


/*==========================================================
 Create Layout
==========================================================*/

function createLayout(){

if(!seatMapElement){

console.error(

"#seatMap not found"

);

return;

}

seatLayout=[];

seatMapElement.innerHTML="";

drawStage();

buildLayout();

updateStatistics();

}


/*==========================================================
 Stage
==========================================================*/

function drawStage(){

const stage=

document.createElement("div");

stage.className="stage";

stage.innerHTML=

`

<div class="stage-title">

${HALL.stageTitle}

</div>

`;

seatMapElement.appendChild(

stage

);

}


/*==========================================================
 Build Layout
==========================================================*/

function buildLayout(){

buildHeadCenter();

buildMainArea();

buildUpper();

}


/*==========================================================
 HeadCenter
==========================================================*/

function buildHeadCenter(){

const zone=

LAYOUT.find(

z=>z.code==="A"

);

if(!zone)return;

const wrapper=

document.createElement("section");

wrapper.className=

"head-wrapper";

const title=

document.createElement("h2");

title.className=

"zone-title";

title.textContent=

zone.name;

wrapper.appendChild(title);

const row=

document.createElement("div");

row.className=

"head-row";

for(

let i=1;

i<=zone.seats;

i++

){

row.appendChild(

createSeat(

zone,

i

)

);

}

wrapper.appendChild(row);

seatMapElement.appendChild(

wrapper

);

}


/*==========================================================
 Main Area
==========================================================*/

function buildMainArea(){

const main=

document.createElement("div");

main.className=

"main-layout";

const left=

buildLeft();

const walkway=

buildWalkway();

const right=

buildRight();

main.appendChild(left);

main.appendChild(walkway);

main.appendChild(right);

seatMapElement.appendChild(

main

);

}


/*==========================================================
 Walkway
==========================================================*/

function buildWalkway(){

const div=

document.createElement("div");

div.className=

"walkway";

div.innerHTML=

`

<div>

ทางเดิน

</div>

`;

return div;

}

/*==========================================================
  Part 2 : Left / Right / Upper / Seat
==========================================================*/

/*==========================================================
 Left Zone
==========================================================*/

function buildLeft(){

    const left=document.createElement("div");

    left.className="left-layout";

    ["B","C","D"].forEach(code=>{

        const zone=

        LAYOUT.find(

            z=>z.code===code

        );

        if(zone){

            left.appendChild(

                buildZone(zone)

            );

        }

    });

    return left;

}


/*==========================================================
 Right Zone
==========================================================*/

function buildRight(){

    const right=document.createElement("div");

    right.className="right-layout";

    ["E","F","G"].forEach(code=>{

        const zone=

        LAYOUT.find(

            z=>z.code===code

        );

        if(zone){

            right.appendChild(

                buildZone(zone)

            );

        }

    });

    return right;

}


/*==========================================================
 Upper Zone
==========================================================*/

function buildUpper(){

    const zone=

    LAYOUT.find(

        z=>z.code==="H"

    );

    if(!zone)return;

    const wrapper=

    document.createElement("section");

    wrapper.className="upper-wrapper";

    const title=

    document.createElement("h2");

    title.className="zone-title";

    title.textContent=zone.name;

    wrapper.appendChild(title);

    const row=

    document.createElement("div");

    row.className="upper-row";

    for(let i=1;i<=zone.seats;i++){

        row.appendChild(

            createSeat(

                zone,

                i

            )

        );

    }

    wrapper.appendChild(row);

    seatMapElement.appendChild(

        wrapper

    );

}


/*==========================================================
 Build Zone
==========================================================*/

function buildZone(zone){

    const card=

    document.createElement("div");

    card.className="zone-card";

    const title=

    document.createElement("div");

    title.className="table-name";

    title.textContent=zone.name;

    card.appendChild(title);

    const row=

    document.createElement("div");

    row.className="seat-row";

    for(let i=1;i<=zone.seats;i++){

        row.appendChild(

            createSeat(

                zone,

                i

            )

        );

    }

    card.appendChild(row);

    return card;

}


/*==========================================================
 Create Seat
==========================================================*/

function createSeat(zone,number){

    const seat=

    document.createElement("div");

    seat.className=

        "seat "+zone.type;

    const code=

        seatCode(

            zone.prefix,

            number

        );

    seat.dataset.id=code;

    seat.dataset.zone=zone.code;

    seat.dataset.number=number;

    seat.draggable=true;

    const no=

    document.createElement("div");

    no.className="seat-number";

    no.textContent=code;

    const name=

    document.createElement("div");

    name.className="seat-name";

    name.textContent="";

    seat.appendChild(no);

    seat.appendChild(name);

    const item={

        id:code,

        zone:zone.code,

        number:number,

        person:null,

        name:"",

        locked:false,

        element:seat

    };

    seatLayout.push(item);

    seat.addEventListener(

        "click",

        ()=>selectSeat(code)

    );

    seat.addEventListener(

        "dblclick",

        ()=>toggleLock(code)

    );

    seat.addEventListener(

        "dragstart",

        dragStart

    );

    seat.addEventListener(

        "dragover",

        dragOver

    );

    seat.addEventListener(

        "drop",

        dropSeat

    );

    seat.addEventListener(

        "dragend",

        dragEnd

    );

    return seat;

}


/*==========================================================
 Seat Utility
==========================================================*/

function getSeat(id){

    return seatLayout.find(

        seat=>seat.id===id

    );

}


function getSeatByName(name){

    return seatLayout.find(

        seat=>seat.name===name

    );

}


function getZoneSeats(zone){

    return seatLayout.filter(

        seat=>seat.zone===zone

    );

}


function clearSeat(){

    seatLayout.forEach(seat=>{

        seat.person=null;

        seat.name="";

        seat.locked=false;

        seat.element

        .querySelector(

            ".seat-name"

        ).textContent="";

        seat.element.classList.remove(

            "locked",

            "selected"

        );

    });

}


/*==========================================================
 Refresh
==========================================================*/

function refreshLayout(){

    seatLayout.forEach(seat=>{

        seat.element

        .querySelector(

            ".seat-name"

        ).textContent=

            seat.name;

        seat.element.classList.toggle(

            "locked",

            seat.locked

        );

    });

}

