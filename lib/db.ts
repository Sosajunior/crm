// lib/db.ts (Relembrando a estrutura conceitual - AJUSTE COM SUA IMPLEMENTAÇÃO REAL)
import mysql from 'mysql2/promise';

// Configure com suas credenciais reais e considere usar variáveis de ambiente
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'dev_db-crm',
  user: process.env.DB_USER || 'mysql',
  password: process.env.DB_PASSWORD || 'SUA_SENHA_AQUI', // LEMBRE-SE DE CONFIGURAR SUA SENHA
  database: process.env.DB_NAME || 'crm',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true, // Retorna DATETIME e TIMESTAMP como strings ISO (YYYY-MM-DD HH:MM:SS)
});

interface QueryResult {
  insertId?: number;
  affectedRows?: number;
  // ... outros campos que o mysql2 retorna
}

export async function query(sql: string, params?: any[]): Promise<any[]> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as any[];
  } catch (error: any) {
    console.error("DB Query Error:", error.message, "\nSQL:", sql, "\nParams:", params);
    // Em um app de produção, você pode querer lançar um erro mais genérico ou logar de forma diferente
    throw new Error(`Database query failed: ${error.message}`);
  }
}

export async function execute(sql: string, params?: any[]): Promise<QueryResult> {
  try {
    const [result] = await pool.execute(sql, params);
    return result as QueryResult;
  } catch (error: any) {
    console.error("DB Execute Error:", error.message, "\nSQL:", sql, "\nParams:", params);
    throw new Error(`Database execution failed: ${error.message}`);
  }
}

export default pool;