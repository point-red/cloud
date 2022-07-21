import Plugin from './Index'
import ScaleWeight from './scale-weight/routes'
import PinPoint from './pin-point/routes'
import PlayBook from './play-book/routes'
import Study from './study/routes'

export default [
  { path: '/plugin', name: 'Plugin', component: Plugin },
  ...ScaleWeight,
  ...PinPoint,
  ...PlayBook,
  Study
]
