<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">User</span>
    </breadcrumb>

    <tab-menu/>

    <br>

    <div class="row">
      <p-block :title="$t('user')" :header="true">
        <p-form-input
          id="search-text"
          name="search-text"
          placeholder="Search"
          ref="searchText"
          :value="searchText"
          @input="filterSearch"/>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Roles</th>
            </tr>
            <tr
              v-for="user in users"
              :key="user.id"
              slot="p-body">
              <td>
                <router-link :to="{ name: 'UserShow', params: { id: user.id }}">
                  {{ user.name | titlecase }}
                </router-link>
              </td>
              <td>{{ user.first_name | lowercase }} {{ user.last_name | lowercase }}</td>
              <td>{{ user.email | lowercase }}</td>
              <td>{{ user.phone }}</td>
              <td>
                <template v-for="role in user.roles">
                  {{ role.name | titlecase }}
                </template>
              </td>
            </tr>
            <tr
              v-for="userInvitation in userInvitations"
              :key="userInvitation.id"
              slot="p-body">
              <td>
                {{ userInvitation.user_name }}
                <br>
                <label for="pending" class="badge badge-danger"><i class="fa fa-warning"></i> PENDING INVITATION</label>
              </td>
              <td>{{ userInvitation.user_email }}</td>
              <td></td>
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage">
        </p-pagination>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import debounce from 'lodash/debounce'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster,
    PointTable
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterUser', ['users']),
    ...mapGetters('masterUserInvitation', ['userInvitations'])
  },
  methods: {
    ...mapActions('masterUser', {
      getUser: 'get'
    }),
    ...mapActions('masterUserInvitation', {
      getUserInvitation: 'get'
    }),
    updatePage (value) {
      this.currentPage = value
      this.getUserRequest()
    },
    getUserRequest () {
      this.isLoading = true
      this.getUser({
        params: {
          limit: 10,
          sort_by: 'name',
          includes: 'roles',
          filter_like: {
            'name': this.searchText,
            'first_name': this.searchText,
            'last_name': this.searchText,
            'address': this.searchText,
            'phone': this.searchText,
            'email': this.searchText
          },
          page: this.currentPage
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notifications.error(error)
      })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getUserRequest()
    }, 300)
  },
  created () {
    this.isLoading = true
    this.getUserRequest()
    
    this.getUserInvitation()
      .then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notifications.error(error.message)
      })
  }
}
</script>
