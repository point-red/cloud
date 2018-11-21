import InterestReasonReport from './InterestReasonReport'
import NoInterestReasonReport from './NoInterestReasonReport'
import SimilarProductReport from './SimilarProductReport'
import RepeatOrderReport from './RepeatOrderReport'

export default [
  { path: '/plugin/pin-point/report/accumulation/interest-reason', component: InterestReasonReport },
  { path: '/plugin/pin-point/report/accumulation/no-interest-reason', component: NoInterestReasonReport },
  { path: '/plugin/pin-point/report/accumulation/similar-product', component: SimilarProductReport },
  { path: '/plugin/pin-point/report/accumulation/repeat-order', component: RepeatOrderReport }
]
