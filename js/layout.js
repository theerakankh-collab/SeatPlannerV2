/*==========================================================
  Seat Planner Professional v3.2
  layout.js
==========================================================*/

"use strict";

/*==========================================================
 Global
==========================================================*/

const seatMapElement =
document.getElementById("seatMap");

let seatLayout=[];

let selectedSeat=null;

let dragSeat=null;


/*==========================================================
 Initialize
==========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

initializeLayout();

}

);


/*==========================================================
 Initialize Layout
==========================================================*/

function initializeLayout(){

const btnCreate=

document.getElementById(

"createLayout"

);

if(btnCreate){

btnCreate.addEventListener(

"click",

createLayout

);

}

}


/*==========================================================
 Create Layout
==========================================================*/

function createLayout(){

if(!seatMapElement){

console.error(

"#seatMap not found"

);

return;

}

seatLayout=[];

seatMapElement.innerHTML="";

drawStage();

buildLayout();

updateStatistics();

}


/*==========================================================
 Stage
==========================================================*/

function drawStage(){

const stage=

document.createElement("div");

stage.className="stage";

stage.innerHTML=

`

<div class="stage-title">

${HALL.stageTitle}

</div>

`;

seatMapElement.appendChild(

stage

);

}


/*==========================================================
 Build Layout
==========================================================*/

function buildLayout(){

buildHeadCenter();

buildMainArea();

buildUpper();

}


/*==========================================================
 HeadCenter
==========================================================*/

function buildHeadCenter(){

const zone=

LAYOUT.find(

z=>z.code==="A"

);

if(!zone)return;

const wrapper=

document.createElement("section");

wrapper.className=

"head-wrapper";

const title=

document.createElement("h2");

title.className=

"zone-title";

title.textContent=

zone.name;

wrapper.appendChild(title);

const row=

document.createElement("div");

row.className=

"head-row";

for(

let i=1;

i<=zone.seats;

i++

){

row.appendChild(

createSeat(

zone,

i

)

);

}

wrapper.appendChild(row);

seatMapElement.appendChild(

wrapper

);

}


/*==========================================================
 Main Area
==========================================================*/

function buildMainArea(){

const main=

document.createElement("div");

main.className=

"main-layout";

const left=

buildLeft();

const walkway=

buildWalkway();

const right=

buildRight();

main.appendChild(left);

main.appendChild(walkway);

main.appendChild(right);

seatMapElement.appendChild(

main

);

}


/*==========================================================
 Walkway
==========================================================*/

function buildWalkway(){

const div=

document.createElement("div");

div.className=

"walkway";

div.innerHTML=

`

<div>

ทางเดิน

</div>

`;

return div;

}

/*==========================================================
  Part 2 : Left / Right / Upper / Seat
==========================================================*/

/*==========================================================
 Left Zone
==========================================================*/

function buildLeft(){

    const left=document.createElement("div");

    left.className="left-layout";

    ["B","C","D"].forEach(code=>{

        const zone=

        LAYOUT.find(

            z=>z.code===code

        );

        if(zone){

            left.appendChild(

                buildZone(zone)

            );

        }

    });

    return left;

}


/*==========================================================
 Right Zone
==========================================================*/

function buildRight(){

    const right=document.createElement("div");

    right.className="right-layout";

    ["E","F","G"].forEach(code=>{

        const zone=

        LAYOUT.find(

            z=>z.code===code

        );

        if(zone){

            right.appendChild(

                buildZone(zone)

            );

        }

    });

    return right;

}


/*==========================================================
 Upper Zone
==========================================================*/

function buildUpper(){

    const zone=

    LAYOUT.find(

        z=>z.code==="H"

    );

    if(!zone)return;

    const wrapper=

    document.createElement("section");

    wrapper.className="upper-wrapper";

    const title=

    document.createElement("h2");

    title.className="zone-title";

    title.textContent=zone.name;

    wrapper.appendChild(title);

    const row=

    document.createElement("div");

    row.className="upper-row";

    for(let i=1;i<=zone.seats;i++){

        row.appendChild(

            createSeat(

                zone,

                i

            )

        );

    }

    wrapper.appendChild(row);

    seatMapElement.appendChild(

        wrapper

    );

}


