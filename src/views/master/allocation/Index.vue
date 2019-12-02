<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">{{ $t('allocation') | titlecase }}</span>
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
            to="/master/allocation/create"
            v-if="$permission.has('create allocation')"
            class="input-group-append">
            <span class="input-group-text">
              <i class="fa fa-plus"></i>
            </span>
          </router-link>
        </div>

        <hr/>

        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Name</th>
            </tr>
            <tr
              v-for="(allocation, index) in allocations"
              :key="allocation.id"
              slot="p-body">
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'allocation.show', params: { id: allocation.id }}">
                  {{ allocation.name }}
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
    ...mapGetters('masterAllocation', ['allocations', 'pagination'])
  },
  methods: {
    ...mapActions('masterAllocation', ['get']),
    updatePage (value) {
      this.currentPage = value
      this.getAllocationRequest()
    },
    getAllocationRequest () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          limit: 20,
          page: this.currentPage,
          filter_like: {
            'code': this.searchText,
            'name': this.searchText
          }
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getAllocationRequest()
    }, 300)
  },
  created () {
    this.getAllocationRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
