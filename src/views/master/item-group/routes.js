import ItemGroupIndex from '@/views/master/item-group/Index'
import ItemGroupCreate from '@/views/master/item-group/Create'
import ItemGroupShow from '@/views/master/item-group/Show'
import ItemGroupEdit from '@/views/master/item-group/Edit'

export default [
  { path: '/master/item-group', name: 'item-group.index', component: ItemGroupIndex },
  { path: '/master/item-group/create', name: 'item-group.create', component: ItemGroupCreate },
  { path: '/master/item-group/:id', name: 'item-group.show', component: ItemGroupShow },
  { path: '/master/item-group/:id/edit', name: 'item-group.edit', component: ItemGroupEdit }
]
