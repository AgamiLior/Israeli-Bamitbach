const { Client } = require("pg");

let DB_URI =
"postgres://jtmeoztciruyaj:df79f95536e0286bc7ae42b1c2c237b14fff0437f30cd948cee163ab5ed05328@ec2-44-205-41-76.compute-1.amazonaws.com:5432/dbor0eo55rte3h"


let db = new Client({
	connectionString: DB_URI,
	ssl: {rejectUnauthorized: false}
})

db.connect();

module.exports = db;