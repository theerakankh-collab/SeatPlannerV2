const svg = document.getElementById("room");

const svgNS = "http://www.w3.org/2000/svg";

function rect(x,y,w,h,color){

const r=document.createElementNS(svgNS,"rect");

r.setAttribute("x",x);

r.setAttribute("y",y);

r.setAttribute("width",w);

r.setAttribute("height",h);

r.setAttribute("fill",color);

r.setAttribute("stroke","#333");

r.setAttribute("stroke-width","3");

svg.appendChild(r);

return r;

}

function chair(x,y,id){

const c=document.createElementNS(svgNS,"circle");

c.setAttribute("cx",x);

c.setAttribute("cy",y);

c.setAttribute("r",12);

c.setAttribute("fill","#90CAF9");

c.setAttribute("stroke","#0D47A1");

c.dataset.id=id;

c.classList.add("seat");

svg.appendChild(c);

return c;

}

function drawRoom(){

svg.innerHTML="";

rect(50,50,1500,900,"#ffffff");

/* โต๊ะหัว */

rect(500,80,320,120,"#FFF8E1");

/* โต๊ะกลาง */

rect(650,300,250,500,"#FFF8E1");

/* โต๊ะซ้าย */

rect(170,300,150,150,"#FFF8E1");

rect(170,520,150,150,"#FFF8E1");

rect(170,740,150,150,"#FFF8E1");

/* โต๊ะขวา */

rect(1180,300,150,150,"#FFF8E1");

rect(1180,520,150,150,"#FFF8E1");

rect(1180,740,150,150,"#FFF8E1");

}

drawRoom();
