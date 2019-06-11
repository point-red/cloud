<template>
  <div>
    <p-loading-block :message="loadingMessage" v-show="isLoading"/>
    <breadcrumb>
      <router-link to="/account/project" class="breadcrumb-item">Project</router-link>
      <span class="breadcrumb-item active">{{ project.code | uppercase }}</span>
    </breadcrumb>

    <tab-menu>
      <li class="nav-item">
        <router-link
          :to="'/account/project/' + id"
          exact
          class="nav-link"
          active-class="active">
          <span>Project</span>
        </router-link>
      </li>
    </tab-menu>

    <project-widget :project="project"></project-widget>

    <hr>    

    <div class="row">
      <p-block column="col-sm-3">
        <div class="row">
          <div class="col text-center">
            <button class="btn btn-primary btn-sm"><i class="fa fa-database"></i> BACKUP</button>
          </div>
          <div class="col text-center">
            <button class="btn btn-primary btn-sm"><i class="fa fa-archive"></i> RESTORE</button>
          </div>
        </div>
        <hr>
        <h3>Tables</h3>
        <point-table>
          <tr slot="p-body" v-for="(table, index) in tables" :key="index">
            <td>
              <a href="javascript:void(0)" @click="chooseTable(table)">{{ table }}</a>
            </td>
          </tr>
        </point-table>
      </p-block>
      <p-block column="col-sm-9">
        <template>
          <h3>Rows</h3>
          <p-block-inner :is-loading="isLoading" v-if="rows && rows.length > 0">
            <point-table>
              <tr slot="p-head">
                <th>#</th>
                <th v-for="(row, index) in Object.keys(rows[0])" :key="index">
                  {{ row }}
                </th>
              </tr>
              <tr
                v-for="(row, index) in rows"
                :key="index"
                slot="p-body">
                <th>{{ index + 1 }}</th>
                <td v-for="(col, index2) in row" :key="index + '-' + index2">{{ col }}</td>
              </tr>            
            </point-table>
          </p-block-inner>
          <p-block-inner :is-loading="isLoading" v-else-if="!isLoading">
            There is no data for table "{{ tableName }}"
          </p-block-inner>
        </template>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import TabMenu from './TabMenu'
import ProjectWidget from './Widget'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      loadingMessage: 'Loading',
      tableName: this.$route.query.table_name,
      projectCode: this.$route.query.project_code
    }
  },
  components: {
    Breadcrumb,
    TabMenu,
    ProjectWidget,
    PointTable
  },
  computed: {
    ...mapGetters('accountProject', ['project']),
    ...mapGetters('databaseTable', ['tables', 'rows'])
  },
  created () {
    this.isLoading = true

    this.findProject({ id: this.id })
      .then(response => {
        this.isLoading = false
        this.projectCode = response.data.code
        this.getTable({
          params: {
            project_code: this.projectCode
          }
        })
        this.getRows({
          params: {
            project_code: this.projectCode,
            table_name: this.tableName
          }
        })
      }).catch(error => {
        this.$router.replace('/account/whoops')
        this.isLoading = false
        this.$notification.error(error.message)
      })
  },
  methods: {
    ...mapActions('accountProject', {
      findProject: 'find'
    }),
    ...mapActions('databaseTable', {
      getTable: 'get',
      getRows: 'show'
    }),
    chooseTable(table) {
      this.isLoading = true
      this.tableName = table
      this.$router.push({
        query: {
          ...this.$route.query,
          project_code: this.projectCode,
          table_name: table
        }
      })
      this.getRows({
        params: {
          project_code: this.projectCode,
          table_name: table
        }
      })
      this.isLoading = false
    }
  }
}
</script>
