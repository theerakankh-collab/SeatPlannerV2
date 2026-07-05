/*==========================================================
 Seat Planner Professional v4.0 (Unified & Fixed)
 engine.js - Core Engine
==========================================================*/

"use strict";

// สเตตัสและโครงสร้างข้อมูลหลักของระบบ
const Engine = {
    version: "4.0",
    ready: false,
    running: false,
    people: [],
    seats: [],
    result: [],
    history: [],
    priority: [],
    statistics: {},
    zone: {}          // ลงทะเบียน Zone API ไว้ที่นี่
};

// ข้อมูลจำลองสำหรับตัวแปรภายนอก (Mock/Fallback ในกรณีที่ไม่มี Object เหล่านี้จากภายนอก)
const SeatAPI = window.SeatAPI || {
    getAll: () => [],
    getZone: (zone) => [],
    clear: () => {},
    assign: (seatId, person) => {},
    refresh: () => {}
};
const APP = window.APP || { debug: true };

/*==========================================================
 Part 1 : Engine Core & Initialization
==========================================================*/

function initializeEngine() {
    Engine.people = [];
    Engine.seats = [];
    Engine.result = [];
    Engine.history = [];
    Engine.priority = [];
    Engine.statistics = {
        totalPeople: 0,
        totalSeat: 0,
        assigned: 0,
        unassigned: 0
    };
    Engine.ready = true;
}

function loadPeople(data) {
    if (Array.isArray(data)) {
        Engine.people = [...data];
        Engine.statistics.totalPeople = Engine.people.length;
    }
}

function loadSeat() {
    Engine.seats = SeatAPI.getAll() || [];
    Engine.statistics.totalSeat = Engine.seats.length;
}

function resetEngine() {
    Engine.result = [];
    Engine.history = [];
    Engine.running = false;
}

function engineReady() {
    return Engine.ready; // แก้ไข: นำขึ้นมาบรรทัดเดียวกันเพื่อป้องกัน Automatic Semicolon Insertion
}

function startEngine(customPeopleData = []) {
    if (!Engine.ready) {
        initializeEngine();
    }
    loadSeat();
    
    // ตรวจสอบข้อมูลผู้เข้าร่วม: ถ้ามีข้อมูลส่งเข้ามาให้ใช้ หากไม่มีให้ใช้ข้อมูลเดิมใน Engine
    if (customPeopleData && customPeopleData.length > 0) {
        loadPeople(customPeopleData);
    } else if (window.people) {
        loadPeople(window.people);
    }
    
    Engine.running = true;
}

function stopEngine() {
    Engine.running = false;
}

function engineStatus() {
    return {
        ready: Engine.ready,
        running: Engine.running,
        people: Engine.people.length,
        seat: Engine.seats.length,
        assigned: Engine.statistics.assigned
    };
}

function pushHistory(data) {
    Engine.history.push(data);
}

function clearHistoryEngine() {
    Engine.history = [];
}

function log(message) {
    if (APP.debug) {
        console.log("[ENGINE]", message);
    }
}

function clearSeat() {
    if (!Engine.people) return;
    Engine.people.forEach(person => {
        person.seat = null;
    });
    if (typeof window.renderPeople === "function") {
        window.renderPeople();
    }
}

/*==========================================================
 Part 2 : Priority Manager
==========================================================*/

const PRIORITY_ORDER = ["A", "B", "C", "D", "E", "F", "G", "H"];

const PRIORITY_ZONE = {
    1 : ["A"],
    2 : ["A", "B"],
    3 : ["A", "B", "C"],
    4 : ["A", "B", "C", "D"],
    5 : ["E", "F"],
    6 : ["F", "G"],
    7 : ["G", "H"],
    8 : ["H"]
};

function buildPriority() {
    Engine.priority = [];
    PRIORITY_ORDER.forEach(zone => {
        const seats = SeatAPI.getZone(zone) || [];
        seats.forEach(seat => {
            Engine.priority.push(seat);
        });
    });
}

function priorityCount() {
    return Engine.priority.length;
}

function getPrioritySeat(index) {
    if (index < 0 || index >= Engine.priority.length) return null;
    return Engine.priority[index];
}

function nextPrioritySeat() {
    for (const seat of Engine.priority) {
        if (!seat.locked && seat.person === null) {
            return seat;
        }
    }
    return null;
}

function getZonePriority(zone) {
    return PRIORITY_ORDER.indexOf(zone) + 1;
}

function sortSeatPriority() {
    Engine.seats.sort((a, b) => {
        const pa = getZonePriority(a.zone);
        const pb = getZonePriority(b.zone);
        if (pa !== pb) return pa - pb;
        return (a.number || 0) - (b.number || 0);
    });
}

function prioritySummary() {
    return PRIORITY_ORDER.map(zone => {
        const seats = Engine.seats.filter(s => s.zone === zone);
        return {
            zone: zone,
            total: seats.length,
            empty: seats.filter(s => s.person === null || !s.person).length,
            locked: seats.filter(s => s.locked).length
        };
    });
}

function refreshPriority() {
    loadSeat();
    sortSeatPriority();
    buildPriority();
}

/*==========================================================
 Part 3 : Zone Manager
==========================================================*/

