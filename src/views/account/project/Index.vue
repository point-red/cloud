<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">{{ $t('project') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block mb-5">
          <router-link
            to="/account/project/create"
            class="input-group-prepend"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </router-link>
          <p-form-input
            id="search-text"
            ref="searchText"
            name="search-text"
            placeholder="Search"
            :value="searchText"
            class="btn-block"
            @input="filterSearch"
          />
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-table>
            <tr slot="p-head">
              <th>Company Id</th>
              <th>project name</th>
              <th class="text-center">
                Max User
              </th>
              <th>Expired Date</th>
              <th />
            </tr>
            <tr
              v-for="(project, index) in projects"
              :key="index"
              slot="p-body"
            >
              <td>{{ project.code | uppercase }}</td>
              <td>
                <template v-if="project.owner_id === userId">
                  <router-link :to="{ path: '/account/project/' + project.id, params: { id: project.id }}">
                    {{ project.name }}
                  </router-link>
                </template>
                <template v-else>
                  {{ project.name }}
                </template>
              </td>
              <td class="text-center">
                {{ project.total_user | uppercase }}
              </td>
              <td>{{ project.expired_date | dateFormat('DD MMMM YYYY') }}</td>
              <td class="text-right">
                <template v-if="project.joined == false && project.request_join_at == null">
                  <button
                    type="button"
                    class="btn btn-sm btn-secondary"
                    :disabled="isSaving"
                    @click="joinProject(index)"
                  >
                    <i
                      v-show="isSaving"
                      class="fa fa-asterisk fa-spin"
                    />
                    <i
                      v-show="!isSaving"
                      class="fa fa-check-circle-o"
                    /> Join
                  </button>
                </template>
                <template v-if="project.joined == false && project.request_join_at != null && project.owner_id == userId">
                  <a
                    class="btn btn-sm btn-secondary"
                    href="javascript:void(0)"
                  >
                    <i class="fa fa-users" /> Pending Request
                  </a>
                </template>
                <template v-if="project.joined == false && project.request_join_at != null && project.owner_id != userId">
                  <a
                    class="btn btn-sm btn-secondary"
                    href="javascript:void(0)"
                  >
                    <i class="fa fa-users" /> Pending Request
                  </a>
                </template>
                <template v-if="project.is_generated == true && project.joined == true">
                  <a
                    class="btn btn-sm btn-secondary"
                    :href="'//' + project.code + '.' + domain"
                    @click="redirectToProject(project)"
                  >
                    <i class="fa fa-globe" /> Open
                  </a>
                </template>
              </td>
            </tr>
          </p-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import TabMenu from './TabMenu'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    TabMenu
  },
  data () {
    return {
      domain: process.env.VUE_APP_DOMAIN,
      isLoading: false,
      isSaving: false,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10,
      userId: parseInt(localStorage.getItem('userId'))
    }
  },
  computed: {
    ...mapGetters('accountProject', ['projects', 'pagination']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.getProjectRequest()
  },
  methods: {
    ...mapActions('accountProject', {
      getProject: 'get'
    }),
    ...mapActions('masterUserInvitation', {
      updateProject: 'update'
    }),
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          search: value
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getProjectRequest()
    }, 300),
    redirectToProject (project) {
      localStorage.setItem('tenantCode', project.code)
      localStorage.setItem('tenantName', project.name)
    },
    joinProject (index) {
      this.isSaving = true
      this.updateProject({
        id: this.projects[index].user_invitation_id,
        project_id: this.projects[index].id,
        user_id: this.projects[index].user_id
      }).then(response => {
        this.isSaving = false
        this.projects[index].joined = true
        this.$notification.success('You joined into this project')
      }).catch(error => {
        this.isSaving = false
        this.$notification.error(error.message)
      })
    },
    getProjectRequest () {
      this.isLoading = true
      this.getProject({
        params: {
          search: this.searchText
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        console.log(JSON.stringify(error))
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getProjectRequest()
    }
  }
}
</script>
