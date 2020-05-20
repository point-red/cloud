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
      <router-link
        :to="'/human-resource/employee/' + employee.id + '/salary'"
        class="breadcrumb-item">Salary</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <employee-widget :id="id"></employee-widget>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('employee salary')" :header="true">
        <p-block-inner :is-loading="isLoading">
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
                :label="$t('location')">
                <div slot="body" class="col-lg-9 col-form-label">
                  {{ form.salary.job_location }}
                </div>
              </p-form-row>
              <p-form-row
                id="salary-date"
                :label="$t('period')">
                <div slot="body" class="col-lg-9 col-form-label">
                  {{ form.salary.start_date | dateFormat('DD MMMM YYYY') }} - {{ form.salary.end_date | dateFormat('DD MMMM YYYY') }}
                </div>
              </p-form-row>
              <p-form-row
                id="active-days-in-month"
                name="active-days-in-month"
                :label="$t('active days / month')">
                <div slot="body" class="col-lg-3">
                  <p-form-number
                    v-model="form.salary.active_days_in_month"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('active-days-in-month')"
                    @errors="form.errors.set('active-days-in-month', null)"/>
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
              <td class="font-size-h6 font-w700">
                <p-form-number
                  v-model="form.salary.active_days_week1"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('active-days-week-1')"
                  @errors="form.errors.set('active-days-week-1', null)"/>
              </td>
              <td class="font-size-h6 font-w700">
                <p-form-number
                  v-model="form.salary.active_days_week2"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('active-days-week-2')"
                  @errors="form.errors.set('active-days-week-2', null)"/>
              </td>
              <td class="font-size-h6 font-w700">
                <p-form-number
                  v-model="form.salary.active_days_week3"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('active-days-week-3')"
                  @errors="form.errors.set('active-days-week-3', null)"/>
              </td>
              <td class="font-size-h6 font-w700">
                <p-form-number
                  v-model="form.salary.active_days_week4"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('active-days-week-4')"
                  @errors="form.errors.set('active-days-week-4', null)"/>
              </td>
              <td class="font-size-h6 font-w700">
                <p-form-number
                  v-model="form.salary.active_days_week5"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('active-days-week-5')"
                  @errors="form.errors.set('active-days-week-5', null)"/>
              </td>
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

            <tr slot="p-body" v-for="(indicator, indicatorIndex) in form.salary.assessments" :key="'indicator' + indicator.id">
              <td>{{ indicatorIndex + 1 }}</td>
              <td>{{ indicator.name }}</td>
              <td>{{ additionalData.score_percentages_assessments[indicatorIndex].week1 | numberFormat }}%</td>
              <td>{{ additionalData.score_percentages_assessments[indicatorIndex].week2 | numberFormat }}%</td>
              <td>{{ additionalData.score_percentages_assessments[indicatorIndex].week3 | numberFormat }}%</td>
              <td>{{ additionalData.score_percentages_assessments[indicatorIndex].week4 | numberFormat }}%</td>
              <td>{{ additionalData.score_percentages_assessments[indicatorIndex].week5 | numberFormat }}%</td>
              <td>
                <p-form-input
                  id="indicator-weight"
                  name="indicator-weight"
                  v-model="indicator.weight"
                  :disabled="isSaving"
                  @input="salaryAssessmentWeight"
                  :is-text-right="false"/>
              </td>
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

            <tr slot="p-body" v-for="(achievement, achievementIndex) in form.salary.achievements" :key="'achievement' + achievement.id">
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
              <td>
                <p-form-input
                  id="indicator-weight"
                  name="indicator-weight"
                  v-model="achievement.weight"
                  :disabled="isSaving"
                  @input="salaryAchievementWeight"
                  :is-text-right="false"/>
              </td>
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
              <td>{{ $t('area value') | titlecase }}</td>
              <td><span class="">Rp {{ form.salary.base_salary | numberFormat }}</span></td>
              <td><span class="">Rp {{ form.salary.base_salary | numberFormat }}</span></td>
              <td><span class="">Rp {{ form.salary.base_salary | numberFormat }}</span></td>
              <td><span class="">Rp {{ form.salary.base_salary | numberFormat }}</span></td>
              <td><span class="">Rp {{ form.salary.base_salary | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('area value per week') | titlecase }}</td>
              <td><span class="">{{ base_salary_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ base_salary_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ base_salary_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ base_salary_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ base_salary_week_5 | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('daily transport') | titlecase }}</td>
              <td><span class="">{{ form.salary.daily_transport_allowance | numberFormat }}</span></td>
              <td><span class="">{{ form.salary.daily_transport_allowance | numberFormat }}</span></td>
              <td><span class="">{{ form.salary.daily_transport_allowance | numberFormat }}</span></td>
              <td><span class="">{{ form.salary.daily_transport_allowance | numberFormat }}</span></td>
              <td><span class="">{{ form.salary.daily_transport_allowance | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('real transport received') | titlecase }}</td>
              <td><span class="">{{ real_transport_allowance_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ real_transport_allowance_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ real_transport_allowance_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ real_transport_allowance_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ real_transport_allowance_week_5 | numberFormat }}</span></td>
              <td class="font-w700"><span class="">{{ real_transport_allowance_total | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('minimum component') | titlecase }}</td>
              <td><span class="">{{ minimum_component_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ minimum_component_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ minimum_component_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ minimum_component_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ minimum_component_amount_week_5 | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('multiplier kpi') | titlecase }}</td>
              <td><span class="">{{ form.salary.multiplier_kpi | numberFormat }}</span></td>
              <td><span class="">{{ form.salary.multiplier_kpi | numberFormat }}</span></td>
              <td><span class="">{{ form.salary.multiplier_kpi | numberFormat }}</span></td>
              <td><span class="">{{ form.salary.multiplier_kpi | numberFormat }}</span></td>
              <td><span class="">{{ form.salary.multiplier_kpi | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('multiplier kpi (weekly result)') | titlecase }}</td>
              <td><span class="">{{ multiplier_kpi_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ multiplier_kpi_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ multiplier_kpi_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ multiplier_kpi_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ multiplier_kpi_week_5 | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('additional point') | titlecase }}</td>
              <td><span class="">{{ additional_component_point_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ additional_component_point_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ additional_component_point_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ additional_component_point_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ additional_component_point_week_5 | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('additional component') | titlecase }}</td>
              <td><span class="">{{ additional_component_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ additional_component_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ additional_component_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ additional_component_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ additional_component_amount_week_5 | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('total amount') | titlecase }}</td>
              <td><span class="">{{ total_component_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ total_component_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ total_component_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ total_component_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ total_component_amount_week_5 | numberFormat }}</span></td>
              <td class="font-w700"><span class="">Rp {{ total_component_amount | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td class="font-size-h6 font-w700">{{ $t('total amount with allowance') | titlecase }}</td>
              <td class="font-w700"><span class="">{{ total_amount_received_week_1 | numberFormat }}</span></td>
              <td class="font-w700"><span class="">{{ total_amount_received_week_2 | numberFormat }}</span></td>
              <td class="font-w700"><span class="">{{ total_amount_received_week_3 | numberFormat }}</span></td>
              <td class="font-w700"><span class="">{{ total_amount_received_week_4 | numberFormat }}</span></td>
              <td class="font-w700"><span class="">{{ total_amount_received_week_5 | numberFormat }}</span></td>
              <td class="font-w700"><span class="">Rp {{ total_amount_received | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('receivable cut > 60 days') | titlecase }}</td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.receivable_cut_60_days_week1"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('receivable-cut-60-days-week-1')"
                    @errors="form.errors.set('receivable-cut-60-days-week-1', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.receivable_cut_60_days_week2"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('receivable-cut-60-days-week-2')"
                    @errors="form.errors.set('receivable-cut-60-days-week-2', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.receivable_cut_60_days_week3"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('receivable-cut-60-days-week-3')"
                    @errors="form.errors.set('receivable-cut-60-days-week-3', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.receivable_cut_60_days_week4"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('receivable-cut-60-days-week-4')"
                    @errors="form.errors.set('receivable-cut-60-days-week-4', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.receivable_cut_60_days_week5"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('receivable-cut-60-days-week-5')"
                    @errors="form.errors.set('receivable-cut-60-days-week-5', null)"/>
                </span>
              </td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td class="font-size-h6 font-w700">{{ $t('total amount received') | titlecase }}</td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-size-h6 font-w700"></td>
              <td class="font-w700"><span class="">Rp {{ total_amount_received | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('company profit') | titlecase }}</td>
              <td><span class="">{{ company_profit_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ company_profit_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ company_profit_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ company_profit_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ company_profit_week_5 | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('overdue receivable') | titlecase }}</td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.overdue_receivable_week1"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('overdue-receivable-week-1')"
                    @errors="form.errors.set('overdue-receivable-week-1', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.overdue_receivable_week2"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('overdue-receivable-week-2')"
                    @errors="form.errors.set('overdue-receivable-week-2', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.overdue_receivable_week3"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('overdue-receivable-week-3')"
                    @errors="form.errors.set('overdue-receivable-week-3', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.overdue_receivable_week4"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('overdue-receivable-week-4')"
                    @errors="form.errors.set('overdue-receivable-week-4', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.overdue_receivable_week5"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('overdue-receivable-week-5')"
                    @errors="form.errors.set('overdue-receivable-week-5', null)"/>
                </span>
              </td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('payment from marketing') | titlecase }}</td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.payment_from_marketing_week1"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-marketing-week-1')"
                    @errors="form.errors.set('payment-from-marketing-week-1', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.payment_from_marketing_week2"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-marketing-week-2')"
                    @errors="form.errors.set('payment-from-marketing-week-2', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.payment_from_marketing_week3"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-marketing-week-3')"
                    @errors="form.errors.set('payment-from-marketing-week-3', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.payment_from_marketing_week4"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-marketing-week-4')"
                    @errors="form.errors.set('payment-from-marketing-week-4', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.payment_from_marketing_week5"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-marketing-week-5')"
                    @errors="form.errors.set('payment-from-marketing-week-5', null)"/>
                </span>
              </td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('payment from sales') | titlecase }}</td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.payment_from_sales_week1"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-sales-week-1')"
                    @errors="form.errors.set('payment-from-sales-week-1', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.payment_from_sales_week2"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-sales-week-2')"
                    @errors="form.errors.set('payment-from-sales-week-2', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.payment_from_sales_week3"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-sales-week-3')"
                    @errors="form.errors.set('payment-from-sales-week-3', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.payment_from_sales_week4"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-sales-week-4')"
                    @errors="form.errors.set('payment-from-sales-week-4', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.payment_from_sales_week5"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-sales-week-5')"
                    @errors="form.errors.set('payment-from-sales-week-5', null)"/>
                </span>
              </td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('payment from spg') | titlecase }}</td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.payment_from_spg_week1"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-spg-week-1')"
                    @errors="form.errors.set('payment-from-spg-week-1', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.payment_from_spg_week2"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-spg-week-2')"
                    @errors="form.errors.set('payment-from-spg-week-2', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.payment_from_spg_week3"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-spg-week-3')"
                    @errors="form.errors.set('payment-from-spg-week-3', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.payment_from_spg_week4"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-spg-week-4')"
                    @errors="form.errors.set('payment-from-spg-week-4', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.payment_from_spg_week5"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-spg-week-5')"
                    @errors="form.errors.set('payment-from-spg-week-5', null)"/>
                </span>
              </td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('received cash payment') | titlecase }}</td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.cash_payment_week1"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('cash-payment-week-1')"
                    @errors="form.errors.set('cash-payment-week-1', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.cash_payment_week2"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('cash-payment-week-2')"
                    @errors="form.errors.set('cash-payment-week-2', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.cash_payment_week3"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('cash-payment-week-3')"
                    @errors="form.errors.set('cash-payment-week-3', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.cash_payment_week4"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('cash-payment-week-4')"
                    @errors="form.errors.set('cash-payment-week-4', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.cash_payment_week5"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('cash-payment-week-5')"
                    @errors="form.errors.set('cash-payment-week-5', null)"/>
                </span>
              </td>
              <td class="font-w700"><span class="">{{ total_payment | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('settlement difference minus amount') | titlecase }}</td>
              <td><span class="">{{ settlement_difference_minus_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ settlement_difference_minus_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ settlement_difference_minus_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ settlement_difference_minus_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ settlement_difference_minus_amount_week_5 | numberFormat }}</span></td>
              <td><span class="font-w700">{{ total_settlement_difference_minus_amount | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('company profit difference minus amount') | titlecase }}</td>
              <td><span class="">{{ company_profit_difference_minus_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ company_profit_difference_minus_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ company_profit_difference_minus_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ company_profit_difference_minus_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ company_profit_difference_minus_amount_week_5 | numberFormat }}</span></td>
              <td><span class="font-w700">{{ total_company_profit_difference_minus_amount | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('communication allowance') | titlecase }}</td>
              <td><span class="">{{ form.salary.communication_allowance | numberFormat }}</span></td>
              <td><span class="">{{ form.salary.communication_allowance | numberFormat }}</span></td>
              <td><span class="">{{ form.salary.communication_allowance | numberFormat }}</span></td>
              <td><span class="">{{ form.salary.communication_allowance | numberFormat }}</span></td>
              <td><span class="">{{ form.salary.communication_allowance | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('functional allowance') | titlecase }}</td>
              <td><span class="">{{ form.salary.functional_allowance | numberFormat }}</span></td>
              <td><span class="">{{ form.salary.functional_allowance | numberFormat }}</span></td>
              <td><span class="">{{ form.salary.functional_allowance | numberFormat }}</span></td>
              <td><span class="">{{ form.salary.functional_allowance | numberFormat }}</span></td>
              <td><span class="">{{ form.salary.functional_allowance | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('weekly sales') | titlecase }}</td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.weekly_sales_week1"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('weekly-sales-week-1')"
                    @errors="form.errors.set('weekly-sales-week-1', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.weekly_sales_week2"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('weekly-sales-week-2')"
                    @errors="form.errors.set('weekly-sales-week-2', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.weekly_sales_week3"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('weekly-sales-week-3')"
                    @errors="form.errors.set('weekly-sales-week-3', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.weekly_sales_week4"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('weekly-sales-week-4')"
                    @errors="form.errors.set('weekly-sales-week-4', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.weekly_sales_week5"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('weekly-sales-week-5')"
                    @errors="form.errors.set('weekly-sales-week-5', null)"/>
                </span>
              </td>
              <td><span class="font-w700">{{ total_weekly_sales | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('active days / week') | titlecase }}</td>
              <td><span class="">{{ active_days_percentage_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ active_days_percentage_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ active_days_percentage_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ active_days_percentage_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ active_days_percentage_week_5 | numberFormat }}</span></td>
              <td><span class="font-w700">{{ active_days_percentage_total | numberFormat}}</span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('wa daily report') | titlecase }}</td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.wa_daily_report_week1"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('wa-daily-report-week-1')"
                    @errors="form.errors.set('wa-daily-report-week-1', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.wa_daily_report_week2"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('wa-daily-report-week-2')"
                    @errors="form.errors.set('wa-daily-report-week-2', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.wa_daily_report_week3"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('wa-daily-report-week-3')"
                    @errors="form.errors.set('wa-daily-report-week-3', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.wa_daily_report_week4"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('wa-daily-report-week-4')"
                    @errors="form.errors.set('wa-daily-report-week-4', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.salary.wa_daily_report_week5"
                    :disabled="isSaving"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('wa-daily-report-week-5')"
                    @errors="form.errors.set('wa-daily-report-week-5', null)"/>
                </span>
              </td>
              <td><span class=""></span></td>
            </tr>
          </p-table>

          <div class="form-group row">
            <div class="col-md-12">
              <hr>
              <button
                :disabled="isSaving"
                type="submit"
                class="btn btn-sm btn-primary mr-5">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}
              </button>
              <button
                type="button"
                @click="cancel"
                class="btn btn-sm btn-outline-danger">
                {{ $t('cancel') | uppercase }}
              </button>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </form>
  </div>
