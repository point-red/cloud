import ItemIndex from '@/views/master/item/Index'
import ItemCreate from '@/views/master/item/Create'
import ItemShow from '@/views/master/item/Show'
import ItemEdit from '@/views/master/item/Edit'

export default [
  { path: '/master/item', name: 'item.index', component: ItemIndex },
  { path: '/master/item/create', name: 'item.create', component: ItemCreate },
  { path: '/master/item/:id', name: 'item.show', component: ItemShow },
  { path: '/master/item/:id/edit', name: 'item.edit', component: ItemEdit }
]
