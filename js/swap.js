function swapSeat(seatA, seatB){

    if(seatA===seatB) return;

    const personA=people.find(p=>p.seat===seatA);

    const personB=people.find(p=>p.seat===seatB);

    if(personA) personA.seat=seatB;

    if(personB) personB.seat=seatA;

    renderPeople();

}
