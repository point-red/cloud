import PsychotestIndex from './Index'
import PsychotestLogin from './Login'
import PsychotestRegister from './Register'
import PsychotestKraepelin from './kraepelin/Index'
import PsychotestPapikostick from './papikostick/Index'

export default [
  { path: '/psychotest', name: 'PsychotestIndex', component: PsychotestIndex },
  { path: '/psychotest/login', name: 'PsychotestLogin', component: PsychotestLogin },
  { path: '/psychotest/register', name: 'PsychotestRegister', component: PsychotestRegister },
  { path: '/psychotest/kraepelin', name: 'PsychotestKraepelin', component: PsychotestKraepelin },
  { path: '/psychotest/papikostick', name: 'PsychotestPapikostick', component: PsychotestPapikostick }
]
