const { query } = require('./database');

async function checkCols() {
    try {
        const rows = await query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'auditoria'");
        console.log('Columns in auditoria table:', rows.map(r => r.COLUMN_NAME).join(', '));
    } catch (err) {
        console.error('Error checking columns:', err.message);
    }
    process.exit(0);
}

checkCols();
