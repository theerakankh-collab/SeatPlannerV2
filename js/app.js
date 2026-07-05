<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seat Planner Professional v3.2</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/seat.css">
    <link rel="stylesheet" href="css/dashboard.css">
    <link rel="stylesheet" href="css/print.css" media="print">
    <script src="library/xlsx.full.min.js"></script>
    <script defer src="js/config.js"></script>
    <script defer src="js/utils.js"></script>
    <script defer src="js/storage.js"></script>
    <script defer src="js/excel.js"></script>
    <script defer src="js/layout.js"></script>
    <script defer src="js/engine.js"></script>
    <script defer src="js/dashboard.js"></script>
    <script defer src="js/dragdrop.js"></script>
    <script defer src="js/search.js"></script>
    <script defer src="js/filter.js"></script>
    <script defer src="js/statistics.js"></script>
    <script defer src="js/export.js"></script>
    <script defer src="js/print.js"></script>
    <script defer src="js/app.js"></script>
</head>
<body>
<header class="topbar">
    <div class="title">
        <h1>Seat Planner Professional v3.2</h1>
        <p>Professional Seating Management System</p>
    </div>
</header>
<div class="container">
    <aside class="sidebar">
        <section class="card">
            <h2>นำเข้าข้อมูล</h2>
            <input
                type="file"
                id="excelFile"
                accept=".xlsx,.xls">
            <button id="importBtn">
                Import Excel
            </button>
        </section>
        <section class="card">
            <h2>เครื่องมือ</h2>
            <button id="createLayout">
                สร้างผัง
            </button>
            <button id="btnAuto">
                จัดที่นั่งอัตโนมัติ
            </button>
            <button id="saveProject">
                บันทึกโครงการ
            </button>
            <button id="loadProject">
                เปิดโครงการ
            </button>
            <button id="exportExcel">
                Export Excel
            </button>
            <button id="exportPDF">
                Export PDF
            </button>
            <button id="printLayout">
                พิมพ์
            </button>
        </section>
        <section class="card">
            <h2>ค้นหา</h2>
            <input
                type="text"
                id="searchName"
                placeholder="ค้นหาชื่อ">
        </section>
        <section class="card">
            <h2>สถิติ</h2>
            <p>
                จำนวนผู้เข้าร่วม
            </p>
            <h3 id="totalPeople">
                0 คน
            </h3>
            <p id="seatCount">
                ที่นั่ง 0
            </p>
        </section>
    </aside>
    <main class="workspace">
        <div id="dashboard">
            <div id="seatMap"></div>
        </div>
    </main>
</div>
<footer>
    Seat Planner Professional Version 3.2
</footer>
</body>
</html>
