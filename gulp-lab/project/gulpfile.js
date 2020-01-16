const gulp = require('gulp');
const browserSync = require('browser-sync');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');

function copy() {
    return gulp.src([
        'app/*.html',
        'app/**/*.jpg'
    ])
        .pipe(gulp.dest('build'));
}

gulp.task('copy', copy);

function serve() {
    return browserSync.init({
        server: 'build',
        open: false,
        port: 3000
    });
}

gulp.task('buildAndServe', gulp.series(
        copy,
        processCss,
        processJs,
        gulp.parallel(serve, watch)
    )
);

function watch() {
    gulp.watch('app/scripts/*.js', processJs);
    gulp.watch('app/styles/*.css', processCss);
}

gulp.task('watch', watch);

function processJs() {
    return gulp.src('app/scripts/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/scripts'));
}

gulp.task('processJs', processJs);

function processCss() {
    return gulp.src('app/styles/*.css')
        // .pipe(babel({
        //     presets: ['env']
        // }))
        .pipe(cleanCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/styles'));
}

gulp.task('processCss', processCss);

gulp.task('prepareToDeploy', gulp.series(
        copy,
        processCss,
        processJs
    )
);