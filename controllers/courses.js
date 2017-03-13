/*
 * One Controller per layout view
 */

const express = require('express');
const router = express.Router();
const marked = require('marked');
const api = require('../api');
const authHelper = require('../helpers/authentication');

// secure routes
router.use(authHelper.authChecker);

router.get('/', function (req, res, next) {
    api(req).get('/courses/').then(courses => {
        courses = courses.data.map(course => {
            course.url = '/courses/' + course._id;
            return course;
        });
        res.render('courses/overview', {title: 'Meine Kurse', courses});
    });
});

router.get('/:courseId', function (req, res, next) {
    api(req).get('/courses/' + req.params.courseId, {
        qs: {
            $populate: ['lessonIds', 'ltiToolIds']
        }
    }).then(course => {

        course.lessonIds = course.lessonIds.map(lesson => {
            return Object.assign(lesson, {
                url: '/courses/' + req.params.courseId + '/' + lesson._id + '/'
            });
        });

        res.render('courses/course', Object.assign({}, course, {
            title: course.name,
            breadcrumb: [
                {
                    title: 'Meine Kurse',
                    url: '/courses'
                },
                {}
            ]
        }));
    });
});


router.get('/:courseId/:lessonId', function (req, res, next) {
    Promise.all([
        api(req).get('/courses/' + req.params.courseId),
        api(req).get('/lessons/' + req.params.lessonId)
    ]).then(([course, lesson]) => {
        // decorate contents
        lesson.contents = (lesson.contents || []).map(block => {
            return Object.assign(block, {
                component: 'courses/components/content-text',
                markup: marked(block.content || '')
            });
        });

        res.render('courses/lesson', Object.assign({}, lesson, {
            breadcrumb: [
                {
                    title: 'Meine Kurse',
                    url: '/courses'
                },
                {
                    title: course.name,
                    url: '/courses/' + course._id
                },
                {}
            ]
        }));
    });
});


module.exports = router;
