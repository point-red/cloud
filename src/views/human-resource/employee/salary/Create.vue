<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <router-link
        to="/human-resource/employee"
        class="breadcrumb-item"
      >
        {{ $t('employee') | titlecase }}
      </router-link>
      <router-link
        :to="'/human-resource/employee/' + employee.id"
        class="breadcrumb-item"
      >
        {{ employee.name | titlecase }}
      </router-link>
      <router-link
        :to="'/human-resource/employee/' + employee.id + '/salary'"
        class="breadcrumb-item"
      >
        Salary
      </router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <employee-widget :id="id" />

    <tab-menu />

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block
        :title="$t('employee salary')"
        :header="true"
      >
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <p-form-row
                id="name"
                :label="$t('name')"
              >
                <div
                  slot="body"
                  class="col-lg-9 col-form-label"
                >
                  {{ employee.name }}
                </div>
              </p-form-row>
              <p-form-row
                id="job-location"
                :label="$t('location')"
              >
                <div
                  slot="body"
                  class="col-lg-9 col-form-label"
                >
                  {{ form.job_location }}
                </div>
              </p-form-row>
              <p-form-row
                id="salary-date"
                :label="$t('period')"
              >
                <div
                  slot="body"
                  class="col-lg-9"
                >
                  <p-date-range-picker
                    v-model="form.date"
                    name="assessment-date"
                    :help="$t('assessment date help')"
                  />
                </div>
              </p-form-row>
              <p-form-row
                id="active-days-in-month"
                name="active-days-in-month"
                :label="$t('active days / month')"
              >
                <div
                  slot="body"
                  class="col-lg-3"
                >
                  <p-form-number
                    v-model="form.active_days_in_month"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('active-days-in-month')"
                    @input="calculate"
                    @errors="form.errors.set('active-days-in-month', null)"
                  />
                </div>
              </p-form-row>
            </div>
          </div>

          <p-table>
            <tr slot="p-head">
              <th class="font-size-h6 font-w700" />
              <th class="font-size-h6 font-w700" />
              <th class="font-size-h6 font-w700">
                {{ 'W1' }}
              </th>
              <th class="font-size-h6 font-w700">
                {{ 'W2' }}
              </th>
              <th class="font-size-h6 font-w700">
                {{ 'W3' }}
              </th>
              <th class="font-size-h6 font-w700">
                {{ 'W4' }}
              </th>
              <th class="font-size-h6 font-w700">
                {{ 'W5' }}
              </th>
              <th class="font-size-h6 font-w700">
                {{ $t('weight') }}
              </th>
            </tr>

            <tr slot="p-body">
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700">
                {{ $t('active days') | uppercase }}
              </td>
              <td class="font-size-h6 font-w700">
                <p-form-number
                  v-model="form.active_days_week_1"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('active-days-week-1')"
                  @errors="form.errors.set('active-days-week-1', null)"
                />
              </td>
              <td class="font-size-h6 font-w700">
                <p-form-number
                  v-model="form.active_days_week_2"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('active-days-week-2')"
                  @errors="form.errors.set('active-days-week-2', null)"
                />
              </td>
              <td class="font-size-h6 font-w700">
                <p-form-number
                  v-model="form.active_days_week_3"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('active-days-week-3')"
                  @errors="form.errors.set('active-days-week-3', null)"
                />
              </td>
              <td class="font-size-h6 font-w700">
                <p-form-number
                  v-model="form.active_days_week_4"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('active-days-week-4')"
                  @errors="form.errors.set('active-days-week-4', null)"
                />
              </td>
              <td class="font-size-h6 font-w700">
                <p-form-number
                  v-model="form.active_days_week_5"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('active-days-week-5')"
                  @errors="form.errors.set('active-days-week-5', null)"
                />
              </td>
              <td class="font-size-h6 font-w700" />
            </tr>

            <tr slot="p-body">
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
            </tr>

            <tr slot="p-body">
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700">
                {{ $t('minimum component') | uppercase }}
              </td>
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700" />
            </tr>

            <tr
              v-for="(indicator, indicatorIndex) in form.salary_assessment.indicators"
              slot="p-body"
              :key="'indicator' + indicator.id"
            >
              <td>{{ indicatorIndex + 1 }}</td>
              <td>{{ indicator.name }}</td>
              <td>{{ indicator.score_percentage.week1 | numberFormat }}%</td>
              <td>{{ indicator.score_percentage.week2 | numberFormat }}%</td>
              <td>{{ indicator.score_percentage.week3 | numberFormat }}%</td>
              <td>{{ indicator.score_percentage.week4 | numberFormat }}%</td>
              <td>{{ indicator.score_percentage.week5 | numberFormat }}%</td>
              <td>
                <p-form-input
                  id="indicator-weight"
                  v-model="indicator.weight"
                  name="indicator-weight"
                  :disabled="isSaving"
                  :is-text-right="false"
                  @input="salaryAssessmentWeight"
                />
              </td>
            </tr>

            <tr slot="p-body">
              <td class="text-center font-w700">
                <span class="" />
              </td>
              <td class="font-size-h6 font-w700">
                {{ $t('minimum component score') | uppercase }}
              </td>
              <td class="font-w700">
                <span class="">{{ form.salary_assessment.total.week1 | numberFormat }}%</span>
              </td>
              <td class="font-w700">
                <span class="">{{ form.salary_assessment.total.week2 | numberFormat }}%</span>
              </td>
              <td class="font-w700">
                <span class="">{{ form.salary_assessment.total.week3 | numberFormat }}%</span>
              </td>
              <td class="font-w700">
                <span class="">{{ form.salary_assessment.total.week4 | numberFormat }}%</span>
              </td>
              <td class="font-w700">
                <span class="">{{ form.salary_assessment.total.week5 | numberFormat }}%</span>
              </td>
              <td class="font-w700">
                <span class="">{{ average_minimum_component_score | numberFormat }}%</span>
              </td>
            </tr>

            <tr slot="p-body">
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
            </tr>

            <tr slot="p-body">
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700">
                {{ $t('additional component') | uppercase }}
              </td>
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700" />
            </tr>

            <tr
              v-for="automated in form.salary_achievement.automated"
              slot="p-body"
              :key="'automated' + automated.id"
            >
              <td>{{ automated.id }}</td>
              <td>{{ automated.name }}</td>
              <td>{{ automated.week1 | numberFormat }}%</td>
              <td>{{ automated.week2 | numberFormat }}%</td>
              <td>{{ automated.week3 | numberFormat }}%</td>
              <td>{{ automated.week4 | numberFormat }}%</td>
              <td>{{ automated.week5 | numberFormat }}%</td>
              <td>
                <p-form-input
                  id="automated-weight"
                  v-model="automated.weight"
                  name="automated-weight"
                  :disabled="isSaving"
                  :is-text-right="false"
                  @input="salaryAchievementWeight"
                />
              </td>
            </tr>

            <tr slot="p-body">
              <td class="text-center font-w700">
                <span class="" />
              </td>
              <td class="font-size-h6 font-w700">
                {{ $t('additional component score') | uppercase }}
              </td>
              <td class="font-w700">
                <span class="">{{ form.salary_achievement.total.week1 | numberFormat }}%</span>
              </td>
              <td class="font-w700">
                <span class="">{{ form.salary_achievement.total.week2 | numberFormat }}%</span>
              </td>
              <td class="font-w700">
                <span class="">{{ form.salary_achievement.total.week3 | numberFormat }}%</span>
              </td>
              <td class="font-w700">
                <span class="">{{ form.salary_achievement.total.week4 | numberFormat }}%</span>
              </td>
              <td class="font-w700">
                <span class="">{{ form.salary_achievement.total.week5 | numberFormat }}%</span>
              </td>
              <td class="font-w700">
                <span class="">{{ average_additional_component_score | numberFormat }}%</span>
              </td>
            </tr>

            <tr slot="p-body">
              <td />
              <td class="font-size-h6 font-w700">
                {{ $t('final score') | uppercase }}
              </td>
              <td class="font-w700">
                <span class="">{{ salary_final_score.week1 | numberFormat }}%</span>
              </td>
              <td class="font-w700">
                <span class="">{{ salary_final_score.week2 | numberFormat }}%</span>
              </td>
              <td class="font-w700">
                <span class="">{{ salary_final_score.week3 | numberFormat }}%</span>
              </td>
              <td class="font-w700">
                <span class="">{{ salary_final_score.week4 | numberFormat }}%</span>
              </td>
              <td class="font-w700">
                <span class="">{{ salary_final_score.week5 | numberFormat }}%</span>
              </td>
              <td class="font-w700">
                <span class="">{{ average_final_score | numberFormat }}%</span>
              </td>
            </tr>

            <tr slot="p-body">
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('area value') | titlecase }}</td>
              <td><span class="">Rp {{ form.base_salary | numberFormat }}</span></td>
              <td><span class="">Rp {{ form.base_salary | numberFormat }}</span></td>
              <td><span class="">Rp {{ form.base_salary | numberFormat }}</span></td>
              <td><span class="">Rp {{ form.base_salary | numberFormat }}</span></td>
              <td><span class="">Rp {{ form.base_salary | numberFormat }}</span></td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('area value per week') | titlecase }}</td>
              <td><span class="">{{ base_salary_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ base_salary_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ base_salary_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ base_salary_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ base_salary_week_5 | numberFormat }}</span></td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('daily transport') | titlecase }}</td>
              <td><span class="">{{ form.daily_transport_allowance | numberFormat }}</span></td>
              <td><span class="">{{ form.daily_transport_allowance | numberFormat }}</span></td>
              <td><span class="">{{ form.daily_transport_allowance | numberFormat }}</span></td>
              <td><span class="">{{ form.daily_transport_allowance | numberFormat }}</span></td>
              <td><span class="">{{ form.daily_transport_allowance | numberFormat }}</span></td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('real transport received') | titlecase }}</td>
              <td><span class="">{{ real_transport_allowance_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ real_transport_allowance_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ real_transport_allowance_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ real_transport_allowance_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ real_transport_allowance_week_5 | numberFormat }}</span></td>
              <td class="font-w700">
                <span class="">{{ real_transport_allowance_total | numberFormat }}</span>
              </td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('minimum component') | titlecase }}</td>
              <td><span class="">{{ minimum_component_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ minimum_component_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ minimum_component_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ minimum_component_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ minimum_component_amount_week_5 | numberFormat }}</span></td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('multiplier kpi') | titlecase }}</td>
              <td><span class="">{{ form.multiplier_kpi | numberFormat }}</span></td>
              <td><span class="">{{ form.multiplier_kpi | numberFormat }}</span></td>
              <td><span class="">{{ form.multiplier_kpi | numberFormat }}</span></td>
              <td><span class="">{{ form.multiplier_kpi | numberFormat }}</span></td>
              <td><span class="">{{ form.multiplier_kpi | numberFormat }}</span></td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('multiplier kpi (weekly result)') | titlecase }}</td>
              <td><span class="">{{ multiplier_kpi_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ multiplier_kpi_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ multiplier_kpi_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ multiplier_kpi_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ multiplier_kpi_week_5 | numberFormat }}</span></td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('additional point') | titlecase }}</td>
              <td><span class="">{{ additional_component_point_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ additional_component_point_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ additional_component_point_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ additional_component_point_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ additional_component_point_week_5 | numberFormat }}</span></td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('additional component') | titlecase }}</td>
              <td><span class="">{{ additional_component_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ additional_component_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ additional_component_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ additional_component_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ additional_component_amount_week_5 | numberFormat }}</span></td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('total amount') | titlecase }}</td>
              <td><span class="">{{ total_component_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ total_component_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ total_component_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ total_component_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ total_component_amount_week_5 | numberFormat }}</span></td>
              <td class="font-w700">
                <span class="">Rp {{ total_component_amount | numberFormat }}</span>
              </td>
            </tr>

            <tr slot="p-body">
              <td />
              <td class="font-size-h6 font-w700">
                {{ $t('total amount with allowance') | titlecase }}
              </td>
              <td class="font-w700">
                <span class="">{{ total_amount_received_week_1 | numberFormat }}</span>
              </td>
              <td class="font-w700">
                <span class="">{{ total_amount_received_week_2 | numberFormat }}</span>
              </td>
              <td class="font-w700">
                <span class="">{{ total_amount_received_week_3 | numberFormat }}</span>
              </td>
              <td class="font-w700">
                <span class="">{{ total_amount_received_week_4 | numberFormat }}</span>
              </td>
              <td class="font-w700">
                <span class="">{{ total_amount_received_week_5 | numberFormat }}</span>
              </td>
              <td class="font-w700">
                <span class="">Rp {{ total_amount_received | numberFormat }}</span>
              </td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('receivable cut > 60 days') | titlecase }}</td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.receivable_cut_60_days_week_1"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('receivable-cut-60-days-week-1')"
                    @input="calculate"
                    @errors="form.errors.set('receivable-cut-60-days-week-1', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.receivable_cut_60_days_week_2"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('receivable-cut-60-days-week-2')"
                    @input="calculate"
                    @errors="form.errors.set('receivable-cut-60-days-week-2', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.receivable_cut_60_days_week_3"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('receivable-cut-60-days-week-3')"
                    @input="calculate"
                    @errors="form.errors.set('receivable-cut-60-days-week-3', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.receivable_cut_60_days_week_4"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('receivable-cut-60-days-week-4')"
                    @input="calculate"
                    @errors="form.errors.set('receivable-cut-60-days-week-4', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.receivable_cut_60_days_week_5"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('receivable-cut-60-days-week-5')"
                    @input="calculate"
                    @errors="form.errors.set('receivable-cut-60-days-week-5', null)"
                  />
                </span>
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td class="font-size-h6 font-w700">
                {{ $t('total amount received') | titlecase }}
              </td>
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700" />
              <td class="font-size-h6 font-w700" />
              <td class="font-w700">
                <span class="">Rp {{ total_amount_received | numberFormat }}</span>
              </td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('company profit') | titlecase }}</td>
              <td><span class="">{{ company_profit_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ company_profit_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ company_profit_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ company_profit_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ company_profit_week_5 | numberFormat }}</span></td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('overdue receivable') | titlecase }}</td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.overdue_receivable_week_1"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('overdue-receivable-week-1')"
                    @input="calculate"
                    @errors="form.errors.set('overdue-receivable-week-1', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.overdue_receivable_week_2"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('overdue-receivable-week-2')"
                    @input="calculate"
                    @errors="form.errors.set('overdue-receivable-week-2', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.overdue_receivable_week_3"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('overdue-receivable-week-3')"
                    @input="calculate"
                    @errors="form.errors.set('overdue-receivable-week-3', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.overdue_receivable_week_4"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('overdue-receivable-week-4')"
                    @input="calculate"
                    @errors="form.errors.set('overdue-receivable-week-4', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.overdue_receivable_week_5"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('overdue-receivable-week-5')"
                    @input="calculate"
                    @errors="form.errors.set('overdue-receivable-week-5', null)"
                  />
                </span>
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('payment from marketing') | titlecase }}</td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_marketing_week_1"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('payment-from-marketing-week-1')"
                    @input="calculate"
                    @errors="form.errors.set('payment-from-marketing-week-1', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_marketing_week_2"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('payment-from-marketing-week-2')"
                    @input="calculate"
                    @errors="form.errors.set('payment-from-marketing-week-2', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_marketing_week_3"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('payment-from-marketing-week-3')"
                    @input="calculate"
                    @errors="form.errors.set('payment-from-marketing-week-3', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_marketing_week_4"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('payment-from-marketing-week-4')"
                    @input="calculate"
                    @errors="form.errors.set('payment-from-marketing-week-4', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_marketing_week_5"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('payment-from-marketing-week-5')"
                    @input="calculate"
                    @errors="form.errors.set('payment-from-marketing-week-5', null)"
                  />
                </span>
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('payment from sales') | titlecase }}</td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_sales_week_1"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('payment-from-sales-week-1')"
                    @input="calculate"
                    @errors="form.errors.set('payment-from-sales-week-1', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_sales_week_2"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('payment-from-sales-week-2')"
                    @input="calculate"
                    @errors="form.errors.set('payment-from-sales-week-2', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_sales_week_3"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('payment-from-sales-week-3')"
                    @input="calculate"
                    @errors="form.errors.set('payment-from-sales-week-3', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_sales_week_4"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('payment-from-sales-week-4')"
                    @input="calculate"
                    @errors="form.errors.set('payment-from-sales-week-4', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_sales_week_5"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('payment-from-sales-week-5')"
                    @input="calculate"
                    @errors="form.errors.set('payment-from-sales-week-5', null)"
                  />
                </span>
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('payment from spg') | titlecase }}</td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_spg_week_1"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('payment-from-spg-week-1')"
                    @input="calculate"
                    @errors="form.errors.set('payment-from-spg-week-1', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_spg_week_2"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('payment-from-spg-week-2')"
                    @input="calculate"
                    @errors="form.errors.set('payment-from-spg-week-2', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_spg_week_3"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('payment-from-spg-week-3')"
                    @input="calculate"
                    @errors="form.errors.set('payment-from-spg-week-3', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_spg_week_4"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('payment-from-spg-week-4')"
                    @input="calculate"
                    @errors="form.errors.set('payment-from-spg-week-4', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_spg_week_5"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('payment-from-spg-week-5')"
                    @input="calculate"
                    @errors="form.errors.set('payment-from-spg-week-5', null)"
                  />
                </span>
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('received cash payment') | titlecase }}</td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.cash_payment_week_1"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('cash-payment-week-1')"
                    @input="calculate"
                    @errors="form.errors.set('cash-payment-week-1', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.cash_payment_week_2"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('cash-payment-week-2')"
                    @input="calculate"
                    @errors="form.errors.set('cash-payment-week-2', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.cash_payment_week_3"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('cash-payment-week-3')"
                    @input="calculate"
                    @errors="form.errors.set('cash-payment-week-3', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.cash_payment_week_4"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('cash-payment-week-4')"
                    @input="calculate"
                    @errors="form.errors.set('cash-payment-week-4', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.cash_payment_week_5"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('cash-payment-week-5')"
                    @input="calculate"
                    @errors="form.errors.set('cash-payment-week-5', null)"
                  />
                </span>
              </td>
              <td class="font-w700">
                <span class="">{{ total_payment | numberFormat }}</span>
              </td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('settlement difference minus amount') | titlecase }}</td>
              <td><span class="">{{ settlement_difference_minus_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ settlement_difference_minus_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ settlement_difference_minus_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ settlement_difference_minus_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ settlement_difference_minus_amount_week_5 | numberFormat }}</span></td>
              <td><span class="font-w700">{{ total_settlement_difference_minus_amount | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('company profit difference minus amount') | titlecase }}</td>
              <td><span class="">{{ company_profit_difference_minus_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">{{ company_profit_difference_minus_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">{{ company_profit_difference_minus_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">{{ company_profit_difference_minus_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">{{ company_profit_difference_minus_amount_week_5 | numberFormat }}</span></td>
              <td><span class="font-w700">{{ total_company_profit_difference_minus_amount | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('communication allowance') | titlecase }}</td>
              <td><span class="">{{ form.communication_allowance | numberFormat }}</span></td>
              <td><span class="" /></td>
              <td><span class="" /></td>
              <td><span class="" /></td>
              <td><span class="" /></td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('functional allowance') | titlecase }}</td>
              <td><span class="">{{ form.functional_allowance | numberFormat }}</span></td>
              <td><span class="" /></td>
              <td><span class="" /></td>
              <td><span class="" /></td>
              <td><span class="" /></td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('weekly sales') | titlecase }}</td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.weekly_sales_week_1"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('weekly-sales-week-1')"
                    @input="calculate"
                    @errors="form.errors.set('weekly-sales-week-1', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.weekly_sales_week_2"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('weekly-sales-week-2')"
                    @input="calculate"
                    @errors="form.errors.set('weekly-sales-week-2', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.weekly_sales_week_3"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('weekly-sales-week-3')"
                    @input="calculate"
                    @errors="form.errors.set('weekly-sales-week-3', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.weekly_sales_week_4"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('weekly-sales-week-4')"
                    @input="calculate"
                    @errors="form.errors.set('weekly-sales-week-4', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.weekly_sales_week_5"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('weekly-sales-week-5')"
                    @input="calculate"
                    @errors="form.errors.set('weekly-sales-week-5', null)"
                  />
                </span>
              </td>
              <td><span class="font-w700">{{ total_weekly_sales | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('wa daily report') | titlecase }}</td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.wa_daily_report_week_1"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('wa-daily-report-week-1')"
                    @input="calculate"
                    @errors="form.errors.set('wa-daily-report-week-1', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.wa_daily_report_week_2"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('wa-daily-report-week-2')"
                    @input="calculate"
                    @errors="form.errors.set('wa-daily-report-week-2', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.wa_daily_report_week_3"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('wa-daily-report-week-3')"
                    @input="calculate"
                    @errors="form.errors.set('wa-daily-report-week-3', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.wa_daily_report_week_4"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('wa-daily-report-week-4')"
                    @input="calculate"
                    @errors="form.errors.set('wa-daily-report-week-4', null)"
                  />
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.wa_daily_report_week_5"
                    :disabled="isSaving"
                    :is-text-right="false"
                    :errors="form.errors.get('wa-daily-report-week-5')"
                    @input="calculate"
                    @errors="form.errors.set('wa-daily-report-week-5', null)"
                  />
                </span>
              </td>
              <td><span class="" /></td>
            </tr>
          </p-table>
          <div class="form-group row">
            <div class="col-md-12">
              <hr>
              <button
                :disabled="isSaving"
                type="submit"
                class="btn btn-sm btn-primary mr-5"
              >
                <i
                  v-show="isSaving"
                  class="fa fa-asterisk fa-spin"
                /> {{ $t('save') | uppercase }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                @click="cancel"
              >
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
import TabMenu from '@/views/human-resource/TabMenu'

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
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      id: this.$route.params.id,
      form: new Form({
        date: {
          start: this.$moment().format('YYYY-MM-DD 00:00:00'),
          end: this.$moment().format('YYYY-MM-DD 23:59:59')
        },
        job_location: '',
        base_salary: 0,
        multiplier_kpi: 0,
        daily_transport_allowance: 0,
        communication_allowance: 0,
        communication_allowance_week_1: 0,
        communication_allowance_week_2: 0,
        communication_allowance_week_3: 0,
        communication_allowance_week_4: 0,
        communication_allowance_week_5: 0,
        functional_allowance: 0,
        functional_allowance_week_1: 0,
        functional_allowance_week_2: 0,
        functional_allowance_week_3: 0,
        functional_allowance_week_4: 0,
        functional_allowance_week_5: 0,
        salary_assessment: {
          indicators: [],
          total: {}
        },
        salary_achievement: {
          automated: {},
          weekly_sales: {},
          total: {}
        },
        active_days_in_month: 0,
        active_days_week_1: 0,
        active_days_week_2: 0,
        active_days_week_3: 0,
        active_days_week_4: 0,
        active_days_week_5: 0,
        receivable_cut_60_days_week_1: 0,
        receivable_cut_60_days_week_2: 0,
        receivable_cut_60_days_week_3: 0,
        receivable_cut_60_days_week_4: 0,
        receivable_cut_60_days_week_5: 0,
        overdue_receivable_week_1: 0,
        overdue_receivable_week_2: 0,
        overdue_receivable_week_3: 0,
        overdue_receivable_week_4: 0,
        overdue_receivable_week_5: 0,
        payment_from_marketing_week_1: 0,
        payment_from_marketing_week_2: 0,
        payment_from_marketing_week_3: 0,
        payment_from_marketing_week_4: 0,
        payment_from_marketing_week_5: 0,
        payment_from_sales_week_1: 0,
        payment_from_sales_week_2: 0,
        payment_from_sales_week_3: 0,
        payment_from_sales_week_4: 0,
        payment_from_sales_week_5: 0,
        payment_from_spg_week_1: 0,
        payment_from_spg_week_2: 0,
        payment_from_spg_week_3: 0,
        payment_from_spg_week_4: 0,
        payment_from_spg_week_5: 0,
        cash_payment_week_1: 0,
        cash_payment_week_2: 0,
        cash_payment_week_3: 0,
        cash_payment_week_4: 0,
        cash_payment_week_5: 0,
        wa_daily_report_week_1: 0,
        wa_daily_report_week_2: 0,
        wa_daily_report_week_3: 0,
        wa_daily_report_week_4: 0,
        wa_daily_report_week_5: 0,
        weekly_sales_week_1: 0,
        weekly_sales_week_2: 0,
        weekly_sales_week_3: 0,
        weekly_sales_week_4: 0,
        weekly_sales_week_5: 0,
        maximum_salary_amount: 0
      }),
      title: 'Salary',
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
      isLoading: true,
      isSaving: false,
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
  computed: {
    ...mapGetters('humanResourceEmployee', ['employee']),
    ...mapGetters('humanResourceEmployeeAssessment', ['assessment']),
    ...mapGetters('humanResourceEmployeeSalary', ['salary', 'salaryAssessment', 'salaryAchievement'])
  },
  watch: {
    'form.date' () {
      if (!this.isSaving && this.form.date.start && this.form.date.end) {
        this.isLoading = true
        this.getAssessment()
      }
    },
    'form.activeDaysInMonth' () {
      if (!this.isLoading) {
        this.calculate()
      }
    },
    'form.active_days_week_1' () {
      if (!this.isLoading) {
        this.calculate()
      }
    },
    'form.active_days_week_2' () {
      if (!this.isLoading) {
        this.calculate()
      }
    },
    'form.active_days_week_3' () {
      if (!this.isLoading) {
        this.calculate()
      }
    },
    'form.active_days_week_4' () {
      if (!this.isLoading) {
        this.calculate()
      }
    },
    'form.active_days_week_5' () {
      if (!this.isLoading) {
        this.calculate()
      }
    }
  },
  created () {
    this.isLoading = true
    this.findEmployee({ id: this.id })
      .then((response) => {
        this.form.daily_transport_allowance = Number(this.employee.daily_transport_allowance) || 0
        this.form.communication_allowance = Number(this.employee.communication_allowance) || 0
        this.form.communication_allowance_week_1 = this.form.communication_allowance
        this.form.communication_allowance_week_2 = 0
        this.form.communication_allowance_week_3 = 0
        this.form.communication_allowance_week_4 = 0
        this.form.communication_allowance_week_5 = 0
        this.form.functional_allowance = Number(this.employee.functional_allowance) || 0
        this.form.functional_allowance_week_1 = this.form.functional_allowance
        this.form.functional_allowance_week_2 = 0
        this.form.functional_allowance_week_3 = 0
        this.form.functional_allowance_week_4 = 0
        this.form.functional_allowance_week_5 = 0
        if (this.employee.job_location) {
          this.form.job_location = this.employee.job_location.name
          this.form.base_salary = Number(this.employee.job_location.base_salary) || 0
          this.form.multiplier_kpi = Number(this.employee.job_location.multiplier_kpi) || 0
        }
        this.getAssessment()
      }, (error) => {
        this.isLoading = false
        console.log(JSON.stringify(error))
      })
  },
  methods: {
    ...mapActions('humanResourceEmployee', {
      findEmployee: 'find'
    }),
    ...mapActions('humanResourceEmployeeSalary', {
      createEmployeeSalary: 'create',
      getSalaryAssessment: 'getAssessment',
      getSalaryAchievement: 'getAchievement'
    }),
    cancel () {
      this.$router.go(-1)
    },
    onSubmit () {
      this.isSaving = true
      this.createEmployeeSalary({ employeeId: this.employee.id, form: this.form })
        .then(
          (response) => {
            this.isSaving = false
            this.$notification.success('Create success')
            this.$router.push('/human-resource/employee/' + this.employee.id + '/salary/' + response.data.id)
          },
          (error) => {
            this.isSaving = false
            this.$notification.error('Create failed', error.message)
            this.form.errors.record(error.errors)
          }
        )
    },
    getAssessment () {
      this.getSalaryAssessment({
        employeeId: this.id,
        params: {
          startDate: this.serverDateTime(this.form.date.start, 'start'),
          endDate: this.serverDateTime(this.form.date.end, 'end')
        }
      }).then(
        (response) => {
          this.$set(this.form.salary_assessment, 'indicators', this.salaryAssessment.indicators)
          this.$set(this.form.salary_assessment, 'total', this.salaryAssessment.total)
          this.getAchievement()
        },
        (error) => {
          this.isLoading = false
          console.log(JSON.stringify(error))
        }
      )
    },
    getAchievement () {
      this.getSalaryAchievement({
        employeeId: this.id,
        params: {
          startDate: this.serverDateTime(this.form.date.start, 'start'),
          endDate: this.serverDateTime(this.form.date.end, 'end')
        }
      }).then(
        (response) => {
          this.$set(this.form, 'salary_achievement', this.salaryAchievement)
          this.salaryAchievementWeight()
          this.calculate()
          this.isLoading = false
        },
        (error) => {
          this.isLoading = false
          console.log(JSON.stringify(error))
        }
      )
    },
    salaryAssessmentWeight () {
      this.form.salary_assessment.total.week1 = 0
      this.form.salary_assessment.total.week2 = 0
      this.form.salary_assessment.total.week3 = 0
      this.form.salary_assessment.total.week4 = 0
      this.form.salary_assessment.total.week5 = 0
      this.form.salary_assessment.total.weight = 0

      this.form.salary_assessment.indicators.forEach((indicator, key) => {
        this.form.salary_assessment.total.weight += (Number(indicator.weight || 0))
        for (const key in indicator.score_percentage) {
          this.form.salary_assessment.total[key] += (Number(indicator.weight || 0) * ((indicator.score_percentage[key] || 0) / 100))
        }
      })

      if (!this.isLoading) {
        this.calculate()
      }
    },
    salaryAchievementWeight () {
      this.form.salary_achievement.total.week1 = 0
      this.form.salary_achievement.total.week2 = 0
      this.form.salary_achievement.total.week3 = 0
      this.form.salary_achievement.total.week4 = 0
      this.form.salary_achievement.total.week5 = 0
      this.form.salary_achievement.total.weight = 0

      for (const key in this.form.salary_achievement.automated) {
        if (this.form.salary_achievement.automated[key]) {
          this.form.salary_achievement.total.weight += (Number(this.form.salary_achievement.automated[key].weight) || 0)
        }
      }

      for (const key in this.form.salary_achievement.automated) {
        for (const week in this.form.salary_achievement.automated[key]) {
          if (week != 'weight') {
            this.form.salary_achievement.total[week] += (this.form.salary_achievement.automated[key][week] || 0) * ((this.form.salary_achievement.automated[key].weight || 0) / 100)
          }
        }
      }

      if (!this.isLoading) {
        this.calculate()
      }
    },
    getWeekOfMonth (date) {
      const dateObject = new Date(date)
      const adjustedDate = dateObject.getDate() + dateObject.getDay()
      const prefixes = ['0', '1', '2', '3', '4', '5']
      return (parseInt(prefixes[0 | adjustedDate / 7]) + 1)
    },
    calculate () {
      this.salary_final_score.week1 = ((this.form.salary_assessment.total.week1 || 0) + (this.form.salary_achievement.total.week1 || 0)) / 2
      this.salary_final_score.week2 = ((this.form.salary_assessment.total.week2 || 0) + (this.form.salary_achievement.total.week2 || 0)) / 2
      this.salary_final_score.week3 = ((this.form.salary_assessment.total.week3 || 0) + (this.form.salary_achievement.total.week3 || 0)) / 2
      this.salary_final_score.week4 = ((this.form.salary_assessment.total.week4 || 0) + (this.form.salary_achievement.total.week4 || 0)) / 2
      this.salary_final_score.week5 = ((this.form.salary_assessment.total.week5 || 0) + (this.form.salary_achievement.total.week5 || 0)) / 2

      this.form.active_days_in_month = this.form.active_days_in_month || 0

      if (Number(this.form.active_days_in_month) != 0) {
        if (this.form.salary_assessment.indicators.length != 0) {
          this.base_salary_week_1 = Number(this.form.base_salary / this.form.active_days_in_month * this.form.active_days_week_1 || 0)
          this.base_salary_week_2 = Number(this.form.base_salary / this.form.active_days_in_month * this.form.active_days_week_2 || 0)
          this.base_salary_week_3 = Number(this.form.base_salary / this.form.active_days_in_month * this.form.active_days_week_3 || 0)
          this.base_salary_week_4 = Number(this.form.base_salary / this.form.active_days_in_month * this.form.active_days_week_4 || 0)
          this.base_salary_week_5 = Number(this.form.base_salary / this.form.active_days_in_month * this.form.active_days_week_5 || 0)

          this.real_transport_allowance_week_1 = Number(this.form.daily_transport_allowance * this.form.active_days_week_1 || 0)
          this.real_transport_allowance_week_2 = Number(this.form.daily_transport_allowance * this.form.active_days_week_2 || 0)
          this.real_transport_allowance_week_3 = Number(this.form.daily_transport_allowance * this.form.active_days_week_3 || 0)
          this.real_transport_allowance_week_4 = Number(this.form.daily_transport_allowance * this.form.active_days_week_4 || 0)
          this.real_transport_allowance_week_5 = Number(this.form.daily_transport_allowance * this.form.active_days_week_5 || 0)

          this.real_transport_allowance_total = this.real_transport_allowance_week_1 + this.real_transport_allowance_week_2 + this.real_transport_allowance_week_3 + this.real_transport_allowance_week_4 + this.real_transport_allowance_week_5

          this.multiplier_kpi_week_1 = Number(this.form.multiplier_kpi / this.form.active_days_in_month * this.form.active_days_week_1 || 0)
          this.multiplier_kpi_week_2 = Number(this.form.multiplier_kpi / this.form.active_days_in_month * this.form.active_days_week_2 || 0)
          this.multiplier_kpi_week_3 = Number(this.form.multiplier_kpi / this.form.active_days_in_month * this.form.active_days_week_3 || 0)
          this.multiplier_kpi_week_4 = Number(this.form.multiplier_kpi / this.form.active_days_in_month * this.form.active_days_week_4 || 0)
          this.multiplier_kpi_week_5 = Number(this.form.multiplier_kpi / this.form.active_days_in_month * this.form.active_days_week_5 || 0)
        }
      }

      this.minimum_component_amount_week_1 = Number(this.form.salary_assessment.total.week1 || 0) * (Number(this.base_salary_week_1 || 0) / 100)
      this.minimum_component_amount_week_2 = Number(this.form.salary_assessment.total.week2 || 0) * (Number(this.base_salary_week_2 || 0) / 100)
      this.minimum_component_amount_week_3 = Number(this.form.salary_assessment.total.week3 || 0) * (Number(this.base_salary_week_3 || 0) / 100)
      this.minimum_component_amount_week_4 = Number(this.form.salary_assessment.total.week4 || 0) * (Number(this.base_salary_week_4 || 0) / 100)
      this.minimum_component_amount_week_5 = Number(this.form.salary_assessment.total.week5 || 0) * (Number(this.base_salary_week_5 || 0) / 100)

      this.additional_component_point_week_1 = Number(this.form.salary_achievement.total.week1 || 0) * (Number(this.multiplier_kpi_week_1 || 0) / 100)
      this.additional_component_point_week_2 = Number(this.form.salary_achievement.total.week2 || 0) * (Number(this.multiplier_kpi_week_2 || 0) / 100)
      this.additional_component_point_week_3 = Number(this.form.salary_achievement.total.week3 || 0) * (Number(this.multiplier_kpi_week_3 || 0) / 100)
      this.additional_component_point_week_4 = Number(this.form.salary_achievement.total.week4 || 0) * (Number(this.multiplier_kpi_week_4 || 0) / 100)
      this.additional_component_point_week_5 = Number(this.form.salary_achievement.total.week5 || 0) * (Number(this.multiplier_kpi_week_5 || 0) / 100)

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

      this.total_amount_received = Number(this.total_amount_received_week_1 || 0) + Number(this.total_amount_received_week_2 || 0) + Number(this.total_amount_received_week_3 || 0) + Number(this.total_amount_received_week_4 || 0) + Number(this.total_amount_received_week_5 || 0) + Number(this.form.communication_allowance_week_1 || 0) + Number(this.form.functional_allowance_week_1 || 0) + Number(this.form.communication_allowance_week_2 || 0) + Number(this.form.functional_allowance_week_2 || 0) + Number(this.form.communication_allowance_week_3 || 0) + Number(this.form.functional_allowance_week_3 || 0) + Number(this.form.communication_allowance_week_4 || 0) + Number(this.form.functional_allowance_week_4 || 0) + Number(this.form.communication_allowance_week_5 || 0) + Number(this.form.functional_allowance_week_5 || 0)

      this.receivable_week_1 = Number(this.form.payment_from_marketing_week_1 || 0) + Number(this.form.payment_from_sales_week_1 || 0) + Number(this.form.payment_from_spg_week_1 || 0) + Number(this.form.cash_payment_week_1 || 0)
      this.receivable_week_2 = Number(this.form.payment_from_marketing_week_2 || 0) + Number(this.form.payment_from_sales_week_2 || 0) + Number(this.form.payment_from_spg_week_2 || 0) + Number(this.form.cash_payment_week_2 || 0)
      this.receivable_week_3 = Number(this.form.payment_from_marketing_week_3 || 0) + Number(this.form.payment_from_sales_week_3 || 0) + Number(this.form.payment_from_spg_week_3 || 0) + Number(this.form.cash_payment_week_3 || 0)
      this.receivable_week_4 = Number(this.form.payment_from_marketing_week_4 || 0) + Number(this.form.payment_from_sales_week_4 || 0) + Number(this.form.payment_from_spg_week_4 || 0) + Number(this.form.cash_payment_week_4 || 0)
      this.receivable_week_5 = Number(this.form.payment_from_marketing_week_5 || 0) + Number(this.form.payment_from_sales_week_5 || 0) + Number(this.form.payment_from_spg_week_5 || 0) + Number(this.form.cash_payment_week_5 || 0)

      this.company_profit_week_1 = 0.05 * this.receivable_week_1
      this.company_profit_week_2 = 0.05 * this.receivable_week_2
      this.company_profit_week_3 = 0.05 * this.receivable_week_3
      this.company_profit_week_4 = 0.05 * this.receivable_week_4
      this.company_profit_week_5 = 0.05 * this.receivable_week_5

      this.settlement_difference_minus_amount_week_1 = this.receivable_week_1 - Number(this.total_amount_received_week_1 || 0) - Number(this.form.communication_allowance_week_1 || 0) - Number(this.form.functional_allowance_week_1 || 0)
      this.settlement_difference_minus_amount_week_2 = this.receivable_week_2 - Number(this.total_amount_received_week_2 || 0) - Number(this.form.communication_allowance_week_2 || 0) - Number(this.form.functional_allowance_week_2 || 0)
      this.settlement_difference_minus_amount_week_3 = this.receivable_week_3 - Number(this.total_amount_received_week_3 || 0) - Number(this.form.communication_allowance_week_3 || 0) - Number(this.form.functional_allowance_week_3 || 0)
      this.settlement_difference_minus_amount_week_4 = this.receivable_week_4 - Number(this.total_amount_received_week_4 || 0) - Number(this.form.communication_allowance_week_4 || 0) - Number(this.form.functional_allowance_week_4 || 0)
      this.settlement_difference_minus_amount_week_5 = this.receivable_week_5 - Number(this.total_amount_received_week_5 || 0) - Number(this.form.communication_allowance_week_5 || 0) - Number(this.form.functional_allowance_week_5 || 0)

      this.company_profit_difference_minus_amount_week_1 = Number(this.company_profit_week_1 || 0) - Number(this.total_amount_received_week_1 || 0) - Number(this.form.communication_allowance_week_1 || 0) - Number(this.form.functional_allowance_week_1 || 0)
      this.company_profit_difference_minus_amount_week_2 = Number(this.company_profit_week_2 || 0) - Number(this.total_amount_received_week_2 || 0) - Number(this.form.communication_allowance_week_2 || 0) - Number(this.form.functional_allowance_week_2 || 0)
      this.company_profit_difference_minus_amount_week_3 = Number(this.company_profit_week_3 || 0) - Number(this.total_amount_received_week_3 || 0) - Number(this.form.communication_allowance_week_3 || 0) - Number(this.form.functional_allowance_week_3 || 0)
      this.company_profit_difference_minus_amount_week_4 = Number(this.company_profit_week_4 || 0) - Number(this.total_amount_received_week_4 || 0) - Number(this.form.communication_allowance_week_4 || 0) - Number(this.form.functional_allowance_week_4 || 0)
      this.company_profit_difference_minus_amount_week_5 = Number(this.company_profit_week_5 || 0) - Number(this.total_amount_received_week_5 || 0) - Number(this.form.communication_allowance_week_5 || 0) - Number(this.form.functional_allowance_week_5 || 0)

      var dayAverageDivisor = 0
      var totalMinimumComponentScore = 0
      var totalAdditionalComponentScore = 0
      var totalFinalScore = 0

      if (this.form.active_days_week_1 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.form.salary_assessment.total.week1
        totalAdditionalComponentScore += this.form.salary_achievement.total.week1
        totalFinalScore += this.salary_final_score.week1
      }
      if (this.form.active_days_week_2 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.form.salary_assessment.total.week2
        totalAdditionalComponentScore += this.form.salary_achievement.total.week2
        totalFinalScore += this.salary_final_score.week2
      }
      if (this.form.active_days_week_3 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.form.salary_assessment.total.week3
        totalAdditionalComponentScore += this.form.salary_achievement.total.week3
        totalFinalScore += this.salary_final_score.week3
      }
      if (this.form.active_days_week_4 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.form.salary_assessment.total.week4
        totalAdditionalComponentScore += this.form.salary_achievement.total.week4
        totalFinalScore += this.salary_final_score.week4
      }
      if (this.form.active_days_week_5 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.form.salary_assessment.total.week5
        totalAdditionalComponentScore += this.form.salary_achievement.total.week5
        totalFinalScore += this.salary_final_score.week5
      }

      this.average_minimum_component_score = dayAverageDivisor != 0 ? totalMinimumComponentScore / dayAverageDivisor : 0
      this.average_additional_component_score = dayAverageDivisor != 0 ? totalAdditionalComponentScore / dayAverageDivisor : 0
      this.average_final_score = dayAverageDivisor != 0 ? totalFinalScore / dayAverageDivisor : 0

      this.total_payment = this.receivable_week_1 + this.receivable_week_2 + this.receivable_week_3 + this.receivable_week_4 + this.receivable_week_5

      this.total_settlement_difference_minus_amount = this.settlement_difference_minus_amount_week_1 + this.settlement_difference_minus_amount_week_2 + this.settlement_difference_minus_amount_week_3 + this.settlement_difference_minus_amount_week_4 + this.settlement_difference_minus_amount_week_5

      this.total_company_profit_difference_minus_amount = this.company_profit_difference_minus_amount_week_1 + this.company_profit_difference_minus_amount_week_2 + this.company_profit_difference_minus_amount_week_3 + this.company_profit_difference_minus_amount_week_4 + this.company_profit_difference_minus_amount_week_5

      this.total_weekly_sales = Number(this.form.weekly_sales_week_1 || 0) + Number(this.form.weekly_sales_week_2 || 0) + Number(this.form.weekly_sales_week_3 || 0) + Number(this.form.weekly_sales_week_4 || 0) + Number(this.form.weekly_sales_week_5 || 0)

      this.amount_received_difference = this.form.maximum_salary_amount - this.total_amount_received
    }
  }
}
</script>
