export default [
  { path: '/plugin/pin-point/sales-visitation-form', name: 'PinPointIndex', component: () => import('./Index') },
  { path: '/plugin/pin-point/sales-visitation-form/create', name: 'PinPointCreate', component: () => import('./Create') },
  { path: '/plugin/pin-point/sales-visitation-form/create2', name: 'PinPointCreate2', component: () => import('./Create2') },
  { path: '/plugin/pin-point/sales-visitation-form/create3', name: 'PinPointCreate3', component: () => import('./Create3') },
  { path: '/plugin/pin-point/sales-visitation-form/:id', name: 'PinPointShow', component: () => import('./Show') },
  { path: '/plugin/pin-point/sales-visitation-form/:id/edit', name: 'PinPointEdit', component: () => import('./Edit') }
]
