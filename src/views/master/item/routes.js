import ItemIndex from '@/views/master/item/Index'
import ItemShow from '@/views/master/item/Show'

export default [
  { path: '/master/item', name: 'item.index', component: ItemIndex },
  { path: '/master/item/:id', name: 'item.show', component: ItemShow }
]
