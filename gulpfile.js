var gulp = require('gulp'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    jasmine = require('gulp-jasmine'),
    transpile  = require('gulp-es6-module-transpiler');

gulp.task('default', function() {
  return gulp.src('src/app.js')
    .pipe(concat('app.js'))
    .pipe(transpile())
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('test', function() {
  return gulp.src('test/*.js')
    .pipe(jasmine());
});