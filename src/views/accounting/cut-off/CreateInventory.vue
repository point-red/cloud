<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting />
      <span class="breadcrumb-item active">
        <router-link
          to="/accounting/cut-off"
          class="breadcrumb-item"
        >{{ $t('cut off') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <div class="col-sm-12">
        <div class="row">
          <p-block>
            <nav
              class="breadcrumb bg-white text-center"
              style="display:block !important"
            >
              <router-link
                to="/accounting/cut-off/create"
                class="breadcrumb-item"
              >
                {{ $t('start') | uppercase }}
              </router-link>
              <router-link
                to="/accounting/cut-off/create/account"
                class="breadcrumb-item"
              >
                {{ $t('account') | uppercase }}
              </router-link>
              <span class="breadcrumb-item active">{{ $t('inventory') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('account payable') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('purchase down payment') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('account receivable') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('sales down payment') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('review') | uppercase }}</span>
            </nav>
            <hr>
            <h5 class="text-center">
              ITEM
            </h5>
            <div
              v-if="inventories.length == 0"
              class="text-center mb-15"
            >
              Anda tidak memiliki item saat ini, klik tombol "+" untuk menambahkan item
            </div>
            <template>
              <div class="input-group block mb-5">
                <a
                  v-if="$permission.has('create cut off')"
                  href="javascript:void(0)"
                  class="input-group-prepend"
                  @click="() => $refs.createInventory.show()"
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
                    <th>Code</th>
                    <th>Name</th>
                    <th>Account</th>
                    <th>Warehouse</th>
                    <th class="text-right">
                      Quantity
                    </th>
                    <th class="text-right">
                      Price
                    </th>
                    <th class="text-right">
                      Total
                    </th>
                    <th>Production Number</th>
                    <th>Expiry Date</th>
                  </tr>
                  <tr
                    v-for="inventory in inventories"
                    :key="inventory.id"
                    slot="p-body"
                  >
                    <td>{{ inventory.item.code }}</td>
                    <td>
                      <a
                        href="javascript:void(0)"
                        @click="$refs.editInventory.show(inventory)"
                      >
                        {{ inventory.item.name }}
                      </a>
                    </td>
                    <td>
                      <template v-if="inventory.item.account">
                        {{ inventory.item.account.label }}
                      </template>
                    </td>
                    <td>{{ inventory.warehouse.name }}</td>
                    <td class="text-right">
                      {{ inventory.quantity | numberFormat }} {{ inventory.unit | lowercase }}
                    </td>
                    <td class="text-right">
                      {{ inventory.price | numberFormat }}
                    </td>
                    <td class="text-right">
                      {{ inventory.total | numberFormat }}
                    </td>
                    <td>
                      <template v-if="inventory.production_number">
                        {{ inventory.production_number }}
                      </template>
                    </td>
                    <td>
                      <template v-if="inventory.item.require_expiry_date">
                        {{ inventory.expiry_date | dateFormat('DD MMMM YYYY') }}
                      </template>
                    </td>
                  </tr>
                  <tr slot="p-body">
                    <th />
                    <td
                      colspan="4"
                      class="text-right"
                    >
                      <b>TOTAL</b>
                    </td>
                    <td class="text-right">
                      {{ total | numberFormat }}
                    </td>
                    <td />
                    <td />
                  </tr>
                </point-table>
              </p-block-inner>
              <router-link
                tag="button"
                to="/accounting/cut-off/create/account-payable"
                class="btn btn-sm btn-primary min-width-100 float-right"
              >
                {{ $t('next') | uppercase }}
              </router-link>
              <router-link
                tag="button"
                to="/accounting/cut-off/create/account"
                class="btn btn-sm btn-primary min-width-100 float-left"
              >
                {{ $t('prev') | uppercase }}
              </router-link>
              <br><br><br>
            </template>
          </p-block>
        </div>
      </div>
    </div>
    <m-create-inventory
      id="create-inventory"
      ref="createInventory"
      @updated="getInventoryRequest()"
    />
    <m-edit-inventory
      id="edit-inventory"
      ref="editInventory"
      @updated="getInventoryRequest()"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import MCreateInventory from './MCreateInventory'
import MEditInventory from './MEditInventory'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbAccounting,
    PointTable,
    MCreateInventory,
    MEditInventory
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      total: 0,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1
    }
  },
  computed: {
    ...mapGetters('accountingCutOffInventory', ['inventories'])
  },
  created () {
    this.getInventoryRequest()
  },
  methods: {
    ...mapActions('accountingCutOffInventory', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getInventoryRequest()
    }, 300),
    getInventoryRequest () {
      this.isLoading = true
      this.get({
        params: {
          fields: 'cut_off_inventories.*',
          limit: 1000,
          join: 'item',
          filter_like: {
            'item.code': this.searchText,
            'item.name': this.searchText
          },
          includes: 'item.account;warehouse',
          sort_by: 'items.code;items.name'
        }
      }).then(response => {
        this.total = 0
        this.inventories.forEach(element => {
          this.total += parseFloat(element.quantity * element.price)
        })
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    }
  }
}
</script>
