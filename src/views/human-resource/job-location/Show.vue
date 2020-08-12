<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <router-link
        to="/human-resource/job-location"
        class="breadcrumb-item"
      >
        {{ $t('job location') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ jobLocation.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <button
            v-if="$permission.has('create employee')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addJobLocation.open()"
          >
            <span>{{ $t('create') | uppercase }}</span>
          </button>
          <button
            v-if="$permission.has('update employee')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.editJobLocation.open(jobLocation)"
          >
            {{ $t('edit') | uppercase }}
          </button>
          <button
            v-if="$permission.has('delete employee')"
            type="button"
            :disabled="isDeleting"
            class="btn btn-sm btn-outline-secondary"
            @click="onDelete()"
          >
            <i
              v-show="isDeleting"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('delete') | uppercase }}
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            v-model="jobLocation.name"
            label="Name"
            name="name"
            readonly
          />
          <p-form-row
            id="base-salary"
            name="base-salary"
            :label="$t('area value')"
            readonly
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-form-number
                id="base-salary"
                v-model="jobLocation.base_salary"
                name="base-salary"
                :is-text-right="false"
                :disabled="true"
                :label="$t('area value')"
              />
            </div>
          </p-form-row>
          <p-form-row
            id="multiplier-kpi"
            name="multiplier-kpi"
            :label="$t('multiplier kpi')"
            readonly
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-form-number
                id="multiplier-kpi"
                v-model="jobLocation.multiplier_kpi"
                name="multiplier-kpi"
                :is-text-right="false"
                :disabled="true"
                :label="$t('multiplier kpi')"
              />
            </div>
          </p-form-row>
        </p-block-inner>
      </p-block>
    </div>

    <m-add-job-location
      ref="addJobLocation"
      @added="onAddedJobLocation($event)"
    />
    <m-edit-job-location
      ref="editJobLocation"
      @updated="onUpdatedJobLocation($event)"
    />
  </div>
</template>

<script>
import TabMenu from '@/views/human-resource/TabMenu'

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
      isLoading: false,
      isDeleting: false,
      page: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployeeJobLocation', ['jobLocation'])
  },
  created () {
    this.findJobLocation()
  },
  methods: {
    ...mapActions('humanResourceEmployeeJobLocation', ['find', 'delete']),
    updatePage (value) {
      this.page = value
    },
    onAddedJobLocation (jobLocation) {
      this.$router.push('/human-resource/job-location/' + jobLocation.id)
      this.id = jobLocation.id
      this.findJobLocation()
    },
    onUpdatedJobLocation (jobLocation) {
      this.findJobLocation()
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$router.push('/human-resource/job-location')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this job location')
        })
      })
    },
    findJobLocation () {
      this.isLoading = true
      this.find({
        id: this.id
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  }
}
</script>
