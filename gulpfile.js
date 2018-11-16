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
    'public/assets/js/core/jquery.min.js',
    'public/assets/js/core/bootstrap.bundle.min.js',
    'public/assets/js/core/jquery.slimscroll.min.js',
    'public/assets/js/core/jquery.scrollLock.min.js',
    'public/assets/js/core/jquery.appear.min.js',
    'public/assets/js/core/jquery.countTo.min.js',
    'public/assets/js/core/jquery.cookie.min.js',
    'public/assets/js/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
    'public/assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.js',
    'public/assets/js/plugins/masked-inputs/jquery.maskedinput.min.js',
    'public/assets/js/plugins/ion-rangeslider/js/ion.rangeSlider.min.js',
    'public/assets/js/plugins/dropzonejs/min/dropzone.min.js'
  ])
    .pipe(concat('core.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js'))
})

gulp.task('styles', function () {
  return gulp.src([
    'public/assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.css',
    'public/assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.min.css',
    'public/assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.skinHTML5.min.css',
    'public/assets/js/plugins/dropzonejs/min/dropzone.min.css',
    'public/assets/css/codebase.css'
  ])
    .pipe(concat('core.min.css'))
    .pipe(minifyCSS())
    .pipe(prefix('last 2 versions'))
    .pipe(gulp.dest('public/assets/css'))
})

gulp.task('default', ['styles', 'js'])

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

gulp.task('lang', ['lang-en', 'lang-id'])
