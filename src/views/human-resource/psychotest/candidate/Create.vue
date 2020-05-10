<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-psychotest />
      <router-link
        to="/human-resource/psychotest/candidate"
        class="breadcrumb-item"
      >
        {{ "candidate" | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu />

    <form class="row" @submit.prevent="onSubmit">
      <p-block
        :is-loading="loading"
        :header="true"
        :title="$t('candidate') | titlecase"
        column="col-sm-12"
      >
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="name"
              :name="$t('name') | titlecase"
              label="name"
              v-model="form.name"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)"
            >
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="phone"
              name="phone"
              :label="$t('phone') | titlecase"
              v-model="form.phone"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('phone')"
              @errors="form.errors.set('phone', null)"
            >
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="position_id"
              :name="$t('position') | titlecase"
              label="position"
              v-model="form.position_id"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('position_id')"
              @errors="form.errors.set('position_id', null)"
            >
              <div slot="body" class="col-lg-9">
                <p-select
                  id="position_id"
                  name="position_id"
                  key-field="id"
                  label-field="position"
                  v-model="form.position_id"
                  :options="candidatePositions"
                  :errors="form.errors.get('position_id')"
                  @errors="form.errors.set('position_id', null)"
                />
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="level"
              :name="$t('level') | titlecase"
              label="level"
              v-model="form.level"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('level')"
              @errors="form.errors.set('level', null)"
            >
              <div slot="body" class="col-lg-9">
                <p-select
                  id="level"
                  name="level"
                  key-field="name"
                  label-field="name"
                  v-model="form.level"
                  :options="levels"
                  :errors="form.errors.get('level')"
                  @errors="form.errors.set('level', null)"
                />
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="ktp_number"
              name="ktp_number"
              :label="$t('ktp number') | titlecase"
              v-model="form.ktp_number"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('ktp_number')"
              @errors="form.errors.set('ktp_number', null)"
            >
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="place_of_birth"
              name="place_of_birth"
              :label="$t('place of birth') | titlecase"
              v-model="form.place_of_birth"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('place_of_birth')"
              @errors="form.errors.set('place_of_birth', null)"
            >
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="date_of_birth"
              name="date_of_birth"
              :label="$t('date of birth') | titlecase"
              v-model="form.date_of_birth"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('date_of_birth')"
              @errors="form.errors.set('date_of_birth', null)"
            >
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="sex"
              :name="$t('sex') | titlecase"
              label="Sex"
              v-model="form.sex"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('sex')"
              @errors="form.errors.set('sex', null)"
            >
              <div slot="body" class="col-lg-9">
                <p-select
                  id="sex"
                  name="sex"
                  key-field="name"
                  label-field="name"
                  v-model="form.sex"
                  :options="sexs"
                  :errors="form.errors.get('sex')"
                  @errors="form.errors.set('sex', null)"
                />
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="religion"
              :name="$t('religion') | titlecase"
              label="religion"
              v-model="form.religion"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('religion')"
              @errors="form.errors.set('religion', null)"
            >
              <div slot="body" class="col-lg-9">
                <p-select
                  id="religion"
                  name="religion"
                  key-field="name"
                  label-field="name"
                  v-model="form.religion"
                  :options="religions"
                  :errors="form.errors.get('religion')"
                  @errors="form.errors.set('religion', null)"
                />
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="marital_status"
              :name="$t('marital_status') | titlecase"
              label="marital status"
              v-model="form.marital_status"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('marital_status')"
              @errors="form.errors.set('marital_status', null)"
            >
              <div slot="body" class="col-lg-9">
                <p-select
                  id="marital_status"
                  name="marital_status"
                  key-field="name"
                  label-field="name"
                  v-model="form.marital_status"
                  :options="maritalStatuses"
                  :errors="form.errors.get('marital_status')"
                  @errors="form.errors.set('marital_status', null)"
                />
              </div>
            </p-form-row>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-12">
            <button
              :disabled="loadingSaveButton"
              type="submit"
              class="btn btn-sm btn-primary"
            >
              <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin" />
              Save
            </button>
          </div>
        </div>
      </p-block>
    </form>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import BreadcrumbPsychotest from '@/views/human-resource/psychotest/Breadcrumb'
import Form from '@/utils/Form'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource,
    BreadcrumbPsychotest
  },
  data () {
    return {
      loading: false,
      loadingSaveButton: false,
      form: new Form({
        name: '',
        phone: '',
        position_id: null,
        is_password_used: false,
        is_kraepelin_started: false,
        is_kraepelin_finished: false,
        is_papikostick_started: false,
        current_papikostick_index: 0,
        is_papikostick_finished: false,
        level: '',
        ktp_number: '',
        place_of_birth: '',
        date_of_birth: '',
        sex: '',
        religion: '',
        marital_status: ''
      }),
      levels: [
        { name: 'Staff' },
        { name: 'Supervisor' },
        { name: 'Manager' },
        { name: 'Direktur' }
      ],
      sexs: [{ name: 'Laki-laki' }, { name: 'Perempuan' }],
      religions: [
        { name: 'Islam' },
        { name: 'Kristen' },
        { name: 'Katolik' },
        { name: 'Hindu' },
        { name: 'Budha' },
        { name: 'Konhucu' },
        { name: 'Lainnya' }
      ],
      maritalStatuses: [{ name: 'Menikah' }, { name: 'Belum Menikah' }]
    }
  },
  computed: {
    ...mapState('humanResourcePsychotestCandidatePosition', [
      'candidatePositions'
    ])
  },
  async mounted () {
    await this.getCandidatePositions()
  },
  methods: {
    ...mapActions('humanResourcePsychotestCandidatePosition', {
      getCandidatePositions: 'get'
    }),
    ...mapActions('humanResourcePsychotestCandidate', {
      createCandidate: 'create'
    }),
    onSubmit () {
      this.loadingSaveButton = true
      this.createCandidate(this.form).then(
        response => {
          this.loadingSaveButton = false
          this.$notification.success('Create success')
          this.$router.push(
            '/human-resource/psychotest/candidate/' + response.data.id
          )
        },
        error => {
          this.loadingSaveButton = false
          this.$notification.error('Create failed', error.message)
          this.form.errors.record(error.errors)
        }
      )
    }
  }
}
</script>
