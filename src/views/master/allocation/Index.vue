<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <span class="breadcrumb-item active">{{ $t('allocation') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create allocation')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.addAllocation.open()"
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
              <th>Name</th>
            </tr>
            <tr
              v-for="(allocation, index) in allocations"
              :key="allocation.id"
              slot="p-body"
            >
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
          :current-page="page"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
    <m-add-allocation
      ref="addAllocation"
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
      limit: 10,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterAllocation', ['allocations', 'pagination'])
  },
  created () {
    this.getAllocationRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('masterAllocation', ['get']),
    updatePage (value) {
      this.page = value
      this.getAllocationRequest()
    },
    getAllocationRequest () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          limit: this.limit,
          page: this.page,
          filter_like: {
            code: this.searchText,
            name: this.searchText
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
      this.page = 1
      this.getAllocationRequest()
    }, 300),
    onAdded () {
      this.getAllocationRequest()
    }
  }
}
</script>
