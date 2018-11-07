module.exports = function regRoutes (registration) {
    // test the route
    async function one (req, res) {
        try {
            res.render('home', {
                numberPlates: await registration.allRegs()
            });
        } catch (err) {
            // ERR
        }
    }

    async function regs (req, res) {
        let userReg = req.body.regField;
        try {
            let numPlate = await registration.regNumbers(userReg);
            res.render('home', {
                numberPlates: await registration.allRegs(), regNum: numPlate
            });
        } catch (err) {
            // ERR
        }
    }

    async function filtering (req, res) {
        try {
            let town = req.params.town;
            console.log(town);
            res.render('home', {
                numberPlates: await registration.whichTown(town)
            });
        } catch (err) {
            // err
        }
    }

    async function clear (req, res) {
        try {
            await registration.clearRegs();
            res.redirect('/');
        } catch (err) {
            // err
        }
    }
    return {
        regs,
        one,
        filtering,
        clear
    };
};
