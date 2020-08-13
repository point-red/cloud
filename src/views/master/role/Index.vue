<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <span class="breadcrumb-item active">{{ $t('role & permission') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create role')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.addRole.open()"
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
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th style="width:50px">
                #
              </th>
              <th>Role</th>
              <th>User</th>
            </tr>
            <tr
              v-for="(role, index) in roles"
              :key="role.id"
              slot="p-body"
            >
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'role.show', params: { id: role.id }}">
                  {{ role.name }}
                </router-link>
              </td>
              <td>
                <template v-for="(user, index2) in role.users">
                  <span
                    :key="'role-user-' + index2"
                    class="mr-10"
                  >
                    <i class="si si-user" /> {{ user.full_name }}
                  </span>
                </template>
              </td>
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>

    <m-add-role
      ref="addRole"
      @added="onAdded"
    />
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
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
      limit: 10,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterRole', ['roles'])
  },
  created () {
    this.getRoleRequest()
  },
  methods: {
    ...mapActions('masterRole', {
      getRoles: 'get'
    }),
    updatePage (value) {
      this.currentPage = value
      this.getRoleRequest()
    },
    getRoleRequest () {
      this.isLoading = true
      this.getRoles({
        params: {
          limit: this.limit,
          sort_by: 'name',
          filter_like: {
            name: this.searchText
          },
          filter_min: {
            id: 2
          },
          page: this.currentPage
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getRoleRequest()
    }, 300),
    onAdded () {
      this.getRoleRequest()
    }
  }
}
</script>
