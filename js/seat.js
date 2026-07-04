document.addEventListener("click",function(e){

    if(!e.target.classList.contains("seat")) return;

    document.querySelectorAll(".seat").forEach(s=>{

        s.setAttribute("fill","#90CAF9");

    });

    e.target.setAttribute("fill","#FF9800");

    document.getElementById("seatInfo").innerHTML=`

        <h3>${e.target.dataset.id}</h3>

        <p>ยังไม่มีผู้เข้าร่วม</p>

    `;

});
