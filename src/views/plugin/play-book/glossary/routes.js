import Glossary from './Index'
import Show from './Show'
import Histories from './histories/Index'

export default [
  { path: '/plugin/play-book/glossary', name: 'Glossary', component: Glossary },
  { path: '/plugin/play-book/glossary/:id', name: 'GlossaryShow', component: Show },
  { path: '/plugin/play-book/glossary/:id/histories', name: 'GlossaryHistories', component: Histories }
]
