require('dotenv').config()
const { connect, connection } = require("mongoose");

const MONGO_URI =
    process.env.STAGE === "PROD"
        ? process.env.MONGO_URI
        : "mongodb://localhost:27017";


const DB_NAME =
    process.env.STAGE === "PROD"
        ? "multiVendor"
        : "multiVendor";

const connectionOptions = {
    dbName: DB_NAME,
}

connect(MONGO_URI, connectionOptions)

connection.on("connected", () => console.log('Database Connected'));
connection.on("error", (error) => console.error('Database Error:', error));
connection.on("disconnected", () => console.log('Database Disconnected'));

process.on("SIGINT", async () => {
    await connection.close()
    process.exit(0)
})