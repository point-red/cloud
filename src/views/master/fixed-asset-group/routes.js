import FixedAssetGroupIndex from '@/views/master/fixed-asset-group/Index'
import FixedAssetGroupShow from '@/views/master/fixed-asset-group/Show'

export default [
  { path: '/master/fixed-asset-groups', name: 'fixed-asset-group.index', component: FixedAssetGroupIndex },
  { path: '/master/fixed-asset-groups/:id', name: 'fixed-asset-group.show', component: FixedAssetGroupShow }
]