const ZONES = {
    A: { code: "A", name: "HeadCenter", priority: 1 },
    B: { code: "B", name: "Left1", priority: 2 },
    C: { code: "C", name: "Left2", priority: 3 },
    D: { code: "D", name: "Left3", priority: 4 },
    E: { code: "E", name: "Right1", priority: 5 },
    F: { code: "F", name: "Right2", priority: 6 },
    G: { code: "G", name: "Right3", priority: 7 },
    H: { code: "H", name: "Upper1", priority: 8 }
};

function getZone(code) {
    return ZONES[code] || null;
}

function getSeatsByZone(code) {
    return Engine.seats.filter(seat => seat.zone === code);
}

function getEmptySeatsByZone(code) {
    return getSeatsByZone(code).filter(seat => !seat.locked && (seat.person === null || !seat.person));
}

function getOccupiedSeatsByZone(code) {
    return getSeatsByZone(code).filter(seat => seat.person !== null && seat.person);
}

function getLockedSeatsByZone(code) {
    return getSeatsByZone(code).filter(seat => seat.locked);
}

function getNextSeat(zone) {
    const list = getEmptySeatsByZone(zone);
    return list.length === 0 ? null : list[0];
}

function zoneCapacity(zone) {
    return getSeatsByZone(zone).length;
}

function zoneSummary() {
    return Object.keys(ZONES).map(code => {
        return {
            code,
            name: ZONES[code].name,
            priority: ZONES[code].priority,
            total: getSeatsByZone(code).length,
            occupied: getOccupiedSeatsByZone(code).length,
            empty: getEmptySeatsByZone(code).length,
            locked: getLockedSeatsByZone(code).length
        };
    });
}

// ผูกฟังก์ชันเข้ากับสเปซของ Engine.zone
Engine.zone = {
    get: getZone,
    seats: getSeatsByZone,
    empty: getEmptySeatsByZone,
    occupied: getOccupiedSeatsByZone,
    locked: getLockedSeatsByZone,
    next: getNextSeat,
    capacity: zoneCapacity,
    summary: zoneSummary,
    refresh: refreshPriority
};

/*==========================================================
 Part 4 : Auto Seat Algorithm & Core Runner
==========================================================*/

function getPersonPriority(person) {
    if (person.pri !== undefined && person.pri !== null) return Number(person.pri);
    if (person.priority !== undefined && person.priority !== null) return Number(person.priority);
    return 8; // Default priority ต่ำสุด
}

function sortPeopleByPriority() {
    Engine.people.sort((a, b) => getPersonPriority(a) - getPersonPriority(b));
}

function findSeatForPerson(person) {
    // เลือกหาที่นั่งตามผัง Priority ของตัวบุคคลก่อน
    const pri = getPersonPriority(person);
    const zones = PRIORITY_ZONE[pri] || ["H"];
    
    for (const zone of zones) {
        const seat = Engine.zone.next(zone);
        if (seat) return seat;
    }
    
    // Fallback: หากไม่เจอโซนตาม Priority ให้ไล่หาโซนทั่วไปที่ยังว่างอยู่
    for (const zone of PRIORITY_ORDER) {
        const seat = Engine.zone.next(zone);
        if (seat) return seat;
    }
    return null;
}

function autoSeat() {
    if (!Engine.running) {
        startEngine();
    }
    refreshPriority();
    Engine.result = [];
    SeatAPI.clear();

    log("Auto Seat Start");
    
    // เรียงลำดับความสำคัญของคนก่อนจัดที่นั่ง
    sortPeopleByPriority();

    Engine.people.forEach(person => {
        const seat = findSeatForPerson(person);
        if (!seat) {
            Engine.result.push({
                person,
                seat: null,
                status: "UNASSIGNED"
            });
            return;
        }

        SeatAPI.assign(seat.id, person);
        Engine.result.push({
            person,
            seat: seat.id,
            status: "ASSIGNED"
        });
    });

    finishAssign();
}

function finishAssign() {
    Engine.statistics.assigned = Engine.result.filter(r => r.status === "ASSIGNED").length;
    Engine.statistics.unassigned = Engine.result.filter(r => r.status === "UNASSIGNED").length;
    SeatAPI.refresh();
    log("Auto Seat Finish");
}

/*==========================================================
 Part 5 : Priority Assignment Engine Extensions
==========================================================*/

function priorityStatistic() {
    const stat = {};
    Engine.people.forEach(person => {
        const pri = getPersonPriority(person);
        stat[pri] = (stat[pri] || 0) + 1;
    });
    return stat;
}

function checkPriorityOverflow() {
    return Engine.result.filter(r => r.status === "UNASSIGNED" || r.status === "WAIT").length;
}

// ผูก Engine Extensions API
Engine.priorityEngine = {
    run: autoSeat,
    sort: sortPeopleByPriority,
    statistic: priorityStatistic,
    overflow: checkPriorityOverflow
};

/*==========================================================
 DOM Event Listeners (Application Bootstrap)
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {
    initializeEngine();
    refreshPriority();
    log("Engine & Priority Systems Ready");

    const btn = document.getElementById("btnAuto");
    if (btn) {
        btn.addEventListener("click", autoSeat);
    }
});
