module.exports = function regRoutes (registration) {
    // test the route
    async function home (req, res) {
        try {
            res.render('home', {
                numberPlates: await registration.allRegs()
            });
        } catch (err) {
            // ERR
        }
    }

    async function filtering (req, res) {
        try {
            let town = req.body.towns;
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
        home,
        filtering,
        clear
    };
};
