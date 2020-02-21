import ManufactureProcessingIndex from '@/views/manufacture/processing/Index'
import ProcessingInput from './input/routes'
import ProcessingOutput from './output/routes'

export default [
  { path: '/manufacture/processing', name: 'manufacture.processing.index', component: ManufactureProcessingIndex },
  ...ProcessingInput,
  ...ProcessingOutput
]
