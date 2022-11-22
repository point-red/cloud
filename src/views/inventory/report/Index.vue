<template>
  <div>
    <breadcrumb>
      <breadcrumb-inventory />
      <span class="breadcrumb-item active">{{ $t('report') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div class="row">
          <div class="col-sm-3 text-center">
            <p-form-row
              id="date-start"
              name="date-start"
              :label="$t('date start')"
              :is-horizontal="false"
            >
              <div slot="body">
                <p-date-picker
                  id="date"
                  v-model="date.start"
                  name="date"
                  label="date"
                />
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-3 text-center">
            <p-form-row
              id="date-end"
              name="date-end"
              :label="$t('date end')"
              :is-horizontal="false"
            >
              <div slot="body">
                <p-date-picker
                  id="date"
                  v-model="date.end"
                  name="date"
                  label="date"
                />
              </div>
            </p-form-row>
          </div>
        </div>
        <p-form-input
          id="search-text"
          name="search-text"
          placeholder="Search"
          :value="searchText"
          class="btn-block"
          @input="filterSearch"
        />
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th />
              <th />
              <th
                style="border: 1px solid #e4e7ed"
                colspan="1"
                class="text-center"
              >
                opening
              </th>
              <th
                style="border: 1px solid #e4e7ed"
                colspan="1"
                class="text-center"
              >
                in
              </th>
              <th
                style="border: 1px solid #e4e7ed"
                colspan="1"
                class="text-center"
              >
                out
              </th>
              <th
                style="border: 1px solid #e4e7ed"
                colspan="1"
                class="text-center"
              >
                ending
              </th>
            </tr>
            <!-- <tr slot="p-head">
              <th>#</th>
              <th>Item</th>
              <th style="border: 1px solid #e4e7ed" class="text-center">Quantity</th>
              <th style="border: 1px solid #e4e7ed" class="text-center">Value</th>
              <th style="border: 1px solid #e4e7ed" class="text-center">Quantity</th>
              <th style="border: 1px solid #e4e7ed" class="text-center">Value</th>
              <th style="border: 1px solid #e4e7ed" class="text-center">Quantity</th>
              <th style="border: 1px solid #e4e7ed" class="text-center">Value</th>
              <th style="border: 1px solid #e4e7ed" class="text-center">Quantity</th>
              <th style="border: 1px solid #e4e7ed" class="text-center">Value</th>
            </tr> -->
            <tr
              v-for="(inventory, index) in inventories"
              slot="p-body"
              :key="index"
            >
              <th>{{ ((currentPage - 1) * limit) + index + 1 }}</th>
              <td>
                <router-link
                  :to="{
                    name: 'inventory.report.show',
                    params: { id: inventory.id },
                    query: {
                      date_from: date.start,
                      date_to: date.end
                    }}"
                >
                  {{ inventory.label }}
                </router-link>
              </td>
              <td class="text-right">
                {{ inventory.opening_balance | numberFormat }}
              </td>
              <!-- <td class="text-right">{{ 0 | numberFormat }}</td> -->
              <td class="text-right">
                {{ inventory.stock_in | numberFormat }}
              </td>
              <!-- <td class="text-right">{{ 0 | numberFormat }}</td> -->
              <td class="text-right">
                {{ inventory.stock_out | numberFormat }}
              </td>
              <!-- <td class="text-right">{{ 0 | numberFormat }}</td> -->
              <td class="text-right">
                {{ inventory.ending_balance | numberFormat }}
              </td>
              <!-- <td class="text-right">{{ 0 | numberFormat }}</td> -->
            </tr>
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
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbInventory from '@/views/inventory/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbInventory,
    PointTable
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10,
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  computed: {
    ...mapGetters('inventoryInventoryRecapitulation', ['inventories', 'pagination'])
  },
  watch: {
    date: {
      handler: function () {
        this.$router.replace({
          query: {
            ...this.$route.query,
            date_from: this.date.start,
            date_to: this.date.end
          }
        })
        this.getInventoryRequest()
      },
      deep: true
    }
  },
  created () {
    if (this.$route.query.date_from != this.date.start && this.$route.query.date_to != this.date.end) {
      this.$router.replace({
        query: {
          ...this.$route.query,
          date_from: this.date.start,
          date_to: this.date.end
        }
      })
    }
    this.getInventoryRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('inventoryInventoryRecapitulation', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value, dateFrom: this.date_from, dateTo: this.date_to } })
      this.searchText = value
      this.currentPage = 1
      this.getInventoryRequest()
    }, 300),
    getInventoryRequest () {
      this.isLoading = true
      this.get({
        params: {
          includes: 'account',
          sort_by: 'code;name',
          limit: this.limit,
          page: this.currentPage,
          date_from: this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00'),
          date_to: this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59'),
          filter_like: {
            code: this.searchText,
            name: this.searchText
          }
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
      this.getInventoryRequest()
    }
  }
}
</script>
