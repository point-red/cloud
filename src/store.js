import Vue from 'vue'
import Vuex from 'vuex'
import VueCookie from 'vue-cookie'
import UIHandler from './modules/ui-handler'
import Auth from './modules/auth'
import Path from './modules/path'
import Lang from './modules/lang'
import KpiTemplate from './modules/human-resource/kpi/template'
import KpiTemplateGroup from './modules/human-resource/kpi/template-group'
import KpiTemplateIndicator from './modules/human-resource/kpi/template-indicator'
import KpiTemplateScore from './modules/human-resource/kpi/template-score'
import KpiResult from './modules/human-resource/kpi/result'
import Employee from './modules/human-resource/employee/employee'
import EmployeeGroup from './modules/human-resource/employee/group'
import EmployeeReligion from './modules/human-resource/employee/religion'
import EmployeeGender from './modules/human-resource/employee/gender'
import EmployeeMaritalStatus from './modules/human-resource/employee/marital-status'
import EmployeeAssessment from './modules/human-resource/employee/assessment'
import AccountProject from './modules/account/project'
import RequestJoinProject from './modules/account/request-join-project'
import Role from './modules/master/role'
import Permission from './modules/master/permission'
import User from './modules/master/user'
import UserInvitation from './modules/master/user-invitation'
import UserRole from './modules/master/user-role'
import ChartOfAccount from './modules/accounting/chart-of-account'
import ChartOfAccountType from './modules/accounting/chart-of-account-type'
import CutOff from './modules/accounting/cut-off'
import BalanceSheet from './modules/accounting/balance-sheet'
import CurrentRatio from './modules/accounting/ratio-report/current-ratio'
import CashRatio from './modules/accounting/ratio-report/cash-ratio'
import AcidTestRatio from './modules/accounting/ratio-report/acid-test-ratio'
import GrossProfitRatio from './modules/accounting/ratio-report/gross-profit-ratio'
import RateOfReturnInvestment from './modules/accounting/ratio-report/rate-of-return-investment'
import NetProfitMargin from './modules/accounting/ratio-report/net-profit-margin'
import RateOfReturnOnNetWorth from './modules/accounting/ratio-report/rate-of-return-on-net-worth'
import ReturnOnEquity from './modules/accounting/ratio-report/return-on-equity'
import TotalDebtToAssetRatio from './modules/accounting/ratio-report/total-debt-to-asset-ratio'
import TotalDebtToEquityRatio from './modules/accounting/ratio-report/total-debt-to-equity-ratio'
import TotalAssetTurnOver from './modules/accounting/ratio-report/total-asset-turn-over'
import WorkingCapitalTurnOver from './modules/accounting/ratio-report/working-capital-turn-over'
import FixedAssetTurnOver from './modules/accounting/ratio-report/fixed-asset-turn-over'
import InventoryTurnOver from './modules/accounting/ratio-report/inventory-turn-over'
import AverageCollectionPeriodRatio from './modules/accounting/ratio-report/average-collection-period-ratio'
import ScaleWeightTruck from './modules/plugin/scale-weight/truck'
import ScaleWeightMerge from './modules/plugin/scale-weight/merge'
import ScaleWeightItem from './modules/plugin/scale-weight/item'
import SalesVisitationForm from './modules/plugin/pin-point/sales-visitation-form'
import SalesVisitationTarget from './modules/plugin/pin-point/sales-visitation-target'
import PinPointPerformanceReport from './modules/plugin/pin-point/report/performance'
import InterestReasonReport from './modules/plugin/pin-point/report/interest-reason'
import NoInterestReasonReport from './modules/plugin/pin-point/report/no-interest-reason'
import SimilarProductReport from './modules/plugin/pin-point/report/similar-product'
import RepeatOrderReport from './modules/plugin/pin-point/report/repeat-order'
import axios from '@/axios'

Vue.use(Vuex)
Vue.use(VueCookie)

const store = new Vuex.Store({
  actions: {
    reloadVuex ({ dispatch, commit, state }) {
      const accessToken = Vue.cookie.get('TAT')
      if (!accessToken) {
        return
      }

      const expirationDate = Vue.cookie.get('TED')
      const now = new Date()
      if (now >= expirationDate) {
        return
      }
      axios.defaults.headers.common['Authorization'] = Vue.cookie.get('TTT') + ' ' + Vue.cookie.get('TAT')
      commit('Auth/storeUser', {})

      dispatch('Auth/tryAutoLogin', {}, { root: true })
      commit('Lang/updateLang', localStorage.getItem('locale') || 'en')
      state.UIHandler['openLeftSidebar'] = localStorage.getItem('openLeftSidebar') || true
      state.UIHandler['openSideOverlay'] = localStorage.getItem('openSideOverlay') || false
      state.UIHandler['isSidebarInverse'] = localStorage.getItem('isSidebarInverse') || true
    }
  },
  modules: {
    UIHandler,
    Auth,
    Path,
    Lang,
    KpiTemplate,
    KpiTemplateGroup,
    KpiTemplateIndicator,
    KpiTemplateScore,
    KpiResult,
    Employee,
    EmployeeGroup,
    EmployeeReligion,
    EmployeeGender,
    EmployeeMaritalStatus,
    EmployeeAssessment,
    AccountProject,
    RequestJoinProject,
    Role,
    Permission,
    User,
    UserRole,
    UserInvitation,
    ChartOfAccount,
    ChartOfAccountType,
    CutOff,
    BalanceSheet,
    CurrentRatio,
    CashRatio,
    AcidTestRatio,
    GrossProfitRatio,
    RateOfReturnInvestment,
    NetProfitMargin,
    RateOfReturnOnNetWorth,
    ReturnOnEquity,
    TotalDebtToAssetRatio,
    TotalDebtToEquityRatio,
    TotalAssetTurnOver,
    WorkingCapitalTurnOver,
    FixedAssetTurnOver,
    InventoryTurnOver,
    AverageCollectionPeriodRatio,
    ScaleWeightTruck,
    ScaleWeightItem,
    ScaleWeightMerge,
    SalesVisitationForm,
    SalesVisitationTarget,
    PinPointPerformanceReport,
    InterestReasonReport,
    NoInterestReasonReport,
    SimilarProductReport,
    RepeatOrderReport
  }
})

Vue.store = store

export default store
