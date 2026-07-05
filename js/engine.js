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

/*==========================================================
 Seat Planner Professional v4.0
 engine.js
 Part 3 : Zone Manager
==========================================================*/

/*==========================================================
 Zone Definition
==========================================================*/

const ZONES = {

    A: {
        code: "A",
        name: "HeadCenter",
        priority: 1
    },

    B: {
        code: "B",
        name: "Left1",
        priority: 2
    },

    C: {
        code: "C",
        name: "Left2",
        priority: 3
    },

    D: {
        code: "D",
        name: "Left3",
        priority: 4
    },

    E: {
        code: "E",
        name: "Right1",
        priority: 5
    },

    F: {
        code: "F",
        name: "Right2",
        priority: 6
    },

    G: {
        code: "G",
        name: "Right3",
        priority: 7
    },

    H: {
        code: "H",
        name: "Upper1",
        priority: 8
    }

};


/*==========================================================
 Get Zone
==========================================================*/

function getZone(code){

    return ZONES[code] || null;

}


/*==========================================================
 Get Seats By Zone
==========================================================*/

function getSeatsByZone(code){

    return Engine.seats.filter(

        seat => seat.zone === code

    );

}


/*==========================================================
 Empty Seats
==========================================================*/

function getEmptySeatsByZone(code){

    return getSeatsByZone(code).filter(

        seat =>

        !seat.locked &&

        seat.person == null

    );

}


/*==========================================================
 Occupied Seats
==========================================================*/

function getOccupiedSeatsByZone(code){

    return getSeatsByZone(code).filter(

        seat =>

        seat.person != null

    );

}


/*==========================================================
 Locked Seats
==========================================================*/

function getLockedSeatsByZone(code){

    return getSeatsByZone(code).filter(

        seat =>

        seat.locked

    );

}


/*==========================================================
 Next Seat
==========================================================*/

function getNextSeat(zone){

    const list = getEmptySeatsByZone(zone);

    if(list.length===0){

        return null;

    }

    return list[0];

}


/*==========================================================
 Zone Capacity
==========================================================*/

function zoneCapacity(zone){

    return getSeatsByZone(zone).length;

}


/*==========================================================
 Zone Summary
==========================================================*/

function zoneSummary(){

    return Object.keys(ZONES).map(code=>{

        return{

            code,

            name:ZONES[code].name,

            priority:ZONES[code].priority,

            total:getSeatsByZone(code).length,

            occupied:getOccupiedSeatsByZone(code).length,

            empty:getEmptySeatsByZone(code).length,

            locked:getLockedSeatsByZone(code).length

        };

    });

}


/*==========================================================
 Refresh Zone
==========================================================*/

function refreshZone(){

    refreshPriority();

}


/*==========================================================
 Zone API
==========================================================*/

Engine.zone={

    get:getZone,

    seats:getSeatsByZone,

    empty:getEmptySeatsByZone,

    occupied:getOccupiedSeatsByZone,

    locked:getLockedSeatsByZone,

    next:getNextSeat,

    capacity:zoneCapacity,

    summary:zoneSummary,

    refresh:refreshZone

};


/*==========================================================
 Zone Ready
==========================================================*/

log("Zone Manager Ready");

/*==========================================================
 Seat Planner Professional v4.0
 engine.js
 Part 4 : Auto Seat Algorithm
==========================================================*/

/*==========================================================
 Auto Seat
==========================================================*/

function autoSeat(){

    if(!Engine.running){

        startEngine();

    }

    refreshPriority();

    Engine.result=[];

    SeatAPI.clear();

    log("Auto Seat Start");

    assignPriority();

    finishAssign();

}


/*==========================================================
 Assign Priority
==========================================================*/

function assignPriority(){

    Engine.people.forEach(person=>{

        assignPerson(person);

    });

}


/*==========================================================
 Assign Person
==========================================================*/

function assignPerson(person){

    const seat=findSeat(person);

    if(!seat){

        Engine.result.push({

            person,

            status:"UNASSIGNED"

        });

        return;

    }

    SeatAPI.assign(

        seat.id,

        person

    );

    Engine.result.push({

        person,

        seat:seat.id,

        status:"ASSIGNED"

    });

}


/*==========================================================
 Find Seat
==========================================================*/

function findSeat(person){

    const zones=PRIORITY_ORDER;

    for(const zone of zones){

        const seat=

            Engine.zone.next(zone);

        if(seat){

            return seat;

        }

    }

    return null;

}


/*==========================================================
 Finish
==========================================================*/

function finishAssign(){

    Engine.statistics.assigned=

        Engine.result.filter(

            r=>r.status==="ASSIGNED"

        ).length;

    Engine.statistics.unassigned=

        Engine.result.filter(

            r=>r.status==="UNASSIGNED"

        ).length;

    SeatAPI.refresh();

    log("Auto Seat Finish");

}


/*==========================================================
 Result
==========================================================*/

function getResult(){

    return Engine.result;

}


/*==========================================================
 Assigned Count
==========================================================*/

function assignedCount(){

    return Engine.statistics.assigned;

}


/*==========================================================
 Unassigned Count
==========================================================*/

function unassignedCount(){

    return Engine.statistics.unassigned;

}


/*==========================================================
 Reset Result
==========================================================*/

function clearResult(){

    Engine.result=[];

}


/*==========================================================
 Button
==========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

const btn=

document.getElementById(

"btnAuto"

);

if(btn){

btn.addEventListener(

"click",

autoSeat

);

}

}

);


