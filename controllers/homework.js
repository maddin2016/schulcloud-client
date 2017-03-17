/*
 * One Controller per layout view
 */

const express = require('express');
const router = express.Router();
const marked = require('marked');
const api = require('../api');
const authHelper = require('../helpers/authentication');

router.use(authHelper.authChecker);

const getSelectOptions = (req, service, query, values = []) => {
    return api(req).get('/' + service, {
            qs: query
        }).then(data => {
            return data.data;
});
};


const getCreateHandler = (service) => {
    return function (req, res, next) {
        api(req).post('/' + service + '/', {
            // TODO: sanitize
            json: req.body
        }).then(data => {
            next();
    }).catch(err => {
            next(err);
    });
    };
};


const getUpdateHandler = (service) => {
    return function (req, res, next) {
        api(req).patch('/' + service + '/' + req.params.id, {
            // TODO: sanitize
            json: req.body
        }).then(data => {
            res.redirect(req.header('Referer'));
    }).catch(err => {
            next(err);
    });
    };
};


const getDetailHandler = (service) => {
    return function (req, res, next) {
        api(req).get('/' + service + '/' + req.params.id).then(data => {
            res.json(data);
    }).catch(err => {
            next(err);
    });
    };
};


const getDeleteHandler = (service) => {
    return function (req, res, next) {
        api(req).delete('/' + service + '/' + req.params.id).then(_ => {
            res.redirect(req.header('Referer'));
    }).catch(err => {
            next(err);
    });
    };
};



router.get('/', function (req, res, next) {
    api(req).get('/homework/', {
        qs: {
            $populate: ['courseId'],
            $or: [
                {userIds: res.locals.currentUser._id},
                {teacherId: res.locals.currentUser._id}
            ]
        }
    }).then(assignments => {
        assignments = assignments.data.map(assignment => {
            assignment.url = '/homework/' + assignment._id;

            const submissionPromise = getSelectOptions(req, 'submissions', {
                homeworkId: assignment._id,
                $populate: ['studentId']
            });

            return assignment;
        });
        console.log(assignments);
        res.render('homework/overview', {title: 'Meine Hausaufgaben', assignments});
    });
});
router.post('/homework/', getCreateHandler('homework'));
router.patch('/homework/:id', getUpdateHandler('homework'));
router.get('/homework/:id', getDetailHandler('homework'));
router.delete('/homework/:id', getDeleteHandler('homework'));

router.get('/:assignmentId', function (req, res, next) {
    api(req).get('/homework/' + req.params.assignmentId, {
        qs: {$populate: ['courseId']}
    }).then(assignment => {
        const submissionPromise = getSelectOptions(req, 'submissions', {
            homeworkId: assignment._id,
            $populate: ['studentId']
        });
        Promise.resolve(submissionPromise).then(submissions => {
            assignment.submissions = submissions;
            console.log(assignment);
            res.render('homework/assignment', Object.assign({}, assignment, {
                title: assignment.courseId.name + ' - ' + assignment.name,
                breadcrumb: [
                    {
                        title: 'Meine Hausaufgaben',
                        url: '/homework'
                    },
                    {}
                ]
            }));
        });
});
});

module.exports = router;
