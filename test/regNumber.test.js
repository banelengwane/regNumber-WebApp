const assert = require('assert');
const Registrator = require('../registration_number');
const pg = require('pg');
const Pool = pg.Pool;

// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost/registrations';

const pool = new Pool({
    connectionString
});

describe('The basic database web app', function () {
    beforeEach(async function () {
        // clean the tables before each test run
        // await pool.query('delete from towns;');
        await pool.query('delete from regsTb;');
    });

    it('should return all regs in db', async function () {
        let registration = Registrator(pool);
        await registration.regNumbers('CA 123-123');
        await registration.regNumbers('CY 223-223');
        await registration.regNumbers('CJ 992-992');

        // console.log(await reg.InputReg('CA 123-123'));
        
        assert.deepStrictEqual(await registration.whichTown('all'), [ { regNumber: 'CA 123-123' } ]);
    });
    after(function () {
        pool.end();
    });
});
