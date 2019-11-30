<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">Customer Group</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('group')" :header="true">
        <router-link
          to="/master/customer-group/create"
          v-if="$permission.has('create customer')"
          slot="header"
          exact
          class="btn-block-option">
          <span><i class="si si-plus"></i> {{ $t('new group') | titlecase }}</span>
        </router-link>
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
              <th>Name</th>
            </tr>
            <tr
              v-for="(group, index) in groups"
              :key="index"
              slot="p-body">
              <td>
                <router-link :to="{ name: 'customer-group.show', params: { id: group.id }}">
                  {{ group.name | titlecase }}
                </router-link>
              </td>
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
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterCustomerGroup', ['groups', 'pagination'])
  },
  methods: {
    ...mapActions('masterCustomerGroup', {
      getGroup: 'get'
    }),
    updatePage (value) {
      this.currentPage = value
      this.getGroupRequest()
    },
    getGroupRequest () {
      this.isLoading = true
      this.getGroup({
        params: {
          sort_by: 'name',
          filter_like: {
            'name': this.searchText
          },
          limit: 10,
          page: this.currentPage
        }
      }).then((response) => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notifications.error(error.message)
      })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getGroupRequest()
    }, 300)
  },
  created () {
    this.getGroupRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
