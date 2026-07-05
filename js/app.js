const excelFile = document.getElementById("excelFile");
const importBtn = document.getElementById("importBtn");

const createLayout = document.getElementById("createLayout");
const saveProject = document.getElementById("saveProject");
const loadProject = document.getElementById("loadProject");
const printLayout = document.getElementById("printLayout");

const totalPeople = document.getElementById("totalPeople");

let people = [];

importBtn.addEventListener("click", importExcel);
createLayout.addEventListener("click", createSeatLayout);
saveProject.addEventListener("click", saveData);
loadProject.addEventListener("click", loadData);
printLayout.addEventListener("click", () => window.print());

function importExcel() {

    if (!excelFile.files.length) {
        alert("กรุณาเลือกไฟล์ Excel");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

        try {

            const data = new Uint8Array(e.target.result);

            const workbook = XLSX.read(data, {
                type: "array"
            });

            const sheet = workbook.Sheets[
                workbook.SheetNames[0]
            ];

            people = XLSX.utils.sheet_to_json(sheet);

            totalPeople.textContent =
                `${people.length} คน`;

            localStorage.setItem(
                "people",
                JSON.stringify(people)
            );

            alert(`นำเข้าข้อมูล ${people.length} คน สำเร็จ`);

        } catch (err) {

            console.error(err);
            alert("อ่านไฟล์ Excel ไม่สำเร็จ");

        }

    };

    reader.readAsArrayBuffer(excelFile.files[0]);

}

function createSeatLayout() {

    if (people.length === 0) {

        const data =
            localStorage.getItem("people");

        if (data) {
            people = JSON.parse(data);
        }

    }

    if (people.length === 0) {
        alert("ยังไม่มีข้อมูลผู้เข้าร่วม");
        return;
    }

    if (typeof renderLayout === "function") {
        renderLayout(people);
    } else {
        console.warn("ไม่พบฟังก์ชัน renderLayout()");
    }

}

function saveData() {

    localStorage.setItem(
        "people",
        JSON.stringify(people)
    );

    alert("บันทึกเรียบร้อย");

}

function loadData() {

    const data =
        localStorage.getItem("people");

    if (!data) {

        alert("ไม่พบข้อมูล");

        return;

    }

    people = JSON.parse(data);

    totalPeople.textContent =
        `${people.length} คน`;

    if (typeof renderLayout === "function") {
        renderLayout(people);
    }

}

window.people = people;
