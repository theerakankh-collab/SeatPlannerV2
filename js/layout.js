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
