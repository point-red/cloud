<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">{{ $t('customer') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
        <div class="input-group block mb-5">
          <router-link
            to="/master/customer/create"
            v-if="$permission.has('create customer')"
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
        <div class="text-center font-size-sm mb-10">
          <a href="javascript:void(0)" @click="isAdvanceFilter = !isAdvanceFilter">
            {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down"></i>
          </a>
        </div>
        <div class="card" :class="{ 'fadeIn': isAdvanceFilter }" v-show="isAdvanceFilter">
          <div class="row">
            <div class="col-sm-3 text-center">
              <p-form-row id="status" name="status" :label="$t('status')" :is-horizontal="false">
                <div slot="body">
                  <m-status
                    :id="'status-id'"
                    v-model="statusId"
                    @choosen="chooseStatus($event)"
                    @clear="clearStatus()"/>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-3 text-center">
              <p-form-row id="pricing-group" name="pricing-group" :label="$t('pricing group')" :is-horizontal="false">
                <div slot="body">
                  <m-pricing-group
                    :id="'pricing-group-id'"
                    v-model="pricingGroupId"
                    @choosen="choosePricingGroup($event)"
                    @clear="clearPricingGroup()"/>
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-3 text-center">
              <p-form-row id="group" name="group" :label="$t('group')" :is-horizontal="false">
                <div slot="body">
                  <m-customer-group
                    :id="'group'"
                    v-model="groupId"
                    @choosen="chooseGroup($event)"
                    @clear="clearGroup()"/>
                </div>
              </p-form-row>
            </div>
          </div>
        </div>
        <hr>
        <div>
          <label class="css-control css-control-primary css-checkbox mr-10">
            <input
              type="checkbox"
              class="css-control-input"
              @click="toggleCheckRows()"
              :checked="isRowsChecked(customers, checkedRow)">
            <span class="css-control-indicator"></span>
          </label>
          <span class="mr-15 animated fadeIn" v-show="checkedRow.length > 0">
            <button type="button" class="btn btn-sm btn-outline-secondary mr-5" @click="bulkArchiveCustomer()">
              {{ $t('archive') | uppercase }}
            </button>
            <button type="button" class="btn btn-sm btn-outline-secondary mr-5" @click="bulkActivateCustomer()">
              {{ $t('activate') | uppercase }}
            </button>
            <button type="button" class="btn btn-sm btn-outline-secondary" @click="bulkDeleteCustomer()">
              {{ $t('delete') | uppercase }}
            </button>
          </span>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">#</th>
              <th width="50px"></th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Group</th>
              <th>Pricing Group</th>
            </tr>
            <tr
              v-for="(customer, index) in customers"
              :key="index"
              :class="{
                'bg-gray': customer.archived_at != null,
                'bg-primary-lighter': isRowChecked(customer.id)
              }"
              slot="p-body">
              <th :class="{
                'bg-gray': customer.archived_at != null,
                'bg-primary-lighter': isRowChecked(customer.id)
              }">
                {{ index + 1}}
              </th>
              <td>
                <p-form-check-box
                  :is-form="false"
                  id="subscibe"
                  name="subscibe"
                  @click.native="toggleCheckRow(customer.id)"
                  :checked="isRowChecked(customer.id)"
                  class="text-center"/>
              </td>
              <td>
                <router-link :to="{ name: 'customer.show', params: { id: customer.id }}">
                  {{ customer.name | titlecase }}
                </router-link>
              </td>
              <td>
                <template v-for="customerAddress in customer.addresses">
                  {{ customerAddress.address | lowercase }}
                </template>
              </td>
              <td>
                <template v-for="customerPhone in customer.phones">
                  {{ customerPhone.number | lowercase }}
                </template>
              </td>
              <td>
                <template v-for="customerEmail in customer.emails">
                  {{ customerEmail.email | lowercase }}
                </template>
              </td>
              <td>
                <template v-for="group in customer.groups">
                  {{ group.name | lowercase }}
                </template>
              </td>
              <td>
                <span v-if="customer.pricing_group">{{ customer.pricing_group.label }}</span>
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
      lastPage: 1,
      isAdvanceFilter: false,
      checkedRow: [],
      groupId: this.$route.query.groupId,
      pricingGroupId: this.$route.query.pricingGroupId,
      statusId: this.$route.query.statusId
    }
  },
  computed: {
    ...mapGetters('masterCustomer', ['customers', 'pagination'])
  },
  methods: {
    ...mapActions('masterCustomer', ['get', 'bulkArchive', 'bulkActivate', 'bulkDelete']),
    toggleCheckRow (id) {
      if (!this.isRowChecked(id)) {
        this.checkedRow.push({ id })
      } else {
        this.checkedRow.splice(this.checkedRow.map((o) => o.id).indexOf(id), 1)
      }
    },
    toggleCheckRows () {
      if (!this.isRowsChecked(this.customers, this.checkedRow)) {
        this.customers.forEach(element => {
          if (!this.isRowChecked(element.id)) {
            let id = element.id
            this.checkedRow.push({ id })
          }
        })
      } else {
        this.customers.forEach(element => {
          this.checkedRow.splice(this.checkedRow.map((o) => o.id).indexOf(element.id), 1)
        })
      }
    },
    isRowChecked (id) {
      return this.checkedRow.some(element => {
        return element.id == id
      })
    },
    isRowsChecked (haystack, needles) {
      if (needles.length == 0) {
        return false
      }
      for (let i = 0; i < haystack.length; i++) {
        let found = needles.some(element => {
          return element.id == haystack[i].id
        })
        if (!found) {
          return false
        }
      }
      return true
    },
    bulkArchiveCustomer () {
      this.$alert.confirm(this.$t('archive'), this.$t('confirmation archive message')).then(response => {
        this.bulkArchive({
          customers: this.checkedRow
        }).then(response => {
          this.checkedRow = []
          this.getCustomerRequest()
        })
      })
    },
    bulkActivateCustomer () {
      this.$alert.confirm(this.$t('activate'), this.$t('confirmation activate message')).then(response => {
        this.bulkActivate({
          customers: this.checkedRow
        }).then(response => {
          this.checkedRow = []
          this.getCustomerRequest()
        })
      })
    },
    bulkDeleteCustomer () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.bulkDelete({
          customers: this.checkedRow
        }).then(response => {
          this.checkedRow = []
          this.getCustomerRequest()
        })
      })
    },
    chooseGroup (option) {
      this.$router.push({
        query: {
          search: this.searchText,
          statusId: this.statusId,
          groupId: this.groupId,
          pricingGroupId: this.pricingGroupId
        }
      })
      this.getCustomerRequest()
    },
    clearGroup () {
      this.groupId = null
      this.getCustomerRequest()
    },
    choosePricingGroup (option) {
      this.$router.push({
        query: {
          search: this.searchText,
          statusId: this.statusId,
          groupId: this.groupId,
          pricingGroupId: this.pricingGroupId
        }
      })
      this.getCustomerRequest()
    },
    clearPricingGroup () {
      this.pricingGroupId = null
      this.getCustomerRequest()
    },
    chooseStatus (option) {
      this.$router.push({
        query: {
          search: this.searchText,
          statusId: this.statusId,
          groupId: this.groupId,
          pricingGroupId: this.pricingGroupId
        }
      })
      this.getCustomerRequest()
    },
    clearStatus () {
      this.statusId = null
      this.getCustomerRequest()
    },
    updatePage (value) {
      this.currentPage = value
      this.getCustomerRequest()
    },
    getCustomerRequest () {
      this.isLoading = true
      this.get({
        params: {
          fields: 'customers.*',
          sort_by: 'name',
          filter_like: {
            'name': this.searchText,
            'addresses.address': this.searchText,
            'emails.email': this.searchText,
            'phones.number': this.searchText
          },
          filter_equal: {
            'pricing_group_id': this.pricingGroupId,
            'groups.id': this.groupId
          },
          is_archived: this.statusId,
          join: 'addresses,phones,emails',
          includes: 'addresses;phones;emails;groups;pricingGroup',
          limit: 10,
          page: this.currentPage
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          search: value,
          statusId: this.statusId,
          groupId: this.groupId,
          pricingGroupId: this.pricingGroupId
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getCustomerRequest()
    }, 300)
  },
  created () {
    this.getCustomerRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
