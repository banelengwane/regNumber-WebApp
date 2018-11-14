const assert = require('assert');
const Registrator = require('../registration_number');
const pg = require('pg');
const Pool = pg.Pool;

// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost/regTests';

const pool = new Pool({
    connectionString
});

describe('The basic database web app', function () {
    beforeEach(async function () {
        await pool.query('delete from regsTb;');
    });

    it('should return all regs in db', async function () {
        let registration = Registrator(pool);
        await registration.regNumbers('CA 1');
        await registration.regNumbers('CY 45695');
        await registration.regNumbers('CAW 123');

        assert.deepStrictEqual(await registration.allRegs(),
            [  { 'regnumber': 'CA 1' },
                { 'regnumber': 'CY 45695' },
                { 'regnumber': 'CAW 123' }
            ]);
    });

    it('should filter and return Cape town registrations', async function () {
        let registration = Registrator(pool);
        await registration.regNumbers('CA 123-123');
        await registration.regNumbers('CY 45695');
        await registration.regNumbers('CA 123');
        await registration.regNumbers('CAW 123');

        assert.deepEqual(await registration.whichTown('CA'),
            [ { 'regnumber': 'CA 123-123' }, { 'regnumber': 'CA 123' } ]);
    });

    it('should filter and return bellville registrations', async function () {
        let registration = Registrator(pool);
        await registration.regNumbers('CA 123-123');
        await registration.regNumbers('CY 45695');
        await registration.regNumbers('CA 123');

        assert.deepEqual(await registration.whichTown('CY'),
            [ { 'regnumber': 'CY 45695' } ]);
    });

    it('should filter and return paarl registrations', async function () {
        let registration = Registrator(pool);
        await registration.regNumbers('CA 123-123');
        await registration.regNumbers('CY 45695');
        await registration.regNumbers('CJ 123');

        assert.deepEqual(await registration.whichTown('CJ'),
            [ { 'regnumber': 'CJ 123' } ]);
    });

    it('should filter and return george registrations', async function () {
        let registration = Registrator(pool);
        await registration.regNumbers('CAW 123-123');
        await registration.regNumbers('CA 45695');
        await registration.regNumbers('CA 123');

        assert.deepEqual(await registration.whichTown('CAW'),
            [ { 'regnumber': 'CAW 123-123' } ]);
    });

    it('should return messages for registrations added more than once', async function () {
        let registration = Registrator(pool);
        await registration.regNumbers('CA 123')
        assert.deepEqual(await registration.regNumbers('CA 123'),
            'This registration has been added before');
    });

    it('should return messages for registrations from other towns', async function () {
        let registration = Registrator(pool);

        assert.deepEqual(await registration.regNumbers('ND 7898'),
            'Enter a Registration number from: CA, CAW, CY and/or CJ');
    });

    it('should return messages for non-strings', async function () {
        let registration = Registrator(pool);

        assert.deepEqual(await registration.regNumbers(123),
            'Please enter a valid Registration Number');
    });
    after(function () {
        pool.end();
    });
});
