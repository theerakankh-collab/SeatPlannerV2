const svg = document.getElementById("room");

const viewport = document.getElementById("viewport");

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

viewport.appendChild(r);

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

const svg = document.getElementById("room");
const svgNS = "http://www.w3.org/2000/svg";

const seats = [];

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

}

function chair(x,y,id){

    const c=document.createElementNS(svgNS,"circle");

    c.setAttribute("cx",x);

    c.setAttribute("cy",y);

    c.setAttribute("r",13);

    c.setAttribute("fill","#90CAF9");

    c.setAttribute("stroke","#1565C0");

    c.setAttribute("stroke-width","2");

    c.dataset.id=id;

    c.classList.add("seat");

    svg.appendChild(c);

    seats.push({

        id:id,

        x:x,

        y:y,

        person:null

    });

}

function drawTable(x,y,w,h){

    rect(x,y,w,h,"#FFF8E1");

}

function headTable(){

    drawTable(500,80,320,120);

    let n=1;

    for(let i=0;i<4;i++){

        chair(540+i*70,55,"A0"+n++);

    }

    chair(475,140,"A0"+n++);

    chair(845,140,"A0"+n++);

    for(let i=0;i<4;i++){

        chair(540+i*70,225,"A"+String(n++).padStart(2,"0"));

    }

}

function centerTable(){

    drawTable(650,300,250,500);

    chair(775,270,"B01");

    let n=2;

    for(let i=0;i<8;i++){

        chair(620,340+i*55,"B"+String(n++).padStart(2,"0"));

    }

    for(let i=0;i<8;i++){

        chair(930,340+i*55,"B"+String(n++).padStart(2,"0"));

    }

}

function smallTable(x,y,prefix){

    drawTable(x,y,150,150);

    let n=1;

    chair(x+40,y-25,prefix+n++);

    chair(x+110,y-25,prefix+n++);

    chair(x-25,y+45,prefix+n++);

    chair(x-25,y+105,prefix+n++);

    chair(x+175,y+45,prefix+n++);

    chair(x+175,y+105,prefix+n++);

    chair(x+40,y+175,prefix+n++);

    chair(x+110,y+175,prefix+n++);

}

function drawRoom(){

    svg.innerHTML="";

    rect(50,50,1500,900,"white");

    headTable();

    centerTable();

    smallTable(170,300,"C");

    smallTable(170,520,"D");

    smallTable(170,740,"E");

    smallTable(1180,300,"F");

    smallTable(1180,520,"G");

    smallTable(1180,740,"H");

}

drawRoom();

