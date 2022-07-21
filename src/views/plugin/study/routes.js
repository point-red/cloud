export default {
  path: '/plugin/study',
  component: () => import('./Index.vue'),
  children: [
    {
      path: '',
      name: 'PluginStudy',
      component: () => import('./Base.vue')
    },
    {
      path: 'subject',
      name: 'PluginStudySubject',
      component: () => import('./Subject/Index.vue')
    },
    {
      path: 'sheet',
      name: 'PluginStudySheetIndex',
      component: () => import('./Sheet/Index.vue')
    },
    {
      path: 'sheet-drafts',
      name: 'PluginStudySheetDraft',
      component: () => import('./Sheet/Drafts.vue')
    },
    {
      path: 'sheet/create',
      name: 'PluginStudySheetCreate',
      component: () => import('./Sheet/Create.vue')
    },
    {
      path: 'sheet/:id',
      name: 'PluginStudySheetShow',
      component: () => import('./Sheet/Show.vue')
    },
    {
      path: 'sheet/:id/edit',
      name: 'PluginStudySheetEdit',
      component: () => import('./Sheet/Edit.vue')
    }
  ]
}
