<template>
  <div>
    <breadcrumb>
      <breadcrumb-salary />
      <span class="breadcrumb-item active">{{ $t('job value') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <h1 class="text-center">
          {{ $t('job value') | uppercase }}
        </h1>
        <hr>
        <div style="display:flex; justify-content: space-between; align-items: center">
          <h3>{{ $t('Factor Criteria') }}</h3>
          <div class="pull-right">
            <button
              type="button"
              class="border-black btn btn-default btn-sm"
              style="margin-right: 30px"
              @click="$refs.addGroup.open()"
            >
              <i class="fa fa-pencil" /> Group
            </button>
          </div>
        </div>
        <p-block-inner :is-loading="isLoading">
          <div class="table-responsive">
            <table
              v-for="(group) in groupList"
              :key="group.id"
              class="table table-hover"
            >
              <thead class="thead-light">
                <tr
                  slot="p-head"
                >
                  <th
                    width="10%"
                  >
                    <b>No</b>
                  </th>
                  <th>
                    <b>{{ $t(group.name) }}</b>
                  </th>
                  <th
                    width="100px"
                  >
                    <button
                      type="button"
                      class="border-black btn btn-default btn-sm"
                      @click="$refs.addGroupFactor.open(group.factors, group.id)"
                    >
                      Factors
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(factor, index) in group.factors"
                  :key="factor.id"
                  slot="p-body"
                >
                  <th>{{ index+1 }}</th>
                  <th>{{ factor.name }}</th>
                  <td>
                    <button
                      type="button"
                      class="btn border-black btn-default btn-sm"
                      @click="$refs.addFactorCriteria.open(factor.criterias, factor.id)"
                    >
                      Level
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </p-block-inner>
        <p-pagination
          :current-page="page"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>

    <m-add-group
      ref="addGroup"
      :data="groupList"
      @added="onAdded"
    />
    <m-add-group-factor
      ref="addGroupFactor"
      @added="onAdded"
    />
    <m-add-factor-criteria
      ref="addFactorCriteria"
      @added="onAdded"
    />
    <m-edit
      ref="editJobLocation"
      @added="onAdded"
    />
  </div>
</template>

<script>
import TabMenu from '@/views/plugin/salary/non-sales/TabMenu'

import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSalary from '@/views/plugin/salary/Breadcrumb'
import MAddGroup from '@/views/plugin/salary/non-sales/job-value/MAddGroup'
import MAddGroupFactor from '@/views/plugin/salary/non-sales/job-value/MAddGroupFactor'
import MAddFactorCriteria from '@/views/plugin/salary/non-sales/job-value/MAddFactorCriteria'
import MEdit from '@/views/plugin/salary/non-sales/job-location/MEdit'
// import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbSalary,
    // PointTable,
    MAddGroup,
    MAddGroupFactor,
    MAddFactorCriteria,
    MEdit
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
    ...mapGetters('pluginSalarySalaryNonSalesGroup', ['groupList', 'pagination'])
  },
  created () {
    this.getGroupRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('pluginSalarySalaryNonSalesGroup', {
      getGroup: 'get'
    }),
    updatePage (value) {
      this.page = value
      this.getGroupRequest()
    },
    getGroupRequest () {
      this.isLoading = true
      this.getGroup({
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
      this.getGroupRequest()
    }, 300),
    onAdded (jobLocation) {
      this.searchText = jobLocation.name
      this.getGroupRequest()
    }
  }
}
</script>

<style scoped>
.table tr th {
  vertical-align: middle;
}
.btn.border-black {
  border: 1px solid black;
}
</style>
