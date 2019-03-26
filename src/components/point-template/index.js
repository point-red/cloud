/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */
import each from 'lodash/each'

export default {
  install: (Vue) => {
    const components = require.context('./', true, /\.vue$/i)
    components.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], components(key).default))
    each(components, (component, name) => {
      Vue.component(name, component)
    })
  }
}
