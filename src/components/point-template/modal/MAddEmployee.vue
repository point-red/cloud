<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="$t('employee information') | uppercase"
      overlay-theme="dark"
      width="100%"
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
              :errors="form.errors.get('name')"
              :label="$t('name')"
              name="name"
              @errors="form.errors.set('name', null)"
            />

            <p-form-row
              id="personal-identity"
              v-model="form.personal_identity"
              :disabled="isSaving"
              :errors="form.errors.get('personal_identity')"
              :label="$t('personal id')"
              name="personal-identity"
              @errors="form.errors.set('personal_identity', null)"
            />

            <p-form-row
              id="tax_identification_number"
              v-model="form.tax_identification_number"
              :disabled="isSaving"
              :errors="form.errors.get('tax_identification_number')"
              :label="$t('npwp')"
              name="tax_identification_number"
              @errors="form.errors.set('tax_identification_number', null)"
            />

            <p-form-row
              id="bpjs"
              v-model="form.bpjs"
              :disabled="isSaving"
              :errors="form.errors.get('bpjs')"
              :label="$t('bpjs')"
              name="bpjs"
              @errors="form.errors.set('bpjs', null)"
            />

            <p-form-row
              id="email"
              v-model="form.emails[0].email"
              :disabled="isSaving"
              :errors="form.errors.get('email')"
              :label="$t('email')"
              name="email"
              @errors="form.errors.set('email', null)"
            />

            <p-form-row
              id="address"
              v-model="form.addresses[0].address"
              :disabled="isSaving"
              :errors="form.errors.get('address')"
              :icon="'fa-plus'"
              :icon-event="isAdditionalAddress"
              :label="$t('address')"
              name="address"
              @errors="form.errors.set('address', null)"
              @handleEvent="handleEvent($event)"
            />

            <p-form-row
              v-show="isAdditionalAddress"
              id="address"
              v-model="form.addresses[1].address"
              :disabled="isSaving"
              :errors="form.errors.get('address')"
              name="address"
              @errors="form.errors.set('address', null)"
            />

            <p-form-row
              id="phone"
              v-model="form.phones[0].number"
              :disabled="isSaving"
              :errors="form.errors.get('phone')"
              :label="$t('phone')"
              name="phone"
              @errors="form.errors.set('phone', null)"
            />

            <p-form-row
              id="last-education"
              v-model="form.last_education"
              :disabled="isSaving"
              :errors="form.errors.get('last_education')"
              :label="$t('last education')"
              name="last-education"
              @errors="form.errors.set('last_education', null)"
            />

            <p-form-row
              id="birth-date"
              :label="$t('birth date')"
              name="birth-date"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-date-picker
                  id="birth-date"
                  v-model="form.birth_date"
                  :errors="form.errors.get('birth_date')"
                  label="Birth Date"
                  name="birth-date"
                  @errors="form.errors.set('birth_date', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="birth-place"
              v-model="form.birth_place"
              :disabled="isSaving"
              :errors="form.errors.get('birth_place')"
              :label="$t('birth place')"
              name="birth-place"
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
                  :disabled="isSaving"
                  class="btn btn-sm btn-secondary mb-15"
                  type="button"
                  @click="$refs.socialMedia.open()"
                >
                  <i class="fa fa-plus" /> {{ $t('social media') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head" />
                  <tr
                    v-for="(socialMedia, index) in form.social_media"
                    :key="socialMedia.index"
                    slot="p-body"
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
              :label="$t('gender')"
              name="gender"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-select
                  id="gender"
                  v-model="form.employee_gender_id"
                  :disabled="isSaving"
                  :errors="form.errors.get('employee_gender_id')"
                  :options="genderList"
                  name="gender"
                  @errors="form.errors.set('employee_gender_id', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="marital-status"
              :label="$t('marital status')"
              name="marital-status"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-select
                  id="marital-status"
                  v-model="form.employee_marital_status_id"
                  :errors="form.errors.get('employee_marital_status_id')"
                  :options="maritalStatusList"
                  name="maritalStatus"
                  @errors="form.errors.set('employee_marital_status_id', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              v-if="form.employee_marital_status_id == 2"
              id="married-with"
              v-model="form.married_with"
              :disabled="isSaving"
              :errors="form.errors.get('married_with')"
              :label="$t('married with')"
              name="married-with"
              @errors="form.errors.set('married_with', null)"
            />

            <p-form-row
              id="religion"
              :label="$t('religion')"
              name="religion"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-select
                  id="religion"
                  v-model="form.employee_religion_id"
                  :errors="form.errors.get('employee_religion_id')"
                  :options="religionList"
                  name="religion"
                  @errors="form.errors.set('employee_religion_id', null)"
                />
              </div>
            </p-form-row>

            <p-separator />

            <h5>{{ $t('job information') | uppercase }}</h5>
            <hr>
            <p-form-row
              id="group"
              :label="$t('department')"
              name="group"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-select
                  id="employee-group"
                  v-model="form.employee_group_id"
                  :errors="form.errors.get('employee_group_id')"
                  :options="groupList"
                  name="employee-group"
                  @errors="form.errors.set('employee_group_id', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="code"
              v-model="form.code"
              :disabled="isSaving"
              :errors="form.errors.get('code')"
              :label="$t('employee code')"
              name="code"
              @errors="form.errors.set('code', null)"
            />

            <p-form-row
              id="job-title"
              v-model="form.job_title"
              :disabled="isSaving"
              :errors="form.errors.get('job_title')"
              :label="$t('job title')"
              name="job-title"
              @errors="form.errors.set('job_title', null)"
            />

            <p-form-row
              id="job-location"
              :label="$t('job location')"
              name="job-location"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-select
                  id="job-location"
                  v-model="form.employee_job_location_id"
                  :errors="form.errors.get('employee_job_location_id')"
                  :options="jobLocationList"
                  name="employee-job-location"
                  @errors="form.errors.set('employee_job_location_id', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="join-date"
              :label="$t('join date')"
              name="join-date"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-date-picker
                  id="join-date"
                  v-model="form.join_date"
                  :errors="form.errors.get('join_date')"
                  label="join date"
                  name="join-date"
                  type="date"
                  @errors="form.errors.set('join_date', null)"
                />
              </div>
            </p-form-row>

            <!-- Resign Date -->
            <p-form-row
              id="resign-date"
              :label="$t('resign date')"
              name="resign-date"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-date-picker
                  id="resign-date"
                  v-model="form.resign_date"
                  :errors="form.errors.get('resign_date')"
                  label="resign date"
                  name="resign-date"
                  type="date"
                  @errors="form.errors.set('resign_date', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="status"
              :label="$t('status')"
              name="status"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-select
                  id="status"
                  v-model="form.employee_status_id"
                  :errors="form.errors.get('employee_status_id')"
                  :options="statusList"
                  name="status"
                  @errors="form.errors.set('employee_status_id', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="company_email"
              v-model="form.company_emails[0].email"
              :disabled="isSaving"
              :errors="form.errors.get('company_email')"
              :label="$t('company email')"
              name="company_email"
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
                  :disabled="isSaving || form.employee_status_id == 2"
                  class="btn btn-sm btn-secondary mb-15"
                  type="button"
                  @click="$refs.contractModal.open()"
                >
                  <i class="fa fa-plus" /> {{ $t('contract period') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head" />
                  <tr
                    v-for="(contract, index) in form.contracts"
                    :key="contract.index"
                    slot="p-body"
                  >
                    <td>{{ contract.contract_begin | dateFormat('DD MMM YYYY') }}</td>
                    <td>{{ contract.contract_end | dateFormat('DD MMM YYYY') }}</td>
                    <td>{{ contract.contract_due_date | dateFormat('DD MMM YYYY') }}</td>
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
              id="reviewer"
              :label="$t('employee reviewer')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <button
                  :disabled="isSaving"
                  class="btn btn-sm btn-secondary mb-15"
                  type="button"
                  @click="$refs.reviewerModal.open()"
                >
                  <i class="fa fa-plus" /> {{ $t('employee reviewer') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head" />
                  <tr
                    v-for="(reviewer, index) in form.reviewers"
                    :key="index"
                    slot="p-body"
                  >
                    <td>{{ reviewer.name }}</td>
                    <td class="text-right">
                      <i
                        class="fa fa-close"
                        @click="removeReviewer(index)"
                      />
                    </td>
                  </tr>
                </p-table>
              </div>
            </p-form-row>

            <p-form-row
              v-if="form.employee_status_id == 2"
              id="reason_ended_contract"
              v-model="form.reason_ended_contract"
              :disabled="isSaving || form.employee_status_id != 2"
              :errors="form.errors.get('reason_ended_contract')"
              :label="$t('reason ended contract')"
              name="reason_ended_contract"
              @errors="form.errors.set('reason_ended_contract', null)"
            />

            <p-form-row
              id="salary"
              :label="$t('salary history')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <button
                  :disabled="isSaving"
                  class="btn btn-sm btn-secondary mb-15"
                  type="button"
                  @click="$refs.salaryModal.open()"
                >
                  <i class="fa fa-plus" /> {{ $t('salary history') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head" />
                  <tr
                    v-for="(salary, index) in form.salary_histories"
                    :key="salary.index"
                    slot="p-body"
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
                  :disabled="isSaving"
                  class="btn btn-sm btn-secondary mb-15"
                  type="button"
                  @click="$refs.scorerModal.open()"
                >
                  <i class="fa fa-plus" /> {{ $t('employee assessor') | titlecase }}
                </button>
                <p-table>
                  <tr slot="p-head" />
                  <tr
                    v-for="(scorer, index) in form.scorers"
                    :key="index"
                    slot="p-body"
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
              :label="$t('user account')"
              name="user-account"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-select
                  id="user-account"
                  v-model="form.user_id"
                  :errors="form.errors.get('user_id')"
                  :options="userList2"
                  name="user-account"
                  @errors="form.errors.set('user_id', null)"
                />
              </div>
            </p-form-row>
            <p-separator />
            <h5>{{ $t('allowance') | uppercase }}</h5>
            <hr>
            <p-form-row
              id="daily-transport-allowance"
              :label="$t('transport allowance (daily)')"
              name="daily-transport-allowance"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-number
                  v-model="form.daily_transport_allowance"
                  :disabled="isSaving"
                  :errors="form.errors.get('daily_transport_allowance')"
                  :is-text-right="false"
                  @errors="form.errors.set('daily_transport_allowance', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="functional-allowance"
              :label="$t('functional allowance (monthly)')"
              name="functional-allowance"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-number
                  v-model="form.functional_allowance"
                  :disabled="isSaving"
                  :errors="form.errors.get('functional_allowance')"
                  :is-text-right="false"
                  @errors="form.errors.set('functional_allowance', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="communication-allowance"
              :label="$t('communication allowance (monthly)')"
              name="communication-allowance"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-number
                  v-model="form.communication_allowance"
                  :disabled="isSaving"
                  :errors="form.errors.get('communication_allowance')"
                  :is-text-right="false"
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
        :disabled="isSaving"
        class="btn btn-sm btn-outline-primary"
        type="button"
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
                :style="'background-image: url(' + cloudStorage.preview + '); height: 130px'"
                class="block-content block-content-full bg-image"
              />
              <div
                v-else
                :style="'height: 130px'"
                class="block-content block-content-full bg-image"
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
                  class="form-control"
                  type="text"
                >
              </div>
              <div class="p-10">
                <a
                  v-if="editIndex != index"
                  class="mr-15 btn btn-sm btn-outline-primary"
                  href="javascript:void(0)"
                  @click="editIndex = index"
                ><i class="fa fa-pencil" /></a>
                <a
                  v-if="editIndex == index"
                  class="mr-15 btn btn-sm btn-outline-primary"
                  href="javascript:void(0)"
                  @click="updateNotes(cloudStorage)"
                >{{ $t('update') | uppercase }}</a>
                <a
                  :href="cloudStorage.download_url"
                  class="mr-15 btn btn-sm btn-outline-primary"
                ><i class="fa fa-download" /></a>
                <a
                  class="btn btn-sm btn-outline-danger"
                  href="javascript:void(0)"
                  @click="deleteAttachment(cloudStorage.id, cloudStorage.key)"
                ><i class="fa fa-trash" /></a>
              </div>
            </div>
          </div>
        </div>
      </p-block-inner>
      <div class="pull-right">
        <button
          :disabled="isSaving"
          class="btn btn-sm btn-primary"
          type="submit"
          @click="onSubmit"
        >
          <i
            v-show="isSaving"
            class="fa fa-asterisk fa-spin"
          /> {{ $t('save') | uppercase }}
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

    <reviewer-modal
      id="reviewer"
      ref="reviewerModal"
      title="Reviewer"
      @add="onSubmitReviewer"
    />

    <upload-modal
      id="file"
      ref="uploadModal"
      :expiration-day="0"
      :is-user-protected="true"
      feature="employee"
      form-ref="uploadForm"
      title="Upload"
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
import { mapActions, mapGetters } from 'vuex'
import ReviewerModal from '@/views/human-resource/employee/modal/ReviewerModal.vue'

export default {
  components: {
    ReviewerModal,
    SocialMediaModal,
    ContractModal,
    SalaryModal,
    ScorerModal,
    UploadModal
  },
  data () {
    const baseURL = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`
    return {
      isSaving: false,
      isLoading: false,
      isFailed: false,
      isAdditionalAddress: false,
      editIndex: -1,
      users: [],
      form: new Form({
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
        attachments: [],
        reviewers: [],
        due_date_callback_url: `${baseURL}/human-resource/employee/`,
        reason_ended_contract: ''
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
    ...mapGetters('masterUser', ['userList2']),
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
    this.getUser({
      params: {
        sort_by: 'name',
        limit: 5000
      }
    })
      .then((response) => {
        const array = []
        response.data.forEach(element => {
          array.push({
            id: element.id,
            label: element.name
          })
        })
        this.users = array
        this.userList2 = response.data
        console.log(response.data)
      }, (error) => {
        console.log(JSON.stringify(error))
      })
  },
  mounted () {
    this.getUser({
      params: {
        sort_by: 'name',
        limit: 5000
      }
    })
      .then((response) => {
        const array = []
        response.data.forEach(element => {
          array.push({
            id: element.id,
            label: element.name
          })
        })
        this.users = array
        this.userList2 = response.data
        console.log(response.data)
      }, (error) => {
        console.log(JSON.stringify(error))
      })
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('humanResourceEmployee', ['create']),
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
      getUser: 'get2'
    }),
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
    onSubmitReviewer (data) {
      this.form.reviewers.push(data)
      this.$refs.reviewerModal.close()
    },
    removeReviewer (index) {
      this.form.reviewers.splice(index, 1)
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
            is_user_protected: true,
            feature: 'employee'
          },
          is_project_protected: true,
          sort_by: '-id',
          filter_null: 'feature_id'
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
      this.create(this.form)
        .then(response => {
          const employeeStatusId = this.form.employee_status_id
          const path = `/human-resource/employee?statusId=${employeeStatusId}`
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$emit('added', response.data)
          const url = new URL(path, window.location.origin)
          window.location.href = url.toString()
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.isFailed = true
          this.form.errors.record(error.errors)
        })
    },
    open () {
      this.$refs.modal.open()
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
