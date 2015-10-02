'use strict';

var path = {
    build: 'build',
    src: 'assets',
}

var gulp       = require('gulp')
, stylus       = require('gulp-stylus')
, plumber      = require('gulp-plumber')
, browserify   = require('gulp-browserify')
, browserSync  = require('browser-sync')
, uglify       = require('gulp-uglify')
, imagemin     = require('gulp-imagemin')
, concat       = require('gulp-concat')
, gulpif       = require('gulp-if')
, jeet         = require('jeet')
, autoprefixer = require('autoprefixer-stylus')
, koutoSwiss   = require('kouto-swiss')
, rupture      = require('rupture')
, livereload   = require('gulp-livereload')
, rsync        = require('rsyncwrapper').rsync;


gulp.task('stylus', function() {
    gulp.src(path.src+'/styl/main.styl')
    .pipe(plumber())
    .pipe(stylus({
        use:[jeet(), autoprefixer(), koutoSwiss(), rupture()],
        compress: true
    }))
    .pipe(gulp.dest(path.build+'/css'))
    .pipe(livereload());
});


gulp.task('jhint', function () {
    return gulp.src([path.src+'/js/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('js', function() {
    return gulp.src(path.src+'/js/**/*.js')
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.build+'/js'))
});


gulp.task('browserify', function(){
    return gulp.src(path.src+'/js/main.js')
        .pipe(plumber())
        .pipe(browserify({debug: !env.p }))
        .pipe(gulpif(env.p, uglify()))
        .pipe(gulp.dest('build/js'));
});


gulp.task('imagemin', function() {
    return gulp.src(path.src+'/img/**/*')
    .pipe(plumber())
    .pipe(imagemin({
        optimizationLevel: 3, progressive: true, interlaced: true
    }))
    .pipe(gulp.dest(path.build+'/img'));
});


gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(path.src+'/styl/main.styl', ['stylus']);
    gulp.watch(path.src+'/js/**/*.js', ['js']);
    gulp.watch(path.src+'/img/**/*.{jpg, png, gif}', ['imagemin']);
});



gulp.task('default', ['stylus', 'imagemin', 'watch']);
