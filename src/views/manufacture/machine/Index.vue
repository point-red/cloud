<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture />
      <span class="breadcrumb-item active">{{ $t('machine') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            v-if="$permission.has('create manufacture machine')"
            to="/manufacture/machine/create"
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
              <th>{{ $t('name') | titlecase }}</th>
              <th>{{ $t('notes') | titlecase }}</th>
            </tr>
            <template v-for="(machine, index) in machines">
              <tr
                :key="'mm-' + index"
                slot="p-body"
              >
                <th>{{ index + 1 + ( ( currentPage - 1 ) * limit ) }}</th>
                <td>
                  <router-link
                    v-if="$permission.has('read manufacture machine')"
                    :to="{ name: 'manufacture.machine.show', params: { id: machine.id }}"
                  >
                    {{ machine.label }}
                  </router-link>
                </td>
                <td>{{ machine.notes }}</td>
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
    ...mapGetters('manufactureMachine', ['machines', 'pagination'])
  },
  created () {
    this.getManufactureMachines()
  },
  updated () {
    this.lastPage = this.pagination.last_page
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
      this.getManufactureMachines()
    }, 300),
    getManufactureMachines () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          filter_like: {
            code: this.searchText,
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
      this.getManufactureMachines()
    }
  }
}
</script>
