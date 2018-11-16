<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <router-link
        to="/human-resource/employee"
        class="breadcrumb-item">{{ $t('employee') | titlecase }}</router-link>
      <span class="breadcrumb-item active">{{ employee.name | titlecase }}</span>
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
      <li class="nav-item" v-if="$permission.has('create employee assessment') && isScorer" slot="right">
        <router-link
          :to="'/human-resource/employee/' + employee.id + '/assessment/create'"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-note"></i> {{ $t('employee assessment') | titlecase }}</span>
        </router-link>
      </li>
    </tab-menu>

    <div class="row">
      <p-block :title="$t('personal info')" :header="true">
        <p-block-inner :is-loading="loading">
          <div class="row">
            <div class="col-sm-6">
              <p-table>
                <template slot="p-body">
                  <tr>
                    <td><span class="font-w700">{{ $t('name') | titlecase }}</span></td>
                    <td>{{ employee.name }}</td>
                  </tr>
                  <tr v-if="$permission.has('read employee')">
                    <td><span class="font-w700">{{ $t('address') | titlecase }}</span></td>
                    <td>
                      <ul>
                        <li
                          v-for="(employeeAddress, index) in employee.addresses"
                          :key="index">
                          {{ employeeAddress.address }}
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr v-if="$permission.has('read employee')">
                    <td><span class="font-w700">{{ $t('phone') | titlecase }}</span></td>
                    <td>
                      <ul>
                        <li
                          v-for="(employeePhone, index) in employee.phones"
                          :key="index">
                          {{ employeePhone.phone }}
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr v-if="$permission.has('read employee')">
                    <td><span class="font-w700">{{ $t('email') | titlecase }}</span></td>
                    <td>
                      <ul>
                        <li
                          v-for="(employeeEmail, index) in employee.emails"
                          :key="index">
                          {{ employeeEmail.email }}
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr v-if="$permission.has('read employee')">
                    <td><span class="font-w700">{{ $t('social media') | titlecase }}</span></td>
                    <td>
                      <ul>
                        <li
                          v-for="(employeeEmployeeAssessment, index) in employee.social_media"
                          :key="index">
                          {{ employeeEmployeeAssessment.type }}
                          {{ employeeEmployeeAssessment.account }}
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr v-if="$permission.has('read employee')">
                    <td><span class="font-w700">{{ $t('personal id') | titlecase }}</span></td>
                    <td>{{ employee.personal_identity }}</td>
                  </tr>
                  <tr v-if="$permission.has('read employee')">
                    <td><span class="font-w700">{{ $t('last education') | titlecase }}</span></td>
                    <td>{{ employee.last_education }}</td>
                  </tr>
                  <tr v-if="$permission.has('read employee')">
                    <td><span class="font-w700">{{ $t('birth date') | titlecase }}</span></td>
                    <td><span v-if="employee.birth_date">{{ employee.birth_date | dateFormat('DD MMM YYYY') }}</span></td>
                  </tr>
                  <tr v-if="$permission.has('read employee')">
                    <td><span class="font-w700">{{ $t('birth place') | titlecase }}</span></td>
                    <td>{{ employee.birth_place }}</td>
                  </tr>
                  <tr>
                    <td><span class="font-w700">{{ $t('gender') | titlecase }}</span></td>
                    <td><span v-if="employee.gender">{{ employee.gender.name }}</span></td>
                  </tr>
                  <tr v-if="$permission.has('read employee')">
                    <td><span class="font-w700">{{ $t('marital status') | titlecase }}</span></td>
                    <td><span v-if="employee.marital_status">{{ employee.marital_status.name }}</span></td>
                  </tr>
                  <tr v-if="$permission.has('read employee') && employee.marital_status && employee.marital_status.id == 2">
                    <td><span class="font-w700">{{ $t('married with') | titlecase }}</span></td>
                    <td>{{ employee.married_with }}</td>
                  </tr>
                  <tr v-if="$permission.has('read employee')">
                    <td><span class="font-w700">{{ $t('religion') | titlecase }}</span></td>
                    <td><span v-if="employee.religion">{{ employee.religion.name }}</span></td>
                  </tr>
                </template>
              </p-table>
            </div>
            <div class="col-sm-6">
              <p-table v-if="$permission.has('read employee')">
                <template slot="p-body">
                  <tr>
                    <td><span class="font-w700">{{ $t('employee group') | titlecase }}</span></td>
                    <td><span v-if="employee.group">{{ employee.group.name }}</span></td>
                  </tr>
                  <tr>
                    <td><span class="font-w700">{{ $t('join date') | titlecase }}</span></td>
                    <td><span v-if="employee.join_date">{{ employee.join_date | dateFormat('DD MMM YYYY') }}</span></td>
                  </tr>
                  <tr>
                    <td><span class="font-w700">{{ $t('job title') | titlecase }}</span></td>
                    <td>{{ employee.job_title }}</td>
                  </tr>
                  <tr>
                    <td><span class="font-w700">{{ $t('email') | titlecase }}</span></td>
                    <td>
                      <ul>
                        <li
                          v-for="(employeeEmail, index) in employee.company_emails"
                          :key="index">
                          {{ employeeEmail.email }}
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td><span class="font-w700">{{ $t('contract') | titlecase }}</span></td>
                    <td>
                      <ul>
                        <li
                          v-for="(employeeContract, index) in employee.contracts"
                          :key="index">
                          {{ employeeContract.contract_begin | dateFormat('DD MMM YYYY') }} - {{ employeeContract.contract_end | dateFormat('DD MMM YYYY') }}
                          <br>{{ employeeContract.notes }}
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td><span class="font-w700">{{ $t('salary history') | titlecase }}</span></td>
                    <td>
                      <ul>
                        <li
                          v-for="(employeeSalaryHistory, index) in employee.salary_histories"
                          :key="index">
                          <b>{{ $t('date') | titlecase }}</b> {{ employeeSalaryHistory.date | dateFormat('DD MMM YYYY') }}
                          <br>
                          <b>{{ $t('salary') | titlecase }}</b> {{ employeeSalaryHistory.salary | numberFormat }}
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td><span class="font-w700">{{ $t('employee scorer') | titlecase }}</span></td>
                    <td>
                      <ul>
                        <li v-for="(employeeScorer, index) in employee.scorers" :key="index">
                          {{ employeeScorer.first_name | titlecase }} {{ employeeScorer.last_name | titlecase }}
                        </li>
                      </ul>
                    </td>
                  </tr>
                </template>
              </p-table>
            </div>
            <div class="col-sm-12 mb-20">
              <router-link
                :to="{ path: '/human-resource/employee/' + employee.id + '/edit', params: { id: employee.id }}"
                v-if="$permission.has('update employee')"
                class="btn btn-sm btn-primary">
                Edit
              </router-link>
              <button
                type="button"
                @click="onDelete()"
                v-if="$permission.has('delete employee')"
                :disabled="loadingSaveButton"
                class="btn btn-sm btn-danger">
                <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Delete
              </button>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
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
      isScorer: false,
      loading: false,
      loadingSaveButton: false
    }
  },
  computed: {
    ...mapGetters('Employee', ['employee', 'employees']),
    ...mapGetters('Auth', ['authUser'])
  },
  created () {
    this.loading = true
    if (this.employees) {
      this.employees.find((element) => {
        console.log(element.id + ' = ' + this.id)
        if (element.id === this.id) {
          this.$store.commit('Employee/FETCH_OBJECT', element)
          this.loading = false
        }
      })
    }
    this.findEmployee({ id: this.id }).then((response) => {
      if (this.employee.scorers) {
        this.employee.scorers.find((element) => {
          if (element.id == this.authUser.id) {
            this.isScorer = true
            this.loading = false
          }
        })
      }
      this.loading = false
    }, (error) => {
      console.log(JSON.stringify(error))
    })
  },
  methods: {
    ...mapActions('Employee', { findEmployee: 'find', deleteEmployee: 'delete' }),
    onDelete () {
      this.loadingSaveButton = true
      this.deleteEmployee({ id: this.id })
        .then((response) => {
          this.loadingSaveButton = false
          this.$router.push('/human-resource/employee')
        }, (error) => {
          this.loadingSaveButton = false
          console.log(JSON.stringify(error))
        })
    }
  }
}
</script>
