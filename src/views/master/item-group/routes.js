import ItemGroupIndex from '@/views/master/item-group/Index'
import ItemGroupShow from '@/views/master/item-group/Show'

export default [
  { path: '/master/item-group', name: 'item-group.index', component: ItemGroupIndex },
  { path: '/master/item-group/:id', name: 'item-group.show', component: ItemGroupShow }
]
