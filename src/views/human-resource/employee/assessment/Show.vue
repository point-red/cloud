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

    <tab-menu>
      <li class="nav-item" v-if="$permission.has('read employee assessment')" slot="right">
        <router-link
          :to="'/human-resource/employee/' + employee.id + '/assessment'"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-bar-chart"></i> {{ $t('kpi') | titlecase }}</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="$permission.has('create employee assessment')" slot="right">
        <router-link
          :to="'/human-resource/employee/' + employee.id + '/assessment/create'"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-note"></i> {{ $t('employee assessment') | titlecase }}</span>
        </router-link>
      </li>
    </tab-menu>

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
            {{ assessment.date | dateFormat('DD MMM YYYY') }}
          </div>
        </p-form-row>
        <p-form-row
          id="assessment-date"
          :label="$t('assessment category')">
          <div slot="body" class="col-lg-9 col-form-label">
            {{ assessment.name }}
          </div>
        </p-form-row>
        <p-table>
          <tr slot="p-head">
            <th class="font-size-h6 font-w700">{{ $t('no') | uppercase }}</th>
            <th class="font-size-h6 font-w700">{{ $t('key performance indicator') | uppercase }}</th>
            <th class="font-size-h6 font-w700 text-center">{{ $t('weight') | uppercase }}</th>
            <th class="font-size-h6 font-w700 text-center">{{ $t('target') | uppercase }}</th>
            <th class="font-size-h6 font-w700 text-center">{{ $t('score') | uppercase }}</th>
            <th class="font-size-h6 font-w700 text-center">{{ $t('score percentage') | uppercase }}</th>
            <th class="font-size-h6 font-w700 text-center">{{ $t('description') | uppercase }}</th>
            <th></th>
          </tr>
          <template
            v-for="group in assessment.groups"
            slot="p-body">
            <tr :key="'group' + group.id" class="bg-info-light">
              <td class="text-center font-w600" colspan="2">{{ group.name }}</td>
              <td class="text-center font-w600">{{ group.weight | numberFormat }}%</td>
              <td class="text-center font-w600">{{ group.target | numberFormat }}</td>
              <td class="text-center font-w600">{{ group.score | numberFormat }}</td>
              <td class="text-center font-w600">{{ group.score_percentage | numberFormat }}</td>
              <td class="text-center font-w600"></td>
              <td></td>
            </tr>
            <tr v-for="(indicator, index) in group.indicators" :key="'indicator' + indicator.id">
              <td>{{ index+1 }}</td>
              <td>{{ indicator.name }}</td>
              <td class="text-center">{{ indicator.weight }}%</td>
              <td class="text-center">{{ indicator.target }}</td>
              <td class="text-center">{{ indicator.score }}</td>
              <td class="text-center">{{ indicator.weight * indicator.score / indicator.target }}</td>
              <td class="text-center">{{ indicator.score_description }}</td>
              <td class="text-center"></td>
            </tr>
          </template>
          <tr slot="p-body">
            <td></td>
            <td></td>
            <td class="text-center font-w700"><span class="">{{ assessment.weight | numberFormat }}%</span></td>
            <td class="text-center font-w700"><span class="">{{ assessment.target | numberFormat }}</span></td>
            <td class="text-center font-w700"><span class="">{{ assessment.score | numberFormat }}</span></td>
            <td class="text-center font-w700"><span class="">{{ assessment.score_percentage | numberFormat }}</span></td>
            <td></td>
          </tr>
        </p-table>
      </p-block>
    </form>
  </div>
</template>

<script>
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
      kpiId: this.$route.params.kpiId,
      title: 'Kpi',
      loading: false
    }
  },
  computed: {
    ...mapGetters('Employee', ['employee']),
    ...mapGetters('EmployeeAssessment', ['assessment'])
  },
  methods: {
    ...mapActions('EmployeeAssessment', {
      findEmployeeAssessment: 'find'
    })
  },
  created () {
    this.loading = true
    this.findEmployeeAssessment({
      employeeId: this.id,
      kpiId: this.kpiId
    }).then(
      (response) => {
        this.loading = false
      },
      (error) => {
        console.log(JSON.stringify(error))
      }
    )
  }
}
</script>
