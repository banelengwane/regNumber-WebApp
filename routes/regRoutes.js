module.exports = function regRoutes (pool) {
    // test the route
    function home (req, res) {
        res.render('home');
    });

    return{
        home
    }
}