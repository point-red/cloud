<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <span class="breadcrumb-item active">{{ $t('supplier') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create supplier')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.addSupplier.open()"
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
              <th>Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
            <tr
              v-for="(supplier, index) in suppliers"
              :key="supplier.id"
              slot="p-body"
            >
              <th>{{ (page - 1) * 10 + index + 1 }}</th>
              <td>{{ supplier.code }}</td>
              <td>
                <router-link :to="{ name: 'supplier.show', params: { id: supplier.id }}">
                  {{ supplier.name }}
                </router-link>
              </td>
              <td>{{ supplier.email }}</td>
              <td>{{ supplier.address }}</td>
              <td>{{ supplier.phone }}</td>
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

    <m-add-supplier
      ref="addSupplier"
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
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterSupplier', ['suppliers', 'pagination'])
  },
  created () {
    this.getSupplierRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
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
          fields: 'supplier.*',
          sort_by: 'name',
          filter_like: {
            'supplier.code': this.searchText,
            'supplier.name': this.searchText,
            'supplier.address': this.searchText,
            'supplier.phone': this.searchText,
            'supplier.email': this.searchText
          },
          includes: 'groups',
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
  }
}
</script>