/*==========================================================
 Build Zone
==========================================================*/

function buildZone(zone){

    const card=

    document.createElement("div");

    card.className="zone-card";

    const title=

    document.createElement("div");

    title.className="table-name";

    title.textContent=zone.name;

    card.appendChild(title);

    const row=

    document.createElement("div");

    row.className="seat-row";

    for(let i=1;i<=zone.seats;i++){

        row.appendChild(

            createSeat(

                zone,

                i

            )

        );

    }

    card.appendChild(row);

    return card;

}


/*==========================================================
 Create Seat
==========================================================*/

function createSeat(zone,number){

    const seat=

    document.createElement("div");

    seat.className=

        "seat "+zone.type;

    const code=

        seatCode(

            zone.prefix,

            number

        );

    seat.dataset.id=code;

    seat.dataset.zone=zone.code;

    seat.dataset.number=number;

    seat.draggable=true;

    const no=

    document.createElement("div");

    no.className="seat-number";

    no.textContent=code;

    const name=

    document.createElement("div");

    name.className="seat-name";

    name.textContent="";

    seat.appendChild(no);

    seat.appendChild(name);

    const item={

        id:code,

        zone:zone.code,

        number:number,

        person:null,

        name:"",

        locked:false,

        element:seat

    };

    seatLayout.push(item);

    seat.addEventListener(

        "click",

        ()=>selectSeat(code)

    );

    seat.addEventListener(

        "dblclick",

        ()=>toggleLock(code)

    );

    seat.addEventListener(

        "dragstart",

        dragStart

    );

    seat.addEventListener(

        "dragover",

        dragOver

    );

    seat.addEventListener(

        "drop",

        dropSeat

    );

    seat.addEventListener(

        "dragend",

        dragEnd

    );

    return seat;

}


/*==========================================================
 Seat Utility
==========================================================*/

function getSeat(id){

    return seatLayout.find(

        seat=>seat.id===id

    );

}


function getSeatByName(name){

    return seatLayout.find(

        seat=>seat.name===name

    );

}


function getZoneSeats(zone){

    return seatLayout.filter(

        seat=>seat.zone===zone

    );

}


function clearSeat(){

    seatLayout.forEach(seat=>{

        seat.person=null;

        seat.name="";

        seat.locked=false;

        seat.element

        .querySelector(

            ".seat-name"

        ).textContent="";

        seat.element.classList.remove(

            "locked",

            "selected"

        );

    });

}


/*==========================================================
 Refresh
==========================================================*/

function refreshLayout(){

    seatLayout.forEach(seat=>{

        seat.element

        .querySelector(

            ".seat-name"

        ).textContent=

            seat.name;

        seat.element.classList.toggle(

            "locked",

            seat.locked

        );

    });

}

/*==========================================================
  Part 3 : Seat Management
==========================================================*/

/*==========================================================
 Select Seat
==========================================================*/

function selectSeat(id){

    clearSelection();

    const seat=getSeat(id);

    if(!seat)return;

    selectedSeat=seat;

    seat.element.classList.add("selected");

}

/*==========================================================
 Clear Selection
==========================================================*/

function clearSelection(){

    document
    .querySelectorAll(".seat")
    .forEach(item=>{

        item.classList.remove("selected");

    });

    selectedSeat=null;

}

/*==========================================================
 Toggle Lock
==========================================================*/

function toggleLock(id){

    const seat=getSeat(id);

    if(!seat)return;

    seat.locked=!seat.locked;

    seat.element.classList.toggle(

        "locked",

        seat.locked

    );

}

/*==========================================================
 Lock Seat
==========================================================*/

function lockSeat(id){

    const seat=getSeat(id);

    if(!seat)return;

    seat.locked=true;

    seat.element.classList.add(

        "locked"

    );

}

/*==========================================================
 Unlock Seat
==========================================================*/

