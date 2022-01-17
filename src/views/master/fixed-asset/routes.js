import FixedAssetIndex from '@/views/master/fixed-asset/Index'
import FixedAssetShow from '@/views/master/fixed-asset/Show'

export default [
  { path: '/master/fixed-assets', name: 'fixedAsset.index', component: FixedAssetIndex },
  { path: '/master/fixed-assets/:id', name: 'fixedAsset.show', component: FixedAssetShow }
]
