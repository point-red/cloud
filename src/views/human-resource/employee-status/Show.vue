<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <router-link
        to="/human-resource/employee-status"
        class="breadcrumb-item"
      >
        {{ $t('employment contract') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ status.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <button
            v-if="$permission.has('create employee')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addEmployeeStatus.open()"
          >
            <span>{{ $t('create') | uppercase }}</span>
          </button>
          <button
            v-if="$permission.has('update employee')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.editEmployeeStatus.open(status)"
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
            v-model="status.name"
            label="Name"
            name="name"
            readonly
          />
        </p-block-inner>
      </p-block>
    </div>

    <m-add-employee-status
      ref="addEmployeeStatus"
      @added="onAddedEmployeeStatus($event)"
    />
    <m-edit-employee-status
      ref="editEmployeeStatus"
      @updated="onUpdatedEmployeeStatus($event)"
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
    ...mapGetters('humanResourceEmployeeStatus', ['status'])
  },
  created () {
    this.findEmployeeStatus()
  },
  methods: {
    ...mapActions('humanResourceEmployeeStatus', ['find', 'delete']),
    updatePage (value) {
      this.page = value
    },
    onAddedEmployeeStatus (status) {
      this.$router.push('/human-resource/employee-status/' + status.id)
      this.id = status.id
      this.findEmployeeStatus()
    },
    onUpdatedEmployeeStatus (status) {
      this.findEmployeeStatus()
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$router.push('/human-resource/employee-status')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this employee')
        })
      })
    },
    findEmployeeStatus () {
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
