const preparedData = (data) => {
    var rows = data.payload.rows;
    // console.log(json);
    var fields = data.payload.fields.map(field => field.name);
    // console.log(fields);

    var csv = rows.map((row) => fields.map((field) => JSON.stringify(row[field], replacer)).join(','));
    csv.unshift(fields.join(',')); // add header column
    csv = csv.join('\r\n');
    console.log(csv)

    return csv;
}

const replacer = (key, value) => {
    return value === null ? '' : value;
}

export default function downloadCSV(model) {
    const page = model.router.params.page;
    const index = model.router.params.index;
    const fileName = `${page}${page === `periods`? '': `-${index}`}`;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += preparedData(model.fetchedData[page][index]);
    
    var encodedUri = encodeURI(csvContent);
    
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link); 
    
    link.click();
}