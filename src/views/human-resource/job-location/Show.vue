<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <router-link to="/human-resource/job-location" class="breadcrumb-item">{{ $t('job location') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ jobLocation.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('job location')" :header="true">
        <p-block-inner :is-loading="loading">
          <div class="row">
            <div class="col-sm-6">
              <p-table>
                <template slot="p-body">
                  <tr>
                    <td><span class="font-w700">{{ $t('name') | titlecase }}</span></td>
                    <td>{{ jobLocation.name }}</td>
                  </tr>
                  <tr>
                    <td><span class="font-w700">{{ $t('base salary') | titlecase }}</span></td>
                    <td>{{ jobLocation.base_salary | numberFormat }}</td>
                  </tr>
                  <tr>
                    <td><span class="font-w700">{{ $t('multiplier kpi') | titlecase }}</span></td>
                    <td>{{ jobLocation.multiplier_kpi | numberFormat }}</td>
                  </tr>
                </template>
              </p-table>
            </div>
            <div class="col-sm-12 mb-20">
              <hr>
              <router-link
                :to="{ path: '/human-resource/job-location/' + jobLocation.id + '/edit', params: { id: jobLocation.id }}"
                v-if="$permission.has('update employee')"
                class="btn btn-sm btn-primary mr-5">
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
      loading: false,
      loadingSaveButton: false
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployeeJobLocation', ['jobLocation', 'jobLocations'])
  },
  created () {
    this.loading = true
    this.findJobLocation({ id: this.id }).then((response) => {
      this.loading = false
    }, (error) => {
      console.log(JSON.stringify(error))
    })
  },
  methods: {
    ...mapActions('humanResourceEmployeeJobLocation', { findJobLocation: 'find', deleteJobLocation: 'delete' }),
    onDelete () {
      this.loadingSaveButton = true
      this.deleteJobLocation({ id: this.id })
        .then((response) => {
          this.loadingSaveButton = false
          this.$router.push('/human-resource/job-location')
        }, (error) => {
          this.loadingSaveButton = false
          console.log(JSON.stringify(error))
        })
    }
  }
}
</script>
