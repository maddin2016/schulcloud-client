/*
 * One Controller per layout view
 */

module.exports = (router) => {
    router.get('/', function (req, res, next) {
        res.render('content/views/layouts/content');
    });

    return router;
};
