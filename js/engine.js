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

/* =========================
   PART 6: RENDER ENGINE
   ========================= */

const Engine = {
  state: {
    seats: [],
    layout: null,
    container: null
  },

  init(containerId, layoutData) {
    this.state.container = document.getElementById(containerId);
    this.state.layout = layoutData;

    this.renderBase();
    this.renderSeats();
  },

  /* -------------------------
     วาดพื้นหลัง / ผังห้อง
  -------------------------- */
  renderBase() {
    const c = this.state.container;
    c.innerHTML = "";

    const base = document.createElement("div");
    base.className = "seat-layout-base";

    base.style.width = this.state.layout.width + "px";
    base.style.height = this.state.layout.height + "px";

    c.appendChild(base);
    this.baseLayer = base;
  },

  /* -------------------------
     วาดที่นั่งทั้งหมด
  -------------------------- */
  renderSeats() {
    const seats = this.state.seats;

    seats.forEach(seat => {
      const el = this.createSeatElement(seat);
      this.baseLayer.appendChild(el);
    });
  },

  /* -------------------------
     สร้าง DOM ที่นั่ง 1 ตัว
  -------------------------- */
  createSeatElement(seat) {
    const el = document.createElement("div");

    el.className = "seat";
    el.id = `seat-${seat.id}`;

    el.innerText = seat.label || seat.id;

    el.style.position = "absolute";
    el.style.left = seat.x + "px";
    el.style.top = seat.y + "px";

    el.dataset.id = seat.id;

    // สีตามประเภท
    if (seat.type === "HEAD") {
      el.classList.add("seat-head");
    } else if (seat.type === "CENTER") {
      el.classList.add("seat-center");
    } else {
      el.classList.add("seat-normal");
    }

    this.attachSeatEvents(el, seat);

    return el;
  },

  /* -------------------------
     event ของที่นั่ง
  -------------------------- */
  attachSeatEvents(el, seat) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    el.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.offsetX;
      offsetY = e.offsetY;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const rect = this.baseLayer.getBoundingClientRect();

      seat.x = e.clientX - rect.left - offsetX;
      seat.y = e.clientY - rect.top - offsetY;

      el.style.left = seat.x + "px";
      el.style.top = seat.y + "px";
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  },

  /* -------------------------
     เพิ่มที่นั่งใหม่
  -------------------------- */
  addSeat(seat) {
    this.state.seats.push(seat);

    const el = this.createSeatElement(seat);
    this.baseLayer.appendChild(el);
  },

  /* -------------------------
     refresh ทั้งหมด
  -------------------------- */
  refresh() {
    this.baseLayer.innerHTML = "";
    this.renderSeats();
  }
};

/* =========================
   PART 7: PRIORITY ENGINE
   ========================= */

const PriorityEngine = {

  /* -------------------------
     กำหนด Priority Rules
  -------------------------- */
  rules: {
    HEADCENTER: 1,   // สูงสุด (A)
    HEAD: 2,
    CENTER: 3,
    B: 4,
    C: 5,
    D: 6,
    E: 7,
    UPPER1: 8        // ตามที่กำหนด
    // UPPER2 ถูกตัดออก
  },

  /* -------------------------
     แปลง type -> priority number
  -------------------------- */
  getPriority(type) {
    return this.rules[type] ?? 999;
  },

  /* -------------------------
     จัดเรียง seats ตาม priority
  -------------------------- */
  sortSeats(seats) {
    return seats.sort((a, b) => {
      const pa = this.getPriority(a.type);
      const pb = this.getPriority(b.type);

      if (pa === pb) {
        // ถ้า priority เท่ากัน ใช้ ID เป็นตัวกันสับสน
        return a.id - b.id;
      }

      return pa - pb;
    });
  },

  /* -------------------------
     จัดกลุ่ม seats ตามประเภท
  -------------------------- */
  groupSeats(seats) {
    const groups = {};

    seats.forEach(seat => {
      const key = seat.type || "UNKNOWN";

      if (!groups[key]) groups[key] = [];
      groups[key].push(seat);
    });

    return groups;
  },

  /* -------------------------
     reassign ลำดับใหม่ (สำคัญมาก)
     ใช้ตอน import Excel หรือ reload
  -------------------------- */
  normalize(seats) {
    const sorted = this.sortSeats(seats);

    let index = 1;

    return sorted.map(seat => {
      return {
        ...seat,
        order: index++
      };
    });
  },

  /* -------------------------
     debug แสดงลำดับ
  -------------------------- */
  print(seats) {
    console.table(
      seats.map(s => ({
        id: s.id,
        type: s.type,
        priority: this.getPriority(s.type),
        order: s.order || "-"
      }))
    );
  }
};

/* =========================
   PART 8: EXCEL IMPORT ENGINE
   ========================= */