function unlockSeat(id){

    const seat=getSeat(id);

    if(!seat)return;

    seat.locked=false;

    seat.element.classList.remove(

        "locked"

    );

}

/*==========================================================
 Update Seat
==========================================================*/

function updateSeat(id,person){

    const seat=getSeat(id);

    if(!seat)return;

    seat.person=person;

    seat.name=

        person?.name ||

        person?.["ชื่อ"] ||

        "";

    seat.element
        .querySelector(".seat-name")
        .textContent=

        seat.name;

}

/*==========================================================
 Remove Person
==========================================================*/

function removePerson(id){

    const seat=getSeat(id);

    if(!seat)return;

    seat.person=null;

    seat.name="";

    seat.element
        .querySelector(".seat-name")
        .textContent="";

}

/*==========================================================
 Empty Seat
==========================================================*/

function emptySeat(id){

    removePerson(id);

}

/*==========================================================
 Get Empty Seats
==========================================================*/

function getEmptySeats(){

    return seatLayout.filter(

        seat=>seat.person==null

    );

}

/*==========================================================
 Get Occupied Seats
==========================================================*/

function getOccupiedSeats(){

    return seatLayout.filter(

        seat=>seat.person!=null

    );

}

/*==========================================================
 Statistics
==========================================================*/

function updateStatistics(){

    statistics.totalSeats=

        seatLayout.length;

    statistics.occupied=

        getOccupiedSeats().length;

    statistics.empty=

        getEmptySeats().length;

    statistics.totalPeople=

        people.length;

    const total=

        document.getElementById(

            "totalPeople"

        );

    if(total){

        total.textContent=

        statistics.totalPeople+

        " คน";

    }

}

/*==========================================================
 Highlight
==========================================================*/

function highlightSeat(id){

    const seat=getSeat(id);

    if(!seat)return;

    seat.element.classList.add(

        "selected"

    );

    setTimeout(()=>{

        seat.element.classList.remove(

            "selected"

        );

    },1500);

}

/*==========================================================
 Search Seat
==========================================================*/

function searchSeat(keyword){

    clearSelection();

    if(!keyword)return;

    keyword=

    keyword.toLowerCase();

    seatLayout.forEach(seat=>{

        if(

            seat.name

            .toLowerCase()

            .includes(keyword)

        ){

            seat.element.classList.add(

                "selected"

            );

        }

    });

}

/*==========================================================
 Render People
==========================================================*/

function renderPeople(){

    clearSeat();

    people.forEach((person,index)=>{

        if(index>=seatLayout.length)

            return;

        updateSeat(

            seatLayout[index].id,

            person

        );

    });

    updateStatistics();

}

/*==========================================================
 Get Seat Index
==========================================================*/

function getSeatIndex(id){

    return seatLayout.findIndex(

        seat=>seat.id===id

    );

}

/*==========================================================
 Get All Seat
==========================================================*/

function getAllSeats(){

    return seatLayout;

}

/*==========================================================
 Get Locked Seats
==========================================================*/

function getLockedSeats(){

    return seatLayout.filter(

        seat=>seat.locked

    );

}

/*==========================================================
 Get Available Seats
==========================================================*/

function getAvailableSeats(){

    return seatLayout.filter(

        seat=>

        !seat.locked &&

        seat.person==null

    );

}

/*==========================================================
  Part 4A : Drag & Drop
==========================================================*/

/*==========================================================
 Drag Start
==========================================================*/

function dragStart(e){

    dragSeat=this.dataset.id;

    this.classList.add("dragging");

    e.dataTransfer.effectAllowed="move";

    e.dataTransfer.setData(

        "text/plain",

        dragSeat

    );

}

/*==========================================================
 Drag Over
==========================================================*/

function dragOver(e){

    e.preventDefault();

    this.classList.add("drag-over");

}

/*==========================================================
 Drag Leave
==========================================================*/

function dragLeave(){

    this.classList.remove(

        "drag-over"

    );

}

/*==========================================================
 Drag End
==========================================================*/

