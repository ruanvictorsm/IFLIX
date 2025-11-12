import {Pool} from 'pg';

export const pool = new Pool({
    user: 'postgres',
    password: 'pabd',
    host: 'localhost',
    database: 'iflix',
    port: 5432
});
