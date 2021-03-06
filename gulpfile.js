var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var umd = require('gulp-umd');

gulp.task('build', ['build-minify', 'build-debug']);

gulp.task('build-debug', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(concat('drawer-swipe.js'))
    .pipe(umd({
      exports: function (file) {
        return 'DrawerSwipe';
      },
      namespace: function (file) {
        return 'DrawerSwipe';
      }
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-minify', ['build-debug'], function () {
  return gulp.src(['dist/drawer-swipe.js'])
    .pipe(concat('drawer-swipe.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});
