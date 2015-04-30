/**
 * Created by felix on 8/13/14.
 */

var gulp        = require("gulp"),
    del         = require('del'),
    jshint      = require('gulp-jshint'),
    stylish     = require('jshint-stylish'),
    less        = require('gulp-less'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    minifycss   = require('gulp-minify-css'),
    livereload  = require('gulp-livereload'),
    notify      = require('gulp-notify'),
    rename      = require('gulp-rename'),
    sourcemaps  = require('gulp-sourcemaps');

var buildDir = './phoebe/release';
var paths = {
    scripts: [
        './phoebe/src/scripts/phoebe.js',
        './phoebe/src/scripts/phoebe.utils.js',
        './phoebe/src/scripts/**/*.js'
    ],
    less: [
        './phoebe/src/less/phoebe.less',
        './phoebe/src/less/**/*.less'
    ],
    libraryjs: [
        './phoebe/src/library/phoebe.library.js',
        './phoebe/src/library/**/*.js'
    ],
    librarycss:[
        './phoebe/src/library/phoebe.library.less',
        './phoebe/src/library/**/*.less',
        './phoebe/src/library/**/*.css'
    ]
};

/*gulp.task('clean', function(cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    del([buildDir], cb);
});*/

/**
 * phoebe 主目录
 */
//拼接、简化JS文件
gulp.task('scripts', function() {
    var filename = 'phoebe.min.js';
    var mapname  = filename + '.map';
    del([buildDir + filename, buildDir + mapname]);
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(concat(filename))
        .pipe(sourcemaps.write('./', {sourceRoot: '../src/scripts'}))
        .pipe(gulp.dest(buildDir));
});

//编译less
gulp.task('less', function(){
    var filename = 'phoebe.min.css';
    del([buildDir + filename]);
    return gulp.src(paths.less)
        .pipe(less())
        .pipe(concat(filename))
        .pipe(minifycss())
        .pipe(gulp.dest(buildDir))
        .pipe(livereload());
});

/**
 * library 目录
 */

//拼接、简化JS文件
gulp.task('libraryjs', function() {
    var filename = 'phoebe.library.min.js';
    var mapname  = filename + '.map';
    del([buildDir + filename, buildDir + mapname]);
    return gulp.src(paths.libraryjs)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat(filename))
        .pipe(sourcemaps.write('./', {sourceRoot: '../src/library'}))
        .pipe(gulp.dest(buildDir));
});

//编译less
gulp.task('libraryless', function(){
    var filename = 'phoebe.library.min.css';
    del([buildDir + filename]);
    return gulp.src(paths.librarycss)
        .pipe(less())
        .pipe(concat(filename))
        .pipe(minifycss())
        .pipe(gulp.dest(buildDir))
        .pipe(livereload());
});

//监视文件的变化
gulp.task('watch', function() {
    // phoebe
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.less, ['less']);
    // library
    gulp.watch(paths.libraryjs, ['libraryjs']);
    gulp.watch(paths.librarycss, ['libraryless']);
});


gulp.task('default', ['watch', 'scripts', 'less', 'libraryjs', 'libraryless']);