import builder from 'electron-builder';
import eslint from 'eslint/lib/cli';
import gulp from 'gulp';
import gutil from 'gulp-util';
import map from 'vinyl-map';
import npmInstall from 'npm-i';
import path from 'path';
import remoteSrc from 'gulp-remote-src';
import rimraf from 'rimraf';
import decompress from 'gulp-decompress';
import webpack from 'webpack';

import pkg from './package.json';
import webpackConfig from './support/config/webpack';

const paths = {
  // Inputs
  html: 'src/app/*.html',
  js: 'src/**/*.js',
  resources: 'src/resources/**/*',

  // Outputs
  dist: 'dist',
  out: 'app',
  terminalNotifier: 'app/node_modules/node-notifier/vendor',
};

// Clean tasks

gulp.task('clean', cb => rimraf(`{${paths.dist},${paths.out}}`, cb));

// Test tasks

gulp.task('test:eslint', () => {
  const code = eslint.execute('--ignore-path .gitignore .');

  if (code) {
    throw new gutil.PluginError('test:eslint', new Error('ESLint error'));
  }
});

// Build Tasks

gulp.task('build:js', cb => {
  webpack(webpackConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('build:js', err);
    gutil.log('[build:webpack]', stats.toString({
      colors: true,
    }));
    cb();
  });
});

gulp.task('build:html', () =>
  gulp.src(paths.html).pipe(gulp.dest(paths.out))
);

gulp.task('build:resources', () =>
  gulp.src(paths.resources, { base: 'src' }).pipe(gulp.dest(paths.out))
);

// Dist tasks

gulp.task('dist:package.json', () =>
  gulp.src('package.json')
    .pipe(map(chunk => {
      const data = JSON.parse(chunk.toString());
      data.main = 'backend.js';
      delete data.bin;
      delete data.build;
      delete data.devDependencies;
      delete data.scripts;
      return JSON.stringify(data, null, 2);
    }))
    .pipe(gulp.dest(paths.out))
);

gulp.task('dist:npm-install', ['dist:package.json'], cb =>
  npmInstall({ path: paths.out, args: ['--production'] }, cb)
);

gulp.task('dist:clean:notifier', ['dist:npm-install'], cb =>
  rimraf(path.join(paths.terminalNotifier, 'terminal-notifier.out'), cb)
);

gulp.task('dist:build:notifier', ['dist:clean:notifier'], () =>
  remoteSrc(['terminal-notifier.zip'], {
    base: 'https://github.com/radiant-player/terminal-notifier/releases/download/radiant/',
  })
    .pipe(decompress())
    .pipe(gulp.dest(paths.terminalNotifier))
);

gulp.task('dist:build', ['dist:build:notifier'], () =>
  builder.build({
    asar: false,
    prune: true,
    platform: ['all'],
    arch: 'all',
    dist: true,
    devMetadata: pkg.build,
  })
);

gulp.task('dist:osx', ['dist:build:notifier'], () =>
  builder.build({
    asar: false,
    prune: true,
    platform: ['darwin'],
    arch: 'all',
    dist: true,
    devMetadata: pkg.build,
  })
);

// Group tasks

gulp.task('dist', ['dist:build']);
gulp.task('test', ['test:eslint']);
gulp.task('build', ['build:resources', 'build:html', 'build:js', 'build:notifier']);
gulp.task('run', []);
gulp.task('watch', ['build'], () => {
  gulp.watch([paths.html], ['build:html']);
  gulp.watch([paths.js], ['build:js']);
  gulp.watch([paths.resources], ['build:resources']);
});

gulp.task('default', ['test', 'build', 'run']);
