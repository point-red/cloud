<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <router-link
        to="/human-resource/employee-status"
        class="breadcrumb-item">{{ $t('employee status') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ status.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('employee status')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-6">
              <p-table>
                <template slot="p-body">
                  <tr>
                    <td><span class="font-w700">{{ $t('name') | titlecase }}</span></td>
                    <td>{{ status.name }}</td>
                  </tr>
                </template>
              </p-table>
            </div>
            <div class="col-sm-12 mb-20">
              <hr>
              <router-link
                :to="{ path: '/human-resource/employee-status/' + status.id + '/edit', params: { id: status.id }}"
                v-if="$permission.has('update employee')"
                class="btn btn-sm btn-primary mr-5">
                Edit
              </router-link>
              <button
                type="button"
                @click="onDelete()"
                v-if="$permission.has('delete employee')"
                :disabled="isSaving"
                class="btn btn-sm btn-danger">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> Delete
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
    ...mapGetters('humanResourceEmployeeStatus', ['status', 'statuses'])
  },
  created () {
    this.isLoading = true
    this.findStatus({ id: this.id }).then((response) => {
      this.isLoading = false
    }, (error) => {
      console.log(JSON.stringify(error))
    })
  },
  methods: {
    ...mapActions('humanResourceEmployeeStatus', { findStatus: 'find', deleteStatus: 'delete' }),
    onDelete () {
      this.isSaving = true
      this.deleteStatus({ id: this.id })
        .then((response) => {
          this.isSaving = false
          this.$router.push('/human-resource/employee-status')
        }, (error) => {
          this.isSaving = false
          console.log(JSON.stringify(error))
        })
    }
  }
}
</script>
