<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <span class="breadcrumb-item active">{{ $t('user') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create user')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.addUser.open()"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </a>
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            :value="searchText"
            class="btn-block"
            @input="filterSearch"
          />
        </div>
        <hr>
        <!-- Filter -->
        <div class="text-center font-size-sm mb-10">
          <a
            href="javascript:void(0)"
            @click="isAdvanceFilter = !isAdvanceFilter"
          >
            {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down" />
          </a>
        </div>
        <div
          v-show="isAdvanceFilter"
          class="card"
          :class="{ 'fadeIn': isAdvanceFilter }"
        >
          <div class="row">
            <!-- Filter Branch -->
            <div class="col-sm-3 text-center">
              <p-form-row
                id="branch"
                name="branch"
                :label="$t('branch')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <span
                    class="select-link"
                    @click="$refs.branch.open({ id: branchId, label: branchLabel })"
                  >
                    {{ branchLabel || $t('select') | uppercase }}
                  </span>
                </div>
              </p-form-row>
            </div>
            <!-- Filter Warehouse -->
            <div class="col-sm-3 text-center">
              <p-form-row
                id="warehouse"
                name="warehouse"
                :label="$t('warehouse')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <span
                    class="select-link"
                    @click="$refs.status.open({ id: statusId, label: statusLabel })"
                  >
                    {{ statusLabel || $t('select') | uppercase }}
                  </span>
                </div>
              </p-form-row>
            </div>
            <!-- Filter Roles -->
            <div class="col-sm-3 text-center">
              <p-form-row
                id="role"
                name="role"
                :label="$t('role')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <span
                    class="select-link"
                    @click="$refs.status.open({ id: statusId, label: statusLabel })"
                  >
                    {{ statusLabel || $t('select') | uppercase }}
                  </span>
                </div>
              </p-form-row>
            </div>
          </div>
        </div>
        <hr>
        <!-- End Filter -->
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">
                #
              </th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Roles</th>
              <th>Branch</th>
              <th>Warehouse</th>
            </tr>
            <tr
              v-for="(user, index) in users"
              :key="user.id"
              slot="p-body"
            >
              <th>{{ ++index }}</th>
              <td>
                <router-link :to="{ name: 'UserShow', params: { id: user.id }}">
                  {{ user.name }}
                </router-link>
              </td>
              <td>{{ user.first_name }} {{ user.last_name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>
                <span
                  v-for="role in user.roles"
                  :key="'role-' + role.id"
                >
                  <i class="si si-badge" /> {{ role.name }}
                </span>
              </td>
              <td>
                <span v-if="user.branches && user.branches.length > 0">
                  <span
                    v-for="branch in user.branches"
                    :key="'branch-' + branch.id"
                  >
                    <i class="si si-globe-alt" /> {{ branch.name }} <br>
                  </span>
                </span>
              </td>
              <td>
                <span v-if="user.warehouses && user.warehouses.length > 0">
                  <span
                    v-for="warehouse in user.warehouses"
                    :key="'warehouse-'+warehouse.id"
                  >
                    <i class="si si-home" /> {{ warehouse.name }} <br>
                  </span>
                </span>
              </td>
            </tr>
          </point-table>
          <template v-if="userInvitations.length > 0">
            <p-separator />
            <h5>{{ $t('pending invitation') | uppercase }}</h5>
            <point-table>
              <tr slot="p-head">
                <th width="50px">
                  #
                </th>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
              <tr
                v-for="(userInvitation, indexInvitation) in userInvitations"
                :key="'user-invitation-'+userInvitation.id"
                slot="p-body"
              >
                <th>{{ ++indexInvitation }}</th>
                <td>{{ userInvitation.user_name }}</td>
                <td>{{ userInvitation.user_email }}</td>
                <td>
                  <label
                    for="pending"
                    class="badge badge-danger"
                  ><i class="fa fa-warning" /> PENDING</label>
                </td>
              </tr>
            </point-table>
          </template>
        </p-block-inner>
        <p-pagination
          :current-page="page"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
    <m-add-user
      ref="addUser"
      @added="onAdded"
    />
    <m-branch
      ref="branch"
      @choosen="onChoosenBranch"
    />
    <set-warehouse-modal
      id="setWarehouse"
      ref="setWarehouseModal"
      :title="'Set Warehouse'"
    />
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
      page: this.$route.query.page * 1 || 1,
      limit: 10,
      lastPage: 1,
      isAdvanceFilter: false
    }
  },
  computed: {
    ...mapGetters('masterUser', ['users']),
    ...mapGetters('masterUserInvitation', ['userInvitations'])
  },
  created () {
    this.isLoading = true
    this.getUserRequest()
  },
  methods: {
    ...mapActions('masterUser', {
      getUser: 'get'
    }),
    ...mapActions('masterUserInvitation', {
      getUserInvitation: 'get'
    }),
    updatePage (value) {
      this.page = value
      this.getUserRequest()
    },
    getUserRequest () {
      this.isLoading = true
      this.getUser({
        params: {
          limit: 10,
          sort_by: 'name',
          includes: 'roles;branches;warehouses',
          filter_like: {
            name: this.searchText,
            first_name: this.searchText,
            last_name: this.searchText,
            address: this.searchText,
            phone: this.searchText,
            email: this.searchText
          },
          page: this.page
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notifications.error(error)
      })

      this.getUserInvitation()
        .then(response => {
          this.isLoading = false
        }).catch(error => {
          this.isLoading = false
          this.$notifications.error(error.message)
        })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.page = 1
      this.getUserRequest()
    }, 300),
    onAdded () {
      this.getUserRequest()
    },
    onChoosenBranch (option) {
      this.branchId = option.id
      this.branchLabel = option.label
      this.$router.push({
        query: {
          // search: this.searchText,
          branchId: this.branchId
          // statusId: this.statusId
        }
      })
      this.getUserRequest()
    }
  }
}
</script>
