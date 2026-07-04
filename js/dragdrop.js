let dragSeat = null;

document.addEventListener("dragstart", (e) => {

    if (!e.target.classList.contains("seat")) return;

    dragSeat = e.target.dataset.id;

});

document.addEventListener("dragover", (e) => {

    if (!e.target.classList.contains("seat")) return;

    e.preventDefault();

});

document.addEventListener("drop", (e) => {

    if (!e.target.classList.contains("seat")) return;

    e.preventDefault();

    const targetSeat = e.target.dataset.id;

    swapSeat(dragSeat, targetSeat);

});
