<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <span class="breadcrumb-item active">{{ $t('machine') | titlecase }}</span>
    </breadcrumb>

    <manufacture-menu/>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('machine')" :header="true">
        <div class="input-group block">
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            :value="searchText"
            class="btn-block"
            @input="filterSearch"/>
          <router-link
            to="/manufacture/machine/create"
            v-if="$permission.has('create manufacture machine')"
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
              <th>#</th>
              <th>{{ $t('code') | titlecase }}</th>
              <th>{{ $t('name') | titlecase }}</th>
            </tr>
            <template v-for="(machine, index) in machines">
              <tr
                :key="'mm-' + index"
                slot="p-body">
                <th>{{ index + 1 + ( ( currentPage - 1 ) * limit ) }}</th>
                <td>
                  {{ machine.code }}
                </td>
                <td>
                  <router-link :to="{ name: 'manufacture.machine.show', params: { id: machine.id }}" v-if="$permission.has('read manufacture machine')">
                    {{ machine.name }}
                  </router-link>
                </td>
              </tr>
            </template>
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
import ManufactureMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbManufacture from '@/views/manufacture/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    ManufactureMenu,
    Breadcrumb,
    BreadcrumbManufacture,
    PointTable
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10
    }
  },
  computed: {
    ...mapGetters('manufactureMachine', ['machines', 'pagination'])
  },
  methods: {
    ...mapActions('manufactureMachine', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          search: value
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getManufactureMachine()
    }, 300),
    getManufactureMachine () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          filter_like: {
            'code': this.searchText,
            'name': this.searchText
          },
          limit: this.limit,
          page: this.currentPage
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getManufactureMachine()
    }
  },
  created () {
    this.getManufactureMachine()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
