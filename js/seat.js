document.addEventListener("click",function(e){

if(e.target.classList.contains("seat")){

document.getElementById("seatInfo").innerHTML=

"รหัสที่นั่ง : "+e.target.dataset.id;

}

});
