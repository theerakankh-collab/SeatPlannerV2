const excelFile =
document.getElementById("excelFile");

const importBtn =
document.getElementById("importBtn");

const totalPeople =
document.getElementById("totalPeople");

let people=[];

importBtn.onclick=function(){

if(excelFile.files.length==0){

alert("เลือกไฟล์ Excel");

return;

}

const reader=
new FileReader();

reader.onload=function(e){

const data=
new Uint8Array(e.target.result);

const workbook=
XLSX.read(data,{type:"array"});

const sheet=
workbook.Sheets[
workbook.SheetNames[0]
];

people=
XLSX.utils.sheet_to_json(sheet);

totalPeople.innerHTML=
people.length+" คน";

alert("Import สำเร็จ");

}

reader.readAsArrayBuffer(
excelFile.files[0]
);

}
