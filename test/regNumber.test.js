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
        await pool.query('delete from regsTb;');
    });

    it('should return all regs in db', async function () {
        let registration = Registrator(pool);
        await registration.regNumbers('CA 123-123');
        await registration.regNumbers('CY 45695');
        await registration.regNumbers('CJ 123');

        assert.deepStrictEqual(await registration.allRegs(),
            [ { 'regnumber': 'CA 123-123' },
                { 'regnumber': 'CY 45695' },
                { 'regnumber': 'CJ 123' }
            ]);
    });
    after(function () {
        pool.end();
    });
});
