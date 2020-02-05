<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">{{ $t('supplier') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            to="/master/supplier/create"
            v-if="$permission.has('create supplier')"
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
        <hr/>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">#</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
            <tr
              v-for="(supplier, index) in suppliers"
              :key="supplier.id"
              slot="p-body">
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'supplier.show', params: { id: supplier.id }}">
                  {{ supplier.name | titlecase }}
                </router-link>
              </td>
              <td>
                <template v-for="supplierAddress in supplier.addresses">
                  {{ supplierAddress.address | lowercase }}
                </template>
              </td>
              <td>
                <template v-for="supplierPhone in supplier.phones">
                  {{ supplierPhone.number | lowercase }}
                </template>
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
    ...mapGetters('masterSupplier', ['suppliers', 'pagination'])
  },
  methods: {
    ...mapActions('masterSupplier', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getSupplierRequest()
    }, 300),
    getSupplierRequest () {
      this.isLoading = true
      this.get({
        params: {
          fields: 'suppliers.*',
          sort_by: 'name',
          filter_like: {
            'name': this.searchText,
            'addresses.address': this.searchText,
            'phones.number': this.searchText,
            'emails.email': this.searchText
          },
          join: 'addresses,phones,emails',
          includes: 'addresses;phones;emails;groups',
          limit: 10,
          page: this.currentPage
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getSupplierRequest()
    }
  },
  created () {
    this.getSupplierRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
