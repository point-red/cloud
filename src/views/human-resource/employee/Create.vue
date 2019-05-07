<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <router-link
        to="/human-resource/employee"
        class="breadcrumb-item">{{ $t('employee') | titlecase }}</router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">

      <p-block
        :is-loading="loading"
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
              v-model="form.name"
              :disabled="loadingSaveButton"
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
                  :disabled="loadingSaveButton"
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
                  :disabled="loadingSaveButton"
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
                  :disabled="loadingSaveButton"
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
                  :disabled="loadingSaveButton"
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
              :disabled="loadingSaveButton"
              v-model="form.personal_identity"
              :errors="form.errors.get('personal_identity')"
              @errors="form.errors.set('personal_identity', null)">
            </p-form-row>

            <p-form-row
              id="last-education"
              name="last-education"
              :label="$t('last education')"
              :disabled="loadingSaveButton"
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
              :label="$t('birth place')"
              :disabled="loadingSaveButton"
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
                  :disabled="loadingSaveButton"
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
              :label="$t('married with')"
              :disabled="loadingSaveButton"
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
              :disabled="loadingSaveButton"
              v-model="form.employee_group_name"
              :errors="form.errors.get('employe_group_name')"
              @errors="form.errors.set('employe_group_name', null)">
            </p-form-row>

            <p-form-row
              id="job-title"
              name="job-title"
              :label="$t('job title')"
              :disabled="loadingSaveButton"
              v-model="form.job_title"
              :errors="form.errors.get('job_title')"
              @errors="form.errors.set('job_title', null)">
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
              id="email"
              :label="$t('email')">
              <div slot="body" class="col-lg-9">
                <button
                  type="button"
                  class="btn btn-alt-primary mb-15"
                  :disabled="loadingSaveButton"
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
                  :disabled="loadingSaveButton"
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
                  :disabled="loadingSaveButton"
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
                    <td>{{ salary.salary }}</td>
                    <td class="text-right">
                      <i class="fa fa-close" @click="removeSalary(index)"/>
                    </td>
                  </tr>
                </p-table>
              </div>
            </p-form-row>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-12">
            <button :disabled="loadingSaveButton" type="submit" class="btn btn-sm btn-primary">
              <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Save
            </button>
          </div>
        </div>
      </p-block>
    </form>

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
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import PhoneModal from './modal/PhoneModal'
import EmailModal from './modal/EmailModal'
import EmailCompanyModal from './modal/EmailCompanyModal'
import AddressModal from './modal/AddressModal'
import SocialMediaModal from './modal/SocialMediaModal'
import ContractModal from './modal/ContractModal'
import SalaryModal from './modal/SalaryModal'
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
    AddressModal,
    SocialMediaModal,
    ContractModal,
    SalaryModal
  },
  data () {
    return {
      loading: false,
      loadingSaveButton: false,
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
        employee_group_name: '',
        job_title: '',
        join_date: '',
        phones: [],
        emails: [],
        company_emails: [],
        addresses: [],
        social_media: [],
        contracts: [],
        salary_histories: []
      })
    }
  },
  computed: {
    ...mapGetters('EmployeeGroup', ['groupList']),
    ...mapGetters('EmployeeReligion', ['religionList']),
    ...mapGetters('EmployeeGender', ['genderList']),
    ...mapGetters('EmployeeMaritalStatus', ['maritalStatusList'])
  },
  created () {
    this.getGroups()
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
        console.log(response.data)
      }, (error) => {
        console.log(JSON.stringify(error))
      })
    this.getMaritalStatuses()
      .then((response) => {
        console.log(response.data)
      }, (error) => {
        console.log(JSON.stringify(error))
      })
  },
  methods: {
    ...mapActions('EmployeeGroup', {
      getGroups: 'get'
    }),
    ...mapActions('EmployeeReligion', {
      getReligions: 'get'
    }),
    ...mapActions('EmployeeGender', {
      getGenders: 'get'
    }),
    ...mapActions('EmployeeMaritalStatus', {
      getMaritalStatuses: 'get'
    }),
    ...mapActions('Employee', {
      createEmployee: 'create'
    }),
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
      this.loadingSaveButton = true
      this.createEmployee(this.form)
        .then(
          (response) => {
            this.loadingSaveButton = false
            this.$notification.success('Create success')
            this.$router.push('/human-resource/employee/' + response.data.id)
          },
          (error) => {
            this.loadingSaveButton = false
            this.$notification.error('Create failed', error.message)
            this.form.errors.record(error.errors)
          }
        )
    }
  }
}
</script>
