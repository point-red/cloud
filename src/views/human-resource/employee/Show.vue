<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <router-link to="/human-resource/employee" class="breadcrumb-item">{{ $t('employee') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ employee.name | uppercase }}</span>
    </breadcrumb>

    <employee-widget :id="id"></employee-widget>

    <tab-menu></tab-menu>

    <div class="row">
      <p-block :title="$t('employee')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-6">
              <p-table>
                <template slot="p-body">
                  <tr>
                    <td><span class="font-w700">{{ $t('name') | titlecase }}</span></td>
                    <td>{{ employee.name }}</td>
                  </tr>
                  <tr>
                    <td><span class="font-w700">{{ $t('code') | titlecase }}</span></td>
                    <td>{{ employee.code }}</td>
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
                    <td><span class="font-w700">{{ $t('job location') | titlecase }}</span></td>
                    <td><span v-if="employee.job_location">{{ employee.job_location.name }}</span></td>
                  </tr>
                  <tr v-if="$permission.has('read employee') && employee.job_location">
                    <td><span class="font-w700">{{ $t('base salary') | titlecase }}</span></td>
                    <td><span>{{ employee.job_location.base_salary | numberFormat }}</span></td>
                  </tr>
                  <tr v-if="$permission.has('read employee') && employee.job_location">
                    <td><span class="font-w700">{{ $t('multiplier kpi') | titlecase }}</span></td>
                    <td><span>{{ employee.job_location.multiplier_kpi | numberFormat }}</span></td>
                  </tr>
                  <tr>
                    <td><span class="font-w700">{{ $t('status') | titlecase }}</span></td>
                    <td><span v-if="employee.status">{{ employee.status.name }}</span></td>
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
                    <td><span class="font-w700">{{ $t('daily transport allowance') | titlecase }}</span></td>
                    <td>{{ employee.daily_transport_allowance | numberFormat }}</td>
                  </tr>
                  <tr>
                    <td><span class="font-w700">{{ $t('functional allowance') | titlecase }}</span></td>
                    <td>{{ employee.functional_allowance | numberFormat }}</td>
                  </tr>
                  <tr>
                    <td><span class="font-w700">{{ $t('communication allowance') | titlecase }}</span></td>
                    <td>{{ employee.communication_allowance | numberFormat }}</td>
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
                  <tr>
                    <td><span class="font-w700">{{ $t('user account') | titlecase }}</span></td>
                    <td>
                      <template v-if="employee.user">
                      {{ employee.user.first_name | titlecase }} {{ employee.user.last_name | titlecase }}
                      </template>
                    </td>
                  </tr>
                </template>
              </p-table>
            </div>
            <div class="col-sm-12 mb-20">
              <hr>
              <router-link
                :to="{ path: '/human-resource/employee/' + employee.id + '/edit', params: { id: employee.id }}"
                v-if="$permission.has('update employee')"
                class="btn btn-sm btn-primary mr-5">
                Edit
              </router-link>
              <button
                type="button"
                @click="onDelete()"
                v-if="$permission.has('delete employee')"
                :disabled="isDeleting"
                class="btn btn-sm btn-danger">
                <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> Delete
              </button>
            </div>
          </div>
        </p-block-inner>
      </p-block>
      <p-block
        :header="true"
        v-if="$permission.has('read employee')"
        :title="$t('attachment')"
        column="col-sm-12">
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div
              class="col-md-6 col-xl-3 mb-15"
              v-for="cloudStorage in cloudStorages"
              :key="cloudStorage.id">
              <div class="card block-rounded block-link-shadow text-center">
                <div v-if="cloudStorage.preview" class="block-content block-content-full bg-image" :style="'background-image: url(' + cloudStorage.preview + '); height: 130px'">
                </div>
                <div v-else class="block-content block-content-full bg-image" :style="'height: 130px'">
                </div>
                <div class="block-content block-content-full block-content-sm" style="height:50px;overflow: auto">
                  <div class="font-size-sm">{{ cloudStorage.notes }}</div>
                </div>
                <div class="p-5">
                  <a :href="cloudStorage.download_url"><i class="fa fa-download"></i></a>
                </div>
              </div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import EmployeeWidget from './EmployeeWidget'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
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
      isScorer: false,
      isLoading: false,
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployee', ['employee', 'employees']),
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('cloudStorage', ['cloudStorages'])
  },
  created () {
    this.isLoading = true
    this.findEmployee({ id: this.id }).then(response => {
      if (this.employee.scorers) {
        this.employee.scorers.find((element) => {
          if (element.id == this.authUser.id) {
            this.isScorer = true
          }
        })
      }
      this.isLoading = false
    }).catch(error => {
      console.log(JSON.stringify(error))
    })
    this.getAttachmentRequest()
  },
  methods: {
    ...mapActions('humanResourceEmployee', { findEmployee: 'find', deleteEmployee: 'delete' }),
    ...mapActions('cloudStorage', { getAttachment: 'get' }),
    onDelete () {
      this.isDeleting = true
      this.deleteEmployee({ id: this.id })
        .then(response => {
          this.isDeleting = false
          this.$router.push('/human-resource/employee')
        }).catch(error => {
          this.isDeleting = false
          console.log(JSON.stringify(error))
        })
    },
    getAttachmentRequest () {
      this.isLoading = true
      this.getAttachment({
        params: {
          filter_equal: {
            'is_user_protected': false,
            'feature': 'employee',
            'feature_id': this.id
          },
          sort_by: '-id'
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    }
  }
}
</script>
