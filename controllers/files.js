/*
 * One Controller per layout view
 */

const fs = require('fs');
const path = require('path');
const mime = require('mime');
const api = require('../api');
const rp = require('request-promise');
const express = require('express');
const router = express.Router();
const authHelper = require('../helpers/authentication');

const getSignedUrl = (req, data) => {
    return api(req).post('/fileStorage/signedUrl', {
        json: data
    });
};



// secure routes
router.use(authHelper.authChecker);


router.get('/', function (req, res, next) {

    const currentDir = req.query.dir || '';
    const storageContext = path.join('users/' + res.locals.currentUser._id, currentDir);

    api(req).get('/fileStorage', {
        qs: {storageContext}
    })
    .then(data => {
        let {files, directories} = data;

        files = files.map(file => {
            file.file = path.join(file.path, file.name);
            return file;
        });

        directories = directories.map(dir => {
            dir.path = path.join(currentDir, dir.name);
            return dir;
        });

        let dirParts = '';
        const breadcrumbs = (currentDir.split('/') || []).filter(value => value).map(dirPart => {
            dirParts += '/' + dirPart;
            return {
                label: dirPart,
                path: dirParts
            };
        });

        breadcrumbs.unshift({
            label: 'Meine persönlichen Dateien',
            path: '/'
        });

        res.render('files/files', {
            title: 'Dateien',
            breadcrumbs,
            files,
            directories
        });
    }).catch(err => {
        next(err);
    });
});


// get file
router.get('/file', function (req, res, next) {

    const {file, download = false} = req.query;

    const data = {
        storageContext: 'users/' + res.locals.currentUser._id,
        fileName: file,
        fileType: mime.lookup(file),
        action: 'getObject'
    };

    getSignedUrl(req, data)
        .then(signedUrl => {
            rp.get(signedUrl.url, {encoding:null}).then(awsFile => {
                if(download) {
                    res.type('application/octet-stream');
                    res.set('Content-Disposition', 'attachment;filename=' + path.basename(file));
                } else if(signedUrl.header['Content-Type']) {
                    res.type(signedUrl.header['Content-Type']);
                }
                res.end(awsFile, 'binary');
            });
        }).catch(err => {
            console.error(err);
        });
});


// upload file
router.post('/file', function (req, res, next) {

    const {type, name, dir = '', action = 'putObject'} = req.body;
    const storageContext = path.join('users/' + res.locals.currentUser._id, dir);

    const data = {
        storageContext,
        fileName: name,
        fileType: type,
        action: action
    };

    getSignedUrl(req, data)
        .then(signedUrl => {
            res.json({signedUrl});
        }).catch(err => {
        console.error(err);
    });
});


// delete file
router.delete('/file', function (req, res, next) {

    const {name, dir = ''} = req.body;
    const storageContext = path.join('users/' + res.locals.currentUser._id, dir);

    const data = {
        storageContext,
        fileName: name,
        fileType: null,
        action: null
    };

    api(req).delete('/fileStorage/', {
        qs: data
    })
    .then(_ => {
        res.sendStatus(200)
    }).catch(err => {
        console.error(err);
    });
});


// create directory
router.post('/directory', function (req, res, next) {

    const {name, dir} = req.body;
    const storageContext = path.join('users/' + res.locals.currentUser._id, dir);


    console.log(storageContext);


    api(req).post('/fileStorage/directories', {
        json: {
            storageContext,
            dirName: name || 'Neuer Ordner'
        }
    }).then(_ => {
        res.sendStatus(200);
    }).catch(err => {
        console.error(err);
    });
});

module.exports = router;
