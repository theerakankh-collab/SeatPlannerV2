/* ==========================================================
   Seat Planner Professional v3.2
   File : js/config.js
========================================================== */

"use strict";

/* ==========================================================
   Application
========================================================== */

const APP = {

    name: "Seat Planner Professional",

    version: "3.2",

    language: "th",

    debug: false,

    autoSave: true,

    autoSaveInterval: 30000

};

/* ==========================================================
   Hall
========================================================== */

const HALL = {

    title: "Seat Planner",

    stageTitle: "เวที",

    seatWidth: 70,

    seatHeight: 70,

    seatGap: 12,

    rowGap: 28,

    walkway: 60

};

/* ==========================================================
   Layout Order
========================================================== */

const LAYOUT = [

    {
        id:1,
        code:"A",
        name:"HeadCenter",
        prefix:"A",
        seats:17,
        type:"head",
        color:"#FFD54F"
    },

    {
        id:2,
        code:"B",
        name:"Left1",
        prefix:"B",
        seats:8,
        type:"left",
        color:"#81C784"
    },

    {
        id:3,
        code:"C",
        name:"Left2",
        prefix:"C",
        seats:8,
        type:"left",
        color:"#66BB6A"
    },

    {
        id:4,
        code:"D",
        name:"Left3",
        prefix:"D",
        seats:8,
        type:"left",
        color:"#43A047"
    },

    {
        id:5,
        code:"E",
        name:"Right1",
        prefix:"E",
        seats:8,
        type:"right",
        color:"#64B5F6"
    },

    {
        id:6,
        code:"F",
        name:"Right2",
        prefix:"F",
        seats:8,
        type:"right",
        color:"#42A5F5"
    },

    {
        id:7,
        code:"G",
        name:"Right3",
        prefix:"G",
        seats:8,
        type:"right",
        color:"#1E88E5"
    },

    {
        id:8,
        code:"H",
        name:"Upper1",
        prefix:"H",
        seats:8,
        type:"upper",
        color:"#BA68C8"
    }

];

/* ==========================================================
   Priority
========================================================== */

const PRIORITY = {

    HeadCenter:1,

    Left1:2,

    Left2:3,

    Left3:4,

    Right1:5,

    Right2:6,

    Right3:7,

    Upper1:8

};

/* ==========================================================
   Seat Status
========================================================== */

const STATUS = {

    EMPTY:"empty",

    OCCUPIED:"occupied",

    LOCKED:"locked",

    RESERVED:"reserved"

};

/* ==========================================================
   CSS Class
========================================================== */

const CLASS = {

    head:"head",

    left:"left",

    right:"right",

    upper:"upper",

    seat:"seat",

    empty:"empty",

    selected:"selected",

    locked:"locked"

};

/* ==========================================================
   Color
========================================================== */

const COLORS = {

    head:"#FFD54F",

    left:"#81C784",

    right:"#64B5F6",

    upper:"#BA68C8",

    empty:"#ECEFF1",

    locked:"#EF5350"

};

/* ==========================================================
   Excel Column
========================================================== */

const EXCEL = {

    id:"ลำดับ",

    name:"ชื่อ",

    unit:"หน่วย",

    position:"ตำแหน่ง",

    remark:"หมายเหตุ"

};

/* ==========================================================
   Storage
========================================================== */

const STORAGE = {

    PEOPLE:"seatplanner_people",

    PROJECT:"seatplanner_project",

    LAYOUT:"seatplanner_layout",

    HISTORY:"seatplanner_history"

};

/* ==========================================================
   Auto Seat
========================================================== */

const AUTO = {

    random:false,

    skipLocked:true,

    fillDirection:"LTR",

    autoSort:true,

    startZone:"HeadCenter"

};

/* ==========================================================
   Print
========================================================== */

const PRINT = {

    paper:"A4",

    orientation:"landscape",

    margin:10,

    showHeader:true,

    showFooter:true,

    showLegend:true

};

/* ==========================================================
   Dashboard
========================================================== */

const DASHBOARD = {

    refresh:1000,

    animation:true

};

/* ==========================================================
   Export
========================================================== */

const EXPORT = {

    excel:true,

    pdf:true,

    image:true

};

/* ==========================================================
   Global Variables
========================================================== */

let people = [];

let seatLayout = [];

let seatMap = [];

let selectedSeat = null;

let selectedPerson = null;

let history = [];

let redoHistory = [];

let statistics = {

    totalPeople:0,

    totalSeats:0,

    occupied:0,

    empty:0

};

/* ==========================================================
   Utility
========================================================== */

function seatCode(prefix, number){

    return prefix +
        String(number).padStart(2,"0");

}

function getZone(code){

    return LAYOUT.find(item=>item.code===code);

}

function getSeatCount(){

    return LAYOUT.reduce(

        (sum,item)=>sum+item.seats,

        0

    );

}

function getAllSeatCodes(){

    const result=[];

    LAYOUT.forEach(zone=>{

        for(let i=1;i<=zone.seats;i++){

            result.push(

                seatCode(zone.prefix,i)

            );

        }

    });

    return result;

}

/* ==========================================================
   Freeze Config
========================================================== */

Object.freeze(APP);
Object.freeze(HALL);
Object.freeze(LAYOUT);
Object.freeze(PRIORITY);
Object.freeze(STATUS);
Object.freeze(CLASS);
Object.freeze(COLORS);
Object.freeze(EXCEL);
Object.freeze(STORAGE);
Object.freeze(AUTO);
Object.freeze(PRINT);
Object.freeze(DASHBOARD);
Object.freeze(EXPORT);
