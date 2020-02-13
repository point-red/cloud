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
        <p-block-inner :is-loading="isLoading">
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
                {{ $t('edit') | uppercase }}
              </router-link>
              <button
                type="button"
                @click="onDelete()"
                v-if="$permission.has('delete employee')"
                :disabled="isSaving"
                class="btn btn-sm btn-danger">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('delete') | uppercase }}
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
      isLoading: false,
      isSaving: false
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployeeJobLocation', ['jobLocation', 'jobLocations'])
  },
  created () {
    this.isLoading = true
    this.findJobLocation({ id: this.id }).then((response) => {
      this.isLoading = false
    }, (error) => {
      console.log(JSON.stringify(error))
    })
  },
  methods: {
    ...mapActions('humanResourceEmployeeJobLocation', { findJobLocation: 'find', deleteJobLocation: 'delete' }),
    onDelete () {
      this.isSaving = true
      this.deleteJobLocation({ id: this.id })
        .then((response) => {
          this.isSaving = false
          this.$router.push('/human-resource/job-location')
        }, (error) => {
          this.isSaving = false
          console.log(JSON.stringify(error))
        })
    }
  }
}
</script>
