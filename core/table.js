export default class Table{

    constructor(id,name){

        this.id=id;

        this.name=name;

        this.chairs=[];

    }

    addChair(chair){

        this.chairs.push(chair);

    }

}
