<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture />
      <span class="breadcrumb-item active">{{ $t('process') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            v-if="$permission.has('create manufacture process')"
            to="/manufacture/process/create"
            class="input-group-prepend"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </router-link>
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
              <th width="50px">
                #
              </th>
              <th>{{ $t('name') }}</th>
              <th>{{ $t('notes') }}</th>
              <th />
            </tr>
            <template v-for="(process, index) in processes">
              <tr
                :key="'mp-' + index"
                slot="p-body"
              >
                <th>{{ index + 1 + ( ( currentPage - 1 ) * limit ) }}</th>
                <td>
                  <router-link
                    v-if="$permission.has('read manufacture process')"
                    :to="{ name: 'manufacture.process.show', params: { id: process.id }}"
                  >
                    {{ process.name }}
                  </router-link>
                </td>
                <td>{{ process.notes }}</td>
                <td class="text-right">
                  <!-- <router-link class="btn btn-sm btn-secondary" :to="{ name: 'manufacture.process.io.input.index', params: { id: process.id }}">
                    <i class="fa fa-share-square-o"></i> {{ $t('start production') | uppercase }}
                  </router-link> -->
                </td>
              </tr>
            </template>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
  </div>
</template>

<script>
import ManufactureMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbManufacture from '@/views/manufacture/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
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
    ...mapGetters('manufactureProcess', ['processes', 'pagination'])
  },
  created () {
    this.getManufactureProcesses()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('manufactureProcess', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          search: value
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getManufactureProcesses()
    }, 300),
    getManufactureProcesses () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          filter_like: {
            name: this.searchText
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
      this.getManufactureProcesses()
    }
  }
}
</script>
