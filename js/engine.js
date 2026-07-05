/* =====================================================
   SEAT PLANNER ENGINE v2 (FINAL CLEAN VERSION)
   A–H STRUCTURE + FULL SYSTEM
===================================================== */


/* =========================
   PRIORITY ENGINE
========================= */
const PriorityEngine = {
  rules: {
    HEADCENTER: 1, // A
    LEFT1: 2,      // B
    LEFT2: 3,      // C
    LEFT3: 4,      // D
    RIGHT1: 5,     // E
    RIGHT2: 6,     // F
    RIGHT3: 7,     // G
    UPPER1: 8      // H
  },

  getPriority(type) {
    return this.rules[type] ?? 999;
  },

  sort(seats) {
    return [...seats].sort((a, b) => {
      return this.getPriority(a.type) - this.getPriority(b.type);
    });
  }
};


/* =========================
   IMPORT ENGINE (EXCEL)
========================= */
const ImportEngine = {

  mapType(role) {
    if (!role) return "LEFT1";

    const r = role.toString().toUpperCase().trim();

    if (r.startsWith("A")) return "HEADCENTER";
    if (r.startsWith("B")) return "LEFT1";
    if (r.startsWith("C")) return "LEFT2";
    if (r.startsWith("D")) return "LEFT3";
    if (r.startsWith("E")) return "RIGHT1";
    if (r.startsWith("F")) return "RIGHT2";
    if (r.startsWith("G")) return "RIGHT3";
    if (r.startsWith("H")) return "UPPER1";

    return "LEFT1";
  },

  load(rows) {
    return rows.map((r, i) => ({
      id: r.id || i + 1,
      name: r.name || "",
      type: this.mapType(r.role),
      raw: r
    }));
  },

  autoAssign(excelRows, seats) {
    const people = PriorityEngine.sort(this.load(excelRows));

    return seats.map((seat, i) => {
      const p = people[i];
      if (!p) return seat;

      return {
        ...seat,
        label: p.name,
        type: p.type,
        person: p
      };
    });
  }
};


/* =========================
   STABILIZER ENGINE
========================= */
const StabilizerEngine = {
  grid: 20,

  snap(v) {
    return Math.round(v / this.grid) * this.grid;
  },

  apply(seats) {
    return seats.map(s => ({
      ...s,
      x: this.snap(s.x),
      y: this.snap(s.y)
    }));
  },

  collide(a, b, size = 40) {
    return !(
      a.x + size <= b.x ||
      a.x >= b.x + size ||
      a.y + size <= b.y ||
      a.y >= b.y + size
    );
  },

  resolve(seats, size = 40) {
    for (let i = 0; i < seats.length; i++) {
      for (let j = i + 1; j < seats.length; j++) {
        if (this.collide(seats[i], seats[j], size)) {
          seats[j].x += size;
          seats[j].y += size;
        }
      }
    }
    return seats;
  },

  stabilize(seats) {
    let s = this.apply(seats);
    return this.resolve(s);
  }
};


/* =========================
   PERMISSION ENGINE
========================= */
const PermissionEngine = {
  rules: {
    HEADCENTER: { drag: false, locked: true },
    LEFT1: { drag: true, locked: false },
    LEFT2: { drag: true, locked: false },
    LEFT3: { drag: true, locked: false },
    RIGHT1: { drag: true, locked: false },
    RIGHT2: { drag: true, locked: false },
    RIGHT3: { drag: true, locked: false },
    UPPER1: { drag: true, locked: false }
  },

  canDrag(seat) {
    return this.rules[seat.type]?.drag ?? true;
  },

  applyUI(el, seat) {
    const r = this.rules[seat.type];
    if (!r) return;

    if (r.locked) {
      el.classList.add("seat-locked");
      el.style.cursor = "not-allowed";
    }
  }
};


/* =========================
   STORAGE ENGINE
========================= */
const StorageEngine = {
  key: "seatplanner_a_h_v2",

  save(state) {
    localStorage.setItem(this.key, JSON.stringify(state));
  },

  load() {
    const d = localStorage.getItem(this.key);
    return d ? JSON.parse(d) : null;
  }
};


