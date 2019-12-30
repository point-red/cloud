<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <router-link
        to="/human-resource/employee"
        class="breadcrumb-item">{{ $t('employee') | uppercase }}</router-link>
      <router-link
        :to="'/human-resource/employee/' + employee.id"
        class="breadcrumb-item">{{ employee.name | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <employee-widget :id="id"></employee-widget>

    <tab-menu></tab-menu>

    <form class="row" @submit.prevent="onSubmit">
      <p-block
        :is-loading="isLoading"
        :header="true"
        :title="$t('employee')"
        column="col-sm-12">
        <div class="row">
          <div class="col-sm-6">
            <h2 class="content-heading">{{ $t('personal info') | uppercase }}</h2>
            <p-form-row
              id="name"
              name="name"
              :label="$t('name')"
              :disabled="isSaving"
              v-model="form.name"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)">
            </p-form-row>

            <p-form-row
              id="address"
              :label="$t('address')">
              <div slot="body" class="col-lg-9">
                <button
                  type="button"
                  class="btn btn-alt-primary mb-15"
                  :disabled="isSaving"
                  @click="$refs.addressModal.show()">
                  <i class="fa fa-plus"/> {{ $t('address') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head"/>
                  <tr
                    v-for="(address, index) in form.addresses"
                    slot="p-body"
                    :key="address.index">
                    <td>{{ address.address }}</td>
                    <td class="text-right"><i
                      class="fa fa-close"
                      @click="removeAddress(index)"/></td>
                  </tr>
                </p-table>
              </div>
            </p-form-row>

            <p-form-row
              id="phone"
              :label="$t('phone')">
              <div slot="body" class="col-lg-9">
                <button
                  type="button"
                  class="btn btn-alt-primary mb-15"
                  :disabled="isSaving"
                  @click="$refs.phoneModal.show()">
                  <i class="fa fa-plus"/> {{ $t('phone') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head"/>
                  <tr
                    v-for="(phone, index) in form.phones"
                    slot="p-body"
                    :key="phone.index">
                    <td>{{ phone.phone }}</td>
                    <td class="text-right"><i
                      class="fa fa-close"
                      @click="removePhone(index)"/></td>
                  </tr>
                </p-table>
              </div>
            </p-form-row>

            <p-form-row
              id="email"
              :label="$t('email')">
              <div slot="body" class="col-lg-9">
                <button
                  type="button"
                  class="btn btn-alt-primary mb-15"
                  :disabled="isSaving"
                  @click="$refs.emailModal.show()">
                  <i class="fa fa-plus"/> {{ $t('email') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head"/>
                  <tr
                    v-for="(email, index) in form.emails"
                    slot="p-body"
                    :key="email.index">
                    <td>{{ email.email }}</td>
                    <td class="text-right"><i
                      class="fa fa-close"
                      @click="removeEmail(index)"/></td>
                  </tr>
                </p-table>
              </div>
            </p-form-row>

            <p-form-row
              id="social-media"
              :label="$t('social media')">
              <div slot="body" class="col-lg-9">
                <button
                  type="button"
                  class="btn btn-alt-primary mb-15"
                  :disabled="isSaving"
                  @click="$refs.socialMedia.show()">
                  <i class="fa fa-plus"/> {{ $t('social media') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head"/>
                  <tr
                    v-for="(socialMedia, index) in form.social_media"
                    slot="p-body"
                    :key="socialMedia.index">
                    <td>{{ socialMedia.type }}</td>
                    <td width="100%">{{ socialMedia.account }}</td>
                    <td class="text-right">
                      <i
                        class="fa fa-close"
                        @click="removeSocialMedia(index)"/>
                    </td>
                  </tr>
                </p-table>
              </div>
            </p-form-row>

            <p-form-row
              id="personal-identity"
              name="personal-identity"
              :label="$t('personal id')"
              :disabled="isSaving"
              v-model="form.personal_identity"
              :errors="form.errors.get('personal_identity')"
              @errors="form.errors.set('personal_identity', null)">
            </p-form-row>

            <p-form-row
              id="last-education"
              name="last-education"
              :label="$t('last education')"
              :disabled="isSaving"
              v-model="form.last_education"
              :errors="form.errors.get('last_education')"
              @errors="form.errors.set('last_education', null)">
            </p-form-row>

            <p-form-row
              id="birth-date"
              name="birth-date"
              :label="$t('birth date')">
              <div slot="body" class="col-lg-9">
                <p-date-picker
                  id="birth-date"
                  name="birth-date"
                  label="Birth Date"
                  v-model="form.birth_date"
                  :errors="form.errors.get('birth_date')"
                  @errors="form.errors.set('birth_date', null)"/>
              </div>
            </p-form-row>

            <p-form-row
              id="birth-place"
              name="birth-place"
              :disabled="isSaving"
              :label="$t('birth place')"
              v-model="form.birth_place"
              :errors="form.errors.get('birth_place')"
              @errors="form.errors.set('birth_place', null)">
            </p-form-row>

            <p-form-row
              id="gender"
              name="gender"
              :label="$t('gender')">
              <div slot="body" class="col-lg-9">
                <p-select
                  id="gender"
                  name="gender"
                  v-model="form.employee_gender_id"
                  :options="genderList"
                  :errors="form.errors.get('employee_gender_id')"
                  @errors="form.errors.set('employee_gender_id', null)"/>
              </div>
            </p-form-row>

            <p-form-row
              id="marital-status"
              name="marital-status"
              :label="$t('marital status')">
              <div slot="body" class="col-lg-9">
                <p-select
                  id="marital-status"
                  name="maritalStatus"
                  v-model="form.employee_marital_status_id"
                  :options="maritalStatusList"
                  :errors="form.errors.get('employee_marital_status_id')"
                  @errors="form.errors.set('employee_marital_status_id', null)"/>
              </div>
            </p-form-row>

            <p-form-row
              id="married-with"
              name="married-with"
              v-if="form.employee_marital_status_id == 2"
              :disabled="isSaving"
              :label="$t('married with')"
              v-model="form.married_with"
              :errors="form.errors.get('married_with')"
              @errors="form.errors.set('married_with', null)">
            </p-form-row>

            <p-form-row
              id="religion"
              name="religion"
              :label="$t('religion')">
              <div slot="body" class="col-lg-9">
                <p-select
                  id="religion"
                  name="religion"
                  v-model="form.employee_religion_id"
                  :options="religionList"
                  :errors="form.errors.get('employee_religion_id')"
                  @errors="form.errors.set('employee_religion_id', null)"/>
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-6">
            <h2 class="content-heading">{{ $t('job info') | uppercase }}</h2>
            <p-form-row
              id="group"
              name="group"
              :label="$t('employee group')">
              <div slot="body" class="col-lg-9">
                <p-select
                  id="employee-group"
                  name="employee-group"
                  v-model="form.employee_group_id"
                  :options="groupList"
                  :errors="form.errors.get('employee_group_id')"
                  @errors="form.errors.set('employee_group_id', null)"/>
              </div>
            </p-form-row>

            <p-form-row
              id="employee-group-name"
              name="employee-group-name"
              :label="$t('')"
              :disabled="isSaving"
              v-model="form.employee_group_name"
              :errors="form.errors.get('employe_group_name')"
              @errors="form.errors.set('employe_group_name', null)">
            </p-form-row>

            <p-form-row
              id="code"
              name="code"
              :label="$t('code')"
              :disabled="isSaving"
              v-model="form.code"
              :errors="form.errors.get('code')"
              @errors="form.errors.set('code', null)">
            </p-form-row>

            <p-form-row
              id="job-title"
              name="job-title"
              :label="$t('job title')"
              :disabled="isSaving"
              v-model="form.job_title"
              :errors="form.errors.get('job_title')"
              @errors="form.errors.set('job_title', null)">
            </p-form-row>

            <p-form-row
              id="job-location"
              name="job-location"
              :label="$t('job location')">
              <div slot="body" class="col-lg-9">
                <p-select
                  id="employee-job-location"
                  name="employee-job-location"
                  v-model="form.employee_job_location_id"
                  :options="jobLocationList"
                  :errors="form.errors.get('employee_job_location_id')"
                  @errors="form.errors.set('employee_job_location_id', null)"/>
              </div>
            </p-form-row>

            <p-form-row
              id="join-date"
              name="join-date"
              :label="$t('join date')">
              <div slot="body" class="col-lg-9">
                <p-date-picker
                  id="join-date"
                  name="join-date"
                  label="join date"
                  v-model="form.join_date"
                  :errors="form.errors.get('join_date')"
                  @errors="form.errors.set('join_date', null)"/>
              </div>
            </p-form-row>

            <p-form-row
              id="status"
              name="status"
              :label="$t('status')">
              <div slot="body" class="col-lg-9">
                <p-select
                  id="status"
                  name="status"
                  v-model="form.employee_status_id"
                  :options="statusList"
                  :errors="form.errors.get('employee_status_id')"
                  @errors="form.errors.set('employee_status_id', null)"/>
              </div>
            </p-form-row>

            <p-form-row
              id="email"
              :label="$t('email')">
              <div slot="body" class="col-lg-9">
                <button
                  type="button"
                  class="btn btn-alt-primary mb-15"
                  :disabled="isSaving"
                  @click="$refs.emailCompanyModal.show()">
                  <i class="fa fa-plus"/> {{ $t('email') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head"/>
                  <tr
                    v-for="(email, index) in form.company_emails"
                    slot="p-body"
                    :key="email.index">
                    <td>{{ email.email }}</td>
                    <td class="text-right"><i
                      class="fa fa-close"
                      @click="removeEmailCompany(index)"/></td>
                  </tr>
                </p-table>
              </div>
            </p-form-row>

            <p-form-row
              id="contract"
              :label="$t('contract')">
              <div slot="body" class="col-lg-9">
                <button
                  type="button"
                  class="btn btn-alt-primary mb-15"
                  :disabled="isSaving"
                  @click="$refs.contractModal.show()">
                  <i class="fa fa-plus"/> {{ $t('contract') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head"/>
                  <tr
                    v-for="(contract, index) in form.contracts"
                    slot="p-body"
                    :key="contract.index">
                    <td>{{ contract.contract_begin | dateFormat('DD MMM YYYY') }}</td>
                    <td>{{ contract.contract_end | dateFormat('DD MMM YYYY') }}</td>
                    <td>{{ contract.notes }}</td>
                    <td class="text-right"><i
                      class="fa fa-close"
                      @click="removeContract(index)"/></td>
                  </tr>
                </p-table>
              </div>
            </p-form-row>

            <p-form-row
              id="salary"
              :label="$t('salary history')">
              <div slot="body" class="col-lg-9">
                <button
                  type="button"
                  class="btn btn-alt-primary mb-15"
                  :disabled="isSaving"
                  @click="$refs.salaryModal.show()">
                  <i class="fa fa-plus"/> {{ $t('salary history') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head"/>
                  <tr
                    v-for="(salary, index) in form.salary_histories"
                    slot="p-body"
                    :key="salary.index">
                    <td>{{ salary.date | dateFormat('DD MMM YYYY') }}</td>
                    <td>{{ salary.salary | numberFormat }}</td>
                    <td class="text-right">
                      <i class="fa fa-close" @click="removeSalary(index)"/>
                    </td>
                  </tr>
                </p-table>
              </div>
            </p-form-row>

            <p-form-row
              id="scorer"
              :label="$t('employee scorer')">
              <div slot="body" class="col-lg-9">
                <button
                  type="button"
                  class="btn btn-alt-primary mb-15"
                  :disabled="isSaving"
                  @click="$refs.scorerModal.show()">
                  <i class="fa fa-plus"/> {{ $t('employee scorer') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head"/>
                  <tr
                    v-for="(scorer, index) in form.scorers"
                    slot="p-body"
                    :key="index">
                    <td>{{ scorer.name }}</td>
                    <td class="text-right">
                      <i class="fa fa-close" @click="removeScorer(index)"/>
                    </td>
                  </tr>
                </p-table>
              </div>
            </p-form-row>

            <p-form-row
              id="user-account"
              name="user-account"
              :label="$t('user account')">
              <div slot="body" class="col-lg-9">
                <p-select
                  id="user-account"
                  name="user-account"
                  v-model="form.user_id"
                  :options="userList"
                  :errors="form.errors.get('user_id')"
                  @errors="form.errors.set('user_id', null)"/>
              </div>
            </p-form-row>

            <h2 class="content-heading">{{ $t('allowance info') | uppercase }}</h2>
            <p-form-row
              id="daily-transport-allowance"
              name="daily-transport-allowance"
              :label="$t('daily transport allowance')">
              <div slot="body" class="col-lg-9">
                <p-form-number
                  v-model="form.daily_transport_allowance"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('daily_transport_allowance')"
                  @errors="form.errors.set('daily_transport_allowance', null)"/>
              </div>
            </p-form-row>

            <p-form-row
              id="functional-allowance"
              name="functional-allowance"
              :label="$t('functional allowance')">
              <div slot="body" class="col-lg-9">
                <p-form-number
                  v-model="form.functional_allowance"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('functional_allowance')"
                  @errors="form.errors.set('functional_allowance', null)"/>
              </div>
            </p-form-row>

            <p-form-row
              id="communication-allowance"
              name="communication-allowance"
              :label="$t('communication allowance')">
              <div slot="body" class="col-lg-9">
                <p-form-number
                  v-model="form.communication_allowance"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('communication_allowance')"
                  @errors="form.errors.set('communication_allowance', null)"/>
              </div>
            </p-form-row>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-12">
            <hr>
            <button
              type="submit"
              :disabled="isSaving"
              class="btn btn-sm btn-primary mr-5">
              <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> Update
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              @click="$router.push('/human-resource/employee/' + id)">
              Close
            </button>
          </div>
        </div>
      </p-block>

      <p-block
        :is-loading="isLoading"
        :header="true"
        :title="$t('attachment')"
        column="col-sm-12">
        <div class="form-group row">
          <div class="col-md-12">
            <button
              type="button"
              class="btn btn-sm btn-outline-primary"
              :disabled="isSaving"
              @click="$refs.uploadModal.show()">
                <i class="fa fa-plus"></i> {{ $t('upload') | uppercase }}
            </button>
          </div>
        </div>
        <hr>
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
                  <a href="javascript:void(0)" class="mr-15"><i class="fa fa-pencil"></i></a>
                  <a :href="cloudStorage.download_url" class="mr-15"><i class="fa fa-download"></i></a>
                  <a href="javascript:void(0)" @click="deleteAttachment(cloudStorage.id, cloudStorage.key)"><i class="fa fa-trash"></i></a>
                </div>
              </div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </form>

    <upload-modal
      id="file"
      ref="uploadModal"
      title="Upload"
      formRef="uploadForm"
      feature="employee"
      :is-user-protected="true"
      @uploaded="attachmentUploaded"/>

    <address-modal
      id="address"
      ref="addressModal"
      title="Address"
      @add="onSubmitAddress"/>

    <phone-modal
      id="phone"
      ref="phoneModal"
      title="PHONE"
      @add="onSubmitPhone"/>

    <email-modal
      id="email"
      ref="emailModal"
      title="EMAIL"
      @add="onSubmitEmail"/>

    <email-company-modal
      id="email-company"
      ref="emailCompanyModal"
      title="EMAIL COMPANY"
      @add="onSubmitEmailCompany"/>

    <social-media-modal
      id="socialMedia"
      ref="socialMedia"
      title="SOCIAL MEDIA"
      @add="onSubmitSocialMedia"/>

    <contract-modal
      id="contract"
      ref="contractModal"
      title="Contract"
      @add="onSubmitContract"/>

    <salary-modal
      id="salary"
      ref="salaryModal"
      title="Salary"
      @add="onSubmitSalary"/>

    <scorer-modal
      id="scorer"
      ref="scorerModal"
      title="Scorer"
      @add="onSubmitScorer"/>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import PhoneModal from './modal/PhoneModal'
import EmailModal from './modal/EmailModal'
import EmailCompanyModal from './modal/EmailCompanyModal'
import EmployeeWidget from './EmployeeWidget'
import AddressModal from './modal/AddressModal'
import SocialMediaModal from './modal/SocialMediaModal'
import ContractModal from './modal/ContractModal'
import SalaryModal from './modal/SalaryModal'
import ScorerModal from './modal/ScorerModal'
import UploadModal from './modal/UploadModal'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource,
    PhoneModal,
    EmailModal,
    EmailCompanyModal,
    EmployeeWidget,
    AddressModal,
    SocialMediaModal,
    ContractModal,
    SalaryModal,
    ScorerModal,
    UploadModal
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isSaving: false,
      form: new Form({
        name: '',
        birth_date: '',
        birth_place: '',
        personal_identity: '',
        last_education: '',
        gender: '',
        marital_status: '',
        married_with: '',
        religion: '',
        employee_group_id: '',
        employee_religion_id: '',
        employee_marital_status_id: '',
        employee_gender_id: '',
        employee_status_id: '',
        employee_job_location_id: '',
        job_title: '',
        join_date: '',
        code: '',
        status: '',
        job_location: '',
        daily_transport_allowance: 0,
        functional_allowance: 0,
        communication_allowance: 0,
        phones: [],
        emails: [],
        company_emails: [],
        addresses: [],
        social_media: [],
        contracts: [],
        salary_histories: [],
        scorers: []
      })
    }
  },
  computed: {
    ...mapGetters('masterUser', ['userList']),
    ...mapGetters('humanResourceEmployee', ['employee']),
    ...mapGetters('humanResourceEmployeeGroup', ['groupList']),
    ...mapGetters('humanResourceEmployeeReligion', ['religionList']),
    ...mapGetters('humanResourceEmployeeGender', ['genderList']),
    ...mapGetters('humanResourceEmployeeMaritalStatus', ['maritalStatusList']),
    ...mapGetters('humanResourceEmployeeStatus', ['statusList']),
    ...mapGetters('humanResourceEmployeeJobLocation', ['jobLocationList']),
    ...mapGetters('cloudStorage', ['cloudStorages'])
  },
  created () {
    this.isLoading = true
    this.getGroups()
      .then((response) => {
        this.isLoading = false
        console.log(response.data)
      }, (error) => {
        this.isLoading = false
        console.log(JSON.stringify(error))
      })
    this.getMaritalStatuses()
      .then((response) => {
        console.log(response.data)
      }, (error) => {
        console.log(JSON.stringify(error))
      })
    this.getReligions()
      .then((response) => {
        console.log(response.data)
      }, (error) => {
        console.log(JSON.stringify(error))
      })
    this.getGenders()
      .then((response) => {
      }, (error) => {
        console.log(JSON.stringify(error))
      })
    this.getStatuses()
      .then((response) => {
        console.log(response.data)
      }, (error) => {
        console.log(JSON.stringify(error))
      })
    this.getJobLocations()
      .then((response) => {
        console.log(response.data)
      }, (error) => {
        console.log(JSON.stringify(error))
      })
    this.findEmployee({
      id: this.id
    }).then((response) => {
      this.isLoading = false
      for (let field in this.form) {
        if (response.data[field]) this.form[field] = response.data[field]
      }
      this.form.id = response.data.id
      this.form.company_emails = response.data.company_emails
    }, (error) => {
      this.isLoading = false
      console.log(JSON.stringify(error))
    })
    this.getAttachmentRequest()
  },
  methods: {
    ...mapActions('humanResourceEmployeeGroup', { getGroups: 'get' }),
    ...mapActions('humanResourceEmployeeReligion', { getReligions: 'get' }),
    ...mapActions('humanResourceEmployeeGender', { getGenders: 'get' }),
    ...mapActions('humanResourceEmployeeMaritalStatus', { getMaritalStatuses: 'get' }),
    ...mapActions('humanResourceEmployeeStatus', { getStatuses: 'get' }),
    ...mapActions('humanResourceEmployeeJobLocation', { getJobLocations: 'get' }),
    ...mapActions('humanResourceEmployee', { findEmployee: 'find', updateEmployee: 'update' }),
    ...mapActions('cloudStorage', { getAttachment: 'get' }),
    onSubmitContract (data) {
      this.form.contracts.push(data)
      this.$refs.contractModal.close()
    },
    removeContract (index) {
      this.form.contracts.splice(index, 1)
    },
    onSubmitSocialMedia (data) {
      this.form.social_media.push(data)
      this.$refs.socialMedia.close()
    },
    removeSocialMedia (index) {
      this.form.social_media.splice(index, 1)
    },
    onSubmitSalary (data) {
      this.form.salary_histories.push(data)
      this.$refs.salaryModal.close()
    },
    removeSalary (index) {
      this.form.salary_histories.splice(index, 1)
    },
    onSubmitScorer (data) {
      this.form.scorers.push(data)
      this.$refs.scorerModal.close()
    },
    removeScorer (index) {
      this.form.scorers.splice(index, 1)
    },
    onSubmitAddress (data) {
      this.form.addresses.push(data)
      this.$refs.addressModal.close()
    },
    removeAddress (index) {
      this.form.addresses.splice(index, 1)
    },
    onSubmitPhone (data) {
      this.form.phones.push(data)
      this.$refs.phoneModal.close()
    },
    removePhone (index) {
      this.form.phones.splice(index, 1)
    },
    onSubmitEmail (data) {
      this.form.emails.push(data)
      this.$refs.emailModal.close()
    },
    removeEmail (index) {
      this.form.emails.splice(index, 1)
    },
    onSubmitEmailCompany (data) {
      this.form.company_emails.push(data)
      this.$refs.emailCompanyModal.close()
    },
    removeEmailCompany (index) {
      this.form.company_emails.splice(index, 1)
    },
    onSubmit () {
      this.isSaving = true
      this.updateEmployee(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('Update success')
          this.$router.replace('/human-resource/employee/' + this.employee.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error('Update failed', error.message)
          this.form.errors.record(error.errors)
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
    },
    attachmentUploaded (payload) {
      this.getAttachmentRequest()
    },
    deleteAttachment (id, key) {
      this.$alert.confirm('DELETE ATTACHMENT').then(response => {
        this.isSaving = true
        this.deleteCloudStorage({
          id: id,
          params: {
            key: key
          }
        }).then(response => {
          this.isSaving = false
          this.$alert.success('FILE DELETED')
          this.getAttachmentRequest()
        }).catch(error => {
          this.isSaving = false
          this.$alert.error(error.message)
        })
      }).catch(error => {
        this.$alert.error(error.message)
      })
    }
  }
}
</script>
