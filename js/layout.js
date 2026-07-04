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
