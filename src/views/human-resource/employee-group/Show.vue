<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <router-link to="/human-resource/employee-group" class="breadcrumb-item">{{ $t('employee group') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ group.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
        <div class="text-right">
          <button
            type="button"
            @click="$refs.addEmployeeGroup.open()"
            v-if="$permission.has('create employee')"
            class="btn btn-sm btn-outline-secondary mr-5">
            <span>{{ $t('create') | uppercase }}</span>
          </button>
          <button
            type="button"
            @click="$refs.editEmployeeGroup.open(group)"
            v-if="$permission.has('update employee')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('edit') | uppercase }}
          </button>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete employee')"
            :disabled="isDeleting"
            class="btn btn-sm btn-outline-secondary">
            <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> {{ $t('delete') | uppercase }}
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            label="Name"
            name="name"
            v-model="group.name"
            readonly/>
        </p-block-inner>
      </p-block>
    </div>

    <m-add-employee-group ref="addEmployeeGroup" @added="onAddedEmployeeGroup($event)"></m-add-employee-group>
    <m-edit-employee-group ref="editEmployeeGroup" @updated="onUpdatedEmployeeGroup($event)"></m-edit-employee-group>
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
      isDeleting: false,
      page: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployeeGroup', ['group'])
  },
  methods: {
    ...mapActions('humanResourceEmployeeGroup', ['find', 'delete']),
    updatePage (value) {
      this.page = value
    },
    onAddedEmployeeGroup (group) {
      this.$router.push('/human-resource/employee-group/' + group.id)
      this.id = group.id
      this.findEmployeeGroup()
    },
    onUpdatedEmployeeGroup (group) {
      this.findEmployeeGroup()
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$router.push('/human-resource/employee-group')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this employee')
        })
      })
    },
    findEmployeeGroup () {
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
  },
  created () {
    this.findEmployeeGroup()
  }
}
</script>
