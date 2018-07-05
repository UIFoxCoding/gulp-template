'use strict';

// ---------- Using Gulp4
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');
var cache = require('gulp-cache');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var favicons = require('gulp-favicons');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var imageminPngquant = require('imagemin-pngquant');
var prettify = require('gulp-jsbeautifier');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var remember = require('gulp-remember');
var fileinclude = require('gulp-file-include');

// ---------- Config
var config = {

  production: true,

  autoprefixer: {
    opt: {
      browsers: ['last 5 versions'],
      cascade: false
    }
  },

  browsersync: {
    opt: {
      server: {
        baseDir: './dist/'
      },
      port: 4000,
      notify: false
    }
  },

  favicons: {
    opt: {
      icons: {
        appleIcon: true,
        favicons: true,
        online: false,
        appleStartup: false,
        android: true,
        firefox: false,
        yandex: false,
        windows: false,
        coast: false
      }
    }
  }

};

// ---------- Paths
var path = {

  clean: './dist/',

  vendor: {
    js: {
      src: [
        './node_modules/jquery/dist/jquery.min.js'
      ],
      dest: './dist/assets/vendor/js/'
    },
    css: {
      src: [
        './node_modules/@fortawesome/fontawesome-free/css/fontawesome.css'
      ],
      dest: './dist/assets/vendor/css/'
    },
    fonts: {
      src: [
        './node_modules/@fortawesome/fontawesome-free/webfonts/**/*'
      ],
      dest: './dist/assets/vendor/fonts/'
    }
  },

  html: {
    src: [
      './src/*.html',
      '!./src/includes/**/*'
    ],
    dest: './dist/'
  },

  sass: {
    src: [
      './src/assets/styles/**/*.{scss,sass}',
      '!./src/assets/styles/vendor/**/*'
    ],
    dest: './dist/assets/css/'
  },

  js: {
    src: [
      './src/assets/js/**/*.js',
      '!./src/assets/js/vendor/**/*'
    ],
    dest: './dist/assets/js/'
  },

  img: {
    src: [
      './src/assets/img/**/*'
    ],
    dest: './dist/assets/img'
  },

  favicons: {
    src: [
      './src/favicons/*.{jpg,jpeg,png,gif}'
    ],
    dest: './dist/favicons/'
  },

  font: {
    src: [
      './src/assets/fonts/**/*',
    ],
    dest: './dist/assets/fonts/'
  }
};

// ---------- Task HTML
gulp.task('html', function () {
  return gulp.src(path.html.src)
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(path.html.dest));
});

// ---------- Task SASS
gulp.task('sass', function () {
  return gulp.src(path.sass.src)
    .pipe(plumber())
    .pipe(gulpIf(config.production, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer(config.autoprefixer.opt))
    .pipe(prettify({
      indent_size: 2
    }))
    .pipe(gulp.dest(path.sass.dest))
    .pipe(gulpIf(config.production, cssnano()))
    .pipe(gulpIf(config.production, rename("styles.min.css")))
    .pipe(gulpIf(config.production, sourcemaps.write('.', {
      sourceRoot: '/'
    })))
    .pipe(gulpIf(config.production, gulp.dest(path.sass.dest)));
});

// ---------- Task JS
gulp.task('js', function () {
  return gulp.src(path.js.src)
    .pipe(plumber())
    .pipe(gulpIf(config.production, sourcemaps.init()))
    .pipe(prettify({
      indent_size: 2
    }))
    .pipe(gulp.dest(path.js.dest))
    .pipe(gulpIf(config.production, uglify()))
    .pipe(gulpIf(config.production, rename("main.min.js")))
    .pipe(gulpIf(config.production, sourcemaps.write('.', {
      sourceRoot: '/'
    })))
    .pipe(gulpIf(config.production, gulp.dest(path.js.dest)));
});

// ---------- Task IMAGES
gulp.task('images', function () {
  return gulp.src(path.img.src)
    .pipe(plumber())
    .pipe(cache(imagemin()))
    .pipe(gulp.dest(path.img.dest));
});