</template>

<script>
import Form from '@/utils/Form'
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
      form: new Form({
        active_days_in_month: 0,
        salary: {}
      }),
      additionalData: {
        score_percentages_assessments: {},
        total_assessments: {},
        total_achievements: {}
      },
      title: 'Salary',
      isLoading: false,
      isSaving: false,
      active_days_percentage_week_1: 0,
      active_days_percentage_week_2: 0,
      active_days_percentage_week_3: 0,
      active_days_percentage_week_4: 0,
      active_days_percentage_week_5: 0,
      active_days_percentage_total: 0,
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
      real_transport_allowance_total: 0,
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
      total_component_amount: 0,
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
      receivable_week_1: 0,
      receivable_week_2: 0,
      receivable_week_3: 0,
      receivable_week_4: 0,
      receivable_week_5: 0,
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
      total_weekly_sales: 0,
      amount_received_difference: 0
    }
  },
  props: {
    name: {
      type: String
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployee', ['employee']),
    ...mapGetters('humanResourceEmployeeSalary', ['salary', 'additional'])
  },
  created () {
    this.isLoading = true
    this.findEmployeeSalary({
      employeeId: this.id,
      salaryId: this.salaryId
    }).then(
      (response) => {
        this.form.salary = this.salary
        this.$set(this, 'additionalData', this.additional)
        this.calculate()
        this.isLoading = false
      },
      (error) => {
        console.log(JSON.stringify(error))
      }
    )
  },
  methods: {
    ...mapActions('humanResourceEmployeeSalary', {
      findEmployeeSalary: 'find', updateEmployeeSalary: 'update'
    }),
    cancel () {
      this.$router.go(-1)
    },
    onSubmit () {
      this.isSaving = true
      this.updateEmployeeSalary({ employeeId: this.id, salaryId: this.salaryId, form: this.form })
        .then(
          (response) => {
            this.isSaving = false
            this.$notification.success('Update success')
            this.$router.replace('/human-resource/employee/' + this.id + '/salary/' + this.salaryId + '/edit')
          },
          (error) => {
            this.isSaving = false
            this.$notification.error('Update failed', error.message)
            this.form.errors.record(error.errors)
          }
        )
    },
    salaryAssessmentWeight () {
      this.additionalData.total_assessments.week1 = 0
      this.additionalData.total_assessments.week2 = 0
      this.additionalData.total_assessments.week3 = 0
      this.additionalData.total_assessments.week4 = 0
      this.additionalData.total_assessments.week5 = 0
      this.additionalData.total_assessments.weight = 0

      this.form.salary.assessments.forEach((indicator, key) => {
        this.additionalData.total_assessments.weight += Number(indicator.weight || 0)
        for (const keyWeek in this.additionalData.score_percentages_assessments[key]) {
          this.additionalData.total_assessments[key] += (Number(indicator.weight || 0) * ((this.additionalData.score_percentages_assessments[key][keyWeek] || 0) / 100))
        }
      })

      if (!this.isLoading) {
        this.calculate()
      }
    },
    salaryAchievementWeight () {
      this.additionalData.total_achievements.week1 = 0
      this.additionalData.total_achievements.week2 = 0
      this.additionalData.total_achievements.week3 = 0
      this.additionalData.total_achievements.week4 = 0
      this.additionalData.total_achievements.week5 = 0
      this.additionalData.total_achievements.weight = 0

      this.form.salary.achievements.forEach((achievement, key) => {
        this.additionalData.total_achievements.weight += Number(achievement.weight || 0)
        this.additionalData.total_achievements.week1 += Number(achievement.week1 || 0) * Number(achievement.weight || 0) / 100
        this.additionalData.total_achievements.week2 += Number(achievement.week2 || 0) * Number(achievement.weight || 0) / 100
        this.additionalData.total_achievements.week3 += Number(achievement.week3 || 0) * Number(achievement.weight || 0) / 100
        this.additionalData.total_achievements.week4 += Number(achievement.week4 || 0) * Number(achievement.weight || 0) / 100
        this.additionalData.total_achievements.week5 += Number(achievement.week5 || 0) * Number(achievement.weight || 0) / 100
      })

      if (!this.isLoading) {
        this.calculate()
      }
    },
    getWeekOfMonth (date) {
      let dateObject = new Date(date)
      let adjustedDate = dateObject.getDate() + dateObject.getDay()
      let prefixes = ['0', '1', '2', '3', '4', '5']
      return (parseInt(prefixes[0 | adjustedDate / 7]) + 1)
    },
    calculate () {
      this.salary_final_score.week1 = ((this.additionalData.total_assessments.week1 || 0) + (this.additionalData.total_achievements.week1 || 0)) / 2
      this.salary_final_score.week2 = ((this.additionalData.total_assessments.week2 || 0) + (this.additionalData.total_achievements.week2 || 0)) / 2
      this.salary_final_score.week3 = ((this.additionalData.total_assessments.week3 || 0) + (this.additionalData.total_achievements.week3 || 0)) / 2
      this.salary_final_score.week4 = ((this.additionalData.total_assessments.week4 || 0) + (this.additionalData.total_achievements.week4 || 0)) / 2
      this.salary_final_score.week5 = ((this.additionalData.total_assessments.week5 || 0) + (this.additionalData.total_achievements.week5 || 0)) / 2

      this.form.salary.active_days_in_month = this.form.salary.active_days_in_month || 0

      if (Number(this.form.salary.active_days_in_month) != 0) {
        let baseSalaryPerWeek = (this.form.salary.active_days_in_month || 0) != 0 ? (this.form.salary.base_salary || 0) / Number(this.form.salary.active_days_in_month || 0) : 0
        let baseMultiplierKpiPerWeek = (this.form.salary.active_days_in_month || 0) != 0 ? (this.form.salary.multiplier_kpi || 0) / Number(this.form.salary.active_days_in_month || 0) : 0

        if (this.additionalData.score_percentages_assessments.length != 0) {
          let percentageCallWeek1 = (Number(this.additionalData.score_percentages_assessments[0].week1 || 0)) / 100
          let percentageCallWeek2 = (Number(this.additionalData.score_percentages_assessments[0].week2 || 0)) / 100
          let percentageCallWeek3 = (Number(this.additionalData.score_percentages_assessments[0].week3 || 0)) / 100
          let percentageCallWeek4 = (Number(this.additionalData.score_percentages_assessments[0].week4 || 0)) / 100
          let percentageCallWeek5 = (Number(this.additionalData.score_percentages_assessments[0].week5 || 0)) / 100

          this.active_days_percentage_week_1 = percentageCallWeek1 * Number(this.form.salary.active_days_week1 || 0)
          this.active_days_percentage_week_2 = percentageCallWeek2 * Number(this.form.salary.active_days_week2 || 0)
          this.active_days_percentage_week_3 = percentageCallWeek3 * Number(this.form.salary.active_days_week3 || 0)
          this.active_days_percentage_week_4 = percentageCallWeek4 * Number(this.form.salary.active_days_week4 || 0)
          this.active_days_percentage_week_5 = percentageCallWeek5 * Number(this.form.salary.active_days_week5 || 0)

          this.active_days_percentage_total = this.active_days_percentage_week_1 + this.active_days_percentage_week_2 + this.active_days_percentage_week_3 + this.active_days_percentage_week_4 + this.active_days_percentage_week_5

          this.base_salary_week_1 = baseSalaryPerWeek * this.active_days_percentage_week_1
          this.base_salary_week_2 = baseSalaryPerWeek * this.active_days_percentage_week_2
          this.base_salary_week_3 = baseSalaryPerWeek * this.active_days_percentage_week_3
          this.base_salary_week_4 = baseSalaryPerWeek * this.active_days_percentage_week_4
          this.base_salary_week_5 = baseSalaryPerWeek * this.active_days_percentage_week_5

          this.real_transport_allowance_week_1 = this.form.salary.daily_transport_allowance * this.active_days_percentage_week_1
          this.real_transport_allowance_week_2 = this.form.salary.daily_transport_allowance * this.active_days_percentage_week_2
          this.real_transport_allowance_week_3 = this.form.salary.daily_transport_allowance * this.active_days_percentage_week_3
          this.real_transport_allowance_week_4 = this.form.salary.daily_transport_allowance * this.active_days_percentage_week_4
          this.real_transport_allowance_week_5 = this.form.salary.daily_transport_allowance * this.active_days_percentage_week_5

          this.real_transport_allowance_total = this.real_transport_allowance_week_1 + this.real_transport_allowance_week_2 + this.real_transport_allowance_week_3 + this.real_transport_allowance_week_4 + this.real_transport_allowance_week_5

          this.multiplier_kpi_week_1 = baseMultiplierKpiPerWeek * this.active_days_percentage_week_1
          this.multiplier_kpi_week_2 = baseMultiplierKpiPerWeek * this.active_days_percentage_week_2
          this.multiplier_kpi_week_3 = baseMultiplierKpiPerWeek * this.active_days_percentage_week_3
          this.multiplier_kpi_week_4 = baseMultiplierKpiPerWeek * this.active_days_percentage_week_4
          this.multiplier_kpi_week_5 = baseMultiplierKpiPerWeek * this.active_days_percentage_week_5
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

      this.total_component_amount = Number(this.total_component_amount_week_1 || 0) + Number(this.total_component_amount_week_2 || 0) + Number(this.total_component_amount_week_3 || 0) + Number(this.total_component_amount_week_4 || 0) + Number(this.total_component_amount_week_5 || 0)

      this.total_amount_week_1 = Number(this.total_component_amount_week_1 || 0) + Number(this.real_transport_allowance_week_1 || 0)
      this.total_amount_week_2 = Number(this.total_component_amount_week_2 || 0) + Number(this.real_transport_allowance_week_2 || 0)
      this.total_amount_week_3 = Number(this.total_component_amount_week_3 || 0) + Number(this.real_transport_allowance_week_3 || 0)
      this.total_amount_week_4 = Number(this.total_component_amount_week_4 || 0) + Number(this.real_transport_allowance_week_4 || 0)
      this.total_amount_week_5 = Number(this.total_component_amount_week_5 || 0) + Number(this.real_transport_allowance_week_5 || 0)

      this.total_amount_received_week_1 = Number(this.total_amount_week_1 || 0)
      this.total_amount_received_week_2 = Number(this.total_amount_week_2 || 0)
      this.total_amount_received_week_3 = Number(this.total_amount_week_3 || 0)
      this.total_amount_received_week_4 = Number(this.total_amount_week_4 || 0)
      this.total_amount_received_week_5 = Number(this.total_amount_week_5 || 0)

      if (this.getWeekOfMonth(this.form.salary.start_date) === 1) {
        this.total_amount_received_week_1 = this.total_amount_received_week_1 + Number(this.form.salary.communication_allowance || 0) + Number(this.form.salary.functional_allowance || 0)
      }

      this.total_amount_received = Number(this.total_amount_received_week_1 || 0) + Number(this.total_amount_received_week_2 || 0) + Number(this.total_amount_received_week_3 || 0) + Number(this.total_amount_received_week_4 || 0) + Number(this.total_amount_received_week_5 || 0)

      this.receivable_week_1 = Number(this.form.salary.payment_from_marketing_week1 || 0) + Number(this.form.salary.payment_from_sales_week1 || 0) + Number(this.form.salary.payment_from_spg_week1 || 0) + Number(this.form.salary.cash_payment_week1 || 0)
      this.receivable_week_2 = Number(this.form.salary.payment_from_marketing_week2 || 0) + Number(this.form.salary.payment_from_sales_week2 || 0) + Number(this.form.salary.payment_from_spg_week2 || 0) + Number(this.form.salary.cash_payment_week2 || 0)
      this.receivable_week_3 = Number(this.form.salary.payment_from_marketing_week3 || 0) + Number(this.form.salary.payment_from_sales_week3 || 0) + Number(this.form.salary.payment_from_spg_week3 || 0) + Number(this.form.salary.cash_payment_week3 || 0)
      this.receivable_week_4 = Number(this.form.salary.payment_from_marketing_week4 || 0) + Number(this.form.salary.payment_from_sales_week4 || 0) + Number(this.form.salary.payment_from_spg_week4 || 0) + Number(this.form.salary.cash_payment_week4 || 0)
      this.receivable_week_5 = Number(this.form.salary.payment_from_marketing_week5 || 0) + Number(this.form.salary.payment_from_sales_week5 || 0) + Number(this.form.salary.payment_from_spg_week5 || 0) + Number(this.form.salary.cash_payment_week5 || 0)

      this.company_profit_week_1 = 0.05 * this.receivable_week_1
      this.company_profit_week_2 = 0.05 * this.receivable_week_2
      this.company_profit_week_3 = 0.05 * this.receivable_week_3
      this.company_profit_week_4 = 0.05 * this.receivable_week_4
      this.company_profit_week_5 = 0.05 * this.receivable_week_5

      this.settlement_difference_minus_amount_week_1 = this.receivable_week_1 - Number(this.total_amount_received_week_1 || 0)
      this.settlement_difference_minus_amount_week_2 = this.receivable_week_2 - Number(this.total_amount_received_week_2 || 0)
      this.settlement_difference_minus_amount_week_3 = this.receivable_week_3 - Number(this.total_amount_received_week_3 || 0)
      this.settlement_difference_minus_amount_week_4 = this.receivable_week_4 - Number(this.total_amount_received_week_4 || 0)
      this.settlement_difference_minus_amount_week_5 = this.receivable_week_5 - Number(this.total_amount_received_week_5 || 0)

      this.company_profit_difference_minus_amount_week_1 = Number(this.company_profit_week_1 || 0) - Number(this.total_amount_received_week_1 || 0)
      this.company_profit_difference_minus_amount_week_2 = Number(this.company_profit_week_2 || 0) - Number(this.total_amount_received_week_2 || 0)
      this.company_profit_difference_minus_amount_week_3 = Number(this.company_profit_week_3 || 0) - Number(this.total_amount_received_week_3 || 0)
      this.company_profit_difference_minus_amount_week_4 = Number(this.company_profit_week_4 || 0) - Number(this.total_amount_received_week_4 || 0)
      this.company_profit_difference_minus_amount_week_5 = Number(this.company_profit_week_5 || 0) - Number(this.total_amount_received_week_5 || 0)

      var dayAverageDivisor = 0
      var totalMinimumComponentScore = 0
      var totalAdditionalComponentScore = 0
      var totalFinalScore = 0

      if (this.form.salary.active_days_week1 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.additionalData.total_assessments.week1
        totalAdditionalComponentScore += this.additionalData.total_achievements.week1
        totalFinalScore += this.salary_final_score.week1
      }
      if (this.form.salary.active_days_week2 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.additionalData.total_assessments.week2
        totalAdditionalComponentScore += this.additionalData.total_achievements.week2
        totalFinalScore += this.salary_final_score.week2
      }
      if (this.form.salary.active_days_week3 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.additionalData.total_assessments.week3
        totalAdditionalComponentScore += this.additionalData.total_achievements.week3
        totalFinalScore += this.salary_final_score.week3
      }
      if (this.form.salary.active_days_week4 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.additionalData.total_assessments.week4
        totalAdditionalComponentScore += this.additionalData.total_achievements.week4
        totalFinalScore += this.salary_final_score.week4
      }
      if (this.form.salary.active_days_week5 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.additionalData.total_assessments.week5
        totalAdditionalComponentScore += this.additionalData.total_achievements.week5
        totalFinalScore += this.salary_final_score.week5
      }

      this.average_minimum_component_score = dayAverageDivisor != 0 ? totalMinimumComponentScore / dayAverageDivisor : 0
      this.average_additional_component_score = dayAverageDivisor != 0 ? totalAdditionalComponentScore / dayAverageDivisor : 0
      this.average_final_score = dayAverageDivisor != 0 ? totalFinalScore / dayAverageDivisor : 0

      this.total_payment = this.receivable_week_1 + this.receivable_week_2 + this.receivable_week_3 + this.receivable_week_4 + this.receivable_week_5

      this.total_settlement_difference_minus_amount = this.settlement_difference_minus_amount_week_1 + this.settlement_difference_minus_amount_week_2 + this.settlement_difference_minus_amount_week_3 + this.settlement_difference_minus_amount_week_4 + this.settlement_difference_minus_amount_week_5

      this.total_company_profit_difference_minus_amount = this.company_profit_difference_minus_amount_week_1 + this.company_profit_difference_minus_amount_week_2 + this.company_profit_difference_minus_amount_week_3 + this.company_profit_difference_minus_amount_week_4 + this.company_profit_difference_minus_amount_week_5

      this.total_weekly_sales = Number(this.form.salary.weekly_sales_week1 || 0) + Number(this.form.salary.weekly_sales_week2 || 0) + Number(this.form.salary.weekly_sales_week3 || 0) + Number(this.form.salary.weekly_sales_week4 || 0) + Number(this.form.salary.weekly_sales_week5 || 0)

      this.amount_received_difference = this.form.salary.maximum_salary_amount - this.total_amount_received
    }
  }
}
</script>