function dragEnd(){

    document

    .querySelectorAll(".seat")

    .forEach(item=>{

        item.classList.remove(

            "dragging",

            "drag-over"

        );

    });

}

/*==========================================================
 Drop
==========================================================*/

function dropSeat(e){

    e.preventDefault();

    this.classList.remove(

        "drag-over"

    );

    const targetId=

        this.dataset.id;

    if(

        !dragSeat ||

        dragSeat===targetId

    ){

        return;

    }

    swapSeat(

        dragSeat,

        targetId

    );

}

/*==========================================================
 Swap Seat
==========================================================*/

function swapSeat(fromId,toId){

    const from=

        getSeat(fromId);

    const to=

        getSeat(toId);

    if(

        !from ||

        !to

    ){

        return;

    }

    if(

        from.locked ||

        to.locked

    ){

        alert(

        "มีที่นั่งถูกล็อก"

        );

        return;

    }

    saveHistory();

    const tempPerson=

        from.person;

    const tempName=

        from.name;

    from.person=

        to.person;

    from.name=

        to.name;

    to.person=

        tempPerson;

    to.name=

        tempName;

    refreshLayout();

}

/*==========================================================
 Move Person
==========================================================*/

function movePerson(

    fromId,

    toId

){

    const from=

        getSeat(fromId);

    const to=

        getSeat(toId);

    if(

        !from ||

        !to

    ){

        return;

    }

    if(to.person){

        alert(

        "ปลายทางไม่ว่าง"

        );

        return;

    }

    saveHistory();

    to.person=

        from.person;

    to.name=

        from.name;

    from.person=null;

    from.name="";

    refreshLayout();

}

/*==========================================================
 Copy Person
==========================================================*/

function copyPerson(

    fromId,

    toId

){

    const from=

        getSeat(fromId);

    const to=

        getSeat(toId);

    if(

        !from ||

        !to

    ){

        return;

    }

    saveHistory();

    to.person=

        from.person;

    to.name=

        from.name;

    refreshLayout();

}

/*==========================================================
 Exchange Zone
==========================================================*/

function swapZone(

    zone1,

    zone2

){

    const left=

        getZoneSeats(zone1);

    const right=

        getZoneSeats(zone2);

    const count=

        Math.min(

            left.length,

            right.length

        );

    saveHistory();

    for(

        let i=0;

        i<count;

        i++

    ){

        const p=

            left[i].person;

        const n=

            left[i].name;

        left[i].person=

            right[i].person;

        left[i].name=

            right[i].name;

        right[i].person=p;

        right[i].name=n;

    }

    refreshLayout();

}

/*==========================================================
 Refresh Seat Display
==========================================================*/

function refreshSeat(

    seat

){

    if(!seat)return;

    seat.element

    .querySelector(

        ".seat-name"

    ).textContent=

        seat.name;

}

/*==========================================================
 Refresh All Seat
==========================================================*/

function refreshAllSeats(){

    seatLayout.forEach(

        refreshSeat

    );

    updateStatistics();

}

/*==========================================================
  Part 4B : History / Undo / Redo
==========================================================*/

/*==========================================================
 Save History
==========================================================*/

function saveHistory(){

    const snapshot = seatLayout.map(seat => ({

        id: seat.id,

        person: seat.person,

        name: seat.name,

        locked: seat.locked

    }));

    history.push(snapshot);

    if(history.length > 50){

        history.shift();

    }

    redoHistory = [];

}

/*==========================================================
 Restore History
==========================================================*/

function restoreHistory(snapshot){

    if(!snapshot) return;

    snapshot.forEach(item=>{

        const seat = getSeat(item.id);

        if(!seat) return;

        seat.person = item.person;
        seat.name = item.name;
        seat.locked = item.locked;

    });

    refreshLayout();

}

/*==========================================================
 Undo
==========================================================*/

function undo(){

    if(history.length===0){

        return;

    }

    const current = seatLayout.map(seat=>({

        id:seat.id,

        person:seat.person,

        name:seat.name,

        locked:seat.locked

    }));

    redoHistory.push(current);

    const previous = history.pop();

    restoreHistory(previous);

}

