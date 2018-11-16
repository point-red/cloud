import components from './components'
import each from 'lodash/each'

export default {
  install: (Vue) => {
    each(components, (component, name) => {
      Vue.component(name, component)
    })
  }
}
