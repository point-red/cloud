<template>
  <div>
    <h5>Database Backup</h5>
    <p-block-inner>
      <template v-if="backups && backups.length > 0">
        <point-table>
          <tr slot="p-head">
            <th>#</th>
            <th>File Name</th>
            <th>Created At</th>
            <th>Download URL</th>
          </tr>
          <tr
            v-for="(row, index) in backups"
            :key="index"
            slot="p-body"
          >
            <th>{{ index + 1 }}</th>
            <td>{{ row.file_name }}</td>
            <td>{{ row.created_at | dateFormat('DD MMM YYYY') }}</td>
            <td><a :href="row.download_url">{{ row.download_url }}</a></td>
            <td>
              <button
                class="btn-sm"
                @click="restoreDatabase()"
              >
                Restore
              </button>
            </td>
          </tr>
        </point-table>
      </template>
      <template v-else>
        There is no backup available
      </template>
      <button
        class="btn-sm"
        :disabled="isSaving"
        @click="createBackup"
      >
        <i
          v-show="isSaving"
          class="fa fa-asterisk fa-spin"
        /> Create new backup
      </button>
    </p-block-inner>
  </div>
</template>

<script>
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PointTable
  },
  props: {
    code: {
      type: String,
      default: ''
    },
    projectId: {
      type: [String, Number],
      default: null
    }
  },
  data () {
    return {
      id: this.projectId,
      isLoading: false,
      isSaving: false
    }
  },
  computed: {
    ...mapGetters('accountProjectDatabaseBackup', ['backups'])
  },
  watch: {
    projectId () {
      this.id = this.projectId
    }
  },
  created () {
    this.get({
      id: this.id,
      params: {
        code: this.code
      }
    })
  },
  methods: {
    ...mapActions('accountProjectDatabaseBackup', ['get', 'create']),
    createBackup () {
      this.isSaving = true
      this.create({
        id: this.id,
        code: this.code
      }).then(response => {
        this.get({
          id: this.id,
          params: {
            code: this.code
          }
        }).then(response => {
          this.isSaving = false
        })
      }).catch(error => {
        this.isSaving = false
        this.$notification.error(error.message)
      })
    },
    restoreDatabase () {
      this.$notification.error('This feature not available under beta version')
    }
  }
}
</script>
