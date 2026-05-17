import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export default db;

initialize();

async function initialize() {
    // Read database config from environment variables (loaded by dotenv in server.ts)
    const host = process.env.DB_HOST || 'localhost';
    const port = Number(process.env.DB_PORT) || 3306;
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASS || '';
    const database = process.env.DB_NAME || 'node_mysql_api';

    // Create DB if it doesn't already exist
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    // Connect to DB
    const sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'production' ? false : console.log
    });

    // Init models and add them to the exported db object
    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    // Define relationships
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    // Sync models with database
    await sequelize.sync();
}