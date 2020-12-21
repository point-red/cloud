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
      <span class="breadcrumb-item active">Assessment</span>
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
                  {{ salariesBy.job_location }}
                </div>
              </p-form-row>
              <p-form-row
                id="salary-date"
                :label="$t('period')"
              >
                <div
                  slot="body"
                  class="col-lg-9 col-form-label"
                >
                  {{ salariesBy.start_date | dateFormat('DD MMMM YYYY') }} - {{ salariesBy.end_date | dateFormat('DD MMMM YYYY') }}
                </div>
              </p-form-row>

              <p-form-row
                id="active-days-in-month"
                :label="$t('active days / month')"
              >
                <div
                  slot="body"
                  class="col-lg-9 col-form-label"
                >
                  {{ salariesBy.active_days_in_month | numberFormat }}
                </div>
              </p-form-row>
            </div>
          </div>

          <p-table>
            <tr slot="p-head">
              <th class="font-size-h6 font-w700" />
              <th class="font-size-h6 font-w700" />
              <th
                v-if="showColumnWeek1"
                class="font-size-h6 font-w700"
              >
                {{ 'W1' }}
              </th>
              <th
                v-if="showColumnWeek2"
                class="font-size-h6 font-w700"
              >
                {{ 'W2' }}
              </th>
              <th
                v-if="showColumnWeek3"
                class="font-size-h6 font-w700"
              >
                {{ 'W3' }}
              </th>
              <th
                v-if="showColumnWeek4"
                class="font-size-h6 font-w700"
              >
                {{ 'W4' }}
              </th>
              <th
                v-if="showColumnWeek5"
                class="font-size-h6 font-w700"
              >
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
              <td v-if="showColumnWeek1">
                {{ salariesBy.active_days_week1 | numberFormat }}
              </td>
              <td v-if="showColumnWeek2">
                {{ salariesBy.active_days_week2 | numberFormat }}
              </td>
              <td v-if="showColumnWeek3">
                {{ salariesBy.active_days_week3 | numberFormat }}
              </td>
              <td v-if="showColumnWeek4">
                {{ salariesBy.active_days_week4 | numberFormat }}
              </td>
              <td v-if="showColumnWeek5">
                {{ salariesBy.active_days_week5 | numberFormat }}
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
              <td
                v-if="showColumnWeek1"
                class="font-size-h6 font-w700"
              >
                <br><br>
              </td>
              <td
                v-if="showColumnWeek2"
                class="font-size-h6 font-w700"
              >
                <br><br>
              </td>
              <td
                v-if="showColumnWeek3"
                class="font-size-h6 font-w700"
              >
                <br><br>
              </td>
              <td
                v-if="showColumnWeek4"
                class="font-size-h6 font-w700"
              >
                <br><br>
              </td>
              <td
                v-if="showColumnWeek5"
                class="font-size-h6 font-w700"
              >
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
              <td
                v-if="showColumnWeek1"
                class="font-size-h6 font-w700"
              />
              <td
                v-if="showColumnWeek2"
                class="font-size-h6 font-w700"
              />
              <td
                v-if="showColumnWeek3"
                class="font-size-h6 font-w700"
              />
              <td
                v-if="showColumnWeek4"
                class="font-size-h6 font-w700"
              />
              <td
                v-if="showColumnWeek5"
                class="font-size-h6 font-w700"
              />
              <td class="font-size-h6 font-w700" />
            </tr>

            <tr
              v-for="(indicator, indicatorIndex) in salaryData.assessments"
              slot="p-body"
              :key="'indicator' + indicator.id"
            >
              <td>{{ indicatorIndex + 1 }}</td>
              <td>{{ indicator.name }}</td>
              <td v-if="showColumnWeek1">
                {{ additionalData.score_percentages_assessments[indicatorIndex].week1 | numberFormat }}%
              </td>
              <td v-if="showColumnWeek2">
                {{ additionalData.score_percentages_assessments[indicatorIndex].week2 | numberFormat }}%
              </td>
              <td v-if="showColumnWeek3">
                {{ additionalData.score_percentages_assessments[indicatorIndex].week3 | numberFormat }}%
              </td>
              <td v-if="showColumnWeek4">
                {{ additionalData.score_percentages_assessments[indicatorIndex].week4 | numberFormat }}%
              </td>
              <td v-if="showColumnWeek5">
                {{ additionalData.score_percentages_assessments[indicatorIndex].week5 | numberFormat }}%
              </td>
              <td>{{ indicator.weight | numberFormat }}%</td>
            </tr>

            <tr slot="p-body">
              <td class="text-center font-w700">
                <span class="" />
              </td>
              <td class="font-size-h6 font-w700">
                {{ $t('minimum component score') | uppercase }}
              </td>
              <td
                v-if="showColumnWeek1"
                class="font-w700"
              >
                <span class="">{{ additionalData.total_assessments.week1 | numberFormat }}%</span>
              </td>
              <td
                v-if="showColumnWeek2"
                class="font-w700"
              >
                <span class="">{{ additionalData.total_assessments.week2 | numberFormat }}%</span>
              </td>
              <td
                v-if="showColumnWeek3"
                class="font-w700"
              >
                <span class="">{{ additionalData.total_assessments.week3 | numberFormat }}%</span>
              </td>
              <td
                v-if="showColumnWeek4"
                class="font-w700"
              >
                <span class="">{{ additionalData.total_assessments.week4 | numberFormat }}%</span>
              </td>
              <td
                v-if="showColumnWeek5"
                class="font-w700"
              >
                <span class="">{{ additionalData.total_assessments.week5 | numberFormat }}%</span>
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
              <td
                v-if="showColumnWeek1"
                class="font-size-h6 font-w700"
              >
                <br><br>
              </td>
              <td
                v-if="showColumnWeek2"
                class="font-size-h6 font-w700"
              >
                <br><br>
              </td>
              <td
                v-if="showColumnWeek3"
                class="font-size-h6 font-w700"
              >
                <br><br>
              </td>
              <td
                v-if="showColumnWeek4"
                class="font-size-h6 font-w700"
              >
                <br><br>
              </td>
              <td
                v-if="showColumnWeek5"
                class="font-size-h6 font-w700"
              >
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
              <td
                v-if="showColumnWeek1"
                class="font-size-h6 font-w700"
              />
              <td
                v-if="showColumnWeek2"
                class="font-size-h6 font-w700"
              />
              <td
                v-if="showColumnWeek3"
                class="font-size-h6 font-w700"
              />
              <td
                v-if="showColumnWeek4"
                class="font-size-h6 font-w700"
              />
              <td
                v-if="showColumnWeek5"
                class="font-size-h6 font-w700"
              />
              <td class="font-size-h6 font-w700" />
            </tr>

            <tr
              v-for="(achievement, achievementIndex) in salaryData.achievements"
              slot="p-body"
              :key="'achievement' + achievement.id"
            >
              <td>{{ achievementIndex + 1 }}</td>
              <td v-if="achievementIndex == 0">
                {{ $t('balance Sku area') | titlecase }}
              </td>
              <td v-if="achievementIndex == 1">
                {{ $t('%C national achievement') | titlecase }}
              </td>
              <td v-if="achievementIndex == 2">
                {{ $t('%EC national achievement') | titlecase }}
              </td>
              <td v-if="achievementIndex == 3">
                {{ $t('%value national achievement') | titlecase }}
              </td>
              <td v-if="achievementIndex == 4">
                {{ $t('%C area achievement') | titlecase }}
              </td>
              <td v-if="achievementIndex == 5">
                {{ $t('%EC area achievement') | titlecase }}
              </td>
              <td v-if="achievementIndex == 6">
                {{ $t('%value area achievement') | titlecase }}
              </td>
              <td v-if="showColumnWeek1">
                {{ achievement.week1 | numberFormat }}%
              </td>
              <td v-if="showColumnWeek2">
                {{ achievement.week2 | numberFormat }}%
              </td>
              <td v-if="showColumnWeek3">
                {{ achievement.week3 | numberFormat }}%
              </td>
              <td v-if="showColumnWeek4">
                {{ achievement.week4 | numberFormat }}%
              </td>
              <td v-if="showColumnWeek5">
                {{ achievement.week5 | numberFormat }}%
              </td>
              <td>{{ achievement.weight | numberFormat }}%</td>
            </tr>

            <tr slot="p-body">
              <td class="text-center font-w700">
                <span class="" />
              </td>
              <td class="font-size-h6 font-w700">
                {{ $t('additional component score') | uppercase }}
              </td>
              <td
                v-if="showColumnWeek1"
                class="font-w700"
              >
                <span class="">{{ additionalData.total_achievements.week1 | numberFormat }}%</span>
              </td>
              <td
                v-if="showColumnWeek2"
                class="font-w700"
              >
                <span class="">{{ additionalData.total_achievements.week2 | numberFormat }}%</span>
              </td>
              <td
                v-if="showColumnWeek3"
                class="font-w700"
              >
                <span class="">{{ additionalData.total_achievements.week3 | numberFormat }}%</span>
              </td>
              <td
                v-if="showColumnWeek4"
                class="font-w700"
              >
                <span class="">{{ additionalData.total_achievements.week4 | numberFormat }}%</span>
              </td>
              <td
                v-if="showColumnWeek5"
                class="font-w700"
              >
                <span class="">{{ additionalData.total_achievements.week5 | numberFormat }}%</span>
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
              <td
                v-if="showColumnWeek1"
                class="font-w700"
              >
                <span class="">{{ salary_final_score.week1 | numberFormat }}%</span>
              </td>
              <td
                v-if="showColumnWeek2"
                class="font-w700"
              >
                <span class="">{{ salary_final_score.week2 | numberFormat }}%</span>
              </td>
              <td
                v-if="showColumnWeek3"
                class="font-w700"
              >
                <span class="">{{ salary_final_score.week3 | numberFormat }}%</span>
              </td>
              <td
                v-if="showColumnWeek4"
                class="font-w700"
              >
                <span class="">{{ salary_final_score.week4 | numberFormat }}%</span>
              </td>
              <td
                v-if="showColumnWeek5"
                class="font-w700"
              >
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
              <td
                v-if="showColumnWeek1"
                class="font-size-h6 font-w700"
              >
                <br><br>
              </td>
              <td
                v-if="showColumnWeek2"
                class="font-size-h6 font-w700"
              >
                <br><br>
              </td>
              <td
                v-if="showColumnWeek3"
                class="font-size-h6 font-w700"
              >
                <br><br>
              </td>
              <td
                v-if="showColumnWeek4"
                class="font-size-h6 font-w700"
              >
                <br><br>
              </td>
              <td
                v-if="showColumnWeek5"
                class="font-size-h6 font-w700"
              >
                <br><br>
              </td>
              <td class="font-size-h6 font-w700">
                <br><br>
              </td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('area value') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">Rp {{ salariesBy.base_salary | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="">Rp {{ salariesBy.base_salary | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek3">
                <span class="">Rp {{ salariesBy.base_salary | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek4">
                <span class="">Rp {{ salariesBy.base_salary | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek5">
                <span class="">Rp {{ salariesBy.base_salary | numberFormat }}</span>
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('area value per week') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ base_salary_week_1 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="">{{ base_salary_week_2 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek3">
                <span class="">{{ base_salary_week_3 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek4">
                <span class="">{{ base_salary_week_4 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek5">
                <span class="">{{ base_salary_week_5 | numberFormat }}</span>
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('daily transport') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ salariesBy.daily_transport_allowance | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="">{{ salariesBy.daily_transport_allowance | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek3">
                <span class="">{{ salariesBy.daily_transport_allowance | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek4">
                <span class="">{{ salariesBy.daily_transport_allowance | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek5">
                <span class="">{{ salariesBy.daily_transport_allowance | numberFormat }}</span>
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('real transport received') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ real_transport_allowance_week_1 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="">{{ real_transport_allowance_week_2 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek3">
                <span class="">{{ real_transport_allowance_week_3 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek4">
                <span class="">{{ real_transport_allowance_week_4 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek5">
                <span class="">{{ real_transport_allowance_week_5 | numberFormat }}</span>
              </td>
              <td class="font-w700">
                <span class="">{{ real_transport_allowance_total | numberFormat }}</span>
              </td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('minimum component') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ minimum_component_amount_week_1 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="">{{ minimum_component_amount_week_2 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek3">
                <span class="">{{ minimum_component_amount_week_3 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek4">
                <span class="">{{ minimum_component_amount_week_4 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek5">
                <span class="">{{ minimum_component_amount_week_5 | numberFormat }}</span>
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('multiplier kpi') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ salariesBy.multiplier_kpi | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="">{{ salariesBy.multiplier_kpi | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek3">
                <span class="">{{ salariesBy.multiplier_kpi | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek4">
                <span class="">{{ salariesBy.multiplier_kpi | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek5">
                <span class="">{{ salariesBy.multiplier_kpi | numberFormat }}</span>
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('multiplier kpi (weekly result)') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ multiplier_kpi_week_1 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="">{{ multiplier_kpi_week_2 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek3">
                <span class="">{{ multiplier_kpi_week_3 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek4">
                <span class="">{{ multiplier_kpi_week_4 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek5">
                <span class="">{{ multiplier_kpi_week_5 | numberFormat }}</span>
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('additional point') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ additional_component_point_week_1 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="">{{ additional_component_point_week_2 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek3">
                <span class="">{{ additional_component_point_week_3 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek4">
                <span class="">{{ additional_component_point_week_4 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek5">
                <span class="">{{ additional_component_point_week_5 | numberFormat }}</span>
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('additional component') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ additional_component_amount_week_1 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="">{{ additional_component_amount_week_2 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek3">
                <span class="">{{ additional_component_amount_week_3 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek4">
                <span class="">{{ additional_component_amount_week_4 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek5">
                <span class="">{{ additional_component_amount_week_5 | numberFormat }}</span>
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('total amount') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ total_component_amount_week_1 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="">{{ total_component_amount_week_2 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek3">
                <span class="">{{ total_component_amount_week_3 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek4">
                <span class="">{{ total_component_amount_week_4 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek5">
                <span class="">{{ total_component_amount_week_5 | numberFormat }}</span>
              </td>
              <td><span class="font-w700">Rp {{ total_component_amount | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td class="font-size-h6 font-w700">
                {{ $t('total amount with allowance') | titlecase }}
              </td>
              <td
                v-if="showColumnWeek1"
                class="font-w700"
              >
                <span class="">{{ total_amount_received_week_1 | numberFormat }}</span>
              </td>
              <td
                v-if="showColumnWeek2"
                class="font-w700"
              >
                <span class="">{{ total_amount_received_week_2 | numberFormat }}</span>
              </td>
              <td
                v-if="showColumnWeek3"
                class="font-w700"
              >
                <span class="">{{ total_amount_received_week_3 | numberFormat }}</span>
              </td>
              <td
                v-if="showColumnWeek4"
                class="font-w700"
              >
                <span class="">{{ total_amount_received_week_4 | numberFormat }}</span>
              </td>
              <td
                v-if="showColumnWeek5"
                class="font-w700"
              >
                <span class="">{{ total_amount_received_week_5 | numberFormat }}</span>
              </td>
              <td class="font-w700">
                <span class="">Rp {{ total_amount_received | numberFormat }}</span>
              </td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('receivable cut > 60 days') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                {{ salariesBy.receivable_cut_60_days_week1 | numberFormat }}
              </td>
              <td v-if="showColumnWeek2">
                {{ salariesBy.receivable_cut_60_days_week2 | numberFormat }}
              </td>
              <td v-if="showColumnWeek3">
                {{ salariesBy.receivable_cut_60_days_week3 | numberFormat }}
              </td>
              <td v-if="showColumnWeek4">
                {{ salariesBy.receivable_cut_60_days_week4 | numberFormat }}
              </td>
              <td v-if="showColumnWeek5">
                {{ salariesBy.receivable_cut_60_days_week5 | numberFormat }}
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td class="font-size-h6 font-w700">
                {{ $t('total amount received') | titlecase }}
              </td>
              <td
                v-if="showColumnWeek1"
                class="font-size-h6 font-w700"
              />
              <td
                v-if="showColumnWeek2"
                class="font-size-h6 font-w700"
              />
              <td
                v-if="showColumnWeek3"
                class="font-size-h6 font-w700"
              />
              <td
                v-if="showColumnWeek4"
                class="font-size-h6 font-w700"
              />
              <td
                v-if="showColumnWeek5"
                class="font-size-h6 font-w700"
              />
              <td class="font-w700">
                <span class="">Rp {{ total_amount_received | numberFormat }}</span>
              </td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('company profit') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ company_profit_week_1 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="">{{ company_profit_week_2 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek3">
                <span class="">{{ company_profit_week_3 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek4">
                <span class="">{{ company_profit_week_4 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek5">
                <span class="">{{ company_profit_week_5 | numberFormat }}</span>
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('overdue receivable') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                {{ salariesBy.overdue_receivable_week1 | numberFormat }}
              </td>
              <td v-if="showColumnWeek2">
                {{ salariesBy.overdue_receivable_week2 | numberFormat }}
              </td>
              <td v-if="showColumnWeek3">
                {{ salariesBy.overdue_receivable_week3 | numberFormat }}
              </td>
              <td v-if="showColumnWeek4">
                {{ salariesBy.overdue_receivable_week4 | numberFormat }}
              </td>
              <td v-if="showColumnWeek5">
                {{ salariesBy.overdue_receivable_week5 | numberFormat }}
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('payment from marketing') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                {{ salariesBy.payment_from_marketing_week1 | numberFormat }}
              </td>
              <td v-if="showColumnWeek2">
                {{ salariesBy.payment_from_marketing_week2 | numberFormat }}
              </td>
              <td v-if="showColumnWeek3">
                {{ salariesBy.payment_from_marketing_week3 | numberFormat }}
              </td>
              <td v-if="showColumnWeek4">
                {{ salariesBy.payment_from_marketing_week4 | numberFormat }}
              </td>
              <td v-if="showColumnWeek5">
                {{ salariesBy.payment_from_marketing_week5 | numberFormat }}
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('payment from sales') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                {{ salariesBy.payment_from_sales_week1 | numberFormat }}
              </td>
              <td v-if="showColumnWeek2">
                {{ salariesBy.payment_from_sales_week2 | numberFormat }}
              </td>
              <td v-if="showColumnWeek3">
                {{ salariesBy.payment_from_sales_week3 | numberFormat }}
              </td>
              <td v-if="showColumnWeek4">
                {{ salariesBy.payment_from_sales_week4 | numberFormat }}
              </td>
              <td v-if="showColumnWeek5">
                {{ salariesBy.payment_from_sales_week5 | numberFormat }}
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('payment from spg') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                {{ salariesBy.payment_from_spg_week1 | numberFormat }}
              </td>
              <td v-if="showColumnWeek2">
                {{ salariesBy.payment_from_spg_week2 | numberFormat }}
              </td>
              <td v-if="showColumnWeek3">
                {{ salariesBy.payment_from_spg_week3 | numberFormat }}
              </td>
              <td v-if="showColumnWeek4">
                {{ salariesBy.payment_from_spg_week4 | numberFormat }}
              </td>
              <td v-if="showColumnWeek5">
                {{ salariesBy.payment_from_spg_week5 | numberFormat }}
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('received cash payment') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ salariesBy.cash_payment_week1 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="">{{ salariesBy.cash_payment_week2 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek3">
                <span class="">{{ salariesBy.cash_payment_week3 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek4">
                <span class="">{{ salariesBy.cash_payment_week4 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek5">
                <span class="">{{ salariesBy.cash_payment_week5 | numberFormat }}</span>
              </td>
              <td><span class="font-w700">{{ total_payment | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('settlement difference minus amount') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ settlement_difference_minus_amount_week_1 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="">{{ settlement_difference_minus_amount_week_2 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek3">
                <span class="">{{ settlement_difference_minus_amount_week_3 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek4">
                <span class="">{{ settlement_difference_minus_amount_week_4 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek5">
                <span class="">{{ settlement_difference_minus_amount_week_5 | numberFormat }}</span>
              </td>
              <td><span class="font-w700">{{ total_settlement_difference_minus_amount | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('company profit difference minus amount') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ company_profit_difference_minus_amount_week_1 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="">{{ company_profit_difference_minus_amount_week_2 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek3">
                <span class="">{{ company_profit_difference_minus_amount_week_3 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek4">
                <span class="">{{ company_profit_difference_minus_amount_week_4 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek5">
                <span class="">{{ company_profit_difference_minus_amount_week_5 | numberFormat }}</span>
              </td>
              <td><span class="font-w700">{{ total_company_profit_difference_minus_amount | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('communication allowance') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ salariesBy.communication_allowance | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="" />
              </td>
              <td v-if="showColumnWeek3">
                <span class="" />
              </td>
              <td v-if="showColumnWeek4">
                <span class="" />
              </td>
              <td v-if="showColumnWeek5">
                <span class="" />
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('functional allowance') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ salariesBy.functional_allowance | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="" />
              </td>
              <td v-if="showColumnWeek3">
                <span class="" />
              </td>
              <td v-if="showColumnWeek4">
                <span class="" />
              </td>
              <td v-if="showColumnWeek5">
                <span class="" />
              </td>
              <td><span class="" /></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('weekly sales') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ salariesBy.weekly_sales_week1 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="">{{ salariesBy.weekly_sales_week2 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek3">
                <span class="">{{ salariesBy.weekly_sales_week3 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek4">
                <span class="">{{ salariesBy.weekly_sales_week4 | numberFormat }}</span>
              </td>
              <td v-if="showColumnWeek5">
                <span class="">{{ salariesBy.weekly_sales_week5 | numberFormat }}</span>
              </td>
              <td><span class="font-w700">{{ total_weekly_sales | numberFormat }}</span></td>
            </tr>

            <tr slot="p-body">
              <td />
              <td>{{ $t('wa daily report') | titlecase }}</td>
              <td v-if="showColumnWeek1">
                <span class="">{{ salariesBy.wa_daily_report_week1 | numberFormat }}%</span>
              </td>
              <td v-if="showColumnWeek2">
                <span class="">{{ salariesBy.wa_daily_report_week2 | numberFormat }}%</span>
              </td>
              <td v-if="showColumnWeek3">
                <span class="">{{ salariesBy.wa_daily_report_week3 | numberFormat }}%</span>
              </td>
              <td v-if="showColumnWeek4">
                <span class="">{{ salariesBy.wa_daily_report_week4 | numberFormat }}%</span>
              </td>
              <td v-if="showColumnWeek5">
                <span class="">{{ salariesBy.wa_daily_report_week5 | numberFormat }}%</span>
              </td>
              <td><span class="" /></td>
            </tr>
          </p-table>
        </p-block-inner>
      </p-block>
    </form>
  </div>
</template>

<script>
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
  data () {
    return {
      id: this.$route.params.id,
      value: this.$route.params.value,
      type: this.$route.params.type,
      title: 'Employee Salary',
      isLoading: false,
      showColumnWeek1: false,
      showColumnWeek2: false,
      showColumnWeek3: false,
      showColumnWeek4: false,
      showColumnWeek5: false,
      salaryData: {
        assessments: {},
        achievements: {}
      },
      additionalData: {
        score_percentages_assessments: {},
        total_assessments: {},
        total_achievements: {}
      },
      active_days_percentage_week_1: 0,
      active_days_percentage_week_2: 0,
      active_days_percentage_week_3: 0,
      active_days_percentage_week_4: 0,
      active_days_percentage_week_5: 0,
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
      amount_received_difference: 0,
      communication_allowance_week_1: 0,
      communication_allowance_week_2: 0,
      communication_allowance_week_3: 0,
      communication_allowance_week_4: 0,
      communication_allowance_week_5: 0,
      functional_allowance_week_1: 0,
      functional_allowance_week_2: 0,
      functional_allowance_week_3: 0,
      functional_allowance_week_4: 0,
      functional_allowance_week_5: 0
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployee', ['employee']),
    ...mapGetters('humanResourceEmployeeSalary', ['salariesBy', 'additionalBy'])
  },
  created () {
    this.isLoading = true
    this.findEmployeeSalary({
      employeeId: this.id,
      value: this.value,
      type: this.type
    }).then(
      (response) => {
        if (this.type === 'monthly') {
          this.showColumnWeek1 = true
          this.showColumnWeek2 = true
          this.showColumnWeek3 = true
          this.showColumnWeek4 = true
          this.showColumnWeek5 = true
        } else if (this.type === 'weekly') {
          const weekOfMonth = this.getWeekOfMonth(this.salariesBy.end_date)
          if (weekOfMonth === 1) {
            this.showColumnWeek1 = true
          }
          if (weekOfMonth === 2) {
            this.showColumnWeek2 = true
          }
          if (weekOfMonth === 3) {
            this.showColumnWeek3 = true
          }
          if (weekOfMonth === 4) {
            this.showColumnWeek4 = true
          }
          if (weekOfMonth === 5) {
            this.showColumnWeek5 = true
          }
        }
        this.$set(this, 'salaryData', this.salariesBy)
        this.$set(this, 'additionalData', this.additionalBy)
        this.communication_allowance_week_1 = this.salariesBy.communication_allowance
        this.communication_allowance_week_2 = 0
        this.communication_allowance_week_3 = 0
        this.communication_allowance_week_4 = 0
        this.communication_allowance_week_5 = 0
        this.functional_allowance_week_1 = this.salariesBy.functional_allowance
        this.functional_allowance_week_2 = 0
        this.functional_allowance_week_3 = 0
        this.functional_allowance_week_4 = 0
        this.functional_allowance_week_5 = 0
        this.isLoading = false
        this.calculate()
      },
      (error) => {
        console.log(JSON.stringify(error))
        this.isLoading = false
      }
    )
  },
  methods: {
    ...mapActions('humanResourceEmployeeSalary', {
      findEmployeeSalary: 'findBy'
    }),
    getWeekOfMonth (date) {
      const dateObject = new Date(date)
      const adjustedDate = dateObject.getDate() + dateObject.getDay()
      const prefixes = ['0', '1', '2', '3', '4', '5']
      return (parseInt(prefixes[0 | adjustedDate / 7]) + 1)
    },
    calculate () {
      this.salary_final_score.week1 = ((this.additionalData.total_assessments.week1 || 0) + (this.additionalData.total_achievements.week1 || 0)) / 2
      this.salary_final_score.week2 = ((this.additionalData.total_assessments.week2 || 0) + (this.additionalData.total_achievements.week2 || 0)) / 2
      this.salary_final_score.week3 = ((this.additionalData.total_assessments.week3 || 0) + (this.additionalData.total_achievements.week3 || 0)) / 2
      this.salary_final_score.week4 = ((this.additionalData.total_assessments.week4 || 0) + (this.additionalData.total_achievements.week4 || 0)) / 2
      this.salary_final_score.week5 = ((this.additionalData.total_assessments.week5 || 0) + (this.additionalData.total_achievements.week5 || 0)) / 2

      this.salariesBy.active_days_in_month = this.salariesBy.active_days_in_month || 0

      if (Number(this.salariesBy.active_days_in_month) != 0) {
        const baseSalaryPerWeek = (this.salariesBy.active_days_in_month || 0) != 0 ? (this.salariesBy.base_salary || 0) / Number(this.salariesBy.active_days_in_month || 0) : 0
        const baseMultiplierKpiPerWeek = (this.salariesBy.active_days_in_month || 0) != 0 ? (this.salariesBy.multiplier_kpi || 0) / Number(this.salariesBy.active_days_in_month || 0) : 0

        if (this.additionalData.score_percentages_assessments.length != 0) {
          const percentageCallWeek1 = (Number(this.additionalData.score_percentages_assessments[0].week1 || 0)) / 100
          const percentageCallWeek2 = (Number(this.additionalData.score_percentages_assessments[0].week2 || 0)) / 100
          const percentageCallWeek3 = (Number(this.additionalData.score_percentages_assessments[0].week3 || 0)) / 100
          const percentageCallWeek4 = (Number(this.additionalData.score_percentages_assessments[0].week4 || 0)) / 100
          const percentageCallWeek5 = (Number(this.additionalData.score_percentages_assessments[0].week5 || 0)) / 100

          this.active_days_percentage_week_1 = percentageCallWeek1 * Number(this.salariesBy.active_days_week1 || 0)
          this.active_days_percentage_week_2 = percentageCallWeek2 * Number(this.salariesBy.active_days_week2 || 0)
          this.active_days_percentage_week_3 = percentageCallWeek3 * Number(this.salariesBy.active_days_week3 || 0)
          this.active_days_percentage_week_4 = percentageCallWeek4 * Number(this.salariesBy.active_days_week4 || 0)
          this.active_days_percentage_week_5 = percentageCallWeek5 * Number(this.salariesBy.active_days_week5 || 0)

          this.base_salary_week_1 = baseSalaryPerWeek * this.active_days_percentage_week_1
          this.base_salary_week_2 = baseSalaryPerWeek * this.active_days_percentage_week_2
          this.base_salary_week_3 = baseSalaryPerWeek * this.active_days_percentage_week_3
          this.base_salary_week_4 = baseSalaryPerWeek * this.active_days_percentage_week_4
          this.base_salary_week_5 = baseSalaryPerWeek * this.active_days_percentage_week_5

          this.real_transport_allowance_week_1 = this.salariesBy.daily_transport_allowance * this.active_days_percentage_week_1
          this.real_transport_allowance_week_2 = this.salariesBy.daily_transport_allowance * this.active_days_percentage_week_2
          this.real_transport_allowance_week_3 = this.salariesBy.daily_transport_allowance * this.active_days_percentage_week_3
          this.real_transport_allowance_week_4 = this.salariesBy.daily_transport_allowance * this.active_days_percentage_week_4
          this.real_transport_allowance_week_5 = this.salariesBy.daily_transport_allowance * this.active_days_percentage_week_5

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

      this.total_amount_received = Number(this.total_amount_received_week_1 || 0) + Number(this.total_amount_received_week_2 || 0) + Number(this.total_amount_received_week_3 || 0) + Number(this.total_amount_received_week_4 || 0) + Number(this.total_amount_received_week_5 || 0) + Number(this.communication_allowance_week_1 || 0) + Number(this.functional_allowance_week_1 || 0) + Number(this.communication_allowance_week_2 || 0) + Number(this.functional_allowance_week_2 || 0) + Number(this.communication_allowance_week_3 || 0) + Number(this.functional_allowance_week_3 || 0) + Number(this.communication_allowance_week_4 || 0) + Number(this.functional_allowance_week_4 || 0) + Number(this.communication_allowance_week_5 || 0) + Number(this.functional_allowance_week_5 || 0)

      this.receivable_week_1 = Number(this.salariesBy.payment_from_marketing_week1 || 0) + Number(this.salariesBy.payment_from_sales_week1 || 0) + Number(this.salariesBy.payment_from_spg_week1 || 0) + Number(this.salariesBy.cash_payment_week1 || 0)
      this.receivable_week_2 = Number(this.salariesBy.payment_from_marketing_week2 || 0) + Number(this.salariesBy.payment_from_sales_week2 || 0) + Number(this.salariesBy.payment_from_spg_week2 || 0) + Number(this.salariesBy.cash_payment_week2 || 0)
      this.receivable_week_3 = Number(this.salariesBy.payment_from_marketing_week3 || 0) + Number(this.salariesBy.payment_from_sales_week3 || 0) + Number(this.salariesBy.payment_from_spg_week3 || 0) + Number(this.salariesBy.cash_payment_week3 || 0)
      this.receivable_week_4 = Number(this.salariesBy.payment_from_marketing_week4 || 0) + Number(this.salariesBy.payment_from_sales_week4 || 0) + Number(this.salariesBy.payment_from_spg_week4 || 0) + Number(this.salariesBy.cash_payment_week4 || 0)
      this.receivable_week_5 = Number(this.salariesBy.payment_from_marketing_week5 || 0) + Number(this.salariesBy.payment_from_sales_week5 || 0) + Number(this.salariesBy.payment_from_spg_week5 || 0) + Number(this.salariesBy.cash_payment_week5 || 0)

      this.company_profit_week_1 = 0.05 * this.receivable_week_1
      this.company_profit_week_2 = 0.05 * this.receivable_week_2
      this.company_profit_week_3 = 0.05 * this.receivable_week_3
      this.company_profit_week_4 = 0.05 * this.receivable_week_4
      this.company_profit_week_5 = 0.05 * this.receivable_week_5

      this.settlement_difference_minus_amount_week_1 = this.receivable_week_1 - Number(this.total_amount_received_week_1 || 0) - Number(this.communication_allowance_week_1 || 0) - Number(this.functional_allowance_week_1 || 0)
      this.settlement_difference_minus_amount_week_2 = this.receivable_week_2 - Number(this.total_amount_received_week_2 || 0) - Number(this.communication_allowance_week_2 || 0) - Number(this.functional_allowance_week_2 || 0)
      this.settlement_difference_minus_amount_week_3 = this.receivable_week_3 - Number(this.total_amount_received_week_3 || 0) - Number(this.communication_allowance_week_3 || 0) - Number(this.functional_allowance_week_3 || 0)
      this.settlement_difference_minus_amount_week_4 = this.receivable_week_4 - Number(this.total_amount_received_week_4 || 0) - Number(this.communication_allowance_week_4 || 0) - Number(this.functional_allowance_week_4 || 0)
      this.settlement_difference_minus_amount_week_5 = this.receivable_week_5 - Number(this.total_amount_received_week_5 || 0) - Number(this.communication_allowance_week_5 || 0) - Number(this.functional_allowance_week_5 || 0)

      this.company_profit_difference_minus_amount_week_1 = Number(this.company_profit_week_1 || 0) - Number(this.total_amount_received_week_1 || 0) - Number(this.communication_allowance_week_1 || 0) - Number(this.functional_allowance_week_1 || 0)
      this.company_profit_difference_minus_amount_week_2 = Number(this.company_profit_week_2 || 0) - Number(this.total_amount_received_week_2 || 0) - Number(this.communication_allowance_week_2 || 0) - Number(this.functional_allowance_week_2 || 0)
      this.company_profit_difference_minus_amount_week_3 = Number(this.company_profit_week_3 || 0) - Number(this.total_amount_received_week_3 || 0) - Number(this.communication_allowance_week_3 || 0) - Number(this.functional_allowance_week_3 || 0)
      this.company_profit_difference_minus_amount_week_4 = Number(this.company_profit_week_4 || 0) - Number(this.total_amount_received_week_4 || 0) - Number(this.communication_allowance_week_4 || 0) - Number(this.functional_allowance_week_4 || 0)
      this.company_profit_difference_minus_amount_week_5 = Number(this.company_profit_week_5 || 0) - Number(this.total_amount_received_week_5 || 0) - Number(this.communication_allowance_week_5 || 0) - Number(this.functional_allowance_week_5 || 0)

      var dayAverageDivisor = 0
      var totalMinimumComponentScore = 0
      var totalAdditionalComponentScore = 0
      var totalFinalScore = 0

      if (this.salariesBy.active_days_week1 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.additionalData.total_assessments.week1
        totalAdditionalComponentScore += this.additionalData.total_achievements.week1
        totalFinalScore += this.salary_final_score.week1
      }
      if (this.salariesBy.active_days_week2 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.additionalData.total_assessments.week2
        totalAdditionalComponentScore += this.additionalData.total_achievements.week2
        totalFinalScore += this.salary_final_score.week2
      }
      if (this.salariesBy.active_days_week3 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.additionalData.total_assessments.week3
        totalAdditionalComponentScore += this.additionalData.total_achievements.week3
        totalFinalScore += this.salary_final_score.week3
      }
      if (this.salariesBy.active_days_week4 !== 0) {
        dayAverageDivisor++
        totalMinimumComponentScore += this.additionalData.total_assessments.week4
        totalAdditionalComponentScore += this.additionalData.total_achievements.week4
        totalFinalScore += this.salary_final_score.week4
      }
      if (this.salariesBy.active_days_week5 !== 0) {
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

      this.total_weekly_sales = this.salariesBy.weekly_sales_week1 + this.salariesBy.weekly_sales_week2 + this.salariesBy.weekly_sales_week3 + this.salariesBy.weekly_sales_week4 + this.salariesBy.weekly_sales_week5

      this.amount_received_difference = this.salariesBy.maximum_salary_amount - this.total_amount_received
    }
  }
}
</script>
