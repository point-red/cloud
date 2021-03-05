<template>
  <div>
    <sweet-modal
      ref="modal"
      width="100%"
      :title="$t('employee information') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <form @submit.prevent="onSubmit">
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="name"
              ref="name"
              v-model="form.name"
              :disabled="isSaving"
              :label="$t('name')"
              name="name"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)"
            />

            <p-form-row
              id="personal-identity"
              v-model="form.personal_identity"
              name="personal-identity"
              :label="$t('personal id')"
              :disabled="isSaving"
              :errors="form.errors.get('personal_identity')"
              @errors="form.errors.set('personal_identity', null)"
            />

            <p-form-row
              id="tax_identification_number"
              v-model="form.tax_identification_number"
              name="tax_identification_number"
              :label="$t('npwp')"
              :disabled="isSaving"
              :errors="form.errors.get('tax_identification_number')"
              @errors="form.errors.set('tax_identification_number', null)"
            />

            <p-form-row
              id="bpjs"
              v-model="form.bpjs"
              name="bpjs"
              :label="$t('bpjs')"
              :disabled="isSaving"
              :errors="form.errors.get('bpjs')"
              @errors="form.errors.set('bpjs', null)"
            />

            <p-form-row
              id="email"
              v-model="form.emails[0].email"
              :disabled="isSaving"
              :label="$t('email')"
              name="email"
              :errors="form.errors.get('email')"
              @errors="form.errors.set('email', null)"
            />

            <p-form-row
              id="address"
              v-model="form.addresses[0].address"
              :disabled="isSaving"
              :label="$t('address')"
              :icon="'fa-plus'"
              :icon-event="isAdditionalAddress"
              name="address"
              :errors="form.errors.get('address')"
              @handleEvent="handleEvent($event)"
              @errors="form.errors.set('address', null)"
            />

            <p-form-row
              v-show="isAdditionalAddress"
              id="address"
              v-model="form.addresses[1].address"
              :disabled="isSaving"
              name="address"
              :errors="form.errors.get('address')"
              @errors="form.errors.set('address', null)"
            />

            <p-form-row
              id="phone"
              v-model="form.phones[0].number"
              :disabled="isSaving"
              :label="$t('phone')"
              name="phone"
              :errors="form.errors.get('phone')"
              @errors="form.errors.set('phone', null)"
            />

            <p-form-row
              id="last-education"
              v-model="form.last_education"
              name="last-education"
              :label="$t('last education')"
              :disabled="isSaving"
              :errors="form.errors.get('last_education')"
              @errors="form.errors.set('last_education', null)"
            />

            <p-form-row
              id="birth-date"
              name="birth-date"
              :label="$t('birth date')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-date-picker
                  id="birth-date"
                  v-model="form.birth_date"
                  name="birth-date"
                  label="Birth Date"
                  :errors="form.errors.get('birth_date')"
                  @errors="form.errors.set('birth_date', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="birth-place"
              v-model="form.birth_place"
              name="birth-place"
              :label="$t('birth place')"
              :disabled="isSaving"
              :errors="form.errors.get('birth_place')"
              @errors="form.errors.set('birth_place', null)"
            />

            <p-form-row
              id="social-media"
              :label="$t('social media')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <button
                  type="button"
                  class="btn btn-sm btn-secondary mb-15"
                  :disabled="isSaving"
                  @click="$refs.socialMedia.open()"
                >
                  <i class="fa fa-plus" /> {{ $t('social media') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head" />
                  <tr
                    v-for="(socialMedia, index) in form.social_media"
                    slot="p-body"
                    :key="socialMedia.index"
                  >
                    <td>{{ socialMedia.type }}</td>
                    <td width="100%">
                      {{ socialMedia.account }}
                    </td>
                    <td class="text-right">
                      <i
                        class="fa fa-close"
                        @click="removeSocialMedia(index)"
                      />
                    </td>
                  </tr>
                </p-table>
              </div>
            </p-form-row>
            <p-form-row
              id="gender"
              name="gender"
              :label="$t('gender')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-select
                  id="gender"
                  v-model="form.employee_gender_id"
                  name="gender"
                  :disabled="isSaving"
                  :options="genderList"
                  :errors="form.errors.get('employee_gender_id')"
                  @errors="form.errors.set('employee_gender_id', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="marital-status"
              name="marital-status"
              :label="$t('marital status')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-select
                  id="marital-status"
                  v-model="form.employee_marital_status_id"
                  name="maritalStatus"
                  :options="maritalStatusList"
                  :errors="form.errors.get('employee_marital_status_id')"
                  @errors="form.errors.set('employee_marital_status_id', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              v-if="form.employee_marital_status_id == 2"
              id="married-with"
              v-model="form.married_with"
              name="married-with"
              :label="$t('married with')"
              :disabled="isSaving"
              :errors="form.errors.get('married_with')"
              @errors="form.errors.set('married_with', null)"
            />

            <p-form-row
              id="religion"
              name="religion"
              :label="$t('religion')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-select
                  id="religion"
                  v-model="form.employee_religion_id"
                  name="religion"
                  :options="religionList"
                  :errors="form.errors.get('employee_religion_id')"
                  @errors="form.errors.set('employee_religion_id', null)"
                />
              </div>
            </p-form-row>

            <p-separator />

            <h5>{{ $t('job information') | uppercase }}</h5>
            <hr>
            <p-form-row
              id="group"
              name="group"
              :label="$t('department')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-select
                  id="employee-group"
                  v-model="form.employee_group_id"
                  name="employee-group"
                  :options="groupList"
                  :errors="form.errors.get('employee_group_id')"
                  @errors="form.errors.set('employee_group_id', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="code"
              v-model="form.code"
              name="code"
              :label="$t('employee code')"
              :disabled="isSaving"
              :errors="form.errors.get('code')"
              @errors="form.errors.set('code', null)"
            />

            <p-form-row
              id="job-title"
              v-model="form.job_title"
              name="job-title"
              :label="$t('job title')"
              :disabled="isSaving"
              :errors="form.errors.get('job_title')"
              @errors="form.errors.set('job_title', null)"
            />

            <p-form-row
              id="job-location"
              name="job-location"
              :label="$t('job location')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-select
                  id="job-location"
                  v-model="form.employee_job_location_id"
                  name="employee-job-location"
                  :options="jobLocationList"
                  :errors="form.errors.get('employee_job_location_id')"
                  @errors="form.errors.set('employee_job_location_id', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="join-date"
              name="join-date"
              :label="$t('join date')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-date-picker
                  id="join-date"
                  v-model="form.join_date"
                  name="join-date"
                  label="join date"
                  type="date"
                  :errors="form.errors.get('join_date')"
                  @errors="form.errors.set('join_date', null)"
                />
              </div>
            </p-form-row>

            <!-- Resign Date -->
            <p-form-row
              id="resign-date"
              name="resign-date"
              :label="$t('resign date')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-date-picker
                  id="resign-date"
                  v-model="form.resign_date"
                  name="resign-date"
                  label="resign date"
                  type="date"
                  :errors="form.errors.get('resign_date')"
                  @errors="form.errors.set('resign_date', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="status"
              name="status"
              :label="$t('status')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-select
                  id="status"
                  v-model="form.employee_status_id"
                  name="status"
                  :options="statusList"
                  :errors="form.errors.get('employee_status_id')"
                  @errors="form.errors.set('employee_status_id', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="company_email"
              v-model="form.company_emails[0].email"
              :disabled="isSaving"
              :label="$t('company email')"
              name="company_email"
              :errors="form.errors.get('company_email')"
              @errors="form.errors.set('company_email', null)"
            />

            <p-form-row
              id="contract"
              :label="$t('contract period')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <button
                  type="button"
                  class="btn btn-sm btn-secondary mb-15"
                  :disabled="isSaving"
                  @click="$refs.contractModal.open()"
                >
                  <i class="fa fa-plus" /> {{ $t('contract period') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head" />
                  <tr
                    v-for="(contract, index) in form.contracts"
                    slot="p-body"
                    :key="contract.index"
                  >
                    <td>{{ contract.contract_begin | dateFormat('DD MMM YYYY') }}</td>
                    <td>{{ contract.contract_end | dateFormat('DD MMM YYYY') }}</td>
                    <td>{{ contract.notes }}</td>
                    <td class="text-right">
                      <i
                        class="fa fa-close"
                        @click="removeContract(index)"
                      />
                    </td>
                  </tr>
                </p-table>
              </div>
            </p-form-row>

            <p-form-row
              id="salary"
              :label="$t('salary history')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <button
                  type="button"
                  class="btn btn-sm btn-secondary mb-15"
                  :disabled="isSaving"
                  @click="$refs.salaryModal.open()"
                >
                  <i class="fa fa-plus" /> {{ $t('salary history') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head" />
                  <tr
                    v-for="(salary, index) in form.salary_histories"
                    slot="p-body"
                    :key="salary.index"
                  >
                    <td>{{ salary.date | dateFormat('DD MMM YYYY') }}</td>
                    <td>{{ salary.salary | numberFormat }}</td>
                    <td class="text-right">
                      <i
                        class="fa fa-close"
                        @click="removeSalary(index)"
                      />
                    </td>
                  </tr>
                </p-table>
              </div>
            </p-form-row>
            <p-form-row
              id="scorer"
              :label="$t('employee assessor')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <button
                  type="button"
                  class="btn btn-sm btn-secondary mb-15"
                  :disabled="isSaving"
                  @click="$refs.scorerModal.open()"
                >
                  <i class="fa fa-plus" /> {{ $t('employee assessor') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head" />
                  <tr
                    v-for="(scorer, index) in form.scorers"
                    slot="p-body"
                    :key="index"
                  >
                    <td>{{ scorer.name }}</td>
                    <td class="text-right">
                      <i
                        class="fa fa-close"
                        @click="removeScorer(index)"
                      />
                    </td>
                  </tr>
                </p-table>
              </div>
            </p-form-row>
            <p-form-row
              id="user-account"
              name="user-account"
              :label="$t('user account')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-select
                  id="user-account"
                  v-model="form.user_id"
                  name="user-account"
                  :options="userList"
                  :errors="form.errors.get('user_id')"
                  @errors="form.errors.set('user_id', null)"
                />
              </div>
            </p-form-row>
            <p-separator />
            <h5>{{ $t('allowance') | uppercase }}</h5>
            <hr>
            <p-form-row
              id="daily-transport-allowance"
              name="daily-transport-allowance"
              :label="$t('transport allowance (daily)')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-number
                  v-model="form.daily_transport_allowance"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('daily_transport_allowance')"
                  @errors="form.errors.set('daily_transport_allowance', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="functional-allowance"
              name="functional-allowance"
              :label="$t('functional allowance (monthly)')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-number
                  v-model="form.functional_allowance"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('functional_allowance')"
                  @errors="form.errors.set('functional_allowance', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="communication-allowance"
              name="communication-allowance"
              :label="$t('communication allowance (monthly)')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-number
                  v-model="form.communication_allowance"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('communication_allowance')"
                  @errors="form.errors.set('communication_allowance', null)"
                />
              </div>
            </p-form-row>
          </div>
        </div>
      </form>
      <h5>{{ $t('attachment') | uppercase }}</h5>
      <hr>
      <button
        type="button"
        class="btn btn-sm btn-outline-primary"
        :disabled="isSaving"
        @click="$refs.uploadModal.open()"
      >
        <i class="fa fa-plus" /> {{ $t('upload') | uppercase }}
      </button>
      <hr>
      <p-block-inner :is-loading="isLoading">
        <div class="row">
          <div
            v-for="(cloudStorage, index) in cloudStorages"
            :key="cloudStorage.id"
            class="col-md-6 col-xl-3 mb-15"
          >
            <div class="card block-rounded block-link-shadow text-center">
              <div
                v-if="cloudStorage.preview"
                class="block-content block-content-full bg-image"
                :style="'background-image: url(' + cloudStorage.preview + '); height: 130px'"
              />
              <div
                v-else
                class="block-content block-content-full bg-image"
                :style="'height: 130px'"
              />
              <div
                class="block-content block-content-full block-content-sm"
                style="height:50px;overflow: auto"
              >
                <div
                  v-if="editIndex != index"
                  class="font-size-sm"
                >
                  {{ cloudStorage.notes }}
                </div>
                <input
                  v-if="editIndex == index"
                  :ref="'notes-'+index"
                  v-model="cloudStorage.notes"
                  type="text"
                  class="form-control"
                >
              </div>
              <div class="p-10">
                <a
                  v-if="editIndex != index"
                  href="javascript:void(0)"
                  class="mr-15 btn btn-sm btn-outline-primary"
                  @click="editIndex = index"
                ><i class="fa fa-pencil" /></a>
                <a
                  v-if="editIndex == index"
                  href="javascript:void(0)"
                  class="mr-15 btn btn-sm btn-outline-primary"
                  @click="updateNotes(cloudStorage)"
                >{{ $t('update') | uppercase }}</a>
                <a
                  :href="cloudStorage.download_url"
                  class="mr-15 btn btn-sm btn-outline-primary"
                ><i class="fa fa-download" /></a>
                <a
                  href="javascript:void(0)"
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteAttachment(cloudStorage.id, cloudStorage.key)"
                ><i class="fa fa-trash" /></a>
              </div>
            </div>
          </div>
        </div>
      </p-block-inner>
      <div class="pull-right">
        <button
          type="submit"
          class="btn btn-sm btn-primary"
          :disabled="isSaving"
          @click="onSubmit"
        >
          <i
            v-show="isSaving"
            class="fa fa-asterisk fa-spin"
          /> {{ $t('update') | uppercase }}
        </button>
      </div>
    </sweet-modal>

    <social-media-modal
      id="socialMedia"
      ref="socialMedia"
      title="SOCIAL MEDIA"
      @add="onSubmitSocialMedia"
    />

    <contract-modal
      id="contract"
      ref="contractModal"
      title="Contract"
      @add="onSubmitContract"
    />

    <salary-modal
      id="salary"
      ref="salaryModal"
      title="Salary"
      @add="onSubmitSalary"
    />

    <scorer-modal
      id="scorer"
      ref="scorerModal"
      title="Scorer"
      @add="onSubmitScorer"
    />

    <upload-modal
      id="file"
      ref="uploadModal"
      title="Upload"
      form-ref="uploadForm"
      feature="employee"
      :feature-id="form.id"
      :is-user-protected="false"
      :expiration-day="0"
      @uploaded="attachmentUploaded"
    />
  </div>
</template>

<script>
import Form from '@/utils/Form'
import SocialMediaModal from '@/views/human-resource/employee/modal/SocialMediaModal'
import ContractModal from '@/views/human-resource/employee/modal/ContractModal'
import SalaryModal from '@/views/human-resource/employee/modal/SalaryModal'
import ScorerModal from '@/views/human-resource/employee/modal/ScorerModal'
import UploadModal from '@/views/human-resource/employee/modal/UploadModal'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    SocialMediaModal,
    ContractModal,
    SalaryModal,
    ScorerModal,
    UploadModal
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      isFailed: false,
      isAdditionalAddress: false,
      editIndex: -1,
      form: new Form({
        id: null,
        name: null,
        tax_identification_number: null,
        bpjs: null,
        emails: [{
          email: null
        }],
        addresses: [{
          address: null
        },
        {
          address: null
        }],
        phones: [{
          number: null
        }],
        birth_date: null,
        birth_place: '',
        personal_identity: '',
        last_education: '',
        gender: '',
        employee_marital_status_id: '',
        marital_status: '',
        married_with: '',
        religion: '',
        employee_group_id: '',
        employee_group_name: '',
        job_title: '',
        join_date: '',
        resign_date: '',
        code: '',
        status: '',
        job_location: '',
        daily_transport_allowance: 0,
        functional_allowance: 0,
        communication_allowance: 0,
        company_emails: [{
          email: null
        }],
        social_media: [],
        contracts: [],
        salary_histories: [],
        scorers: [],
        attachments: []
      })
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployee', ['employee']),
    ...mapGetters('humanResourceEmployeeReligion', ['religionList']),
    ...mapGetters('humanResourceEmployeeGender', ['genderList']),
    ...mapGetters('humanResourceEmployeeMaritalStatus', ['maritalStatusList']),
    ...mapGetters('humanResourceEmployeeStatus', ['statusList']),
    ...mapGetters('humanResourceEmployeeJobLocation', ['jobLocationList']),
    ...mapGetters('humanResourceEmployeeGroup', ['groupList']),
    ...mapGetters('masterUser', ['userList']),
    ...mapGetters('cloudStorage', ['cloudStorages', 'pagination'])
  },
  created () {
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
    this.getGroups()
      .then((response) => {
        console.log(response.data)
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
    this.getUser()
      .then((response) => {
        console.log(response.data)
      }, (error) => {
        console.log(JSON.stringify(error))
      })
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('humanResourceEmployee', ['find', 'update']),
    ...mapActions('humanResourceEmployeeReligion', {
      getReligions: 'get'
    }),
    ...mapActions('humanResourceEmployeeGender', {
      getGenders: 'get'
    }),
    ...mapActions('humanResourceEmployeeMaritalStatus', {
      getMaritalStatuses: 'get'
    }),
    ...mapActions('humanResourceEmployeeGroup', {
      getGroups: 'get'
    }),
    ...mapActions('humanResourceEmployeeStatus', {
      getStatuses: 'get'
    }),
    ...mapActions('humanResourceEmployeeJobLocation', {
      getJobLocations: 'get'
    }),
    ...mapActions('masterUser', {
      getUser: 'get'
    }),
    findEmployeeRequest () {
      this.find({
        id: this.form.id,
        params: {
          includes: 'addresses;phones;emails'
        }
      }).then(response => {
        this.form.id = this.employee.id
        this.form.name = this.employee.name
        this.form.tax_identification_number = this.employee.tax_identification_number
        this.form.bpjs = this.employee.bpjs
        if (this.employee.emails.length > 0) {
          this.form.emails[0].email = this.employee.emails[0].email
        }
        if (this.employee.addresses.length > 0) {
          this.form.addresses[0].address = this.employee.addresses[0].address
        }
        if (this.employee.addresses.length > 1) {
          this.form.addresses[1].address = this.employee.addresses[1].address
        }
        if (this.employee.phones.length > 0) {
          this.form.phones[0].number = this.employee.phones[0].number
        }
        this.form.birth_date = this.employee.birth_date
        this.form.birth_place = this.employee.birth_place
        this.form.personal_identity = this.employee.personal_identity
        this.form.last_education = this.employee.last_education
        this.form.employee_gender_id = this.employee.employee_gender_id
        this.form.employee_marital_status_id = this.employee.employee_marital_status_id
        this.form.marital_status = this.employee.marital_status
        this.form.married_with = this.employee.married_with
        this.form.employee_religion_id = this.employee.employee_religion_id
        this.form.employee_group_id = this.employee.employee_group_id
        this.form.employee_group_name = this.employee.employee_group_name
        this.form.job_title = this.employee.job_title
        this.form.join_date = this.employee.join_date
        this.form.resign_date = this.employee.resign_date
        this.form.code = this.employee.code
        this.form.employee_status_id = this.employee.employee_status_id
        this.form.employee_job_location_id = this.employee.employee_job_location_id
        this.form.daily_transport_allowance = this.employee.daily_transport_allowance
        this.form.functional_allowance = this.employee.functional_allowance
        this.form.communication_allowance = this.employee.communication_allowance
        if (this.employee.company_emails.length > 0) {
          this.form.company_emails[0].email = this.employee.company_emails[0].email
        }
        this.form.social_media = this.employee.social_media
        this.form.contracts = this.employee.contracts
        this.form.salary_histories = this.employee.salary_histories
        this.form.scorers = this.employee.scorers
        this.form.user_id = this.employee.user_id
        // this.form.attachments = this.employee.attachments
        // this.form.attachments = this.employee.attachments.forEach(attachment => {
        // })
      })
    },
    ...mapActions('cloudStorage', {
      getCloudStorage: 'get',
      updateCloudStorage: 'update',
      deleteCloudStorage: 'delete'
    }),
    onSubmitSocialMedia (data) {
      this.form.social_media.push(data)
      this.$refs.socialMedia.close()
    },
    removeSocialMedia (index) {
      this.form.social_media.splice(index, 1)
    },
    onSubmitContract (data) {
      this.form.contracts.push(data)
      this.$refs.contractModal.close()
    },
    removeContract (index) {
      this.form.contracts.splice(index, 1)
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
    updateNotes (cloudStorage) {
      this.updateCloudStorage({
        id: cloudStorage.id,
        key: cloudStorage.key,
        notes: cloudStorage.notes
      }).then(response => {
        this.editIndex = -1
      }).catch(error => {
        this.editIndex = -1
      })
    },
    getCloudStorageRequest () {
      this.isLoading = true
      this.getCloudStorage({
        params: {
          filter_equal: {
            feature: 'employee',
            feature_id: this.form.id
          },
          is_project_protected: true,
          sort_by: '-id'
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    attachmentUploaded (payload) {
      this.getCloudStorageRequest()
    },
    deleteAttachment (id, key) {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isSaving = true
        this.deleteCloudStorage({
          id: id,
          params: {
            key: key
          }
        }).then(response => {
          this.isSaving = false
          this.$alert.success('FILE DELETED')
          this.getCloudStorageRequest()
        }).catch(error => {
          this.isSaving = false
          this.$alert.error(error.message)
        })
      }).catch(error => {
        this.$alert.error(error.message)
      })
    },
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onSubmit () {
      this.isSaving = true
      this.form.attachments = this.cloudStorages
      this.form.attachments.forEach(attachment => {
        delete attachment.preview
      })
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$emit('updated', response.data)
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.isFailed = true
          if (typeof (error.errors) !== 'undefined') {
            this.form.errors.record(error.errors)
          }
        })
    },
    open (employee) {
      this.$refs.modal.open()
      this.form.id = employee.id
      this.findEmployeeRequest()
      this.getCloudStorageRequest()
      this.$nextTick(() => {
        this.$refs.name.setFocus()
      })
    },
    close () {
      this.$refs.modal.close()
    },
    handleEvent (e) {
      this.isAdditionalAddress = e
    }
  }
}
</script>

<style>
  h2 {
    line-height: 3;
  }
</style>
