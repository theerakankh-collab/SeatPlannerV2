/* ==========================================================
   Seat Planner Professional v3.2
   File : js/layout.js
   Part 1 : Create Layout
========================================================== */

"use strict";

const seatMapElement = document.getElementById("seatMap");

/* ==========================================================
   Create Layout
========================================================== */

function createLayout() {

    if (!seatMapElement) {

        console.error("ไม่พบ #seatMap");

        return;

    }

    seatMapElement.innerHTML = "";

    seatLayout = [];

    drawStage();

    createAllZones();

    updateStatistics();

}

/* ==========================================================
   Stage
========================================================== */

function drawStage() {

    const stage = document.createElement("div");

    stage.className = "stage";

    stage.textContent = HALL.stageTitle;

    seatMapElement.appendChild(stage);

}

/* ==========================================================
   Create All Zones
========================================================== */

function createAllZones() {

    LAYOUT.forEach(zone => {

        createZone(zone);

    });

}

/* ==========================================================
   Create Zone
========================================================== */

function createZone(zone) {

    const section = document.createElement("section");

    section.className = "zone";

    section.dataset.zone = zone.code;

    const title = document.createElement("h2");

    title.className = "zone-title";

    title.textContent =
        `${zone.name} (${zone.seats})`;

    section.appendChild(title);

    const row = document.createElement("div");

    row.className = "seat-row";

    row.dataset.zone = zone.code;

    for (let i = 1; i <= zone.seats; i++) {

        row.appendChild(

            createSeat(zone, i)

        );

    }

    section.appendChild(row);

    seatMapElement.appendChild(section);

}

/* ==========================================================
   Create Seat
========================================================== */

