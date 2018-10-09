module.exports = function Registrator (pool) {
    async function regNumbers (reg) {
        reg = reg.toUpperCase();

        let simplifiedReg = reg.replace(/\W/g, '');
        let regEx = /^[A-Z]{2}\s[0-9]{3}(\-)[0-9]{3}$/;
        let reg2 = /^[A-Z]{2}[0-9]{0,6}$/;

        let knownRegistrations = ['CA', 'CY', 'CJ'];

        if (reg2.test(simplifiedReg) && knownRegistrations.includes(simplifiedReg.substring(0, 2))) {
            // Do The Things
            // check if the reg is in the db...
            const regCountResult = await pool.query('select count(*) from regsTb where regNumber = $1', [reg]);
            const regCount = Number(regCountResult.rows[0].town_id);

            if (regCount === 0) {
            // if not there then lets add the registration number
                await pool.query('insert into regTb(regNumber, town_id) values($1, 1)', [reg]);
            } else {
                console.log('error');
            }

            // if
        }
    }

    async function whichTown (town) {
        let allRegs = await pool.query()
        var cpt = [];
        var bel = [];
        var par = [];
        var all = [];

        // filter for cape town
        if (town === 'capetown') {
            for (let key in regObj) {
                if (key.startsWith('CA')) {
                    cpt.push(key);
                }
            }
            return cpt;
        }
        // filter for Bellville
        if (town === 'bellville') {
            for (let key in regObj) {
                if (key.startsWith('CY')) {
                    bel.push(key);
                }
            }
            return bel;
        }

        // filter for paarl
        if (town === 'paarl') {
            for (let key in regObj) {
                if (key.startsWith('CJ')) {
                    par.push(key);
                }
            }
            return par;
        }

        // filter for All
        if (town === 'alltowns') {
            for (let key in regObj) {
                all.push(key);
            }
            return all;
        }
    }
    function clearObj () {
        //  return regObj = {};
    }

    async function allRegs () {
        let countRegs = await pool.query('select regNumber from regsTb');
        let regs = countRegs.rows;
        return regs;
    }

    return {
        whichTown,
        allRegs,
        clearObj,
        regNumbers
    };
};
