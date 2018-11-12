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

    async function regs (req, res, next) {
        let userReg = req.body.regField;
        try {
            let numPlate = await registration.regNumbers(userReg);
            if (typeof numPlate === 'string') {
                req.flash('error', numPlate);
                res.redirect('/');
            } else {
                res.render('home', {
                    numberPlates: await registration.allRegs()
                });
            }
        } catch (err) {
            // ERR
        }
    }

    async function filtering (req, res) {
        let town = req.body.town;
        try {
            let numPlate = await registration.whichTown(town);
            console.log(numPlate.length);
            if (numPlate.length === 0) {
                req.flash('error', 'There are no registrations to filter');
                res.redirect('/');
            } else {
                res.render('home', {
                    numberPlates: numPlate
                });
            }
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