const ImportEngine = {

  /* -------------------------
     รับข้อมูลดิบจาก Excel
     (array of objects)
  -------------------------- */
  loadExcelData(excelRows) {
    if (!Array.isArray(excelRows)) {
      console.error("Invalid Excel data");
      return [];
    }

    return excelRows.map((row, index) => ({
      id: row.id || index + 1,
      name: row.name || "",
      role: row.role || "NORMAL",
      type: this.mapType(row.role),
      raw: row
    }));
  },

  /* -------------------------
     map role → seat type
     (แกนหลักของระบบ)
  -------------------------- */
  mapType(role) {
    if (!role) return "CENTER";

    const r = role.toString().toUpperCase().trim();

    switch (r) {
      case "HEADCENTER":
        return "HEADCENTER";

      case "HEAD":
        return "HEAD";

      case "A":
        return "HEADCENTER";

      case "B":
      case "C":
      case "D":
      case "E":
        return r;

      case "UPPER1":
        return "UPPER1";

      // UPPER2 ถูกตัดออก → fallback
      case "UPPER2":
        return "CENTER";

      default:
        return "CENTER";
    }
  },

  /* -------------------------
     merge Excel → Seats
  -------------------------- */
  bindToSeats(excelData, seats) {
    const mapped = this.loadExcelData(excelData);

    return seats.map((seat, index) => {
      const data = mapped[index];

      if (!data) return seat;

      return {
        ...seat,
        label: data.name,
        type: data.type,
        person: data
      };
    });
  },

  /* -------------------------
     auto assign (เต็มระบบ)
     - import Excel
     - sort priority
     - bind seats
  -------------------------- */
  autoAssign(excelRows, seats) {

    // 1. map Excel
    const mapped = this.loadExcelData(excelRows);

    // 2. sort ตาม priority
    const sortedPeople = PriorityEngine.sortSeats(mapped);

    // 3. assign ลง seat
    const updatedSeats = seats.map((seat, i) => {
      const person = sortedPeople[i];

      if (!person) return seat;

      return {
        ...seat,
        label: person.name,
        type: person.type,
        person: person
      };
    });

    return updatedSeats;
  }
};

/* =========================
   PART 9: PERSISTENCE ENGINE
   SAVE / LOAD / EXPORT
   ========================= */

const StorageEngine = {

  /* -------------------------
     KEY หลักของระบบ
  -------------------------- */
  key: "seatplanner_layout_v1",

  /* -------------------------
     SAVE state ทั้งระบบ
  -------------------------- */
  save(state) {
    try {
      const data = {
        seats: state.seats,
        layout: state.layout,
        savedAt: new Date().toISOString()
      };

      localStorage.setItem(this.key, JSON.stringify(data));
      console.log("Layout saved");
    } catch (err) {
      console.error("Save failed", err);
    }
  },

  /* -------------------------
     LOAD state กลับมา
  -------------------------- */
  load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return null;

      const data = JSON.parse(raw);
      return data;
    } catch (err) {
      console.error("Load failed", err);
      return null;
    }
  },

  /* -------------------------
     CLEAR ข้อมูลทั้งหมด
  -------------------------- */
  clear() {
    localStorage.removeItem(this.key);
    console.log("Layout cleared");
  },

  /* -------------------------
     EXPORT เป็น JSON file
  -------------------------- */
  exportJSON(state) {
    const data = {
      seats: state.seats,
      layout: state.layout,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "seat-layout.json";
    a.click();

    URL.revokeObjectURL(url);
  },

  /* -------------------------
     IMPORT JSON file กลับเข้า
  -------------------------- */
  importJSON(file, callback) {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        callback(data);
      } catch (err) {
        console.error("Invalid JSON file", err);
      }
    };

    reader.readAsText(file);
  }
};

/* =========================
   PART 10: STABILIZER ENGINE
   GRID SNAP + COLLISION + AUTO LAYOUT FIX
   ========================= */

