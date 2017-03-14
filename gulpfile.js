const gulp = require('gulp');
const sass = require('gulp-sass');
const minifycss = require('gulp-csso');
const rimraf = require('gulp-rimraf');
const uglify = require('gulp-uglify');
const pump = require('pump');
var gutil = require('gulp-util');


const buildImages = () => {
    return gulp.src('./static/images/**/*.*')
        .pipe(gulp.dest('./build/images'))
};

gulp.task('watch-images', function () {
    return gulp.watch('./static/images/**/*.*', function (cb) {
        buildImages(cb);
    });
});

const buildStyles = () => {
    return gulp.src('./static/styles/**/*.{css,sass,scss}')
        .pipe(sass())
        .pipe(minifycss())
        .pipe(gulp.dest('./build/styles'))
};

gulp.task('watch-styles', function () {
    return gulp.watch('./static/styles/**/*.{css,sass,scss}', function (cb) {
        buildStyles(cb);
    });
});

const buildFonts = () => {
    return gulp.src('./static/fonts/**/*.*')
        .pipe(gulp.dest('./build/fonts'))
};

gulp.task('watch-fonts', function () {
    return gulp.watch('./static/fonts/**/*.*', function (cb) {
        buildFonts(cb);
    });
});


const buildScripts = (cb) => {
    gulp.src('./static/scripts/**/*.js')
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('./build/scripts'))
};


gulp.task('watch-scripts', function () {
    return gulp.watch('./static/scripts/**/*.js', function (cb) {
        buildScripts(cb);
    });
});


gulp.task('clean', function() {
    return gulp.src('./build/*', { read: false }).pipe(rimraf());
});

/* Main Tasks */
gulp.task('watch', [
    'default',
    'watch-images',
    'watch-styles',
    'watch-fonts',
    'watch-scripts'
]);

gulp.task('default', ['clean'], function () {
    buildImages();
    buildStyles();
    buildFonts();
    buildScripts();
});