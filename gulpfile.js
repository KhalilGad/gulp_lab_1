const gulp = require("gulp");
const { src, dest, series, parallel, watch } = require("gulp");
const htmlmin = require("gulp-htmlmin");
var concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const terser = require("gulp-terser");
const imgmin = require("gulp-imagemin");
var rep = require("gulp-replace-image-src");
var htmlreplace = require("gulp-replace-path");

// ----------------------------------------->
let globs = {
  html: "*.html",
  css: "css/**/*.css",
  img: "img/*",
};
// -----------HTML--->
function htmlTask() {
  return src(globs.html)
    .pipe(
      rep({
        prependSrc: "/img/",
        keepOrigin: false,
      })
    )
    .pipe(
      htmlreplace(
        "./css/style.css", "./assets/style.min.css"
      )
    )
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest("dist"));
}

// -----------css--->
function cssTask() {
  return src(globs.css)
    .pipe(concat("style.min.css"))
    .pipe(cleanCSS())
    .pipe(dest("dist/assets"));
}

// -----------img--->
function imgTask() {
  return src(globs.img).pipe(imgmin()).pipe(dest("dist/assets/img"));
}
// ---------------watch----->

function watchTask() {
  watch(globs.css, cssTask);
  watch(globs.html, htmlTask);
  watch(globs.img, imgTask);
}

exports.default = series(
  parallel(imgTask, htmlTask, cssTask,),
  watchTask
);
