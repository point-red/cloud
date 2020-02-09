<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting/>
      <span class="breadcrumb-item active">
        <router-link to="/accounting/cut-off" class="breadcrumb-item">{{ $t('cut off') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <div class="col-sm-12">
        <div class="row">
          <p-block>
            <nav class="breadcrumb bg-white text-center" style="display:block !important">
              <router-link to="/accounting/cut-off/create" class="breadcrumb-item">{{ $t('start') | uppercase }}</router-link>
              <router-link to="/accounting/cut-off/create/account" class="breadcrumb-item">{{ $t('account') | uppercase }}</router-link>
              <span class="breadcrumb-item">{{ $t('inventory') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('account payable') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('purchase down payment') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('account receivable') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('sales down payment') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('cut off') | uppercase }}</span>
            </nav>
            <hr>
            <h5 class="text-center">INVENTORY</h5>
            <div class="input-group block">
              <router-link
                to="/master/item/create"
                v-if="$permission.has('create item')"
                class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-plus"></i>
                </span>
              </router-link>
              <p-form-input
                id="search-text"
                name="search-text"
                placeholder="Search"
                ref="searchText"
                :value="searchText"
                class="btn-block"
                @input="filterSearch"/>
            </div>
            <hr>
            <p-block-inner :is-loading="isLoading">
              <point-table>
                <tr slot="p-head">
                  <th width="50px">#</th>
                  <th>Name</th>
                  <th>Account</th>
                  <th class="text-right">Stock</th>
                  <th class="text-right">Price</th>
                  <th class="text-right">Balance</th>
                </tr>
                <tr
                  v-for="(item, index) in items"
                  :key="item.id"
                  slot="p-body">
                  <th>{{ ++index }}</th>
                  <td>
                    <router-link :to="{ name: 'item.show', params: { id: item.id }}">
                      {{ item.label }}
                    </router-link>
                  </td>
                  <td>
                    <template v-if="item.account">
                      {{ item.account.number }} - {{ item.account.name | titlecase }}
                    </template>
                  </td>
                  <td class="text-right">
                    <template v-if="item.units.length">
                      {{ item.stock | numberFormat }} {{ item.units[0].label }}
                    </template>
                  </td>
                  <td class="text-right">0</td>
                  <td class="text-right">0</td>
                </tr>
                <tr slot="p-body">
                  <th></th>
                  <td colspan="4" class="text-right"><b>TOTAL</b></td>
                  <td class="text-right">0</td>
                </tr>
              </point-table>
            </p-block-inner>
            <p-pagination
              :current-page="currentPage"
              :last-page="lastPage"
              @updatePage="updatePage">
            </p-pagination>
            <router-link
              tag="button"
              to="/accounting/cut-off/create/account-payable"
              class="btn btn-sm btn-primary min-width-100 float-right">
              {{ $t('next') | uppercase }}
            </router-link>
            <router-link
              tag="button"
              to="/accounting/cut-off/create/account"
              class="btn btn-sm btn-primary min-width-100 float-left">
              {{ $t('prev') | uppercase }}
            </router-link>
            <br><br><br>
          </p-block>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
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
    ...mapGetters('masterItem', ['items', 'pagination'])
  },
  methods: {
    ...mapActions('masterItem', ['get']),
    updatePage (value) {
      this.currentPage = value
      this.getItemRequest()
    },
    getItemRequest () {
      this.isLoading = true
      this.get({
        params: {
          page: this.currentPage,
          limit: 20,
          sort_by: 'name',
          filter_like: {
            'code': this.searchText,
            'name': this.searchText
          },
          includes: 'account;units'
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
      this.getItemRequest()
    }, 300)
  },
  created () {
    this.getItemRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
