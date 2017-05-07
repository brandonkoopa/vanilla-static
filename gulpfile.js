var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;

var gutil = require('gulp-util');
var postcss = require('gulp-postcss');
var simplevars = require('postcss-simple-vars');
var autoprefixer = require('autoprefixer-core');
var mqpacker = require('css-mqpacker');
var csswring = require('csswring');
var nestedcss = require('postcss-nested');
var corepostcss = require('postcss');

var buildDir = './dist/';
var sourceDir = './src/';

var categories = require(sourceDir + 'css/colors.json');

var dataloop = function(css) {
    for ( var category in categories.colorList ) {
        var colorSet = categories.colorList[category];
        var borderTop = colorSet[0];
        var borderBottom = colorSet[1];
        var rule = corepostcss.rule({ selector: '.cat-' + category });
        rule.append({ prop: 'border-top', value: '1px solid ' + borderTop});
        rule.append({ prop: 'border-bottom', value: '1px solid ' + borderBottom + ";"});
        css.append(rule);
    }
};

gulp.task('css', function () {
    var processors = [
        autoprefixer({browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']}),
        simplevars,
        nestedcss,
        dataloop
    ];
    return gulp.src(sourceDir + 'css/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest(buildDir));
});

// Static server
gulp.task('browser-sync', function() {
     browserSync({
          server: {
                baseDir: buildDir
          }
     });
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(sourceDir + 'js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest(buildDir))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildDir))
        .pipe(reload({stream:true}));
});

// Images
gulp.task('images', function() {
  return gulp.src(sourceDir + 'img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(buildDir + 'images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// HTML
gulp.task('html', function () {
    gulp.src(sourceDir + 'html/**/**')
        .pipe(gulp.dest(buildDir));
});

// Watch
gulp.task('watch', function() {

    // Watch .css files
    gulp.watch(sourceDir + '**/*.css', ['css', browserSync.reload]);

    // Watch .js files
    gulp.watch([sourceDir + 'js/**/*.js'], ['scripts', browserSync.reload]);

    // Watch image files
    gulp.watch(sourceDir + 'img/**/*', ['images']);

    // html
    gulp.watch([sourceDir + 'html/**/**'], ['html', browserSync.reload]);

});

gulp.task('serve', ['css', 'images', 'html', 'browser-sync', 'scripts', 'watch']);

// build for production
gulp.task('default', ['css', 'images', 'html', 'scripts']);
gulp.task('build', ['css', 'images', 'html', 'scripts']);
