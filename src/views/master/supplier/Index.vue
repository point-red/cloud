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
          <a
            href="javascript:void(0)"
            @click="$refs.addSupplier.open()"
            v-if="$permission.has('create supplier')"
            class="input-group-prepend">
            <span class="input-group-text">
              <i class="fa fa-plus"></i>
            </span>
          </a>
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
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
            <tr
              v-for="(supplier, index) in suppliers"
              :key="supplier.id"
              slot="p-body">
              <th>{{ (page - 1) * 10 + index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'supplier.show', params: { id: supplier.id }}">
                  {{ supplier.name }}
                </router-link>
              </td>
              <td>
                <template v-for="supplierEmail in supplier.emails">
                  {{ supplierEmail.email }}
                </template>
              </td>
              <td>
                <template v-for="supplierAddress in supplier.addresses">
                  {{ supplierAddress.address }}
                </template>
              </td>
              <td>
                <template v-for="supplierPhone in supplier.phones">
                  {{ supplierPhone.number }}
                </template>
              </td>
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="page"
          :last-page="lastPage"
          @updatePage="updatePage">
        </p-pagination>
      </p-block>
    </div>

    <m-add-supplier ref="addSupplier" @added="onAdded"></m-add-supplier>
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
      this.page = 1
      this.getSupplierRequest()
    }, 300),
    getSupplierRequest () {
      this.isLoading = true
      this.get({
        params: {
          join: 'address,phone,email',
          fields: 'supplier.*',
          sort_by: 'name',
          filter_like: {
            'name': this.searchText,
            'address.address': this.searchText,
            'phone.number': this.searchText,
            'email.email': this.searchText
          },
          includes: 'addresses;phones;emails;groups',
          limit: 10,
          page: this.page
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    updatePage (value) {
      this.page = value
      this.getSupplierRequest()
    },
    onAdded () {
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
