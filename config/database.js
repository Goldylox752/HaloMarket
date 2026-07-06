// ========================================
// Halo Marketplace
// config/database.js
// PostgreSQL (Supabase)
// ========================================

const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.SUPABASE_DB_HOST,
    port: Number(process.env.SUPABASE_DB_PORT || 5432),
    database: process.env.SUPABASE_DB_NAME,
    user: process.env.SUPABASE_DB_USER,
    password: process.env.SUPABASE_DB_PASSWORD,

    ssl: process.env.SUPABASE_DB_SSL === "true"
        ? {
              rejectUnauthorized: false
          }
        : false,

    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
});

// ========================================
// Connect Test
// ========================================

async function connectDatabase() {

    try {

        const client = await pool.connect();

        const result = await client.query(
            "SELECT NOW()"
        );

        console.log("================================");
        console.log("✓ Connected to Supabase");
        console.log(
            "Server Time:",
            result.rows[0].now
        );
        console.log("================================");

        client.release();

    } catch (err) {

        console.error("Database Connection Failed");
        console.error(err);

        process.exit(1);

    }

}

// ========================================
// Query Helper
// ========================================

async function query(text, params = []) {

    return pool.query(text, params);

}

// ========================================
// Transaction Helper
// ========================================

async function getClient() {

    return pool.connect();

}

// ========================================
// Graceful Shutdown
// ========================================

process.on("SIGINT", async () => {

    console.log("Closing PostgreSQL connections...");

    await pool.end();

    process.exit(0);

});

process.on("SIGTERM", async () => {

    console.log("Closing PostgreSQL connections...");

    await pool.end();

    process.exit(0);

});

module.exports = {

    pool,

    query,

    getClient,

    connectDatabase

};
