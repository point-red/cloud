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
        :is-loading="isLoading">
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
            name="template-category"
            id="template-category"
            :label="$t('assessment category')">
            <div slot="body" class="col-lg-9 col-form-label" v-if="templateList.length > 0 && templateSelected">
              <a href="javascript:void(0)" @click="$refs.kpiAssessmentCategory.show()">{{ templateSelected.template }}</a>
            </div>
        </p-form-row>
        <div class="form-group row">
            <div class="col-md-12">
              <div class="btn-group-toggle" data-toggle="buttons">
                <label :class="{
                    'btn btn-sm mr-5 btn-primary active': isHighlight,
                    'btn btn-sm mr-5 btn-info': !isHighlight
                    }">
                  <input v-if="templateSelected"
                    :disabled="isLoading" type="checkbox"
                    :checked="{
                      'checked': isHighlight,
                      '': !isHighlight
                    }"
                    @click="toggleHiglight" data-toggle="button" :aria-pressed="!isHighlight" autocomplete="off"> Highlight
                </label>
              </div>
            </div>
          </div>
          <p-table v-if="templateSelected">
            <tr slot="p-head">
              <th rowspan="2" class="font-size-h6 font-w700">{{ $t('no') | uppercase }}</th>
              <th rowspan="2" class="font-size-h6 font-w700">{{ $t('key performance indicator') | uppercase }}</th>
              <th rowspan="2" class="font-size-h6 font-w700 text-center">{{ $t('weight') | uppercase }}</th>
              <th rowspan="2" class="font-size-h6 font-w700 text-center">{{ $t('target') | uppercase }}</th>
              <template v-if="$permission.has('create employee kpi')">
                <th v-for="(sc, index) in templateSelected.scorer" :key="'z'+index" colspan="2" class="font-size-h6 font-w700 text-center">{{ sc.name }}</th>
              </template>
              <template v-else>
                <th :colspan="templateSelected.scorer.length*2" class="font-size-h6 font-w700 text-center">{{ $t('you do not have permission to see the employee scorer') }}</th>
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
            <tr slot="p-body">
              <td></td>
              <td v-for="(val, no) in templateSelected['total']" :key="'f'+no" class="font-size-h6 font-w700 text-center">
                <b v-if="no>0">{{ (val%1 === 0 ? val : val.toFixed(2)) }}</b>
                <b v-else>{{ val }}</b>
              </td>
            </tr>
          </p-table>
      </p-block>
    </form>
  <kpi-assessment-category-modal ref="kpiAssessmentCategory" v-model="templateIndex" :templates="templateList"/>
  </div>
</template>

<script>
import TabMenu from '../TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import EmployeeWidget from '../EmployeeWidget'
import KpiAssessmentCategoryModal from './KpiAssessmentCategoryModal'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource,
    EmployeeWidget,
    KpiAssessmentCategoryModal
  },
  data () {
    return {
      id: this.$route.params.id,
      value: this.$route.params.value,
      type: this.$route.params.type,
      title: 'Kpi',
      isLoading: false,
      templateList: [],
      templateIndex: 0,
      templateSelected: null,
      isHighlight: false
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployee', ['employee']),
    ...mapGetters('humanResourceEmployeeAssessment', ['assessmentsBy'])
  },
  watch: {
    templateIndex: function (val) {
      this.isLoading = true
      setTimeout(() => {
        this.templateSelected = this.assessmentsBy[val]
        this.isLoading = false
      }, 100)
    }
  },
  methods: {
    ...mapActions('humanResourceEmployeeAssessment', {
      findEmployeeAssessment: 'findBy'
    }),
    isScoreColumn (col) {
      let FIRST_SCORER_INDEX = 3
      return (col >= FIRST_SCORER_INDEX && (col % 2) != 0)
    },
    formatIndicator (indicators, isGroup) {
      let fomatedIndicator = []
      let TOLERANCE = 2
      let showHighlight = false
      if (this.isHighlight) {
        let scoreList = []
        indicators.forEach((el, j) => {
          if (this.isScoreColumn(j)) {
            scoreList.push(el)
          }
        })
        scoreList.forEach((el, i) => {
          scoreList.forEach((el2, j) => {
            if (i != j) {
              if (Math.abs(el - el2) >= TOLERANCE) {
                showHighlight = true
                return 0
              }
            }
          })
        })
      }
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
        } else if (this.isScoreColumn(j)) {
          text = this.$options.filters.numberFormat(el)
          if (this.isHighlight && showHighlight) {
            style = style + ' highlight'
          }
        } else {
          text = this.$options.filters.numberFormat(el) + '%'
        }
        if (isGroup) {
          style = 'font-size-h6 font-w700 ' + style
        }
        fomatedIndicator.push({ text: text, style: style, colSpan: colSpan })
      })
      return fomatedIndicator
    },
    toggleHiglight () {
      this.isHighlight = !this.isHighlight
    }
  },
  created () {
    this.isLoading = true
    this.findEmployeeAssessment({
      employeeId: this.id,
      value: this.value,
      type: this.type
    }).then(
      (response) => {
        this.isLoading = false
        this.templateList = []
        this.assessmentsBy.forEach((tpl, index) => {
          this.templateList.push(tpl.template)
        })
        if (this.templateList.length > 0) {
          this.templateIndex = 0
          this.templateSelected = this.assessmentsBy[this.templateIndex]
        }
      },
      (error) => {
        console.log(JSON.stringify(error))
        this.isLoading = false
      }
    )
  }
}
</script>

<style scoped>
  .highlight {
    background: red;
  }
</style>
