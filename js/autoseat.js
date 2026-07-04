let seatOrder = [];

/*
    สร้างลำดับที่นั่งจาก layout
*/
function buildSeatOrder() {

    seatOrder = [];

    if (!layout || !layout.tables) return;

    layout.tables
        .sort((a, b) => a.priority - b.priority)
        .forEach(table => {

            table.seats.forEach(seat => {

                seatOrder.push(seat);

            });

        });

}

/*
    จัดที่นั่งอัตโนมัติ
*/
async function autoSeat() {

    if (people.length === 0) {

        alert("กรุณา Import Excel ก่อน");

        return;

    }

    if (!layout) {

        await loadLayout();

    }

    buildSeatOrder();

    people.forEach((person, index) => {

        person.seat = seatOrder[index] || null;

    });

    renderPeople();

    renderPersonList();

    alert("จัดที่นั่งเรียบร้อย");

}

