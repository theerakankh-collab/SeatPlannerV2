const viewport=document.getElementById("viewport");

let scale=1;

let panX=0;

let panY=0;

let drag=false;

let startX=0;

let startY=0;

function updateView(){

viewport.setAttribute(

"transform",

`translate(${panX},${panY}) scale(${scale})`

);

}

room.addEventListener("wheel",e=>{

e.preventDefault();

scale+=e.deltaY*-0.001;

scale=Math.min(Math.max(.5,scale),4);

updateView();

});

room.addEventListener("mousedown",e=>{

drag=true;

startX=e.clientX-panX;

startY=e.clientY-panY;

});

window.addEventListener("mouseup",()=>{

drag=false;

});

window.addEventListener("mousemove",e=>{

if(!drag)return;

panX=e.clientX-startX;

panY=e.clientY-startY;

updateView();

});

room.addEventListener("touchstart",e=>{

drag=true;

startX=e.touches[0].clientX-panX;

startY=e.touches[0].clientY-panY;

});

room.addEventListener("touchmove",e=>{

if(!drag)return;

panX=e.touches[0].clientX-startX;

panY=e.touches[0].clientY-startY;

updateView();

});

room.addEventListener("touchend",()=>{

drag=false;

});

updateView();
