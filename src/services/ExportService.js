import * as XLSX from "xlsx";

export function exportToExcel(data, filename = "Data.xlsx") {
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Định dạng tiêu đề
    const headerStyle = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "center" },
        fill: { fgColor: { rgb: "D9EAD3" } },
    };

    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    // Áp dụng định dạng cho tiêu đề
    for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (worksheet[cellAddress]) {
            worksheet[cellAddress].s = headerStyle;
        }
    }

    // Định dạng ngày cho các cột Ngày Tạo và Ngày Cập Nhật
    for (let R = 1; R <= range.e.r; R++) {
        const createAtCell = XLSX.utils.encode_cell({ r: R, c: 3 });
        const updateAtCell = XLSX.utils.encode_cell({ r: R, c: 4 });

        if (worksheet[createAtCell]) {
            worksheet[createAtCell].z = "dd/mm/yyyy";
        }

        if (worksheet[updateAtCell]) {
            worksheet[updateAtCell].z = "dd/mm/yyyy";
        }
    }



    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Aircrafts");

    // Lưu file
    XLSX.writeFile(workbook, filename);
}