function createSeat(zone, number) {

    const seat = document.createElement("div");

    seat.className =
        `seat ${zone.type}`;

    const code =
        seatCode(zone.prefix, number);

    seat.dataset.id = code;

    seat.dataset.zone = zone.code;

    seat.dataset.number = number;

    seat.dataset.locked = "false";

    seat.draggable = true;

    const no = document.createElement("div");

    no.className = "seat-number";

    no.textContent = code;

    const name = document.createElement("div");

    name.className = "seat-name";

    name.textContent = "";

    seat.appendChild(no);

    seat.appendChild(name);

    seatLayout.push({

        id: code,

        zone: zone.code,

        name: "",

        person: null,

        locked: false,

        element: seat

    });

    seat.addEventListener(

        "click",

        () => selectSeat(code)

    );

    seat.addEventListener(

        "dblclick",

        () => toggleLock(code)

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

/* ==========================================================
   Select Seat
========================================================== */

function selectSeat(id) {

    document
        .querySelectorAll(".seat")
        .forEach(seat => {

            seat.classList.remove(

                "selected"

            );

        });

    const obj =
        seatLayout.find(

            x => x.id === id

        );

    if (!obj) return;

    obj.element.classList.add(

        "selected"

    );

    selectedSeat = obj;

}

/* ==========================================================
   Lock Seat
========================================================== */

function toggleLock(id) {

    const obj =
        seatLayout.find(

            x => x.id === id

        );

    if (!obj) return;

    obj.locked = !obj.locked;

    obj.element.dataset.locked =
        obj.locked;

    obj.element.classList.toggle(

        "locked",

        obj.locked

    );

}

/* ==========================================================
   Update Seat Name
========================================================== */

function updateSeatName(id, person) {

    const obj =
        seatLayout.find(

            x => x.id === id

        );

    if (!obj) return;

    obj.person = person;

    obj.name = person?.name || "";

    obj.element.querySelector(

        ".seat-name"

    ).textContent = obj.name;

}

/* ==========================================================
   Clear Layout
========================================================== */

function clearLayout() {

    seatLayout.forEach(seat => {

        seat.person = null;

        seat.name = "";

        seat.locked = false;

        seat.element.classList.remove(

            "locked",

            "selected"

        );

        seat.element.dataset.locked =
            "false";

        seat.element.querySelector(

            ".seat-name"

        ).textContent = "";

    });

}

/* ==========================================================
   Initialize
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        const btn =
            document.getElementById(

                "createLayout"

            );

        if (btn) {

            btn.addEventListener(

                "click",

                createLayout

            );

        }

    }

);

/* ==========================================================
   Seat Planner Professional v3.2
   layout.js
   Part 2 : Render / Statistics / DragDrop
========================================================== */

"use strict";

/* ==========================================================
   Refresh Layout
========================================================== */

function refreshLayout(){

    seatLayout.forEach(seat=>{

        const element=seat.element;

        element.querySelector(".seat-name").textContent=
            seat.name||"";

        if(seat.locked){

            element.classList.add("locked");

        }else{

            element.classList.remove("locked");

        }

    });

    updateStatistics();

}

/* ==========================================================
   Statistics
========================================================== */

function updateStatistics(){

    statistics.totalSeats=seatLayout.length;

    statistics.occupied=
        seatLayout.filter(x=>x.person!=null).length;

    statistics.empty=
        statistics.totalSeats-
        statistics.occupied;

    const total=document.getElementById("totalPeople");

    if(total){

        total.textContent=
            statistics.occupied+" คน";

    }

}

/* ==========================================================
   Find Seat
========================================================== */

function findSeat(id){

    return seatLayout.find(

        seat=>seat.id===id

    );

}

/* ==========================================================
   Find Seat By Person
========================================================== */

function findSeatByPerson(name){

    return seatLayout.find(

        seat=>seat.name===name

    );

}

/* ==========================================================
   Render People
========================================================== */

function renderPeople(){

    if(!people.length)return;

    people.forEach((person,index)=>{

        if(index>=seatLayout.length)return;

        seatLayout[index].person=person;

        seatLayout[index].name=

            person.name||

            person["ชื่อ"]||

            "";

    });

    refreshLayout();

}

/* ==========================================================
   Drag & Drop
========================================================== */

let dragSource=null;

function dragStart(e){

    dragSource=this;

    this.classList.add("dragging");

    e.dataTransfer.effectAllowed="move";

    e.dataTransfer.setData(

        "text/plain",

        this.dataset.id

    );

}

function dragOver(e){

    e.preventDefault();

    this.classList.add("over");

}

function dragEnd(){

    this.classList.remove("dragging");

    document

    .querySelectorAll(".seat")

    .forEach(seat=>{

        seat.classList.remove("over");

    });

}

function dropSeat(e){

    e.preventDefault();

    this.classList.remove("over");

    const fromId=

        e.dataTransfer.getData(

            "text/plain"

        );

    const toId=

        this.dataset.id;

    if(fromId===toId)return;

    swapSeat(fromId,toId);

}

/* ==========================================================
   Swap Seat
========================================================== */

function swapSeat(fromId,toId){

    const from=findSeat(fromId);

    const to=findSeat(toId);

    if(!from||!to)return;

    if(from.locked)return;

    if(to.locked)return;

    const person=from.person;

    const name=from.name;

    from.person=to.person;

    from.name=to.name;

    to.person=person;

    to.name=name;

    refreshLayout();

}

/* ==========================================================
   Highlight Seat
========================================================== */

function highlightSeat(id){

    const seat=findSeat(id);

    if(!seat)return;

    seat.element.classList.add("selected");

    setTimeout(()=>{

        seat.element.classList.remove("selected");

    },2000);

}

/* ==========================================================
   Clear Selection
========================================================== */

function clearSelection(){

    document

    .querySelectorAll(".seat")

    .forEach(seat=>{

        seat.classList.remove(

            "selected"

        );

    });

}

/* ==========================================================
   Reset Layout
========================================================== */

function resetLayout(){

    seatLayout.forEach(seat=>{

        seat.person=null;

        seat.name="";

    });

    refreshLayout();

}

/* ==========================================================
   Export Layout
========================================================== */

function exportLayout(){

    return seatLayout.map(seat=>{

        return{

            seat:seat.id,

            name:seat.name,

            locked:seat.locked

        };

    });

}

/* ==========================================================
   Import Layout
========================================================== */

function importLayout(data){

    data.forEach(item=>{

        const seat=findSeat(item.seat);

        if(!seat)return;

        seat.name=item.name;

        seat.locked=item.locked;

    });

    refreshLayout();

}

/* ==========================================================
   Search Seat
========================================================== */

function searchSeat(keyword){

    clearSelection();

    if(!keyword)return;

    seatLayout.forEach(seat=>{

        if(

            seat.name

            .toLowerCase()

            .includes(

                keyword.toLowerCase()

            )

        ){

            seat.element.classList.add(

                "selected"

            );

        }

    });

}


