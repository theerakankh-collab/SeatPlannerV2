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
