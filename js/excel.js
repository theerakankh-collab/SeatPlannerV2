const btnImport=document.getElementById("btnImport");

const excelFile=document.getElementById("excelFile");

btnImport.onclick=()=>{

    excelFile.click();

};

excelFile.addEventListener(

"change",

importExcel

);

function importExcel(e){

    const file=e.target.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=function(evt){

        const data=new Uint8Array(evt.target.result);

        const workbook=XLSX.read(data,{type:"array"});

        const sheet=workbook.Sheets[workbook.SheetNames[0]];

        const json=XLSX.utils.sheet_to_json(sheet);

        people=[];

        json.forEach((row,index)=>{

            people.push({

                seat:null,

                id:index+1,

                name:row.Name,

                position:row.Position,

                department:row.Department,

                type:row.Type

            });

        });

        renderPersonList();

    };

    reader.readAsArrayBuffer(file);

}
