document.addEventListener("click",function(e){

    if(!e.target.classList.contains("seat")) return;

    document.querySelectorAll(".seat").forEach(s=>{

        s.classList.remove("selected");

    });

    e.target.classList.add("selected");

    const id=e.target.dataset.id;

    const person=people.find(p=>p.seat===id);

    if(person){

        document.getElementById("seatInfo").innerHTML=`

            <h2>${person.name}</h2>

            <hr>

            <p><b>ที่นั่ง :</b> ${person.seat}</p>

            <p><b>ตำแหน่ง :</b> ${person.position}</p>

            <p><b>หน่วยงาน :</b> ${person.department}</p>

        `;

    }else{

        document.getElementById("seatInfo").innerHTML=`

        <h2>${id}</h2>

        <p>ยังไม่มีผู้เข้าร่วม</p>

        `;

    }

});