/*==========================================================
 Redo
==========================================================*/

function redo(){

    if(redoHistory.length===0){

        return;

    }

    const current = seatLayout.map(seat=>({

        id:seat.id,

        person:seat.person,

        name:seat.name,

        locked:seat.locked

    }));

    history.push(current);

    const next = redoHistory.pop();

    restoreHistory(next);

}

/*==========================================================
 Clear History
==========================================================*/

function clearHistory(){

    history=[];

    redoHistory=[];

}

/*==========================================================
 Keyboard Shortcut
==========================================================*/

document.addEventListener("keydown",function(e){

    if(e.ctrlKey && e.key.toLowerCase()==="z"){

        e.preventDefault();

        undo();

    }

    if(e.ctrlKey && e.key.toLowerCase()==="y"){

        e.preventDefault();

        redo();

    }

});

/*==========================================================
 Auto Save History
==========================================================*/

function autoSaveHistory(){

    if(!APP.autoSave){

        return;

    }

    localStorage.setItem(

        STORAGE.HISTORY,

        JSON.stringify(history)

    );

}

/*==========================================================
 Load History
==========================================================*/

function loadHistory(){

    const json=

        localStorage.getItem(

            STORAGE.HISTORY

        );

    if(!json){

        return;

    }

    history=

        JSON.parse(json);

}

/*==========================================================
 Reset History
==========================================================*/

function resetHistory(){

    history=[];

    redoHistory=[];

    autoSaveHistory();

}

/*==========================================================
 History Count
==========================================================*/

function historyCount(){

    return history.length;

}

/*==========================================================
  Part 4C : Multi Select / Context Menu / Keyboard
==========================================================*/

let selectedSeats = [];

/*==========================================================
 Multi Select
==========================================================*/

function multiSelectSeat(id){

    const seat = getSeat(id);

    if(!seat) return;

    if(selectedSeats.includes(id)){

        selectedSeats = selectedSeats.filter(

            item => item !== id

        );

        seat.element.classList.remove(

            "selected"

        );

    }else{

        selectedSeats.push(id);

        seat.element.classList.add(

            "selected"

        );

    }

}


/*==========================================================
 Clear Multi Select
==========================================================*/

function clearMultiSelect(){

    selectedSeats.forEach(id=>{

        const seat=getSeat(id);

        if(seat){

            seat.element.classList.remove(

                "selected"

            );

        }

    });

    selectedSeats=[];

}


/*==========================================================
 Lock Selected
==========================================================*/

function lockSelected(){

    selectedSeats.forEach(id=>{

        lockSeat(id);

    });

}


/*==========================================================
 Unlock Selected
==========================================================*/

function unlockSelected(){

    selectedSeats.forEach(id=>{

        unlockSeat(id);

    });

}


/*==========================================================
 Delete Selected
==========================================================*/

function deleteSelected(){

    saveHistory();

    selectedSeats.forEach(id=>{

        removePerson(id);

    });

    clearMultiSelect();

    refreshLayout();

}


/*==========================================================
 Copy Selected
==========================================================*/

let clipboard=[];

function copySelected(){

    clipboard=[];

    selectedSeats.forEach(id=>{

        const seat=getSeat(id);

        if(seat){

            clipboard.push({

                person:seat.person,

                name:seat.name

            });

        }

    });

}


/*==========================================================
 Paste Selected
==========================================================*/

function pasteSelected(){

    if(!clipboard.length)return;

    saveHistory();

    selectedSeats.forEach((id,index)=>{

        if(index>=clipboard.length)return;

        const seat=getSeat(id);

        if(!seat)return;

        seat.person=

            clipboard[index].person;

        seat.name=

            clipboard[index].name;

    });

    refreshLayout();

}


/*==========================================================
 Keyboard
==========================================================*/

