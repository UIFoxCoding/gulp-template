'use strict';

// Using Gulp4
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
