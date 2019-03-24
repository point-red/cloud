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

    <tab-menu>
      <li class="nav-item" v-if="$permission.has('read employee salary')" slot="right">
        <router-link
          :to="'/human-resource/employee/' + employee.id + '/salary'"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-wallet"></i> {{ $t('salary') | titlecase }}</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="$permission.has('create employee salary')" slot="right">
        <router-link
          :to="'/human-resource/employee/' + employee.id + '/salary/create'"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-wallet"></i> {{ $t('employee salary') | titlecase }}</span>
        </router-link>
      </li>
    </tab-menu>

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
                  {{ form.job_location }}
                </div>
              </p-form-row>
              <p-form-row
                id="salary-date"
                :label="$t('salary period')">
                <div slot="body" class="col-lg-9">
                  <p-date-picker
                    name="salary-year-month"
                    type="month"
                    format="YYYY-MM"
                    placeholder="Select Period"
                    v-model="form.date"/>
                </div>
              </p-form-row>
              <p-form-row
                id="active-days-in-month"
                name="active-days-in-month"
                :label="$t('active days / month')">
                <div slot="body" class="col-lg-3">
                  <p-form-number
                    v-model="form.active_days_in_month"
                    :disabled="loadingSaveButton"
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
                  v-model="form.active_days_week_1"
                  :disabled="loadingSaveButton"
                  :is-text-right="false"
                  :errors="form.errors.get('active-days-week-1')"
                  @errors="form.errors.set('active-days-week-1', null)"/>
              </td>
              <td class="font-size-h6 font-w700">
                <p-form-number
                  v-model="form.active_days_week_2"
                  :disabled="loadingSaveButton"
                  :is-text-right="false"
                  :errors="form.errors.get('active-days-week-2')"
                  @errors="form.errors.set('active-days-week-2', null)"/>
              </td>
              <td class="font-size-h6 font-w700">
                <p-form-number
                  v-model="form.active_days_week_3"
                  :disabled="loadingSaveButton"
                  :is-text-right="false"
                  :errors="form.errors.get('active-days-week-3')"
                  @errors="form.errors.set('active-days-week-3', null)"/>
              </td>
              <td class="font-size-h6 font-w700">
                <p-form-number
                  v-model="form.active_days_week_4"
                  :disabled="loadingSaveButton"
                  :is-text-right="false"
                  :errors="form.errors.get('active-days-week-4')"
                  @errors="form.errors.set('active-days-week-4', null)"/>
              </td>
              <td class="font-size-h6 font-w700">
                <p-form-number
                  v-model="form.active_days_week_5"
                  :disabled="loadingSaveButton"
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

            <tr slot="p-body" v-for="(indicator, indicatorIndex) in form.salary_assessment.indicators" :key="'indicator' + indicator.id">
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
                  name="indicator-weight"
                  v-model="indicator.weight"
                  :disabled="loadingSaveButton"
                  @input="salaryAssessmentWeight"
                  :is-text-right="false"/>
              </td>
            </tr>

            <tr slot="p-body">
              <td class="text-center font-w700"><span class=""></span></td>
              <td class="font-size-h6 font-w700">{{ $t('minimum component score') | uppercase }}</td>
              <td class="font-w700"><span class="">{{ form.salary_assessment.total.week1 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ form.salary_assessment.total.week2 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ form.salary_assessment.total.week3 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ form.salary_assessment.total.week4 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ form.salary_assessment.total.week5 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ form.salary_assessment.total.weight | numberFormat }}%</span></td>
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

            <tr slot="p-body">
              <td>1</td>
              <td>{{ $t('balance Sku area') | titlecase }}</td>
              <td>{{ form.salary_achievement.automated.balance.week1 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.balance.week2 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.balance.week3 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.balance.week4 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.balance.week5 | numberFormat }}%</td>
              <td>
                <p-form-input
                  id="balance-weight"
                  name="balance-weight"
                  v-model="form.salary_achievement.automated.balance.weight"
                  :disabled="loadingSaveButton"
                  @input="salaryAchievementWeight"
                  :is-text-right="false"/>
              </td>
            </tr>

            <tr slot="p-body">
              <td>2</td>
              <td>{{ $t('%C national achievement') | titlecase }}</td>
              <td>{{ form.salary_achievement.automated.achievement_national_call.week1 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_national_call.week2 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_national_call.week3 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_national_call.week4 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_national_call.week5 | numberFormat }}%</td>
              <td>
                <p-form-input
                  id="call-national-achievement-weight"
                  name="call-national-achievement-weight"
                  v-model="form.salary_achievement.automated.achievement_national_call.weight"
                  :disabled="loadingSaveButton"
                  @input="salaryAchievementWeight"
                  :is-text-right="false"/>
              </td>
            </tr>

            <tr slot="p-body">
              <td>3</td>
              <td>{{ $t('%EC national achievement') | titlecase }}</td>
              <td>{{ form.salary_achievement.automated.achievement_national_effective_call.week1 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_national_effective_call.week2 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_national_effective_call.week3 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_national_effective_call.week4 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_national_effective_call.week5 | numberFormat }}%</td>
              <td>
                <p-form-input
                  id="effective-call-national-achievement-weight"
                  name="effective-call-national-achievement-weight"
                  v-model="form.salary_achievement.automated.achievement_national_effective_call.weight"
                  :disabled="loadingSaveButton"
                  @input="salaryAchievementWeight"
                  :is-text-right="false"/>
              </td>
            </tr>

            <tr slot="p-body">
              <td>4</td>
              <td>{{ $t('%value national achievement') | titlecase }}</td>
              <td>{{ form.salary_achievement.automated.achievement_national_value.week1 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_national_value.week2 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_national_value.week3 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_national_value.week4 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_national_value.week5 | numberFormat }}%</td>
              <td>
                <p-form-input
                  id="value-national-achievement-weight"
                  name="value-national-achievement-weight"
                  v-model="form.salary_achievement.automated.achievement_national_value.weight"
                  :disabled="loadingSaveButton"
                  @input="salaryAchievementWeight"
                  :is-text-right="false"/>
              </td>
            </tr>

            <tr slot="p-body">
              <td>5</td>
              <td>{{ $t('%C area achievement') | titlecase }}</td>
              <td>{{ form.salary_achievement.automated.achievement_area_call.week1 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_area_call.week2 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_area_call.week3 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_area_call.week4 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_area_call.week5 | numberFormat }}%</td>
              <td>
                <p-form-input
                  id="call-area-achievement-weight"
                  name="call-area-achievement-weight"
                  v-model="form.salary_achievement.automated.achievement_area_call.weight"
                  :disabled="loadingSaveButton"
                  @input="salaryAchievementWeight"
                  :is-text-right="false"/>
              </td>
            </tr>

            <tr slot="p-body">
              <td>6</td>
              <td>{{ $t('%EC area achievement') | titlecase }}</td>
              <td>{{ form.salary_achievement.automated.achievement_area_effective_call.week1 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_area_effective_call.week2 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_area_effective_call.week3 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_area_effective_call.week4 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_area_effective_call.week5 | numberFormat }}%</td>
              <td>
                <p-form-input
                  id="effective-call-area-achievement-weight"
                  name="effective-call-area-achievement-weight"
                  v-model="form.salary_achievement.automated.achievement_area_effective_call.weight"
                  :disabled="loadingSaveButton"
                  @input="salaryAchievementWeight"
                  :is-text-right="false"/>
              </td>
            </tr>

            <tr slot="p-body">
              <td>7</td>
              <td>{{ $t('%value area achievement') | titlecase }}</td>
              <td>{{ form.salary_achievement.automated.achievement_area_value.week1 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_area_value.week2 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_area_value.week3 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_area_value.week4 | numberFormat }}%</td>
              <td>{{ form.salary_achievement.automated.achievement_area_value.week5 | numberFormat }}%</td>
              <td>
                <p-form-input
                  id="value-area-achievement-weight"
                  name="value-area-achievement-weight"
                  v-model="form.salary_achievement.automated.achievement_area_value.weight"
                  :disabled="loadingSaveButton"
                  @input="salaryAchievementWeight"
                  :is-text-right="false"/>
              </td>
            </tr>

            <tr slot="p-body">
              <td class="text-center font-w700"><span class=""></span></td>
              <td class="font-size-h6 font-w700">{{ $t('additional component score') | uppercase }}</td>
              <td class="font-w700"><span class="">{{ form.salary_achievement.total.week1 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ form.salary_achievement.total.week2 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ form.salary_achievement.total.week3 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ form.salary_achievement.total.week4 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ form.salary_achievement.total.week5 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ form.salary_achievement.total.weight | numberFormat }}%</span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td class="font-size-h6 font-w700">{{ $t('final score') | uppercase }}</td>
              <td class="font-w700"><span class="">{{ salary_final_score.week1 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ salary_final_score.week2 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ salary_final_score.week3 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ salary_final_score.week4 | numberFormat }}%</span></td>
              <td class="font-w700"><span class="">{{ salary_final_score.week5 | numberFormat }}%</span></td>
              <td class="font-w700"><span class=""></span></td>
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
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.receiveable_cut_60_days_week_1"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('receiveable-cut-60-days-week-1')"
                    @errors="form.errors.set('receiveable-cut-60-days-week-1', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.receiveable_cut_60_days_week_2"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('receiveable-cut-60-days-week-2')"
                    @errors="form.errors.set('receiveable-cut-60-days-week-2', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.receiveable_cut_60_days_week_3"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('receiveable-cut-60-days-week-3')"
                    @errors="form.errors.set('receiveable-cut-60-days-week-3', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.receiveable_cut_60_days_week_4"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('receiveable-cut-60-days-week-4')"
                    @errors="form.errors.set('receiveable-cut-60-days-week-4', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.receiveable_cut_60_days_week_5"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('receiveable-cut-60-days-week-5')"
                    @errors="form.errors.set('receiveable-cut-60-days-week-5', null)"/>
                </span>
              </td>
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
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.overdue_receivable_week_1"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('overdue-receivable-week-1')"
                    @errors="form.errors.set('overdue-receivable-week-1', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.overdue_receivable_week_2"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('overdue-receivable-week-2')"
                    @errors="form.errors.set('overdue-receivable-week-2', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.overdue_receivable_week_3"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('overdue-receivable-week-3')"
                    @errors="form.errors.set('overdue-receivable-week-3', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.overdue_receivable_week_4"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('overdue-receivable-week-4')"
                    @errors="form.errors.set('overdue-receivable-week-4', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.overdue_receivable_week_5"
                    :disabled="loadingSaveButton"
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
                    v-model="form.payment_from_marketing_week_1"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-marketing-week-1')"
                    @errors="form.errors.set('payment-from-marketing-week-1', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_marketing_week_2"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-marketing-week-2')"
                    @errors="form.errors.set('payment-from-marketing-week-2', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_marketing_week_3"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-marketing-week-3')"
                    @errors="form.errors.set('payment-from-marketing-week-3', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_marketing_week_4"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-marketing-week-4')"
                    @errors="form.errors.set('payment-from-marketing-week-4', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_marketing_week_5"
                    :disabled="loadingSaveButton"
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
                    v-model="form.payment_from_sales_week_1"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-sales-week-1')"
                    @errors="form.errors.set('payment-from-sales-week-1', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_sales_week_2"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-sales-week-2')"
                    @errors="form.errors.set('payment-from-sales-week-2', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_sales_week_3"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-sales-week-3')"
                    @errors="form.errors.set('payment-from-sales-week-3', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_sales_week_4"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-sales-week-4')"
                    @errors="form.errors.set('payment-from-sales-week-4', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_sales_week_5"
                    :disabled="loadingSaveButton"
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
                    v-model="form.payment_from_spg_week_1"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-spg-week-1')"
                    @errors="form.errors.set('payment-from-spg-week-1', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_spg_week_2"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-spg-week-2')"
                    @errors="form.errors.set('payment-from-spg-week-2', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_spg_week_3"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-spg-week-3')"
                    @errors="form.errors.set('payment-from-spg-week-3', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_spg_week_4"
                    :disabled="loadingSaveButton"
                    :is-text-right="false"
                    @input="calculate"
                    :errors="form.errors.get('payment-from-spg-week-4')"
                    @errors="form.errors.set('payment-from-spg-week-4', null)"/>
                </span>
              </td>
              <td>
                <span class="">
                  <p-form-number
                    v-model="form.payment_from_spg_week_5"
                    :disabled="loadingSaveButton"
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
              <td><span class="">Rp {{ form.salary_achievement.cash_payment.week1 | numberFormat }}</span></td>
              <td><span class="">Rp {{ form.salary_achievement.cash_payment.week2 | numberFormat }}</span></td>
              <td><span class="">Rp {{ form.salary_achievement.cash_payment.week3 | numberFormat }}</span></td>
              <td><span class="">Rp {{ form.salary_achievement.cash_payment.week4 | numberFormat }}</span></td>
              <td><span class="">Rp {{ form.salary_achievement.cash_payment.week5 | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('settlement difference minus amount') | titlecase }}</td>
              <td><span class="">Rp {{ settlement_difference_minus_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">Rp {{ settlement_difference_minus_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">Rp {{ settlement_difference_minus_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">Rp {{ settlement_difference_minus_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">Rp {{ settlement_difference_minus_amount_week_5 | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>

            <tr slot="p-body">
              <td></td>
              <td>{{ $t('company profit difference minus amount') | titlecase }}</td>
              <td><span class="">Rp {{ company_profit_difference_minus_amount_week_1 | numberFormat }}</span></td>
              <td><span class="">Rp {{ company_profit_difference_minus_amount_week_2 | numberFormat }}</span></td>
              <td><span class="">Rp {{ company_profit_difference_minus_amount_week_3 | numberFormat }}</span></td>
              <td><span class="">Rp {{ company_profit_difference_minus_amount_week_4 | numberFormat }}</span></td>
              <td><span class="">Rp {{ company_profit_difference_minus_amount_week_5 | numberFormat }}</span></td>
              <td><span class=""></span></td>
            </tr>
          </p-table>
          <div class="form-group row">
            <div class="col-md-12">
              <hr>
              <button
                :disabled="loadingSaveButton"
                type="submit"
                class="btn btn-sm btn-primary mr-5">
                <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Save
              </button>
              <button
                type="button"
                @click="cancel"
                class="btn btn-sm btn-outline-danger">
                Cancel
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
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource
  },
  data () {
    return {
      id: this.$route.params.id,
      form: new Form({
        date: new Date().toISOString().slice(0, 10),
        job_location: '',
        base_salary: 0,
        multiplier_kpi: 0,
        daily_transport_allowance: 0,
        communication_allowance: 0,
        team_leader_allowance: 0,
        salary_assessment: {
          indicators: [],
          total: {}
        },
        salary_achievement: {
          automated: {
            balance: {},
            achievement_national_call: {},
            achievement_national_effective_call: {},
            achievement_national_value: {},
            achievement_area_call: {},
            achievement_area_effective_call: {},
            achievement_area_value: {}
          },
          cash_payment: {},
          total: {}
        },
        active_days_in_month: 0,
        active_days_week_1: 0,
        active_days_week_2: 0,
        active_days_week_3: 0,
        active_days_week_4: 0,
        active_days_week_5: 0,
        receiveable_cut_60_days_week_1: 0,
        receiveable_cut_60_days_week_2: 0,
        receiveable_cut_60_days_week_3: 0,
        receiveable_cut_60_days_week_4: 0,
        receiveable_cut_60_days_week_5: 0,
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
        payment_from_spg_week_5: 0
      }),
      title: 'Salary',
      base_salary_week_1: 0,
      base_salary_week_2: 0,
      base_salary_week_3: 0,
      base_salary_week_4: 0,
      base_salary_eek_5: 0,
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
      loading: true,
      loadingSaveButton: false
    }
  },
  props: {
    name: {
      type: String
    }
  },
  watch: {
    'form.date' () {
      if (!this.loadingSaveButton) {
        this.loading = true
        this.getAssessment()
      }
    },
    'form.activeDaysInMonth' () {
      this.calculate()
    },
    'form.active_days_week_1' () {
      this.calculate()
    },
    'form.active_days_week_2' () {
      this.calculate()
    },
    'form.active_days_week_3' () {
      this.calculate()
    },
    'form.active_days_week_4' () {
      this.calculate()
    },
    'form.active_days_week_5' () {
      this.calculate()
    }
  },
  computed: {
    ...mapGetters('Employee', ['employee']),
    ...mapGetters('EmployeeAssessment', ['assessment']),
    ...mapGetters('EmployeeSalary', ['salary', 'salaryAssessment', 'salaryAchievement'])
  },
  created () {
    this.loading = true
    this.findEmployee({ id: this.id })
      .then((response) => {
        this.form.daily_transport_allowance = Number(this.employee.daily_transport_allowance)
        this.form.communication_allowance = Number(this.employee.communication_allowance)
        this.form.team_leader_allowance = Number(this.employee.team_leader_allowance)
        if (this.employee.job_location) {
          this.form.job_location = this.employee.job_location.name
          this.form.base_salary = Number(this.employee.job_location.base_salary)
          this.form.multiplier_kpi = Number(this.employee.job_location.multiplier_kpi)
        }
        this.getAssessment()
      }, (error) => {
        this.loading = false
        console.log(JSON.stringify(error))
      })
  },
  methods: {
    ...mapActions('Employee', {
      findEmployee: 'find'
    }),
    ...mapActions('EmployeeSalary', {
      createEmployeeSalary: 'create',
      getSalaryAssessment: 'getAssessment',
      getSalaryAchievement: 'getAchievement'
    }),
    cancel () {
      this.$router.go(-1)
    },
    onSubmit () {
      this.loadingSaveButton = true
      this.createEmployeeSalary({ employeeId: this.employee.id, form: this.form })
        .then(
          (response) => {
            this.loadingSaveButton = false
            this.$notification.success('Create success')
            this.$router.push('/human-resource/employee/' + this.employee.id + '/salary/' + response.data.id)
          },
          (error) => {
            this.loadingSaveButton = false
            this.$notification.error('Create failed', error.message)
            this.form.errors.record(error.errors)
          }
        )
    },
    getAssessment () {
      this.getSalaryAssessment({
        employeeId: this.id,
        params: {
          date: this.form.date
        }
      }).then(
        (response) => {
          this.$set(this.form.salary_assessment, 'indicators', this.salaryAssessment.indicators)
          this.$set(this.form.salary_assessment, 'total', this.salaryAssessment.total)
          this.getAchievement()
        },
        (error) => {
          this.loading = false
          console.log(JSON.stringify(error))
        }
      )
    },
    getAchievement () {
      this.getSalaryAchievement({
        employeeId: this.id,
        params: {
          date: this.form.date
        }
      }).then(
        (response) => {
          this.$set(this.form, 'salary_achievement', this.salaryAchievement)
          this.calculate()
          this.loading = false
        },
        (error) => {
          this.loading = false
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
        this.form.salary_assessment.total.weight += Number(indicator.weight)
        for (const key in indicator.score_percentage) {
          this.form.salary_assessment.total[key] += Number(indicator.weight) * indicator.score_percentage[key] / 100
        }
      })

      this.calculate()
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
          this.form.salary_achievement.total.weight += Number(this.form.salary_achievement.automated[key].weight)
        }
      }

      for (const key in this.form.salary_achievement.automated) {
        for (const week in this.form.salary_achievement.automated[key]) {
          if (week != 'weight') {
            this.form.salary_achievement.total[week] += this.form.salary_achievement.automated[key][week] * this.form.salary_achievement.automated[key].weight / 100
          }
        }
      }

      this.calculate()
    },
    calculate () {
      this.salary_final_score.week1 = (this.form.salary_assessment.total.week1 + this.form.salary_achievement.total.week1) / 2
      this.salary_final_score.week2 = (this.form.salary_assessment.total.week2 + this.form.salary_achievement.total.week2) / 2
      this.salary_final_score.week3 = (this.form.salary_assessment.total.week3 + this.form.salary_achievement.total.week3) / 2
      this.salary_final_score.week4 = (this.form.salary_assessment.total.week4 + this.form.salary_achievement.total.week4) / 2
      this.salary_final_score.week5 = (this.form.salary_assessment.total.week5 + this.form.salary_achievement.total.week5) / 2

      if (this.form.active_days_in_month != null && Number(this.form.active_days_in_month != 0)) {
        let baseSalaryPerWeek = this.form.base_salary / Number(this.form.active_days_in_month)

        this.base_salary_week_1 = baseSalaryPerWeek * Number(this.form.active_days_week_1)
        this.base_salary_week_2 = baseSalaryPerWeek * Number(this.form.active_days_week_2)
        this.base_salary_week_3 = baseSalaryPerWeek * Number(this.form.active_days_week_3)
        this.base_salary_week_4 = baseSalaryPerWeek * Number(this.form.active_days_week_4)
        this.base_salary_week_5 = baseSalaryPerWeek * Number(this.form.active_days_week_5)
      }

      this.real_transport_allowance_week_1 = this.form.daily_transport_allowance * Number(this.form.active_days_week_1)
      this.real_transport_allowance_week_2 = this.form.daily_transport_allowance * Number(this.form.active_days_week_2)
      this.real_transport_allowance_week_3 = this.form.daily_transport_allowance * Number(this.form.active_days_week_3)
      this.real_transport_allowance_week_4 = this.form.daily_transport_allowance * Number(this.form.active_days_week_4)
      this.real_transport_allowance_week_5 = this.form.daily_transport_allowance * Number(this.form.active_days_week_5)

      this.minimum_component_amount_week_1 = Number(Number(this.form.salary_assessment.total.week1) * Number(this.base_salary_week_1)) / 100
      this.minimum_component_amount_week_2 = Number(Number(this.form.salary_assessment.total.week2) * Number(this.base_salary_week_2)) / 100
      this.minimum_component_amount_week_3 = Number(Number(this.form.salary_assessment.total.week3) * Number(this.base_salary_week_3)) / 100
      this.minimum_component_amount_week_4 = Number(Number(this.form.salary_assessment.total.week4) * Number(this.base_salary_week_4)) / 100
      this.minimum_component_amount_week_5 = Number(Number(this.form.salary_assessment.total.week5) * Number(this.base_salary_week_5)) / 100

      this.multiplier_kpi_week_1 = Number(this.form.multiplier_kpi * Number(this.form.active_days_week_1)) / Number(this.form.active_days_in_month)
      this.multiplier_kpi_week_2 = Number(this.form.multiplier_kpi * Number(this.form.active_days_week_2)) / Number(this.form.active_days_in_month)
      this.multiplier_kpi_week_3 = Number(this.form.multiplier_kpi * Number(this.form.active_days_week_3)) / Number(this.form.active_days_in_month)
      this.multiplier_kpi_week_4 = Number(this.form.multiplier_kpi * Number(this.form.active_days_week_4)) / Number(this.form.active_days_in_month)
      this.multiplier_kpi_week_5 = Number(this.form.multiplier_kpi * Number(this.form.active_days_week_5)) / Number(this.form.active_days_in_month)

      this.additional_component_point_week_1 = Number(Number(this.form.salary_achievement.total.week1) * Number(this.multiplier_kpi_week_1)) / 100
      this.additional_component_point_week_2 = Number(Number(this.form.salary_achievement.total.week2) * Number(this.multiplier_kpi_week_2)) / 100
      this.additional_component_point_week_3 = Number(Number(this.form.salary_achievement.total.week3) * Number(this.multiplier_kpi_week_3)) / 100
      this.additional_component_point_week_4 = Number(Number(this.form.salary_achievement.total.week4) * Number(this.multiplier_kpi_week_4)) / 100
      this.additional_component_point_week_5 = Number(Number(this.form.salary_achievement.total.week5) * Number(this.multiplier_kpi_week_5)) / 100

      this.additional_component_amount_week_1 = this.additional_component_point_week_1 * 1000
      this.additional_component_amount_week_2 = this.additional_component_point_week_2 * 1000
      this.additional_component_amount_week_3 = this.additional_component_point_week_3 * 1000
      this.additional_component_amount_week_4 = this.additional_component_point_week_4 * 1000
      this.additional_component_amount_week_5 = this.additional_component_point_week_5 * 1000

      this.total_component_amount_week_1 = this.minimum_component_amount_week_1 + this.additional_component_amount_week_1
      this.total_component_amount_week_2 = this.minimum_component_amount_week_2 + this.additional_component_amount_week_2
      this.total_component_amount_week_3 = this.minimum_component_amount_week_3 + this.additional_component_amount_week_3
      this.total_component_amount_week_4 = this.minimum_component_amount_week_4 + this.additional_component_amount_week_4
      this.total_component_amount_week_5 = this.minimum_component_amount_week_5 + this.additional_component_amount_week_5

      this.total_amount_week_1 = this.total_component_amount_week_1 + this.real_transport_allowance_week_1
      this.total_amount_week_2 = this.total_component_amount_week_2 + this.real_transport_allowance_week_2
      this.total_amount_week_3 = this.total_component_amount_week_3 + this.real_transport_allowance_week_3
      this.total_amount_week_4 = this.total_component_amount_week_4 + this.real_transport_allowance_week_4
      this.total_amount_week_5 = this.total_component_amount_week_5 + this.real_transport_allowance_week_5

      this.total_amount_received_week_1 = this.total_amount_week_1 - this.form.receiveable_cut_60_days_week_1
      this.total_amount_received_week_2 = this.total_amount_week_2 - this.form.receiveable_cut_60_days_week_2
      this.total_amount_received_week_3 = this.total_amount_week_3 - this.form.receiveable_cut_60_days_week_3
      this.total_amount_received_week_4 = this.total_amount_week_4 - this.form.receiveable_cut_60_days_week_4
      this.total_amount_received_week_5 = this.total_amount_week_5 - this.form.receiveable_cut_60_days_week_5

      this.total_amount_received = this.total_amount_received_week_1 + this.total_amount_received_week_2 + this.total_amount_received_week_3 + this.total_amount_received_week_4 + this.total_amount_received_week_5 + this.form.communication_allowance + this.form.team_leader_allowance

      this.company_profit_week_1 = (5 / 100) * (Number(this.form.payment_from_marketing_week_1) + Number(this.form.payment_from_sales_week_1) + Number(this.form.payment_from_spg_week_1))
      this.company_profit_week_2 = (5 / 100) * (Number(this.form.payment_from_marketing_week_2) + Number(this.form.payment_from_sales_week_2) + Number(this.form.payment_from_spg_week_2))
      this.company_profit_week_3 = (5 / 100) * (Number(this.form.payment_from_marketing_week_3) + Number(this.form.payment_from_sales_week_3) + Number(this.form.payment_from_spg_week_3))
      this.company_profit_week_4 = (5 / 100) * (Number(this.form.payment_from_marketing_week_4) + Number(this.form.payment_from_sales_week_4) + Number(this.form.payment_from_spg_week_4))
      this.company_profit_week_5 = (5 / 100) * (Number(this.form.payment_from_marketing_week_5) + Number(this.form.payment_from_sales_week_5) + Number(this.form.payment_from_spg_week_5))

      this.settlement_difference_minus_amount_week_1 = Number(this.form.payment_from_marketing_week_1) + Number(this.form.payment_from_sales_week_1) + Number(this.form.payment_from_spg_week_1) - Number(this.total_amount_received_week_1)
      this.settlement_difference_minus_amount_week_2 = Number(this.form.payment_from_marketing_week_2) + Number(this.form.payment_from_sales_week_2) + Number(this.form.payment_from_spg_week_2) - Number(this.total_amount_received_week_2)
      this.settlement_difference_minus_amount_week_3 = Number(this.form.payment_from_marketing_week_3) + Number(this.form.payment_from_sales_week_3) + Number(this.form.payment_from_spg_week_3) - Number(this.total_amount_received_week_3)
      this.settlement_difference_minus_amount_week_4 = Number(this.form.payment_from_marketing_week_4) + Number(this.form.payment_from_sales_week_4) + Number(this.form.payment_from_spg_week_4) - Number(this.total_amount_received_week_4)
      this.settlement_difference_minus_amount_week_5 = Number(this.form.payment_from_marketing_week_5) + Number(this.form.payment_from_sales_week_5) + Number(this.form.payment_from_spg_week_5) - Number(this.total_amount_received_week_5)

      this.company_profit_difference_minus_amount_week_1 = Number(this.company_profit_week_1) - Number(this.total_amount_received_week_1)
      this.company_profit_difference_minus_amount_week_2 = Number(this.company_profit_week_2) - Number(this.total_amount_received_week_2)
      this.company_profit_difference_minus_amount_week_3 = Number(this.company_profit_week_3) - Number(this.total_amount_received_week_3)
      this.company_profit_difference_minus_amount_week_4 = Number(this.company_profit_week_4) - Number(this.total_amount_received_week_4)
      this.company_profit_difference_minus_amount_week_5 = Number(this.company_profit_week_5) - Number(this.total_amount_received_week_5)
    }
  }
}
</script>
