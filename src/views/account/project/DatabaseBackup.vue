<template>
  <div>
    <h3>Database Backup</h3>
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
              slot="p-body">
              <th>{{ index + 1 }}</th>
              <td>{{ row.file_name }}</td>
              <td>{{ row.created_at | dateFormat('DD MMM YYYY') }}</td>
              <td><a :href="row.download_url">{{ row.download_url }}</a></td>
              <td><button @click="restoreDatabase()" class="btn-sm">Restore</button></td>
            </tr>
          </point-table>
        </template>
        <template v-else>
          There is no backup available
        </template>
        <button class="btn-sm" @click="createBackup" :disabled="isSaving">
          <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> Create new backup
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
  data () {
    return {
      isLoading: false,
      isSaving: false
    }
  },
  props: {
    code: {
      type: String
    }
  },
  computed: {
    ...mapGetters('databaseBackup', ['backups'])
  },
  methods: {
    ...mapActions('databaseBackup', ['get', 'create']),
    createBackup () {
      this.isSaving = true
      this.create({
        code: this.code
      }).then(response => {
        this.get({
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
  },
  created () {
    this.get({
      params: {
        code: this.code
      }
    })
  }
}
</script>
