<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <span class="breadcrumb-item active">{{ $t('branch') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create branch')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.addBranch.open()"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </a>
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
          <point-table>
            <tr slot="p-head">
              <th width="50px">
                #
              </th>
              <th>Branch</th>
              <th>User</th>
            </tr>
            <tr
              v-for="(branch, index) in branches"
              :key="branch.id"
              slot="p-body"
            >
              <th>{{ (page - 1) * limit + (index + 1) }}</th>
              <td>
                <router-link :to="{ name: 'branch.show', params: { id: branch.id }}">
                  {{ branch.name }}
                </router-link>
              </td>
              <td>
                <template v-for="(user, index2) in branch.users">
                  <span
                    :key="'branch-user-' + index2"
                    class="mr-10"
                  >
                    <i
                      v-if="!user.pivot.is_default"
                      class="si si-user"
                    />
                    <i
                      v-if="user.pivot.is_default"
                      class="si si-user-following"
                    /> {{ user.full_name }}
                  </span>
                </template>
              </td>
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="page"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>

    <m-add-branch
      ref="addBranch"
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
      page: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10
    }
  },
  computed: {
    ...mapGetters('masterBranch', ['branches', 'pagination'])
  },
  created () {
    this.getBranchRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('masterBranch', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.page = 1
      this.getBranchRequest()
    }, 300),
    getBranchRequest () {
      this.isLoading = true
      this.get({
        params: {
          fields: 'branch.*',
          sort_by: 'name',
          filter_like: {
            name: this.searchText
          },
          includes: 'users',
          limit: this.limit,
          page: this.page
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    updatePage (value) {
      this.page = value
      this.getBranchRequest()
    },
    onAdded () {
      this.getBranchRequest()
    }
  }
}
</script>
