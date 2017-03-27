/*
 * One Controller per layout view
 */

const express = require('express');
const router = express.Router();
const marked = require('marked');
const api = require('../api');
const authHelper = require('../helpers/authentication');
const handlebars = require("handlebars");

handlebars.registerHelper('ifvalue', function (conditional, options) {
    if (options.hash.value === conditional) {
        return options.fn(this)
    } else {
        return options.inverse(this);
    }
});

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


router.post('/', getCreateHandler('homework'));
router.patch('/homework/:id', getUpdateHandler('homework'));
router.delete('/homework/:id', getDeleteHandler('homework'));

router.all('/', function (req, res, next) {
    api(req).get('/homework/', {
        qs: {
            $populate: ['courseId']
        }
    }).then(assignments => {
        assignments = assignments.data.map(assignment => {
            if(assignment.courseId.userIds.indexOf(res.locals.currentUser._id) == -1
                && assignment.teacherId != res.locals.currentUser._id){ return }
            if(new Date(assignment.availableDate).getTime() > Date.now()
                && assignment.teacherId != res.locals.currentUser._id){ return }
            assignment.url = '/homework/' + assignment._id;
            assignment.userIds = assignment.courseId.userIds;
            var dueDate = new Date(assignment.dueDate);
            assignment.dueDateF = dueDate.getDate()+"."+(dueDate.getMonth()+1)+"."+dueDate.getFullYear();
            var availableDate = new Date(assignment.availableDate);
            assignment.availableDateF = availableDate.getDate()+"."+(availableDate.getMonth()+1)+"."+availableDate.getFullYear();

            const submissionPromise = getSelectOptions(req, 'submissions', {
                homeworkId: assignment._id,
                $populate: ['studentId']
            });
            return assignment;
        });
        assignments = assignments.filter(function(n){ return n != undefined });
        const coursesPromise = getSelectOptions(req, 'courses', {$or:[{
            userIds: res.locals.currentUser._id
        },{
            teacherIds: res.locals.currentUser._id
        }]});
        Promise.resolve(coursesPromise).then(courses => {
            res.render('homework/overview', {title: 'Meine Hausaufgaben', assignments, courses});
        });

    });
});

router.get('/:assignmentId', function (req, res, next) {
    api(req).get('/homework/' + req.params.assignmentId, {
        qs: {
            $populate: ['courseId']
        }
    }).then(assignment => {
        const submissionPromise = getSelectOptions(req, 'submissions', {
            homeworkId: assignment._id,
            $populate: ['studentId']
        });
        Promise.resolve(submissionPromise).then(submissions => {
            if(assignment.courseId.userIds.indexOf(res.locals.currentUser._id) == -1
                && assignment.teacherId != res.locals.currentUser._id){ return }
            assignment.submissions = submissions;
            assignment.userIds = assignment.courseId.userIds;
            var dueDate = new Date(assignment.dueDate);
            assignment.dueDateF = dueDate.getDate()+"."+(dueDate.getMonth()+1)+"."+dueDate.getFullYear();
            var availableDate = new Date(assignment.availableDate);
            assignment.availableDateF = availableDate.getDate()+"."+(availableDate.getMonth()+1)+"."+availableDate.getFullYear();
            //23:59 am Tag der Abgabe
            if (new Date(assignment.dueDate).getTime()+84340000 < Date.now()){
                assignment.submittable = false;
            }else{
                assignment.submittable = true;
            }
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
