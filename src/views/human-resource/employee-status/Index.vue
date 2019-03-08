<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <span class="breadcrumb-item active">{{ 'employee status' | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('employee status')" :header="true">
        <p-block-inner :is-loading="loading">
          <p-table>
            <tr slot="p-head">
              <th width="100%">{{ $t('name') }}</th>
            </tr>
            <tr
              v-for="status in statuses"
              :key="status.id"
              v-if="$permission.has('read employee status')"
              slot="p-body">
              <td>
                <router-link :to="{ name: 'EmployeeStatusShow', params: { id: status.id }}">
                  {{ status.name }}
                </router-link>
              </td>
            </tr>
          </p-table>
          <nav v-show="pagination.last_page > 1">
            <ul class="pagination justify-content-center">
              <li class="page-item" v-show="pagination.current_page > 1">
                <a class="page-link" href="javascript:void(0)" tabindex="-1" aria-label="Previous" @click="paginate(1)">
                  <span aria-hidden="true">
                    <i class="fa fa-angle-double-left"></i>
                  </span>
                  <span class="sr-only">Previous</span>
                </a>
              </li>
              <li
                class="page-item"
                :class="{ 'active': pagination.current_page === n }"
                v-for="n in pagination.last_page"
                :key="n">
                <a class="page-link" href="javascript:void(0)" @click="paginate(n)">{{ n }}</a>
              </li>
              <li class="page-item" v-show="pagination.current_page < pagination.last_page">
                <a class="page-link" href="javascript:void(0)" aria-label="Next" @click="paginate(pagination.last_page)">
                  <span aria-hidden="true">
                    <i class="fa fa-angle-double-right"></i>
                  </span>
                  <span class="sr-only">Next</span>
                </a>
              </li>
            </ul>
          </nav>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource
  },
  data () {
    return {
      loading: false,
      listStatus: this.statuses,
      filter: {
        name: ''
      }
    }
  },
  computed: {
    ...mapGetters('EmployeeStatus', ['statuses', 'pagination'])
  },
  methods: {
    ...mapActions('EmployeeStatus', { getStatuses: 'get' }),
    paginate (page) {
      this.getStatuses({
        filter_like: [{'name': this.filter.name }],
        sort_by: 'name',
        paginate: 20,
        page: page
      }).then((response) => {
      }, (errors) => {
        console.log(errors.data)
      })
    },
    filterTable () {
      this.filterColumn()
    },
    filterColumn: debounce(function () {
      this.loading = true
      this.getStatuses({
        filter_like: [{'name': this.filter.name }],
        sort_by: 'name',
        paginate: 20
      }).then((response) => {
        this.loading = false
      }, (errors) => {
        console.log(errors.data)
      })
    }, 500)
  },
  created () {
    this.listStatus = this.statuses
    if (this.listStatus.length === 0) {
      this.loading = true
    }
    this.getStatuses({
      sort_by: 'name',
      paginate: 20,
      page: 1
    }).then((response) => {
      this.loading = false
    })
  }
}
</script>
