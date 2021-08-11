function switchQuery(id, value, year, month, day) {
    let query = "SELECT * FROM data";
    let flags = 0;

    if (id !== "") flags += 4;
    if (value !== "") flags += 2;
    if (year !== "" && month !== "" && day !== "") flags += 1;

    switch(flags) {
      case 1:
        query += ` WHERE date(date)=make_date(${year}, ${month}, ${day})`;
        break;
      case 2:
        query += ` WHERE value=${value}`;
        break;
      case 3:
        query += ` WHERE date(date)=make_date(${year}, ${month}, ${day}) AND value=${value}`;
        break;
      case 4:
        query += ` WHERE id=${id}`;
        break;
      case 5:
        query += ` WHERE id=${id} AND date(date)=make_date(${year}, ${month}, ${day})`;
        break;
      case 6:
        query += ` WHERE id=${id} AND value=${value}`;
        break;
      case 7:
        query += ` WHERE id=${id} AND value=${value} AND date(date)=make_date(${year}, ${month}, ${day})`;
        break;
      default: // zero (no parameters specified)
        break;
    }

    query += " ORDER BY id";
    return query;
}

module.exports = switchQuery;