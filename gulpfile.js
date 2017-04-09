const decompress = require('gulp-decompress');
const gulp = require('gulp');
const gutil = require('gulp-util');
const map = require('vinyl-map');
const npmInstall = require('npm-i');
const path = require('path');
const remoteSrc = require('gulp-remote-src');
const rimraf = require('rimraf');
const webpack = require('webpack');

const webpackConfig = require('./webpack/webpack');

// Clean tasks

gulp.task('clean', cb => rimraf('dist,app', cb));

// Build tasks

gulp.task('build', ['build:js', 'build:html', 'build:resources']);

gulp.task('build:js', (cb) => {
  webpack(webpackConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('build:js', err);
    gutil.log('[build:js]', stats.toString({
      colors: true,
    }));
    cb();
  });
});

gulp.task('build:html', () =>
  gulp.src('src/main/*.html').pipe(gulp.dest('app'))
);

gulp.task('build:resources', () =>
  gulp.src('src/resources/**', { base: 'src' }).pipe(gulp.dest('app'))
);

// Watch task

gulp.task('watch', ['build'], () => {
  gulp.watch('src/main/*.html', ['build:html']);
  gulp.watch('src/**', ['build:js']);
  gulp.watch('src/resources/**', ['build:resources']);
});

// Dist tasks

gulp.task('dist:package.json', () =>
  gulp.src('package.json')
    .pipe(map((chunk) => {
      const data = JSON.parse(chunk.toString());
      data.main = 'backend.js';
      delete data.bin;
      delete data.build;
      delete data.devDependencies;
      delete data.scripts;
      return JSON.stringify(data, null, 2);
    }))
    .pipe(gulp.dest('app'))
);

gulp.task('dist:npm-install', ['dist:package.json'], cb =>
  npmInstall({ path: 'app', args: ['--production'] }, cb)
);

gulp.task('dist:clean:notifier', ['dist:npm-install'], cb =>
  rimraf(path.join('app/node_modules/node-notifier/vendor', 'terminal-notifier.out'), cb)
);

gulp.task('dist:build:notifier', ['dist:clean:notifier'], () =>
  remoteSrc(['terminal-notifier.zip'], {
    base: 'https://github.com/radiant-player/terminal-notifier/releases/download/radiant/',
  })
    .pipe(decompress())
    .pipe(gulp.dest('app/node_modules/node-notifier/vendor'))
);
