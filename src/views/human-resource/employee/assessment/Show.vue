<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <router-link
        to="/human-resource/employee"
        class="breadcrumb-item"
      >
        {{ $t('employee') | uppercase }}
      </router-link>
      <router-link
        :to="'/human-resource/employee/' + employee.id"
        class="breadcrumb-item"
      >
        {{ employee.name | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('assessment') | uppercase }}</span>
    </breadcrumb>

    <employee-widget :id="id" />

    <tab-menu />

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block
        :title="$t('employee assessment')"
        :header="true"
        :is-loading="isLoading"
      >
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
          id="assessment-date"
          :label="$t('assessment date')"
        >
          <div
            slot="body"
            class="col-lg-9 col-form-label"
          >
            {{ assessment.date | dateFormat('DD MMM YYYY') }}
          </div>
        </p-form-row>
        <p-form-row
          id="assessment-date"
          :label="$t('assessment category')"
        >
          <div
            slot="body"
            class="col-lg-9 col-form-label"
          >
            {{ assessment.name }}
          </div>
        </p-form-row>
        <p-table>
          <tr slot="p-head">
            <th class="font-size-h6 font-w700">
              {{ $t('no') | uppercase }}
            </th>
            <th class="font-size-h6 font-w700">
              {{ $t('key performance indicator') | uppercase }}
            </th>
            <th class="font-size-h6 font-w700 text-center">
              {{ $t('weight') | uppercase }}
            </th>
            <th class="font-size-h6 font-w700 text-center">
              {{ $t('target') | uppercase }}
            </th>
            <th class="font-size-h6 font-w700 text-center">
              {{ $t('score') | uppercase }}
            </th>
            <th class="font-size-h6 font-w700 text-center">
              {{ $t('score percentage') | uppercase }}
            </th>
            <th class="font-size-h6 font-w700 text-center">
              {{ $t('description') | uppercase }}
            </th>
            <th class="font-size-h6 font-w700 text-center">
              {{ $t('comment') | uppercase }}
            </th>
            <th class="font-size-h6 font-w700 text-center">
              {{ $t('upload file') | uppercase }}
            </th>
            <th />
          </tr>
          <template
            v-for="group in assessment.groups"
            slot="p-body"
          >
            <tr
              :key="'group' + group.id"
              class="bg-info-light"
            >
              <td
                class="text-center font-w600"
                colspan="2"
              >
                {{ group.name }}
              </td>
              <td class="text-center font-w600">
                {{ group.weight | numberFormat }}%
              </td>
              <td class="text-center font-w600">
                {{ group.target | numberFormat }}
              </td>
              <td class="text-center font-w600">
                {{ group.score | numberFormat }}
              </td>
              <td class="text-center font-w600">
                {{ group.score_percentage | numberFormat }}
              </td>
              <td class="text-center font-w600" />
              <td class="text-center font-w600" />
              <td class="text-center font-w600" />
              <td />
            </tr>
            <tr
              v-for="(indicator, index) in group.indicators"
              :key="'indicator' + indicator.id"
            >
              <td>{{ index+1 }}</td>
              <td>{{ indicator.name }}</td>
              <td class="text-center">
                {{ indicator.weight }}%
              </td>
              <td class="text-center">
                {{ indicator.target | numberFormat }}
              </td>
              <td class="text-center">
                {{ indicator.score | numberFormat }}
              </td>
              <td class="text-center">
                {{ indicator.score_percentage | numberFormat }}
              </td>
              <td class="text-center">
                {{ indicator.score_description }}
              </td>

              <!-- Comment -->
              <td class="text-center">
                <textarea
                  id="comment"
                  name="comment"
                  cols="30"
                  :rows="rows[index]"
                  readonly
                  :value="indicator.scores[0].comment"
                />
              </td>

              <!-- Upload File -->
              <td class="text-center">
                <span
                  v-for="(file, indexFile) in indicator.scores[index].uploadFiles.split(',')"
                  :key="indexFile"
                >
                  <button
                    :title="file"
                    class="m-1"
                  ><a :href="file">{{ indexFile + 1 }}</a></button>
                </span>
              </td>
              <td class="text-center" />
            </tr>
          </template>
          <tr slot="p-body">
            <td />
            <td />
            <td class="text-center font-w700">
              <span class="">{{ assessment.weight | numberFormat }}%</span>
            </td>
            <td class="text-center font-w700">
              <span class="">{{ assessment.target | numberFormat }}</span>
            </td>
            <td class="text-center font-w700">
              <span class="">{{ assessment.score | numberFormat }}</span>
            </td>
            <td class="text-center font-w700">
              <span class="">{{ assessment.score_percentage | numberFormat }}</span>
            </td>
            <td />
          </tr>
        </p-table>
        <p-form-row
          :is-horizontal="false"
          :label="$t('comment')"
        >
          <div
            slot="body"
            class="col-lg-9 col-form-label"
          >
            <pre>{{ assessment.comment }}</pre>
          </div>
        </p-form-row>
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
      kpiId: this.$route.params.kpiId,
      title: 'Kpi',
      isLoading: false,
      rows: []
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployee', ['employee']),
    ...mapGetters('humanResourceEmployeeAssessment', ['assessment'])
  },
  created () {
    this.isLoading = true
    this.findEmployeeAssessment({
      employeeId: this.id,
      kpiId: this.kpiId
    }).then(
      (response) => {
        this.isLoading = false
        this.assessment.groups.map((group) => {
          group.indicators.map((indicator) => {
            console.log('ini indicator: ' + indicator.scores[0].comment)
            if (indicator.scores[0].comment) {
              console.log('ada score')
              const rows = indicator.scores[0].comment.length / 30
              if (rows !== 0) {
                let enters = 0
                indicator.scores[0].comment.split('').map((arr) => {
                  if (arr === '\n') {
                    enters += 1
                  }
                })
                this.rows.push(Math.ceil(rows) + enters)
              } else {
                this.rows.push('1')
              }
            } else {
              console.log('kosong score')
              this.rows.push('1')
            }
          })
        })
      },
      (error) => {
        console.log(JSON.stringify(error))
        this.isLoading = false
      }
    )
  },
  methods: {
    ...mapActions('humanResourceEmployeeAssessment', {
      findEmployeeAssessment: 'find'
    })
  }
}
</script>
