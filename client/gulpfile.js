// resource: https://github.com/addyosmani/critical-path-css-demo

const gulp = require('gulp');
const critical = require('critical').stream;

// Generate & Inline Critical-path CSS
gulp.task('critical', () => {
  return gulp
    .src('public/*.html')
    .pipe(critical({
      css: [
        'public/styles/app.css'
      ]
    }))
    .on('error', err => {
      console.log(err);
    })
    .pipe(gulp.dest('public/critical-html'));
});

// Compile public SASS
gulp.task('sass', function () {
return sass('public/styles/sass/main.scss', { style: 'compressed' })
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('public/styles/css'))
});