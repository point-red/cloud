# Localization

## Usage

1 Copy english localization folder `src/lang/locale/en` into new locale `src/lang/locale/id`

2 Add new task into `gulpfile.js`


```
gulp.task('lang-id', function () {
  return gulp.src([
    'src/lang/locale/id/**/*.json'
  ])
  .pipe(merge({
    fileName: 'id.json'
  }))
  .pipe(gulp.dest('src/lang/locale'))
})
```

3 Still in `gulpfile.js` add your task into `lang` task

```
gulp.task('lang', ['lang-en', 'lang-id'])
```

4 Add your locale into `lang/lang.js`

```
...
import id from './locale/id.json'

const messages = {
  en,
  id
}
```

5 Add your language into app, so user can choose your language

```
<div class="col-sm-12">
  <div class="block">
    <button class="btn btn-hero btn-outline-secondary btn-block" @click="setLang('id')">Indonesian</button>
  </div>
</div>
```

That's it, now your local language added into our app