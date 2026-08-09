/**
 * SQLite → MongoDB Migration Utility
 * -----------------------------------
 * Reads the original `students.db` SQLite database (located at the project
 * root) and inserts the records into MongoDB using the Student Mongoose model.
 *
 * Uses `sql.js` (pure WebAssembly, no native compilation required).
 *
 * The migration is non-destructive:
 *   - It NEVER deletes existing MongoDB data.
 *   - It avoids duplicates by checking roll_no / email against existing docs.
 *   - It preserves the original integer `id` in the `legacyId` field.
 *
 * Usage:
 *   cd server
 *   npm run migrate
 */
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const initSqlJs = require("sql.js");
const mongoose = require("mongoose");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const Student = require("../models/Student");

const SQLITE_DB_PATH = path.join(__dirname, "..", "..", "students.db");

const DEPARTMENT_ENUM = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Information Technology",
  "Electrical",
];

const migrate = async () => {
  try {
    // 1. Verify students.db exists
    if (!fs.existsSync(SQLITE_DB_PATH)) {
      console.error(`students.db not found at: ${SQLITE_DB_PATH}`);
      process.exit(1);
    }

    // 2. Load SQLite database with sql.js (WASM)
    const SQL = await initSqlJs({
      locateFile: (file) =>
        path.join(__dirname, "..", "node_modules", "sql.js", "dist", file),
    });
    const fileBuffer = fs.readFileSync(SQLITE_DB_PATH);
    const db = new SQL.Database(fileBuffer);

    // 3. Read student records
    const result = db.exec("SELECT * FROM students ORDER BY id ASC");
    let rows = [];
    if (result.length > 0) {
      const columns = result[0].columns;
      rows = result[0].values.map((values) => {
        const obj = {};
        columns.forEach((col, i) => {
          obj[col] = values[i];
        });
        return obj;
      });
    }
    db.close();

    console.log(`Found ${rows.length} student record(s) in students.db`);
    if (rows.length === 0) {
      console.log("Nothing to migrate. students.db is empty.");
      return;
    }

    // 4. Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      console.error(
        "MONGODB_URI is not set. Copy server/.env.example to server/.env and configure it.",
      );
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // 5. Transform & insert records
    let inserted = 0;
    let skipped = 0;

    for (const row of rows) {
      const department = DEPARTMENT_ENUM.includes(row.department)
        ? row.department
        : "Computer Science";

      const payload = {
        legacyId: row.id,
        name: String(row.name || "").trim(),
        roll_no: String(row.roll_no || "")
          .trim()
          .toUpperCase(),
        department,
        year: Number(row.year) || 1,
        email: String(row.email || "")
          .trim()
          .toLowerCase(),
        phone: row.phone ? String(row.phone).trim() : "",
        cgpa: typeof row.cgpa === "number" ? row.cgpa : 0,
      };

      // Avoid duplicates
      const exists = await Student.findOne({
        $or: [{ roll_no: payload.roll_no }, { email: payload.email }],
      });

      if (exists) {
        console.log(`Skipped duplicate: ${payload.name} (${payload.roll_no})`);
        skipped++;
        continue;
      }

      try {
        await Student.create(payload);
        inserted++;
        console.log(`Migrated: ${payload.name} (${payload.roll_no})`);
      } catch (err) {
        if (err.code === 11000) {
          console.log(
            `Skipped duplicate key: ${payload.name} (${payload.roll_no})`,
          );
          skipped++;
        } else {
          console.error(`Error migrating ${payload.roll_no}: ${err.message}`);
          skipped++;
        }
      }
    }

    console.log("\n--- Migration Summary ---");
    console.log(`Inserted: ${inserted}`);
    console.log(`Skipped (duplicates/errors): ${skipped}`);
    console.log(`Total processed: ${rows.length}`);
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();
    } catch (_) {}
  }
};

migrate();
