/*
    Before using make sure you have:
    npm install --save-dev gulp gulp-minify-css gulp-concat gulp-uglify gulp-autoprefixer gulp-sass
    Make sure to change the directory names in the default watch function to the CSS/SCSS/SASS directories you are using so it reloads
 */
var gulp = require('gulp')
var minifyCSS = require('gulp-minify-css')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var prefix = require('gulp-autoprefixer')
var merge = require('gulp-merge-json')

gulp.task('js', function () {
  return gulp.src([
    'resources/js/core/jquery.min.js',
    'resources/js/core/bootstrap.bundle.min.js',
    'resources/js/core/jquery.slimscroll.min.js',
    'resources/js/core/jquery.scrollLock.min.js',
    'resources/js/core/jquery.appear.min.js',
    'resources/js/core/jquery.countTo.min.js',
    'resources/js/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
    'resources/js/plugins/jquery-auto-complete/jquery.auto-complete.min.js',
    'resources/js/plugins/masked-inputs/jquery.maskedinput.min.js'
  ])
    .pipe(concat('core.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js'))
})

gulp.task('styles', function () {
  return gulp.src([
    'resources/js/plugins/jquery-auto-complete/jquery.auto-complete.min.css',
    'resources/css/codebase.css',
    'resources/css/bootstrap-social.css',
    'resources/css/custom.css'
  ])
    .pipe(concat('core.min.css'))
    .pipe(minifyCSS())
    .pipe(prefix('last 2 versions'))
    .pipe(gulp.dest('public/assets/css'))
})

gulp.task('default', gulp.series('styles', 'js'))

gulp.task('lang-en', function () {
  return gulp.src([
    'src/lang/locale/en/**/*.json'
  ])
    .pipe(merge({
      fileName: 'en.json'
    }))
    .pipe(gulp.dest('src/lang/locale'))
})

gulp.task('lang-id', function () {
  return gulp.src([
    'src/lang/locale/id/**/*.json'
  ])
    .pipe(merge({
      fileName: 'id.json'
    }))
    .pipe(gulp.dest('src/lang/locale'))
})

gulp.task('lang', gulp.series('lang-en', 'lang-id'))
