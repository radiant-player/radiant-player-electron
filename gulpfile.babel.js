import gulp from 'gulp';
import gutil from 'gulp-util';
import path from 'path';
import remoteSrc from 'gulp-remote-src';
import rimraf from 'rimraf';
import decompress from 'gulp-decompress';
import webpack from 'webpack';

import webpackConfig from './support/config/webpack';

const paths = {
  templates: 'src/app/*.html',
  resources: 'src/resources/**/*',
  out: 'app/out',
  terminalNotifier: 'app/node_modules/node-notifier/vendor',
};

gulp.task('clean', cb => rimraf(paths.dist, cb));

gulp.task('webpack:build', cb => {
  webpack(webpackConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack:build', err);
    gutil.log('[webpack:build]', stats.toString({
      colors: true,
    }));
    cb();
  });
});

gulp.task('templates', () =>
  gulp.src(paths.templates).pipe(gulp.dest(paths.out))
);

gulp.task('resources', () =>
  gulp.src(paths.resources, { base: 'src' }).pipe(gulp.dest(paths.out))
);

gulp.task('clean:notifier', cb =>
  rimraf(path.join(paths.terminalNotifier, 'terminal-notifier.app'), cb)
);

gulp.task('build:notifier', ['clean:notifier'], () =>
  remoteSrc(['terminal-notifier.zip'], {
    base: 'https://github.com/radiant-player/terminal-notifier/releases/download/radiant/',
  })
    .pipe(decompress())
    .pipe(gulp.dest(paths.terminalNotifier))
);

gulp.task('build', ['webpack:build', 'templates', 'resources', 'build:notifier']);

gulp.task('watch', () => {
  webpack({
    ...webpackConfig,
    watch: true,
  }, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack:build', err);
    gutil.log('[webpack:build]', stats.toString({
      colors: true,
    }));
  });

  return gulp.watch('**', ['templates', 'resources']);
});

gulp.task('default', ['build']);
