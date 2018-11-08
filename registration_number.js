module.exports = function Registrator (pool) {
    async function regNumbers (reg) {
        if (typeof reg === 'string' || reg instanceof String) {
            reg = reg.toUpperCase();
            let startString = reg.split(' ', 1).join();
            let currentTown = await pool.query('select id from towns where startStr = $1', [startString]);

            if (currentTown.rows.length === 1) {
                let resultReg = await pool.query('select * from regsTb where regNumber = $1', [reg]);

                if (resultReg.rows.length === 0) {
                    await pool.query('insert into regsTb(town_id, regNumber) values ($1, $2)', [currentTown.rows[0].id, reg]);
                } else if (resultReg.rowCount > 0) {
                    return 'This registration has been added before';
                }
            } else {
                return 'Enter a Registration number from: CA, CAW, CY and/or CJ';
            }
        } else {
            return 'Please enter a valid Registration Number';
        }
    }

    async function whichTown (startString) {
        if (startString === 'all') return allRegs();

        let data = await pool.query('select regNumber from towns join regsTb on regsTb.town_id=towns.id where startStr=$1', [startString]);
        return data.rows;
    }
    async function clearRegs () {
        await pool.query('delete from regsTb');
    }

    async function allRegs () {
        const countRegs = await pool.query('select regNumber from regsTb');
        return countRegs.rows;
    }

    return {
        whichTown,
        allRegs,
        clearRegs,
        regNumbers
    };
};
