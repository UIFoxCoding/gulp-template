'use strict';

// ---------- Using Gulp4
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var cache = require('gulp-cache');
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
var del = require('del');
var notify = require("gulp-notify");

// ---------- Config
var config = {

  production: true,

  autoprefixer: {
    opts: {
      browsers: ['last 5 versions'],
      cascade: false
    }
  },

  browsersync: {
    opts: {
      server: {
        baseDir: './dist/'
      },
      port: 4000,
      notify: false
    }
  },

  favicons: {
    opts: {
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
var paths = {

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
  return gulp.src(paths.html.src)
    .pipe(plumber({
      errorHandler: notify.onError({
        message: "Error: <%= error.message %>",
        title: "HTML"
      })
    }))
    .pipe(changed('./src/**/*.html'))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(remember('html'))
    .pipe(gulp.dest(paths.html.dest));
});

// ---------- Task SASS
gulp.task('sass', function () {
  return gulp.src(paths.sass.src)
    .pipe(plumber({
      errorHandler: notify.onError({
        message: "Error: <%= error.message %>",
        title: "SASS"
      })
    }))
    .pipe(changed('./src/assets/styles/**/*.{scss,sass}'))
    .pipe(gulpIf(config.production, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer(config.autoprefixer.opts))
    .pipe(prettify({
      indent_size: 2
    }))
    .pipe(remember('sass'))
    .pipe(gulp.dest(paths.sass.dest))
    .pipe(gulpIf(config.production, cssnano()))
    .pipe(gulpIf(config.production, rename("styles.min.css")))
    .pipe(gulpIf(config.production, sourcemaps.write('.', {
      sourceRoot: '/'
    })))
    .pipe(gulpIf(config.production, gulp.dest(paths.sass.dest)));
});

// ---------- Task JS
gulp.task('js', function () {
  return gulp.src(paths.js.src)
    .pipe(plumber({
      errorHandler: notify.onError({
        message: "Error: <%= error.message %>",
        title: "JS"
      })
    }))
    .pipe(changed('./src/assets/js/**/*.js'))
    .pipe(gulpIf(config.production, sourcemaps.init()))
    .pipe(prettify({
      indent_size: 2
    }))
    .pipe(remember('js'))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(gulpIf(config.production, uglify()))
    .pipe(gulpIf(config.production, rename("main.min.js")))
    .pipe(gulpIf(config.production, sourcemaps.write('.', {
      sourceRoot: '/'
    })))
    .pipe(gulpIf(config.production, gulp.dest(paths.js.dest)));
});

// ---------- Task IMAGES
gulp.task('images', function () {
  return gulp.src(paths.img.src)
    .pipe(gulpIf(config.production,
      cache(imagemin([
        imagemin.gifsicle({
          interlaced: true
        }),
        imagemin.jpegtran({
          progressive: true
        }),
        imageminJpegRecompress({
          loops: 5,
          min: 65,
          max: 70,
          quality: 'medium'
        }),
        imagemin.svgo(),
        imagemin.optipng({
          optimizationLevel: 3
        }),
        imageminPngquant({
          quality: '65-70',
          speed: 5
        })
      ], {
        verbose: true
      }))
    ))
    .pipe(gulp.dest(paths.img.dest));
});

// ---------- Task FONTS
gulp.task('fonts', function () {
  return gulp.src(paths.font.src)
    .pipe(gulp.dest(paths.font.dest));
});

// ---------- Task FAVICONS
gulp.task('favicons', function () {
  return gulp.src(paths.favicons.src)
    .pipe(favicons(config.favicons.opts))
    .pipe(gulp.dest(paths.favicons.dest));
});

// ---------- Task APP
gulp.task('app', gulp.parallel('html', 'js', 'images', 'sass', 'fonts', 'favicons'));

// ---------- Task CLEAN
gulp.task('clean:cache', function (done) {
  return cache.clearAll(done);
});

gulp.task('clean:dist', function () {
  return del(paths.clean);
});

gulp.task('clean', gulp.parallel('clean:cache', 'clean:dist'));

// ---------- Task VENDORS
gulp.task('vendor:js', function () {
  return gulp.src(paths.vendor.js.src)
    .pipe(plumber({
      errorHandler: notify.onError({
        message: "Error: <%= error.message %>",
        title: "Vendor:JS"
      })
    }))
    .pipe(gulp.dest(paths.vendor.js.dest));
});

gulp.task('vendor:css', function () {
  return gulp.src(paths.vendor.css.src)
    .pipe(plumber({
      errorHandler: notify.onError({
        message: "Error: <%= error.message %>",
        title: "Vendor:CSS"
      })
    }))
    .pipe(gulp.dest(paths.vendor.css.dest));
});

gulp.task('vendor:fonts', function () {
  return gulp.src(paths.vendor.fonts.src)
    .pipe(gulp.dest(paths.vendor.fonts.dest));
});

gulp.task('vendor', gulp.parallel('vendor:js', 'vendor:css', 'vendor:fonts'));

// ---------- Task WATCH
gulp.task('watch', function () {
  gulp.watch('./src/**/*.html', gulp.series('html'));
  gulp.watch(paths.sass.src, gulp.series('sass'));
  gulp.watch(paths.js.src, gulp.series('js'));
  gulp.watch(paths.img.src, gulp.series('images'));
  gulp.watch(paths.font.src, gulp.series('fonts'));
  gulp.watch(paths.favicons.src, gulp.series('favicons'));
});

// ---------- Task SYNC
gulp.task('sync', function () {
  browserSync.init(config.browsersync.opts);
  browserSync.watch('./dist/**/*').on('change', browserSync.reload);
});

// ---------- Task BUILD
gulp.task('build', gulp.series('clean', gulp.parallel('app', 'vendor')));

// ---------- Task DEFAULT
gulp.task('default', gulp.series('build', gulp.parallel('sync', 'watch')));