/*
====================================
Seat Renderer
====================================
*/

function clearSeatLabels() {

    document.querySelectorAll(".seat-name").forEach(el => el.remove());

}

function renderSeatNames() {

    clearSeatLabels();

    if (!people) return;

    people.forEach(person => {

        if (!person.seat) return;

        const seat = document.querySelector(
            `[data-id="${person.seat}"]`
        );

        if (!seat) return;

        const x = Number(seat.getAttribute("cx"));
        const y = Number(seat.getAttribute("cy"));

        const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        text.setAttribute("x", x);

        text.setAttribute("y", y + 28);

        text.setAttribute("class", "seat-name");

        text.setAttribute("text-anchor", "middle");

        text.setAttribute("font-size", "11");

        text.setAttribute("fill", "#222");

        text.textContent = person.name;

        viewport.appendChild(text);

    });

}

