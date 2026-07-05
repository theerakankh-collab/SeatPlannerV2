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

