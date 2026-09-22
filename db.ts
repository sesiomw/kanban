import { Database } from "bun:sqlite";

const db = new Database("database.sqlite");
const query = db.query(`
    CREATE TABLE IF NOT EXISTS tarefas (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo          TEXT NOT NULL,
        autor           TEXT NOT NULL,
        prazo           TEXT NOT NULL,
        coluna          TEXT NOT NULL
    );
`);
query.run();
export { db }