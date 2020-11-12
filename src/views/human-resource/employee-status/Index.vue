<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <span class="breadcrumb-item active">{{ $t('employment contract') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create employee')"
            href="javascript:void(0)"
            to="/human-resource/employee-status/create"
            class="input-group-prepend"
            @click="$refs.addEmployeeStatus.open()"
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
            class="btn-block"
            :value="searchText"
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
              v-for="(status, index) in statuses"
              :key="index"
              slot="p-body"
            >
              <th>{{ (page - 1) * limit + index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'employee-status.show', params: { id: status.id }}">
                  {{ status.name }}
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

    <m-add-employee-status
      ref="addEmployeeStatus"
      @added="onAdded"
    />
  </div>
</template>

<script>
import TabMenu from '@/views/human-resource/TabMenu'

import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource,
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
    ...mapGetters('humanResourceEmployeeStatus', ['statuses', 'pagination'])
  },
  created () {
    this.getStatusRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('humanResourceEmployeeStatus', {
      getStatus: 'get'
    }),
    updatePage (value) {
      this.page = value
      this.getStatusRequest()
    },
    getStatusRequest () {
      this.isLoading = true
      this.getStatus({
        params: {
          sort_by: 'name',
          filter_like: {
            name: this.searchText
          },
          limit: this.limit,
          page: this.page
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
      this.page = 1
      this.getStatusRequest()
    }, 300),
    onAdded (status) {
      this.getStatusRequest()
    }
  }
}
</script>
