let people=[];

async function loadPeople(){

    const res=await fetch("data/person.json");

    people=await res.json();

    renderPeople();
    renderSeatNames();
}

function renderPeople(){

    document.querySelectorAll(".seat").forEach(seat=>{

        seat.setAttribute("fill","#90CAF9");

    });

    people.forEach(person=>{

        const seat=document.querySelector(

            `[data-id="${person.seat}"]`

        );

        if(!seat) return;

        switch(person.type){

            case "president":

                seat.setAttribute("fill","#F44336");

            break;

            case "vip":

                seat.setAttribute("fill","#FFC107");

            break;

            default:

                seat.setAttribute("fill","#4CAF50");

        }

    });

}

loadPeople();

const list=document.getElementById("personList");

people.forEach(person=>{

    const div=document.createElement("div");

    div.className="personItem";

    div.innerHTML=`

        <b>${person.name}</b><br>

        ${person.position}

    `;

    div.onclick=()=>{

        document.querySelector(

        `[data-id="${person.seat}"]`

        ).dispatchEvent(

            new MouseEvent("click")

        );

    };

    list.appendChild(div);

});

function renderPersonList(){

    const list=document.getElementById("personList");

    list.innerHTML="";

    people.forEach(person=>{

        const div=document.createElement("div");

        div.className="personItem";

        div.innerHTML=`

        <b>${person.name}</b>

        <br>

        ${person.position}

        `;

        list.appendChild(div);

    });

}

function renderPeople() {

    document.querySelectorAll(".seat").forEach(seat => {

        seat.setAttribute("fill", "#90CAF9");

    });

    people.forEach(person => {

        if (!person.seat) return;

        const seat = document.querySelector(
            `[data-id="${person.seat}"]`
        );

        if (!seat) return;

        switch (person.type) {

            case "president":
                seat.setAttribute("fill", "#E53935");
                break;

            case "vip":
                seat.setAttribute("fill", "#FBC02D");
                break;

            default:
                seat.setAttribute("fill", "#43A047");
        }

    });

}