const StabilizerEngine = {

  /* -------------------------
     GRID CONFIG
  -------------------------- */
  gridSize: 20,

  /* -------------------------
     SNAP TO GRID
  -------------------------- */
  snap(value) {
    return Math.round(value / this.gridSize) * this.gridSize;
  },

  /* -------------------------
     APPLY SNAP TO SEAT
  -------------------------- */
  snapSeat(seat) {
    seat.x = this.snap(seat.x);
    seat.y = this.snap(seat.y);
    return seat;
  },

  /* -------------------------
     ตรวจการชน (Collision Detection)
     ป้องกันที่นั่งซ้อนกัน
  -------------------------- */
  isColliding(a, b, size = 40) {
    return !(
      a.x + size <= b.x ||
      a.x >= b.x + size ||
      a.y + size <= b.y ||
      a.y >= b.y + size
    );
  },

  /* -------------------------
     แก้ collision อัตโนมัติ
  -------------------------- */
  resolveCollisions(seats, size = 40) {
    for (let i = 0; i < seats.length; i++) {
      for (let j = i + 1; j < seats.length; j++) {
        const a = seats[i];
        const b = seats[j];

        if (this.isColliding(a, b, size)) {
          // เลื่อน b ออกด้านขวา
          b.x += size;
          b.y += size;
        }
      }
    }

    return seats;
  },

  /* -------------------------
     auto layout arrange
     (เรียงเป็นแถวอัตโนมัติ)
  -------------------------- */
  autoLayout(seats, cols = 10, spacing = 60) {
    let x = 0;
    let y = 0;
    let col = 0;

    return seats.map((seat, index) => {

      const newSeat = {
        ...seat,
        x: this.snap(x),
        y: this.snap(y)
      };

      col++;

      if (col >= cols) {
        col = 0;
        x = 0;
        y += spacing;
      } else {
        x += spacing;
      }

      return newSeat;
    });
  },

  /* -------------------------
     stabilize ทั้งระบบ
     (เรียกก่อน render)
  -------------------------- */
  stabilize(seats) {

    // 1. snap ทุกตัว
    let updated = seats.map(s => this.snapSeat(s));

    // 2. fix collision
    updated = this.resolveCollisions(updated);

    return updated;
  }
};

/* =========================
   PART 11: PRINT ENGINE
   A4 / PDF EXPORT SYSTEM
   ========================= */

const PrintEngine = {

  /* -------------------------
     CONFIG A4 (pixels)
     96 DPI approx
  -------------------------- */
  a4: {
    width: 794,
    height: 1123
  },

  /* -------------------------
     PREPARE PRINT LAYOUT
  -------------------------- */
  preparePrint(seats, layout) {

    // scale fit to A4
    const scaleX = this.a4.width / layout.width;
    const scaleY = this.a4.height / layout.height;
    const scale = Math.min(scaleX, scaleY);

    const clonedSeats = seats.map(seat => ({
      ...seat,
      x: seat.x * scale,
      y: seat.y * scale
    }));

    return {
      seats: clonedSeats,
      layout: {
        width: this.a4.width,
        height: this.a4.height
      },
      scale
    };
  },

  /* -------------------------
     OPEN PRINT WINDOW
  -------------------------- */
  openPrintWindow(data) {
    const win = window.open("", "_blank");

    const html = `
      <html>
      <head>
        <title>Seat Layout Print</title>
        <style>
          body {
            margin: 0;
            background: white;
          }
          .page {
            width: ${this.a4.width}px;
            height: ${this.a4.height}px;
            position: relative;
            border: 1px solid #ccc;
          }
          .seat {
            position: absolute;
            width: 40px;
            height: 40px;
            text-align: center;
            line-height: 40px;
            font-size: 10px;
            border: 1px solid #000;
          }
          .seat-head { background: #ffcccc; }
          .seat-center { background: #ccffcc; }
          .seat-normal { background: #ccccff; }
        </style>
      </head>
      <body>
        <div class="page" id="page"></div>

        <script>
          const seats = ${JSON.stringify(data.seats)};

          const page = document.getElementById("page");

          seats.forEach(s => {
            const el = document.createElement("div");
            el.className = "seat";

            if (s.type === "HEAD") el.classList.add("seat-head");
            else if (s.type === "CENTER") el.classList.add("seat-center");
            else el.classList.add("seat-normal");

            el.style.left = s.x + "px";
            el.style.top = s.y + "px";

            el.innerText = s.label || s.id;

            page.appendChild(el);
          });

          window.onload = () => {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    win.document.write(html);
    win.document.close();
  },

  /* -------------------------
     EXPORT HTML FILE (offline print)
  -------------------------- */
  exportHTML(data) {
    const html = `
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Seat Layout Export</title>
        <style>
          body { margin:0; background:#fff; }
          .page {
            width:${this.a4.width}px;
            height:${this.a4.height}px;
            position:relative;
          }
          .seat {
            position:absolute;
            width:40px;
            height:40px;
            text-align:center;
            line-height:40px;
            font-size:10px;
            border:1px solid #000;
          }
        </style>
      </head>
      <body>
        <div class="page">
          ${data.seats.map(s => `
            <div class="seat ${
              s.type === "HEAD" ? "seat-head" :
              s.type === "CENTER" ? "seat-center" : "seat-normal"
            }"
            style="left:${s.x}px;top:${s.y}px;">
              ${s.label || s.id}
            </div>
          `).join("")}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "seat-layout.html";
    a.click();

    URL.revokeObjectURL(url);
  }
};



