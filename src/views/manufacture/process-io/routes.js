import ManufactureProcessIOIndex from '@/views/manufacture/process-io/Index'
import Input from './input/routes'
import Output from './output/routes'

export default [
  { path: '/manufacture/process-io/:id', name: 'manufacture.process.io.index', component: ManufactureProcessIOIndex },
  ...Input,
  ...Output
]
