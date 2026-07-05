/*
==========================================
SeatPlanner V2
Engine
==========================================
*/

let layout = null;

/*
==========================================
โหลด Layout
==========================================
*/

async function loadLayout() {

    try {

        const response = await fetch("data/layout.json");

        if (!response.ok) {
            throw new Error("ไม่พบไฟล์ layout.json");
        }

        layout = await response.json();

        console.log("Layout Loaded");

    } catch (err) {

        console.error(err);

        alert("โหลดผังห้องไม่สำเร็จ");

    }

}

/*
==========================================
คืนค่าลำดับที่นั่งทั้งหมด
==========================================
*/

function getSeatOrder() {

    if (!layout || !layout.tables) {

        return [];

    }

    const order = [];

    layout.tables
        .sort((a, b) => a.priority - b.priority)
        .forEach(table => {

            table.seats.forEach(seat => {

                order.push(seat);

            });

        });

    return order;

}

/*
==========================================
จำนวนที่นั่งทั้งหมด
==========================================
*/

function totalSeat() {

    return getSeatOrder().length;

}

/*
==========================================
ค้นหาที่นั่ง
==========================================
*/

function findSeat(id) {

    const order = getSeatOrder();

    return order.find(seat => seat === id);

}

/*
==========================================
ล้างการจัดที่นั่ง
==========================================
*/

function clearSeat() {

    if (!people) return;

    people.forEach(person => {

        person.seat = null;

    });

    if (typeof renderPeople === "function") {

        renderPeople();

    }

}

/*
==========================================
รีโหลดผัง
==========================================
*/

async function reloadLayout() {

    await loadLayout();

}

/*
==========================================
เริ่มต้นระบบ
==========================================
*/

window.addEventListener("load", async () => {

    await loadLayout();

    console.log("SeatPlanner Engine Ready");

    console.log("Total Seat :", totalSeat());

});

/*==========================================================
 Seat Planner Professional v4.0
 engine.js
 Part 1 : Engine Core
==========================================================*/

"use strict";

/*==========================================================
 Engine
==========================================================*/

const Engine={

    version:"4.0",

    ready:false,

    running:false,

    people:[],

    seats:[],

    result:[],

    history:[],

    priority:[],

    statistics:{}

};


/*==========================================================
 Initialize
==========================================================*/

function initializeEngine(){

    Engine.people=[];

    Engine.seats=[];

    Engine.result=[];

    Engine.history=[];

    Engine.priority=[];

    Engine.statistics={

        totalPeople:0,

        totalSeat:0,

        assigned:0,

        unassigned:0

    };

    Engine.ready=true;

}


/*==========================================================
 Load Data
==========================================================*/

function loadPeople(data){

    Engine.people=[...data];

    Engine.statistics.totalPeople=

        Engine.people.length;

}


function loadSeat(){

    Engine.seats=

        SeatAPI.getAll();

    Engine.statistics.totalSeat=

        Engine.seats.length;

}


/*==========================================================
 Reset
==========================================================*/

function resetEngine(){

    Engine.result=[];

    Engine.history=[];

    Engine.running=false;

}


/*==========================================================
 Ready
==========================================================*/

function engineReady(){

    return

        Engine.ready;

}


/*==========================================================
 Start
==========================================================*/

function startEngine(){

    if(

        !Engine.ready

    ){

        initializeEngine();

    }

    loadSeat();

    loadPeople(

        people

    );

    Engine.running=true;

}


/*==========================================================
 Stop
==========================================================*/

function stopEngine(){

    Engine.running=false;

}


/*==========================================================
 Status
==========================================================*/

function engineStatus(){

    return{

        ready:

        Engine.ready,

        running:

        Engine.running,

        people:

        Engine.people.length,

        seat:

        Engine.seats.length,

        assigned:

        Engine.statistics.assigned

    };

}


/*==========================================================
 History
==========================================================*/

function pushHistory(data){

    Engine.history.push(data);

}


function clearHistoryEngine(){

    Engine.history=[];

}


/*==========================================================
 Logger
==========================================================*/

function log(message){

    if(APP.debug){

        console.log(

            "[ENGINE]",

            message

        );

    }

}


/*==========================================================
 Initialize
==========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

initializeEngine();

log("Engine Ready");

}

);

/*==========================================================
 Seat Planner Professional v4.0
 engine.js
 Part 2 : Priority Manager
==========================================================*/

/*==========================================================
 Priority Definition
==========================================================*/

const PRIORITY_ORDER=[

    "A",   // HeadCenter
    "B",   // Left1
    "C",   // Left2
    "D",   // Left3
    "E",   // Right1
    "F",   // Right2
    "G",   // Right3
    "H"    // Upper1

];


/*==========================================================
 Build Priority List
==========================================================*/

function buildPriority(){

    Engine.priority=[];

    PRIORITY_ORDER.forEach(zone=>{

        const seats=

            SeatAPI.getZone(zone);

        seats.forEach(seat=>{

            Engine.priority.push(seat);

        });

    });

}


/*==========================================================
 Priority Seat Count
==========================================================*/

function priorityCount(){

    return Engine.priority.length;

}


/*==========================================================
 Get Priority Seat
==========================================================*/

function getPrioritySeat(index){

    if(index<0) return null;

    if(index>=Engine.priority.length)

        return null;

    return Engine.priority[index];

}


/*==========================================================
 Get Next Empty Seat
==========================================================*/

function nextPrioritySeat(){

    for(const seat of Engine.priority){

        if(

            !seat.locked &&

            seat.person==null

        ){

            return seat;

        }

    }

    return null;

}


/*==========================================================
 Get Zone Priority
==========================================================*/

function getZonePriority(zone){

    return PRIORITY_ORDER.indexOf(zone)+1;

}


/*==========================================================
 Sort By Priority
==========================================================*/

function sortSeatPriority(){

    Engine.seats.sort((a,b)=>{

        const pa=

            getZonePriority(a.zone);

        const pb=

            getZonePriority(b.zone);

        if(pa!==pb){

            return pa-pb;

        }

        return a.number-b.number;

    });

}


/*==========================================================
 Priority Summary
==========================================================*/

function prioritySummary(){

    return PRIORITY_ORDER.map(zone=>{

        const seats=

            Engine.seats.filter(

                s=>s.zone===zone

            );

        return{

            zone:zone,

            total:seats.length,

            empty:seats.filter(

                s=>!s.person

            ).length,

            locked:seats.filter(

                s=>s.locked

            ).length

        };

    });

}


/*==========================================================
 Refresh Priority
==========================================================*/

function refreshPriority(){

    loadSeat();

    sortSeatPriority();

    buildPriority();

}


/*==========================================================
 Initialize Priority
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        refreshPriority();

        log("Priority Ready");

    }

);


