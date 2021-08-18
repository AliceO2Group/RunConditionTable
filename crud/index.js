const { HttpServer, Log } = require('@aliceo2/web-ui');
const db = require('./db/connection.js');
const config = require('./config.js');
const httpServer = new HttpServer(config.http, config.jwt);

httpServer.addStaticPath('./public');

httpServer.get("/getData", async function(req, res, next) {
    try {
        const filters = req.query;
        const results = await db.query("SELECT * FROM data ORDER BY id");

        const filteredResults = results.rows.filter(row => {
            let isValid = true;
                for (const [key, filter] of Object.entries(filters)) {
                  if (row[key]) { 
                    if (key === 'date') {
                        const rowDate = new Date(row[key]);
                        const filterDate = new Date(filter);
                        sameYear = rowDate.getFullYear() == filterDate.getFullYear();
                        sameMonth = rowDate.getMonth() == filterDate.getMonth();
                        sameDay = rowDate.getDate() == filterDate.getDate();
                        isValid = isValid && sameYear && sameMonth && sameDay;
                    } else isValid = isValid && row[key] == filter;
                  }
                 }
            return isValid;
        });
        return res.json(filteredResults);
    } catch (err) {
      return next(err);
    }
  }, {public: true});

  httpServer.post("/insert", async function(req, res, next) {
    try {
        var date = req.body.date;
        var value = req.body.value;

        const result = await db.query(
          "INSERT INTO data (value, date) VALUES ($1, $2) RETURNING *",
          [value, date]
        );
        return res.json(result.rows[0]);
    } catch (err) {
        return next(err);
    }
}, { public: true });

httpServer.patch("/update/:id", async function(req, res, next) {
    try {
      const id = req.params.id;
      const value = req.body.value;
      const date = req.body.date;
  
      const result = await db.query(
        "UPDATE data SET value=$1, date=$2 WHERE id=$3 RETURNING *",
        [value, date, id]
      );
      return res.json(result.rows[0]);
    } catch (err) {
      return next(err);
    }
  }, { public: true });

  httpServer.delete("/delete/:id", async function(req, res, next) {
    try {
      const result = await db.query("DELETE FROM data WHERE id=$1", [
        req.params.id
      ]);
      return res.json({ message: "Deleted" });
    } catch (err) {
      return next(err);
    }
  }, { public: true });
  
