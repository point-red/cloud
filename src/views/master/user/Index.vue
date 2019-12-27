<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">{{ $t('user') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
        <div class="input-group block">
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            :value="searchText"
            class="btn-block"
            @input="filterSearch"/>
          <router-link
            to="/master/user/create"
            v-if="$permission.has('create user')"
            class="input-group-append">
            <span class="input-group-text">
              <i class="fa fa-plus"></i>
            </span>
          </router-link>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">#</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Roles</th>
              <th>Warehouse Permission</th>
            </tr>
            <tr
              v-for="(user, index) in users"
              :key="user.id"
              slot="p-body">
              <th>{{ ++index }}</th>
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
              <td>
                <span v-if="user.warehouses.length > 0">
                  <span v-for="(warehouse, index) in user.warehouses" :key="'warehouse-'+warehouse.id">
                    {{ ++index }}.
                    <a href="javascript:void(0)" @click="$refs.setWarehouseModal.show()">
                      {{ warehouse.name | titlecase }}
                    </a>
                    <br/>
                  </span>
                </span>
                <span v-else>
                  <a href="javascript:void(0)"  @click="$refs.setWarehouseModal.show()">
                    <i class="fa fa-check-square-o"></i> {{ $t('set permission') | titlecase }}
                  </a>
                </span>
              </td>
            </tr>
          </point-table>
          <template v-if="userInvitations.length > 0">
            <p-separator></p-separator>
            <h5>{{ $t('pending invitation') | uppercase }}</h5>
            <point-table>
              <tr slot="p-head">
                <th width="50px">#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
              <tr
                v-for="(userInvitation, indexInvitation) in userInvitations"
                :key="'user-invitation-'+userInvitation.id"
                slot="p-body">
                <th>{{ ++indexInvitation }}</th>
                <td>{{ userInvitation.user_name }}</td>
                <td>{{ userInvitation.user_email }}</td>
                <td><label for="pending" class="badge badge-danger"><i class="fa fa-warning"></i> PENDING</label></td>
              </tr>
            </point-table>
          </template>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage">
        </p-pagination>
      </p-block>
    </div>
    <set-warehouse-modal id="setWarehouse" ref="setWarehouseModal" :title="'Set Warehouse'"/>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import debounce from 'lodash/debounce'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import PointTable from 'point-table-vue'
import SetWarehouseModal from './SetWarehouseModal'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster,
    PointTable,
    SetWarehouseModal
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
          includes: 'roles;warehouses',
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