/* =========================
   PRINT ENGINE
========================= */
const PrintEngine = {
  a4: { width: 794, height: 1123 },

  open(state) {
    const w = window.open("", "_blank");

    const html = `
    <html>
    <head>
      <style>
        body { margin:0; }
        .page {
          width:${this.a4.width}px;
          height:${this.a4.height}px;
          position:relative;
        }
        .seat {
          position:absolute;
          width:40px;
          height:40px;
          border:1px solid #000;
          text-align:center;
          line-height:40px;
          font-size:10px;
        }
        .seat-locked { background:#ffb3b3; }
      </style>
    </head>
    <body>
      <div class="page" id="p"></div>

      <script>
        const seats = ${JSON.stringify(state.seats)};
        const p = document.getElementById("p");

        seats.forEach(s => {
          const el = document.createElement("div");
          el.className = "seat";

          if (s.type === "HEADCENTER") {
            el.classList.add("seat-locked");
          }

          el.style.left = s.x + "px";
          el.style.top = s.y + "px";
          el.innerText = s.label || s.id;

          p.appendChild(el);
        });

        window.onload = () => window.print();
      </script>
    </body>
    </html>
    `;

    w.document.write(html);
    w.document.close();
  }
};


/* =========================
   MAIN ENGINE
========================= */
const Engine = {

  state: {
    seats: [],
    layout: { width: 1200, height: 700 },
    container: null
  },

  init(containerId, layout, seats = []) {
    this.state.container = document.getElementById(containerId);
    this.state.layout = layout;

    const saved = StorageEngine.load();
    this.state.seats = saved?.seats || seats;

    this.render();
  },

  render() {
    const c = this.state.container;
    c.innerHTML = "";

    const base = document.createElement("div");
    base.style.width = this.state.layout.width + "px";
    base.style.height = this.state.layout.height + "px";
    base.style.position = "relative";

    c.appendChild(base);
    this.base = base;

    let seats = StabilizerEngine.stabilize(this.state.seats);

    seats.forEach(seat => {
      const el = document.createElement("div");

      el.className = "seat";
      el.innerText = seat.label || seat.id;

      el.style.position = "absolute";
      el.style.left = seat.x + "px";
      el.style.top = seat.y + "px";

      PermissionEngine.applyUI(el, seat);

      if (PermissionEngine.canDrag(seat)) {
        this.attachDrag(el, seat);
      }

      base.appendChild(el);
    });

    this.state.seats = seats;
  },

  attachDrag(el, seat) {
    let dragging = false;
    let ox = 0, oy = 0;

    el.addEventListener("mousedown", (e) => {
      if (!PermissionEngine.canDrag(seat)) return;

      dragging = true;
      ox = e.offsetX;
      oy = e.offsetY;
    });

    document.addEventListener("mousemove", (e) => {
      if (!dragging) return;

      const r = this.base.getBoundingClientRect();

      seat.x = e.clientX - r.left - ox;
      seat.y = e.clientY - r.top - oy;

      el.style.left = seat.x + "px";
      el.style.top = seat.y + "px";
    });

    document.addEventListener("mouseup", () => {
      dragging = false;
      StorageEngine.save(this.state);
    });
  },

  importExcel(rows) {
    this.state.seats = ImportEngine.autoAssign(rows, this.state.seats);
    this.render();
  },

  save() {
    StorageEngine.save(this.state);
  },

  print() {
    PrintEngine.open(this.state);
  }
};


/* =========================
   AUTO GENERATOR A–H
========================= */
function generateSeats() {
  const zones = [
    ["HEADCENTER", 17],
    ["LEFT1", 8],
    ["LEFT2", 8],
    ["LEFT3", 8],
    ["RIGHT1", 8],
    ["RIGHT2", 8],
    ["RIGHT3", 8],
    ["UPPER1", 8]
  ];

  const seats = [];
  let id = 1;

  zones.forEach(([type, count], row) => {
    for (let i = 1; i <= count; i++) {
      seats.push({
        id: id++,
        label: `${type}-${String(i).padStart(2, "0")}`,
        type,
        x: i * 60,
        y: row * 70
      });
    }
  });

  return seats;
}
