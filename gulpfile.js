const gulp = require('gulp')
const rename = require('gulp-rename')
const tap = require('gulp-tap')
const fs = require('fs')
const edge = require('edge.js')

// Edgeテンプレート -> HTML
function templates () {
  // テンプレートファイルを読み込む
  edge.registerViews('src/templates')
  // データファイルを読み込む
  const data = fs.existsSync('src/templates/data.json')
    ? JSON.parse(fs.readFileSync('src/templates/data.json', 'utf8'))
    : {}
  // ヘルパー関数を読み込む
  fs.existsSync('src/templates/helpers.js') && require('./src/templates/helpers.js')
  return gulp.src('src/templates/pages/**/*.edge')
    .pipe(tap(file => {
      const contents = edge.renderString(String(file.contents), data)
      file.contents = new Buffer.from(contents)
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('public'))
}

// タスク登録
gulp.task('dev', templates)