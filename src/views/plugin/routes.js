import Plugin from './Index'
import ScaleWeight from './scale-weight/routes'
import PinPoint from './pin-point/routes'

export default [
  { path: '/plugin', name: 'Plugin', component: Plugin },
  ...ScaleWeight,
  ...PinPoint
]
