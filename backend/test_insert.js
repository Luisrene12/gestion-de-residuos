const sql = require('mssql/msnodesqlv8');
const config = {server:'localhost',database:'GestionResiduosPro',driver:'SQL Server',options:{trustedConnection:true}};

(async () => {
  try {
    const pool = await new sql.ConnectionPool(config).connect();
    const req = pool.request();
    req.input('arg_0', 1);
    req.input('arg_1', 1);
    req.input('arg_2', 1);
    req.input('arg_3', 1);
    req.input('arg_4', 1);
    req.input('arg_5', 50.5);
    req.input('arg_6', '2025-03-24');
    const sqlStr = "INSERT INTO Residuos (id_area, id_tipo, id_clasificacion, id_estado, id_responsable, cantidad, fecha) VALUES (@arg_0, @arg_1, @arg_2, @arg_3, @arg_4, @arg_5, @arg_6)";
    // intentionally omitted SELECT SCOPE_IDENTITY() to test if that breaks it
    await req.query(sqlStr);
    console.log("INSERT WORKED WITHOUT SCOPE_IDENTITY");
    
    // Now test with Scope identity
    const req2 = pool.request();
    req2.input('arg_0', 1);
    req2.input('arg_1', 1);
    req2.input('arg_2', 1);
    req2.input('arg_3', 1);
    req2.input('arg_4', 1);
    req2.input('arg_5', 50.5);
    req2.input('arg_6', '2025-03-24');
    await req2.query(sqlStr + "; SELECT SCOPE_IDENTITY() AS id;");
    console.log("INSERT WORKED WITH SCOPE_IDENTITY");

    pool.close();
  } catch(e) {
    console.error("FAIL", e.message);
  }
})();
