<template>
  <div>
    <p-loading-block
      v-show="isLoading"
      :message="loadingMessage"
    />
    <breadcrumb>
      <router-link
        to="/account/project"
        class="breadcrumb-item"
      >
        {{ $t('project') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ project.code | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <project-widget :project="project" />

    <hr>

    <div class="row">
      <p-block column="col-sm-3">
        <div class="row">
          <div class="col text-center">
            <button
              v-if="content == 'storage'"
              class="btn btn-primary btn-sm"
              @click="content = 'backup'"
            >
              <i class="fa fa-database" /> BACKUP & RESTORE
            </button>
            <hr v-if="content == 'storage'">
            <button
              v-if="content == 'storage'"
              class="btn btn-danger btn-sm"
              @click="reset()"
            >
              <i class="fa fa-database" /> RESET
            </button>
            <button
              v-if="content == 'backup'"
              class="btn btn-primary btn-sm"
              @click="content = 'storage'"
            >
              <i class="fa fa-database" /> MY DATABASE
            </button>
          </div>
        </div>
        <hr>
        <h5 v-show="content == 'storage'">
          Tables
        </h5>
        <point-table v-show="content == 'storage'">
          <tr
            v-for="(table, index) in tables"
            slot="p-body"
            :key="index"
          >
            <td>
              <a
                href="javascript:void(0)"
                @click="chooseTable(table)"
              >{{ table }}</a>
            </td>
          </tr>
        </point-table>
      </p-block>
      <p-block column="col-sm-9">
        <database-storage
          v-if="content == 'storage'"
          :data="rows"
          :table-name="tableName"
          :is-loading="isLoading"
          :project-id="id"
        />
        <database-backup
          v-if="content == 'backup'"
          :project-id="id"
        />
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import TabMenu from './TabMenu'
import ProjectWidget from './Widget'
import PointTable from 'point-table-vue'
import DatabaseStorage from './DatabaseStorage'
import DatabaseBackup from './DatabaseBackup'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    TabMenu,
    ProjectWidget,
    PointTable,
    DatabaseStorage,
    DatabaseBackup
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      loadingMessage: 'Loading',
      tableName: this.$route.query.table_name,
      content: 'storage' // should be 'storage' or 'backup'
    }
  },
  computed: {
    ...mapGetters('accountProject', ['project']),
    ...mapGetters('accountProjectDatabaseTable', ['tables', 'rows'])
  },
  created () {
    this.isLoading = true

    this.findProject({ id: this.id })
      .then(response => {
        this.isLoading = false
        this.getTable({
          id: this.id
        })
        if (this.tableName) {
          this.getRows({
            id: this.id,
            params: {
              table_name: this.tableName
            }
          })
        }
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
  },
  methods: {
    ...mapActions('accountProject', {
      findProject: 'find'
    }),
    ...mapActions('accountProjectDatabaseTable', {
      getTable: 'get',
      getRows: 'show'
    }),
    ...mapActions('accountProjectDatabaseReset', {
      resetDatabase: 'reset'
    }),
    chooseTable (table) {
      this.isLoading = true
      this.loadingMessage = 'Loading'
      this.tableName = table
      this.$router.push({
        query: {
          ...this.$route.query,
          table_name: table
        }
      })
      if (this.tableName) {
        this.getRows({
          id: this.id,
          params: {
            table_name: table
          }
        })
      }
      this.isLoading = false
    },
    reset () {
      this.$swal.fire({
        title: 'Reset Database',
        text: 'The will delete your current database and create new one',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, reset it!'
      }).then((result) => {
        this.isLoading = true
        this.loadingMessage = 'Loading.. (This may take some time)'
        if (result.value) {
          this.resetDatabase({
            id: this.id
          }).then(response => {
            this.isLoading = false
            this.$swal.fire('Finish', 'Your database has been reset.', 'success')
          }).catch(error => {
            this.isLoading = false
          })
        }
      })
    }
  }
}
</script>
