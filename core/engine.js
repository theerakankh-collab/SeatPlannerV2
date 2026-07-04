export default class Engine{

    constructor(){

        this.room=null;

        this.people=[];

    }

    setRoom(room){

        this.room=room;

    }

    addPeople(list){

        this.people=list;

    }

}