document.addEventListener(

"keydown",

function(e){

    if(e.key==="Delete"){

        deleteSelected();

    }

    if(e.ctrlKey &&

       e.key.toLowerCase()==="c"){

        copySelected();

    }

    if(e.ctrlKey &&

       e.key.toLowerCase()==="v"){

        pasteSelected();

    }

}

);


/*==========================================================
 Context Menu
==========================================================*/

document.addEventListener(

"contextmenu",

function(e){

    const seat=

    e.target.closest(".seat");

    if(!seat)return;

    e.preventDefault();

    selectSeat(

        seat.dataset.id

    );

    const cmd=

    prompt(

`1 Lock
2 Unlock
3 Delete`

    );

    switch(cmd){

        case "1":

            lockSeat(

                seat.dataset.id

            );

            break;

        case "2":

            unlockSeat(

                seat.dataset.id

            );

            break;

        case "3":

            removePerson(

                seat.dataset.id

            );

            break;

    }

    refreshLayout();

}


/*==========================================================
 Shift Select
==========================================================*/

document.addEventListener(

"click",

function(e){

    const seat=

    e.target.closest(".seat");

    if(!seat)return;

    if(event.shiftKey){

        multiSelectSeat(

            seat.dataset.id

        );

    }

}


/*==========================================================
 Auto Refresh
==========================================================*/

setInterval(

function(){

    refreshLayout();

},

1000

);

/*==========================================================
  Part 5 : Project / Save / Load
==========================================================*/

/*==========================================================
 Save Layout
==========================================================*/

function saveLayout(){

    const data = seatLayout.map(seat=>({

        id:seat.id,

        zone:seat.zone,

        number:seat.number,

        name:seat.name,

        person:seat.person,

        locked:seat.locked

    }));

    localStorage.setItem(

        STORAGE.LAYOUT,

        JSON.stringify(data)

    );

}

/*==========================================================
 Load Layout
==========================================================*/

function loadLayout(){

    const json=

        localStorage.getItem(

            STORAGE.LAYOUT

        );

    if(!json){

        return false;

    }

    const data=

        JSON.parse(json);

    data.forEach(item=>{

        const seat=getSeat(item.id);

        if(!seat)return;

        seat.person=item.person;

        seat.name=item.name;

        seat.locked=item.locked;

    });

    refreshLayout();

    return true;

}

/*==========================================================
 Save Project
==========================================================*/

function saveProject(){

    const project={

        version:APP.version,

        date:new Date().toISOString(),

        people:people,

        layout:seatLayout.map(seat=>({

            id:seat.id,

            person:seat.person,

            name:seat.name,

            locked:seat.locked

        }))

    };

    localStorage.setItem(

        STORAGE.PROJECT,

        JSON.stringify(project)

    );

    alert("บันทึกโครงการเรียบร้อย");

}

/*==========================================================
 Load Project
==========================================================*/

function loadProject(){

    const json=

        localStorage.getItem(

            STORAGE.PROJECT

        );

    if(!json){

        alert("ไม่พบ Project");

        return;

    }

    const project=

        JSON.parse(json);

    people=

        project.people||[];

    project.layout.forEach(item=>{

        const seat=

        getSeat(item.id);

        if(!seat)return;

        seat.person=item.person;

        seat.name=item.name;

        seat.locked=item.locked;

    });

    refreshLayout();

    updateStatistics();

}

/*==========================================================
 Export JSON
==========================================================*/

function exportProject(){

    const blob=new Blob(

        [

            JSON.stringify(

                {

                    version:APP.version,

                    people,

                    layout:seatLayout

                },

                null,

                2

            )

        ],

        {

            type:"application/json"

        }

    );

    const url=

        URL.createObjectURL(blob);

    const a=

        document.createElement("a");

    a.href=url;

    a.download="SeatPlanner.json";

    a.click();

    URL.revokeObjectURL(url);

}

/*==========================================================
 Import JSON
==========================================================*/

function importProject(file){

    const reader=

        new FileReader();

    reader.onload=function(e){

        const data=

        JSON.parse(

            e.target.result

        );

        people=

            data.people||[];

        data.layout.forEach(item=>{

            const seat=

            getSeat(item.id);

            if(!seat)return;

            seat.person=item.person;

            seat.name=item.name;

            seat.locked=item.locked;

        });

        refreshLayout();

        updateStatistics();

    };

    reader.readAsText(file);

}

/*==========================================================
 Reset Project
==========================================================*/

function resetProject(){

    if(

        !confirm(

            "ล้างข้อมูลทั้งหมด ?"

        )

    ){

        return;

    }

    people=[];

    clearSeat();

    clearHistory();

    updateStatistics();

}

/*==========================================================
 Search Person
==========================================================*/

function searchPerson(name){

    clearSelection();

    const seat=

        getSeatByName(name);

    if(!seat){

        alert("ไม่พบข้อมูล");

        return;

    }

    highlightSeat(seat.id);

}

/*==========================================================
 Dashboard
==========================================================*/

function dashboard(){

    return{

        people:people.length,

        seats:seatLayout.length,

        occupied:getOccupiedSeats().length,

        empty:getEmptySeats().length,

        locked:getLockedSeats().length

    };

}

/*==========================================================
 Auto Save
==========================================================*/

if(APP.autoSave){

    setInterval(()=>{

        saveLayout();

        autoSaveHistory();

    },

    APP.autoSaveInterval

    );

}

/*==========================================================
 Button Event
==========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

const saveBtn=

document.getElementById(

"saveProject"

);

if(saveBtn){

saveBtn.onclick=

saveProject;

}

const loadBtn=

document.getElementById(

"loadProject"

);

if(loadBtn){

loadBtn.onclick=

loadProject;

}

}

);

/*==========================================================
  Part 6 : Engine API
==========================================================*/

/*==========================================================
 Assign Person
==========================================================*/

function assignPerson(seatId, person){

    const seat = getSeat(seatId);

    if(!seat) return false;

    if(seat.locked) return false;

    seat.person = person;

    seat.name =
        person?.name ||
        person?.["ชื่อ"] ||
        "";

    refreshSeat(seat);

    updateStatistics();

    return true;

}


/*==========================================================
 Remove Person
==========================================================*/

function unassignPerson(seatId){

    const seat = getSeat(seatId);

    if(!seat) return;

    seat.person = null;

    seat.name = "";

    refreshSeat(seat);

}


/*==========================================================
 Seat Available
==========================================================*/

function isSeatAvailable(seatId){

    const seat = getSeat(seatId);

    if(!seat) return false;

    return !seat.locked && seat.person == null;

}


/*==========================================================
 Next Available Seat
==========================================================*/

function getNextAvailableSeat(){

    for(const seat of seatLayout){

        if(isSeatAvailable(seat.id)){

            return seat;

        }

    }

    return null;

}


/*==========================================================
 Zone Available
==========================================================*/

function getAvailableSeatByZone(zone){

    return seatLayout.filter(

        seat=>

        seat.zone===zone &&

        !seat.locked &&

        seat.person==null

    );

}


/*==========================================================
 Assign By Zone
==========================================================*/

function assignPersonToZone(zone,person){

    const list=

        getAvailableSeatByZone(zone);

    if(list.length===0)

        return false;

    assignPerson(

        list[0].id,

        person

    );

    return true;

}


/*==========================================================
 Get Seat Summary
==========================================================*/

function getSeatSummary(){

    return{

        total:seatLayout.length,

        empty:getEmptySeats().length,

        occupied:getOccupiedSeats().length,

        locked:getLockedSeats().length

    };

}


/*==========================================================
 Refresh Seat
==========================================================*/

function refreshSeat(seat){

    if(!seat)return;

    seat.element
        .querySelector(".seat-name")
        .textContent=seat.name;

    seat.element.classList.toggle(

        "locked",

        seat.locked

    );

}


/*==========================================================
 Refresh All
==========================================================*/

function refreshAll(){

    seatLayout.forEach(

        refreshSeat

    );

    updateStatistics();

}


/*==========================================================
 Clear All Seat
==========================================================*/

function clearAllSeat(){

    saveHistory();

    seatLayout.forEach(seat=>{

        seat.person=null;

        seat.name="";

    });

    refreshAll();

}


/*==========================================================
 Auto Seat API
==========================================================*/

const SeatAPI={

    assign:assignPerson,

    remove:unassignPerson,

    refresh:refreshAll,

    clear:clearAllSeat,

    get:getSeat,

    getAll:getAllSeats,

    getEmpty:getEmptySeats,

    getOccupied:getOccupiedSeats,

    getLocked:getLockedSeats,

    getAvailable:getAvailableSeats,

    getZone:getZoneSeats,

    getSummary:getSeatSummary,

    next:getNextAvailableSeat,

    assignZone:assignPersonToZone

};

/*==========================================================
  Part 7 : Final Utility
==========================================================*/

/*==========================================================
 Validate Layout
==========================================================*/

function validateLayout(){

    const errors=[];

    const used=new Set();

    seatLayout.forEach(seat=>{

        if(used.has(seat.id)){

            errors.push(

                "Duplicate Seat : "+seat.id

            );

        }

        used.add(seat.id);

    });

    if(people.length>seatLayout.length){

        errors.push(

            "จำนวนคนมากกว่าจำนวนที่นั่ง"

        );

    }

    return errors;

}


/*==========================================================
 Get Layout Data
==========================================================*/

function getLayoutData(){

    return seatLayout.map(seat=>({

        id:seat.id,

        zone:seat.zone,

        number:seat.number,

        name:seat.name,

        locked:seat.locked

    }));

}


/*==========================================================
 Set Layout Data
==========================================================*/

function setLayoutData(data){

    data.forEach(item=>{

        const seat=getSeat(item.id);

        if(!seat)return;

        seat.name=item.name;

        seat.locked=item.locked;

    });

    refreshAll();

}


/*==========================================================
 Sort Seat
==========================================================*/

function sortSeat(){

    seatLayout.sort((a,b)=>{

        return a.id.localeCompare(b.id);

    });

}


/*==========================================================
 Seat Exists
==========================================================*/

function hasSeat(id){

    return getSeat(id)!=null;

}


/*==========================================================
 Person Exists
==========================================================*/

function hasPerson(name){

    return getSeatByName(name)!=null;

}


/*==========================================================
 Export CSV
==========================================================*/

function exportCSV(){

    let csv="Seat,Name,Locked\n";

    seatLayout.forEach(seat=>{

        csv+=

        seat.id+","+

        '"' + seat.name + '"' + ","+

        seat.locked+

        "\n";

    });

    const blob=new Blob(

        [csv],

        {

            type:"text/csv"

        }

    );

    const url=

    URL.createObjectURL(blob);

    const a=

    document.createElement("a");

    a.href=url;

    a.download="SeatPlanner.csv";

    a.click();

    URL.revokeObjectURL(url);

}


/*==========================================================
 Print
==========================================================*/

function printLayout(){

    window.print();

}


/*==========================================================
 Reset Selection
==========================================================*/

function resetSelection(){

    clearSelection();

    clearMultiSelect();

}


/*==========================================================
 Focus Seat
==========================================================*/

function focusSeat(id){

    const seat=getSeat(id);

    if(!seat)return;

    seat.element.scrollIntoView({

        behavior:"smooth",

        block:"center"

    });

    highlightSeat(id);

}


/*==========================================================
 Event Manager
==========================================================*/

function bindButton(){

    const btnPrint=

    document.getElementById(

        "printLayout"

    );

    if(btnPrint){

        btnPrint.onclick=

        printLayout;

    }

}


/*==========================================================
 Initialize Event
==========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

    bindButton();

}


/*==========================================================
 Layout Ready
==========================================================*/

console.log(

"Seat Planner Layout Ready"

);

document.addEventListener("DOMContentLoaded", () => {
    bindButton();
});

/*==========================================================
 Layout Ready
==========================================================*/

console.log("Seat Planner Layout Ready");




