<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <router-link
        to="/human-resource/employee"
        class="breadcrumb-item">{{ $t('employee') | titlecase }}</router-link>
      <router-link
        :to="'/human-resource/employee/' + employee.id"
        class="breadcrumb-item">{{ employee.name | titlecase }}</router-link>
      <span class="breadcrumb-item active">Salary</span>
    </breadcrumb>

    <employee-widget :id="id"></employee-widget>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('employee salary')" :header="true">
        <p-block-inner :is-loading="loading">
          <div class="row">
            <div class="col-sm-12">
              <p-form-row
                id="name"
                :label="$t('name')">
                <div slot="body" class="col-lg-9 col-form-label">
                  {{ employee.name }}
                </div>
              </p-form-row>
              <p-form-row
                id="job-location"
                :label="$t('job location')">
                <div slot="body" class="col-lg-9 col-form-label">
                  {{ salary.job_location }}
                </div>
              </p-form-row>
              <p-form-row
                id="salary-date"
                :label="$t('period')">
                <div slot="body" class="col-lg-9 col-form-label">
                  {{ salary.start_date | dateFormat('DD MMMM YYYY') }} - {{ salary.end_date | dateFormat('DD MMMM YYYY') }}
                </div>
              </p-form-row>

              <p-form-row
                id="active-days-in-month"
                :label="$t('active days / month')">
                <div slot="body" class="col-lg-9 col-form-label">
                  {{ salary.active_days_in_month | numberFormat }}
                </div>
              </p-form-row>
            </div>
          </div>

          <p-table>
            <tr slot="p-head">
              <th class="font-size-h6 font-w700"></th>
              <th class="font-size-h6 font-w700"></th>
              <th class="font-size-h6 font-w700">{{ 'W1' }}</th>
              <th class="font-size-h6 font-w700">{{ 'W2' }}</th>
              <th class="font-size-h6 font-w700">{{ 'W3' }}</th>
              <th class="font-size-h6 font-w700">{{ 'W4' }}</th>
              <th class="font-size-h6 font-w700">{{ 'W5' }}</th>
              <th class="font-size-h6 font-w700">{{ $t('weight') }}</th>
            </tr>

            <tr slot="p-body">
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700">{{ $t('active days') | uppercase }}</td>
              <td>{{ salary.active_days_week1 | numberFormat }}</td>
              <td>{{ salary.active_days_week2 | numberFormat }}</td>
              <td>{{ salary.active_days_week3 | numberFormat }}</td>
              <td>{{ salary.active_days_week4 | numberFormat }}</td>
              <td>{{ salary.active_days_week5 | numberFormat }}</td>
              <td class="font-size-h6 font-w700"></td>
            </tr>

            <tr slot="p-body">
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
            </tr>

            <tr slot="p-body">
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700">{{ $t('minimum component') | uppercase }}</td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
            </tr>

            <tr slot="p-body" v-for="(indicator, indicatorIndex) in salaryData.assessments" :key="'indicator' + indicator.id">
              <td>{{ indicatorIndex + 1 }}</td>
              <td>{{ indicator.name }}</td>
              <td>{{ additionalData.score_percentages_assessments[indicatorIndex].week1 | numberFormat }}%</td>
              <td>{{ additionalData.score_percentages_assessments[indicatorIndex].week2 | numberFormat }}%</td>
              <td>{{ additionalData.score_percentages_assessments[indicatorIndex].week3 | numberFormat }}%</td>
              <td>{{ additionalData.score_percentages_assessments[indicatorIndex].week4 | numberFormat }}%</td>
              <td>{{ additionalData.score_percentages_assessments[indicatorIndex].week5 | numberFormat }}%</td>
              <td>{{ indicator.weight | numberFormat }}</td>
            </tr>

            <tr slot="p-body">
              <td class="text-center font-w700"><span class=""></span></td>
              <td class="font-size-h6 font-w700">{{ $t('minimum component score') | uppercase }}</td>
              <td class="font-w700"><span class="">{{ additionalData.total_assessments.week1 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ additionalData.total_assessments.week2 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ additionalData.total_assessments.week3 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ additionalData.total_assessments.week4 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ additionalData.total_assessments.week5 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ average_minimum_component_score | numberFormat }}%</span></td>
            </tr>

            <tr slot="p-body">
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
            </tr>

            <tr slot="p-body">
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700">{{ $t('additional component') | uppercase }}</td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
            </tr>

            <tr slot="p-body" v-for="(achievement, achievementIndex) in salaryData.achievements" :key="'achievement' + achievement.id">
              <td>{{ achievementIndex + 1 }}</td>
              <td v-if="achievementIndex == 0">{{ $t('balance Sku area') | titlecase }}</td>
              <td v-if="achievementIndex == 1">{{ $t('%C national achievement') | titlecase }}</td>
              <td v-if="achievementIndex == 2">{{ $t('%EC national achievement') | titlecase }}</td>
              <td v-if="achievementIndex == 3">{{ $t('%value national achievement') | titlecase }}</td>
              <td v-if="achievementIndex == 4">{{ $t('%C area achievement') | titlecase }}</td>
              <td v-if="achievementIndex == 5">{{ $t('%EC area achievement') | titlecase }}</td>
              <td v-if="achievementIndex == 6">{{ $t('%value area achievement') | titlecase }}</td>
              <td>{{ achievement.week1 | numberFormat }}%</td>
              <td>{{ achievement.week2 | numberFormat }}%</td>
              <td>{{ achievement.week3 | numberFormat }}%</td>
              <td>{{ achievement.week4 | numberFormat }}%</td>
              <td>{{ achievement.week5 | numberFormat }}%</td>
              <td>{{ achievement.weight | numberFormat }}</td>
            </tr>

            <tr slot="p-body">
              <td class="text-center font-w700"><span class=""></span></td>
              <td class="font-size-h6 font-w700">{{ $t('additional component score') | uppercase }}</td>
              <td class="font-w700"><span class="">{{ additionalData.total_achievements.week1 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ additionalData.total_achievements.week2 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ additionalData.total_achievements.week3 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ additionalData.total_achievements.week4 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ additionalData.total_achievements.week5 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ average_additional_component_score | numberFormat }}%</span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td class="font-size-h6 font-w700">{{ $t('final score') | uppercase }}</td>
              <td class="font-w700"><span class="">{{ salary_final_score.week1 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ salary_final_score.week2 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ salary_final_score.week3 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ salary_final_score.week4 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ salary_final_score.week5 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ average_final_score | numberFormat }}%</span></td>
            </tr>

            <tr slot="p-body">
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
              <td class="font-size-h6 font-w700"><br/><br/></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('minimum component amount') | titlecase }}</td>
              <td><span class="">Rp {{ minimum_component_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">Rp {{ minimum_component_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">Rp {{ minimum_component_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">Rp {{ minimum_component_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">Rp {{ minimum_component_amount_week_5 | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('additional component amount') | titlecase }}</td>
              <td><span class="">Rp {{ additional_component_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">Rp {{ additional_component_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">Rp {{ additional_component_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">Rp {{ additional_component_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">Rp {{ additional_component_amount_week_5 | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('total amount') | titlecase }}</td>
              <td><span class="">Rp {{ total_component_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">Rp {{ total_component_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">Rp {{ total_component_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">Rp {{ total_component_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">Rp {{ total_component_amount_week_5 | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td class="font-size-h6 font-w700">{{ $t('total amount with allowance') | titlecase }}</td>
              <td class="font-w700"><span class="">Rp {{ total_amount_week_1 | numberFormat }}</span></td>
              <td class="font-w700"><span class="">Rp {{ total_amount_week_2 | numberFormat }}</span></td>
              <td class="font-w700"><span class="">Rp {{ total_amount_week_3 | numberFormat }}</span></td>
              <td class="font-w700"><span class="">Rp {{ total_amount_week_4 | numberFormat }}</span></td>
              <td class="font-w700"><span class="">Rp {{ total_amount_week_5 | numberFormat }}</span></td>
              <td class="font-w700"><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('receivable cut > 60 days') | titlecase }}</td>
              <td>Rp {{ salary.receivable_cut_60_days_week1 | numberFormat }}</td>
              <td>Rp {{ salary.receivable_cut_60_days_week2 | numberFormat }}</td>
              <td>Rp {{ salary.receivable_cut_60_days_week3 | numberFormat }}</td>
              <td>Rp {{ salary.receivable_cut_60_days_week4 | numberFormat }}</td>
              <td>Rp {{ salary.receivable_cut_60_days_week5 | numberFormat }}</td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td class="font-size-h6 font-w700">{{ $t('total amount received') | titlecase }}</td>
              <td class="font-w700"><span class="">Rp {{ total_amount_received_week_1 | numberFormat }}</span></td>
              <td class="font-w700"><span class="">Rp {{ total_amount_received_week_2 | numberFormat }}</span></td>
              <td class="font-w700"><span class="">Rp {{ total_amount_received_week_3 | numberFormat }}</span></td>
              <td class="font-w700"><span class="">Rp {{ total_amount_received_week_4 | numberFormat }}</span></td>
              <td class="font-w700"><span class="">Rp {{ total_amount_received_week_5 | numberFormat }}</span></td>
              <td class="font-w700"><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-w700"><span class="">Rp {{ total_amount_received | numberFormat }}</span></td>
              <td class="font-w700"><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('company profit') | titlecase }}</td>
              <td><span class="">Rp {{ company_profit_week_1 | numberFormat }}</span></td>
              <td><span class="">Rp {{ company_profit_week_2 | numberFormat }}</span></td>
              <td><span class="">Rp {{ company_profit_week_3 | numberFormat }}</span></td>
              <td><span class="">Rp {{ company_profit_week_4 | numberFormat }}</span></td>
              <td><span class="">Rp {{ company_profit_week_5 | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('overdue receivable') | titlecase }}</td>
              <td>Rp {{ salary.overdue_receivable_week1 | numberFormat }}</td>
              <td>Rp {{ salary.overdue_receivable_week2 | numberFormat }}</td>
              <td>Rp {{ salary.overdue_receivable_week3 | numberFormat }}</td>
              <td>Rp {{ salary.overdue_receivable_week4 | numberFormat }}</td>
              <td>Rp {{ salary.overdue_receivable_week5 | numberFormat }}</td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('payment from marketing') | titlecase }}</td>
              <td>Rp {{ salary.payment_from_marketing_week1 | numberFormat }}</td>
              <td>Rp {{ salary.payment_from_marketing_week2 | numberFormat }}</td>
              <td>Rp {{ salary.payment_from_marketing_week3 | numberFormat }}</td>
              <td>Rp {{ salary.payment_from_marketing_week4 | numberFormat }}</td>
              <td>Rp {{ salary.payment_from_marketing_week5 | numberFormat }}</td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('payment from sales') | titlecase }}</td>
              <td>Rp {{ salary.payment_from_sales_week1 | numberFormat }}</td>
              <td>Rp {{ salary.payment_from_sales_week2 | numberFormat }}</td>
              <td>Rp {{ salary.payment_from_sales_week3 | numberFormat }}</td>
              <td>Rp {{ salary.payment_from_sales_week4 | numberFormat }}</td>
              <td>Rp {{ salary.payment_from_sales_week5 | numberFormat }}</td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('payment from spg') | titlecase }}</td>
              <td>Rp {{ salary.payment_from_spg_week1 | numberFormat }}</td>
              <td>Rp {{ salary.payment_from_spg_week2 | numberFormat }}</td>
              <td>Rp {{ salary.payment_from_spg_week3 | numberFormat }}</td>
              <td>Rp {{ salary.payment_from_spg_week4 | numberFormat }}</td>
              <td>Rp {{ salary.payment_from_spg_week5 | numberFormat }}</td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('received cash payment') | titlecase }}</td>
              <td><span class="">Rp {{ salary.cash_payment_week1 | numberFormat }}</span></td>
              <td><span class="">Rp {{ salary.cash_payment_week2 | numberFormat }}</span></td>
              <td><span class="">Rp {{ salary.cash_payment_week3 | numberFormat }}</span></td>
              <td><span class="">Rp {{ salary.cash_payment_week4 | numberFormat }}</span></td>
              <td><span class="">Rp {{ salary.cash_payment_week5 | numberFormat }}</span></td>
              <td><span class="font-w700">Rp {{ total_payment | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('settlement difference minus amount') | titlecase }}</td>
              <td><span class="">Rp {{ settlement_difference_minus_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">Rp {{ settlement_difference_minus_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">Rp {{ settlement_difference_minus_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">Rp {{ settlement_difference_minus_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">Rp {{ settlement_difference_minus_amount_week_5 | numberFormat }}</span></td>
              <td><span class="font-w700">Rp {{ total_settlement_difference_minus_amount | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('company profit difference minus amount') | titlecase }}</td>
              <td><span class="">Rp {{ company_profit_difference_minus_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">Rp {{ company_profit_difference_minus_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">Rp {{ company_profit_difference_minus_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">Rp {{ company_profit_difference_minus_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">Rp {{ company_profit_difference_minus_amount_week_5 | numberFormat }}</span></td>
              <td><span class="font-w700">Rp {{ total_company_profit_difference_minus_amount | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('weekly sales') | titlecase }}</td>
              <td><span class="">Rp {{ salary.weekly_sales_week1 | numberFormat }}</span></td>
              <td><span class="">Rp {{ salary.weekly_sales_week2 | numberFormat }}</span></td>
              <td><span class="">Rp {{ salary.weekly_sales_week3 | numberFormat }}</span></td>
              <td><span class="">Rp {{ salary.weekly_sales_week4 | numberFormat }}</span></td>
              <td><span class="">Rp {{ salary.weekly_sales_week5 | numberFormat }}</span></td>
              <td><span class="font-w700">Rp {{ total_weekly_sales | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('wa daily report') | titlecase }}</td>
              <td><span class="">{{ salary.wa_daily_report_week1 | numberFormat }}%</span></td>
              <td><span class="">{{ salary.wa_daily_report_week2 | numberFormat }}%</span></td>
              <td><span class="">{{ salary.wa_daily_report_week3 | numberFormat }}%</span></td>
              <td><span class="">{{ salary.wa_daily_report_week4 | numberFormat }}%</span></td>
              <td><span class="">{{ salary.wa_daily_report_week5 | numberFormat }}%</span></td>
              <td><span class=""></span></td>
            </tr>
          </p-table>
        </p-block-inner>
      </p-block>
    </form>
  </div>
</template>

<script>
import TabMenu from '../TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import EmployeeWidget from '../EmployeeWidget'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource,
    EmployeeWidget
  },
  data () {
    return {
      id: this.$route.params.id,
      salaryId: this.$route.params.salaryId,
      title: 'Employee Salary',
      loading: false,
      salaryData: {
        assessments: {},
        achievements: {}
      },
      additionalData: {
        score_percentages_assessments: {},
        total_assessments: {},
        total_achievements: {}
      },
      base_salary_week_1: 0,
      base_salary_week_2: 0,
      base_salary_week_3: 0,
      base_salary_week_4: 0,
      base_salary_week_5: 0,
      salary_final_score: {},
      real_transport_allowance_week_1: 0,
      real_transport_allowance_week_2: 0,
      real_transport_allowance_week_3: 0,
      real_transport_allowance_week_4: 0,
      real_transport_allowance_week_5: 0,
      minimum_component_amount_week_1: 0,
      minimum_component_amount_week_2: 0,
      minimum_component_amount_week_3: 0,
      minimum_component_amount_week_4: 0,
      minimum_component_amount_week_5: 0,
      multiplier_kpi_week_1: 0,
      multiplier_kpi_week_2: 0,
      multiplier_kpi_week_3: 0,
      multiplier_kpi_week_4: 0,
      multiplier_kpi_week_5: 0,
      additional_component_point_week_1: 0,
      additional_component_point_week_2: 0,
      additional_component_point_week_3: 0,
      additional_component_point_week_4: 0,
      additional_component_point_week_5: 0,
      additional_component_amount_week_1: 0,
      additional_component_amount_week_2: 0,
      additional_component_amount_week_3: 0,
      additional_component_amount_week_4: 0,
      additional_component_amount_week_5: 0,
      total_component_amount_week_1: 0,
      total_component_amount_week_2: 0,
      total_component_amount_week_3: 0,
      total_component_amount_week_4: 0,
      total_component_amount_week_5: 0,
      total_amount_week_1: 0,
      total_amount_week_2: 0,
      total_amount_week_3: 0,
      total_amount_week_4: 0,
      total_amount_week_5: 0,
      total_amount_received_week_1: 0,
      total_amount_received_week_2: 0,
      total_amount_received_week_3: 0,
      total_amount_received_week_4: 0,
      total_amount_received_week_5: 0,
      total_amount_received: 0,
      company_profit_week_1: 0,
      company_profit_week_2: 0,
      company_profit_week_3: 0,
      company_profit_week_4: 0,
      company_profit_week_5: 0,
      settlement_difference_minus_amount_week_1: 0,
      settlement_difference_minus_amount_week_2: 0,
      settlement_difference_minus_amount_week_3: 0,
      settlement_difference_minus_amount_week_4: 0,
      settlement_difference_minus_amount_week_5: 0,
      company_profit_difference_minus_amount_week_1: 0,
      company_profit_difference_minus_amount_week_2: 0,
      company_profit_difference_minus_amount_week_3: 0,
      company_profit_difference_minus_amount_week_4: 0,
      company_profit_difference_minus_amount_week_5: 0,
      average_minimum_component_score: 0,
      average_additional_component_score: 0,
      average_final_score: 0,
      total_payment: 0,
      total_settlement_difference_minus_amount: 0,
      total_company_profit_difference_minus_amount: 0,
      total_weekly_sales: 0
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployee', ['employee']),
    ...mapGetters('humanResourceEmployeeSalary', ['salary', 'additional'])
  },
  created () {
    this.loading = true
    this.findEmployeeSalary({
      employeeId: this.id,
      salaryId: this.salaryId
    }).then(
      (response) => {
        this.$set(this, 'salaryData', this.salary)
        this.$set(this, 'additionalData', this.additional)
        this.calculate()
        this.loading = false
      },
      (error) => {
        console.log(JSON.stringify(error))
      }
    )
  },
  methods: {
    ...mapActions('humanResourceEmployeeSalary', {
      findEmployeeSalary: 'find'
    }),
    calculate () {
      this.salary_final_score.week1 = ((this.additionalData.total_assessments.week1 || 0) + (this.additionalData.total_achievements.week1 || 0)) / 2
      this.salary_final_score.week2 = ((this.additionalData.total_assessments.week2 || 0) + (this.additionalData.total_achievements.week2 || 0)) / 2
      this.salary_final_score.week3 = ((this.additionalData.total_assessments.week3 || 0) + (this.additionalData.total_achievements.week3 || 0)) / 2
      this.salary_final_score.week4 = ((this.additionalData.total_assessments.week4 || 0) + (this.additionalData.total_achievements.week4 || 0)) / 2
      this.salary_final_score.week5 = ((this.additionalData.total_assessments.week5 || 0) + (this.additionalData.total_achievements.week5 || 0)) / 2

      this.salary.active_days_in_month = this.salary.active_days_in_month || 0

      if (Number(this.salary.active_days_in_month) != 0) {
        let baseSalaryPerWeek = (this.salary.base_salary || 0) / Number(this.salary.active_days_in_month || 0)

        if (this.additionalData.score_percentages_assessments.length != 0) {
          this.base_salary_week_1 = baseSalaryPerWeek * Number(this.salary.active_days_week1 || 0) * ((Number(this.additionalData.score_percentages_assessments[0].week1 || 0)) / 100)
          this.base_salary_week_2 = baseSalaryPerWeek * Number(this.salary.active_days_week2 || 0) * ((Number(this.additionalData.score_percentages_assessments[0].week2 || 0)) / 100)
          this.base_salary_week_3 = baseSalaryPerWeek * Number(this.salary.active_days_week3 || 0) * ((Number(this.additionalData.score_percentages_assessments[0].week3 || 0)) / 100)
          this.base_salary_week_4 = baseSalaryPerWeek * Number(this.salary.active_days_week4 || 0) * ((Number(this.additionalData.score_percentages_assessments[0].week4 || 0)) / 100)
          this.base_salary_week_5 = baseSalaryPerWeek * Number(this.salary.active_days_week5 || 0) * ((Number(this.additionalData.score_percentages_assessments[0].week5 || 0)) / 100)

          this.real_transport_allowance_week_1 = this.salary.daily_transport_allowance * Number(this.salary.active_days_week1 || 0) * ((Number(this.additionalData.score_percentages_assessments[0].week1 || 0)) / 100)
          this.real_transport_allowance_week_2 = this.salary.daily_transport_allowance * Number(this.salary.active_days_week2 || 0) * ((Number(this.additionalData.score_percentages_assessments[0].week2 || 0)) / 100)
          this.real_transport_allowance_week_3 = this.salary.daily_transport_allowance * Number(this.salary.active_days_week3 || 0) * ((Number(this.additionalData.score_percentages_assessments[0].week3 || 0)) / 100)
          this.real_transport_allowance_week_4 = this.salary.daily_transport_allowance * Number(this.salary.active_days_week4 || 0) * ((Number(this.additionalData.score_percentages_assessments[0].week4 || 0)) / 100)
          this.real_transport_allowance_week_5 = this.salary.daily_transport_allowance * Number(this.salary.active_days_week5 || 0) * ((Number(this.additionalData.score_percentages_assessments[0].week5 || 0)) / 100)

          this.multiplier_kpi_week_1 = (Number(this.salary.multiplier_kpi || 0) * Number(this.salary.active_days_week1 || 0) * ((Number(this.additionalData.score_percentages_assessments[0].week1 || 0)) / 100) / Number(this.salary.active_days_in_month || 0)) || 0
          this.multiplier_kpi_week_2 = (Number(this.salary.multiplier_kpi || 0) * Number(this.salary.active_days_week2 || 0) * ((Number(this.additionalData.score_percentages_assessments[0].week2 || 0)) / 100) / Number(this.salary.active_days_in_month || 0)) || 0
          this.multiplier_kpi_week_3 = (Number(this.salary.multiplier_kpi || 0) * Number(this.salary.active_days_week3 || 0) * ((Number(this.additionalData.score_percentages_assessments[0].week3 || 0)) / 100) / Number(this.salary.active_days_in_month || 0)) || 0
          this.multiplier_kpi_week_4 = (Number(this.salary.multiplier_kpi || 0) * Number(this.salary.active_days_week4 || 0) * ((Number(this.additionalData.score_percentages_assessments[0].week4 || 0)) / 100) / Number(this.salary.active_days_in_month || 0)) || 0
          this.multiplier_kpi_week_5 = (Number(this.salary.multiplier_kpi || 0) * Number(this.salary.active_days_week5 || 0) * ((Number(this.additionalData.score_percentages_assessments[0].week5 || 0)) / 100) / Number(this.salary.active_days_in_month || 0)) || 0
        }
      }

      this.minimum_component_amount_week_1 = Number(this.additionalData.total_assessments.week1 || 0) * (Number(this.base_salary_week_1 || 0) / 100)
      this.minimum_component_amount_week_2 = Number(this.additionalData.total_assessments.week2 || 0) * (Number(this.base_salary_week_2 || 0) / 100)
      this.minimum_component_amount_week_3 = Number(this.additionalData.total_assessments.week3 || 0) * (Number(this.base_salary_week_3 || 0) / 100)
      this.minimum_component_amount_week_4 = Number(this.additionalData.total_assessments.week4 || 0) * (Number(this.base_salary_week_4 || 0) / 100)
      this.minimum_component_amount_week_5 = Number(this.additionalData.total_assessments.week5 || 0) * (Number(this.base_salary_week_5 || 0) / 100)

      this.additional_component_point_week_1 = Number(this.additionalData.total_achievements.week1 || 0) * (Number(this.multiplier_kpi_week_1 || 0) / 100)
      this.additional_component_point_week_2 = Number(this.additionalData.total_achievements.week2 || 0) * (Number(this.multiplier_kpi_week_2 || 0) / 100)
      this.additional_component_point_week_3 = Number(this.additionalData.total_achievements.week3 || 0) * (Number(this.multiplier_kpi_week_3 || 0) / 100)
      this.additional_component_point_week_4 = Number(this.additionalData.total_achievements.week4 || 0) * (Number(this.multiplier_kpi_week_4 || 0) / 100)
      this.additional_component_point_week_5 = Number(this.additionalData.total_achievements.week5 || 0) * (Number(this.multiplier_kpi_week_5 || 0) / 100)

      this.additional_component_amount_week_1 = Number(this.additional_component_point_week_1 || 0) * 1000
      this.additional_component_amount_week_2 = Number(this.additional_component_point_week_2 || 0) * 1000
      this.additional_component_amount_week_3 = Number(this.additional_component_point_week_3 || 0) * 1000
      this.additional_component_amount_week_4 = Number(this.additional_component_point_week_4 || 0) * 1000
      this.additional_component_amount_week_5 = Number(this.additional_component_point_week_5 || 0) * 1000

      this.total_component_amount_week_1 = Number(this.minimum_component_amount_week_1 || 0) + Number(this.additional_component_amount_week_1 || 0)
      this.total_component_amount_week_2 = Number(this.minimum_component_amount_week_2 || 0) + Number(this.additional_component_amount_week_2 || 0)
      this.total_component_amount_week_3 = Number(this.minimum_component_amount_week_3 || 0) + Number(this.additional_component_amount_week_3 || 0)
      this.total_component_amount_week_4 = Number(this.minimum_component_amount_week_4 || 0) + Number(this.additional_component_amount_week_4 || 0)
      this.total_component_amount_week_5 = Number(this.minimum_component_amount_week_5 || 0) + Number(this.additional_component_amount_week_5 || 0)

      this.total_amount_week_1 = Number(this.total_component_amount_week_1 || 0) + Number(this.real_transport_allowance_week_1 || 0)
      this.total_amount_week_2 = Number(this.total_component_amount_week_2 || 0) + Number(this.real_transport_allowance_week_2 || 0)
      this.total_amount_week_3 = Number(this.total_component_amount_week_3 || 0) + Number(this.real_transport_allowance_week_3 || 0)
      this.total_amount_week_4 = Number(this.total_component_amount_week_4 || 0) + Number(this.real_transport_allowance_week_4 || 0)
      this.total_amount_week_5 = Number(this.total_component_amount_week_5 || 0) + Number(this.real_transport_allowance_week_5 || 0)

      this.total_amount_received_week_1 = Number(this.total_amount_week_1 || 0) + Number(this.salary.communication_allowance || 0) + Number(this.salary.functional_allowance || 0)
      this.total_amount_received_week_2 = Number(this.total_amount_week_2 || 0)
      this.total_amount_received_week_3 = Number(this.total_amount_week_3 || 0)
      this.total_amount_received_week_4 = Number(this.total_amount_week_4 || 0)
      this.total_amount_received_week_5 = Number(this.total_amount_week_5 || 0)

      this.total_amount_received = Number(this.total_amount_received_week_1 || 0) + Number(this.total_amount_received_week_2 || 0) + Number(this.total_amount_received_week_3 || 0) + Number(this.total_amount_received_week_4 || 0) + Number(this.total_amount_received_week_5 || 0)

      this.company_profit_week_1 = 0.05 * (Number(this.salary.payment_from_marketing_week1 || 0) + Number(this.salary.payment_from_sales_week1 || 0) + Number(this.salary.payment_from_spg_week1 || 0) + Number(this.salary.cash_payment_week1 || 0))
      this.company_profit_week_2 = 0.05 * (Number(this.salary.payment_from_marketing_week2 || 0) + Number(this.salary.payment_from_sales_week2 || 0) + Number(this.salary.payment_from_spg_week2 || 0) + Number(this.salary.cash_payment_week2 || 0))
      this.company_profit_week_3 = 0.05 * (Number(this.salary.payment_from_marketing_week3 || 0) + Number(this.salary.payment_from_sales_week3 || 0) + Number(this.salary.payment_from_spg_week3 || 0) + Number(this.salary.cash_payment_week3 || 0))
      this.company_profit_week_4 = 0.05 * (Number(this.salary.payment_from_marketing_week4 || 0) + Number(this.salary.payment_from_sales_week4 || 0) + Number(this.salary.payment_from_spg_week4 || 0) + Number(this.salary.cash_payment_week4 || 0))
      this.company_profit_week_5 = 0.05 * (Number(this.salary.payment_from_marketing_week5 || 0) + Number(this.salary.payment_from_sales_week5 || 0) + Number(this.salary.payment_from_spg_week5 || 0) + Number(this.salary.cash_payment_week5 || 0))

      this.settlement_difference_minus_amount_week_1 = Number(this.salary.payment_from_marketing_week1 || 0) + Number(this.salary.payment_from_sales_week1 || 0) + Number(this.salary.payment_from_spg_week1 || 0) + Number(this.salary.cash_payment_week1 || 0) - Number(this.total_amount_received_week_1 || 0)
      this.settlement_difference_minus_amount_week_2 = Number(this.salary.payment_from_marketing_week2 || 0) + Number(this.salary.payment_from_sales_week2 || 0) + Number(this.salary.payment_from_spg_week2 || 0) + Number(this.salary.cash_payment_week2 || 0) - Number(this.total_amount_received_week_2 || 0)
      this.settlement_difference_minus_amount_week_3 = Number(this.salary.payment_from_marketing_week3 || 0) + Number(this.salary.payment_from_sales_week3 || 0) + Number(this.salary.payment_from_spg_week3 || 0) + Number(this.salary.cash_payment_week3 || 0) - Number(this.total_amount_received_week_3 || 0)
      this.settlement_difference_minus_amount_week_4 = Number(this.salary.payment_from_marketing_week4 || 0) + Number(this.salary.payment_from_sales_week4 || 0) + Number(this.salary.payment_from_spg_week4 || 0) + Number(this.salary.cash_payment_week4 || 0) - Number(this.total_amount_received_week_4 || 0)
      this.settlement_difference_minus_amount_week_5 = Number(this.salary.payment_from_marketing_week5 || 0) + Number(this.salary.payment_from_sales_week5 || 0) + Number(this.salary.payment_from_spg_week5 || 0) + Number(this.salary.cash_payment_week5 || 0) - Number(this.total_amount_received_week_5 || 0)

      this.company_profit_difference_minus_amount_week_1 = Number(this.company_profit_week_1 || 0) - Number(this.total_amount_week_1 || 0)
      this.company_profit_difference_minus_amount_week_2 = Number(this.company_profit_week_2 || 0) - Number(this.total_amount_week_2 || 0)
      this.company_profit_difference_minus_amount_week_3 = Number(this.company_profit_week_3 || 0) - Number(this.total_amount_week_3 || 0)
      this.company_profit_difference_minus_amount_week_4 = Number(this.company_profit_week_4 || 0) - Number(this.total_amount_week_4 || 0)
      this.company_profit_difference_minus_amount_week_5 = Number(this.company_profit_week_5 || 0) - Number(this.total_amount_week_5 || 0)

      var dayAverageDivisor = 0
      var totalMinimumComponentScore = 0
      var totalAdditionalComponentScore = 0
      var totalFinalScore = 0

      if (this.salary.active_days_week1 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.additionalData.total_assessments.week1
        totalAdditionalComponentScore += this.additionalData.total_achievements.week1
        totalFinalScore += this.salary_final_score.week1
      }
      if (this.salary.active_days_week2 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.additionalData.total_assessments.week2
        totalAdditionalComponentScore += this.additionalData.total_achievements.week2
        totalFinalScore += this.salary_final_score.week2
      }
      if (this.salary.active_days_week3 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.additionalData.total_assessments.week3
        totalAdditionalComponentScore += this.additionalData.total_achievements.week3
        totalFinalScore += this.salary_final_score.week3
      }
      if (this.salary.active_days_week4 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.additionalData.total_assessments.week4
        totalAdditionalComponentScore += this.additionalData.total_achievements.week4
        totalFinalScore += this.salary_final_score.week4
      }
      if (this.salary.active_days_week5 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.additionalData.total_assessments.week5
        totalAdditionalComponentScore += this.additionalData.total_achievements.week5
        totalFinalScore += this.salary_final_score.week5
      }

      this.average_minimum_component_score = dayAverageDivisor != 0 ? totalMinimumComponentScore / dayAverageDivisor : 0
      this.average_additional_component_score = dayAverageDivisor != 0 ? totalAdditionalComponentScore / dayAverageDivisor : 0
      this.average_final_score = dayAverageDivisor != 0 ? totalFinalScore / dayAverageDivisor : 0

      this.total_payment = Number(this.salary.payment_from_marketing_week1 || 0) + Number(this.salary.payment_from_sales_week1 || 0) + Number(this.salary.payment_from_spg_week1 || 0) + Number(this.salary.cash_payment_week1 || 0) + Number(this.salary.payment_from_marketing_week2 || 0) + Number(this.salary.payment_from_sales_week2 || 0) + Number(this.salary.payment_from_spg_week2 || 0) + Number(this.salary.cash_payment_week2 || 0) + Number(this.salary.payment_from_marketing_week3 || 0) + Number(this.salary.payment_from_sales_week3 || 0) + Number(this.salary.payment_from_spg_week3 || 0) + Number(this.salary.cash_payment_week3 || 0) + Number(this.salary.payment_from_marketing_week4 || 0) + Number(this.salary.payment_from_sales_week4 || 0) + Number(this.salary.payment_from_spg_week4 || 0) + Number(this.salary.cash_payment_week4 || 0) + Number(this.salary.payment_from_marketing_week5 || 0) + Number(this.salary.payment_from_sales_week5 || 0) + Number(this.salary.payment_from_spg_week5 || 0) + Number(this.salary.cash_payment_week5 || 0)

      this.total_settlement_difference_minus_amount = this.settlement_difference_minus_amount_week_1 + this.settlement_difference_minus_amount_week_2 + this.settlement_difference_minus_amount_week_3 + this.settlement_difference_minus_amount_week_4 + this.settlement_difference_minus_amount_week_5

      this.total_company_profit_difference_minus_amount = this.company_profit_difference_minus_amount_week_1 + this.company_profit_difference_minus_amount_week_2 + this.company_profit_difference_minus_amount_week_3 + this.company_profit_difference_minus_amount_week_4 + this.company_profit_difference_minus_amount_week_5

      this.total_weekly_sales = this.salary.weekly_sales_week1 + this.salary.weekly_sales_week2 + this.salary.weekly_sales_week3 + this.salary.weekly_sales_week4 + this.salary.weekly_sales_week5
    }
  }
}
</script>
