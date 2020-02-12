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
      <span class="breadcrumb-item active">Assessment</span>
    </breadcrumb>

    <employee-widget :id="id"></employee-widget>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block
        :title="$t('employee assessment')"
        :header="true"
        :is-loading="loading">
        <p-form-row
          id="name"
          :label="$t('name')">
          <div slot="body" class="col-lg-9 col-form-label">
            {{ employee.name }}
          </div>
        </p-form-row>
        <p-form-row
          id="assessment-date"
          :label="$t('assessment date')">
          <div slot="body" class="col-lg-9 col-form-label">
            <template v-if="type=='monthly'">
              {{ decodeURI(value) | dateFormat('MMM YYYY') }}
            </template>
            <template v-else>
              {{ decodeURI(value) | dateFormat('YYYY') }}
            </template>
          </div>
        </p-form-row>
          <p-form-row
              id="assessment-category"
              :label="$t('assessment category')">
              <div slot="body" class="col-lg-9 col-form-label">
                <p-select
                  id="template_select"
                  name="template_select"
                  v-model="templateIndex"
                  :disabled="loading"
                  :options="templateList"/>
              </div>
          </p-form-row>
          <p-table v-if="templateSelected">
            <tr slot="p-head">
              <th rowspan="2" class="font-size-h6 font-w700">{{ $t('no') | uppercase }}</th>
              <th rowspan="2" class="font-size-h6 font-w700">{{ $t('key performance indicator') | uppercase }}</th>
              <th rowspan="2" class="font-size-h6 font-w700 text-center">{{ $t('weight') | uppercase }}</th>
              <th rowspan="2" class="font-size-h6 font-w700 text-center">{{ $t('target') | uppercase }}</th>
              <template v-for="(sc, index) in templateSelected.scorer">
                <th :key="'z'+index" colspan="2" class="font-size-h6 font-w700 text-center">{{ sc.name }}</th>
              </template>
            </tr>
            <tr slot="p-head">
              <template v-for="(sc2, index) in templateSelected.scorer">
                <th :key="'a'+index" class="font-size-h6 font-w700 text-center">{{ $t('score') | uppercase }}</th>
                <th :key="'k'+(index*10)" class="font-size-h6 font-w700 text-center">{{ $t('score percentage') | uppercase }}</th>
              </template>
            </tr>
            <template v-for="(group, i) in templateSelected.group" slot="p-body">
                  <tr :key="'b'+i" class="bg-info-light">
                      <td v-for="(indic, ii) in formatIndicator(templateSelected['data'][group]['data'], true)"
                         :class="indic.style" :key="i+'c'+ii" :colspan="indic.colSpan">
                        {{ indic.text }}
                      </td>
                  </tr>
                  <tr v-for="(indicator, no) in templateSelected['data'][group]['indicators']" :key="i+'d'+no">
                    <td>{{ no + 1}} </td>
                    <td v-for="(indic, j) in formatIndicator(templateSelected['data'][group]['indicator'][indicator], false)"
                        :class="indic.style" :key="i+'e'+j">
                      {{ indic.text }}
                    </td>
                  </tr>
            </template>
          </p-table>
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
      value: this.$route.params.value,
      type: this.$route.params.type,
      title: 'Kpi',
      loading: false,
      templateList: [],
      templateIndex: 0,
      templateSelected: null
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployee', ['employee']),
    ...mapGetters('humanResourceEmployeeAssessment', ['assessmentsBy'])
  },
  watch: {
    templateIndex: function (val) {
      this.loading = true
      setTimeout(() => {
        this.templateSelected = this.assessmentsBy[val]
        this.loading = false
      }, 100)
    }
  },
  methods: {
    ...mapActions('humanResourceEmployeeAssessment', {
      findEmployeeAssessment: 'findBy'
    }),
    formatIndicator (indicators, isGroup) {
      let fomatedIndicator = []
      indicators.forEach((el, j) => {
        let text = el
        let style = 'text-center'
        let colSpan = 0
        if (j == 0) {
          if (isGroup) {
            colSpan = 2
          } else {
            style = ''
          }
        } else if (j > 3 && (j % 2) == 0) {
          text = this.$options.filters.numberFormat(el) + '%'
        } else {
          text = this.$options.filters.numberFormat(el)
        }
        if (isGroup) {
          style = 'font-size-h6 font-w700 ' + style
        }
        fomatedIndicator.push({ text: text, style: style, colSpan: colSpan })
      })
      return fomatedIndicator
    }
  },
  created () {
    this.loading = true
    this.findEmployeeAssessment({
      employeeId: this.id,
      value: this.value,
      type: this.type
    }).then(
      (response) => {
        this.loading = false
        this.templateList = []
        this.assessmentsBy.forEach((tpl, index) => {
          this.templateList.push({ id: index, label: tpl.template })
        })
        if (this.templateList.length > 0) {
          this.templateIndex = 0
        }
      },
      (error) => {
        console.log(JSON.stringify(error))
        this.loading = false
      }
    )
  }
}
</script>
