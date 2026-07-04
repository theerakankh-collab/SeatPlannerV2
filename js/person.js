let people=[];

async function loadPeople(){

    const res=await fetch("data/person.json");

    people=await res.json();

    renderPeople();

}

function renderPeople(){

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
