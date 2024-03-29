<template>
  <div>
    <breadcrumb>
      <breadcrumb-sales />
      <router-link
        to="/sales/payment-collection"
        class="breadcrumb-item"
      >
        {{ $t('payment collection') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('approval') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            v-if="$permission.has('create sales payment collection')"
            to="/sales/payment-collection/create"
            class="input-group-prepend"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </router-link>
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
        <div class="input-group block">
          <button
            class="btn btn-primary mr-3"
            @click="sendRequest"
          >
            Sent {{ checkedRow.length }} {{ `Request${checkedRow.length > 1 ? 's' : ''}` }} <i class="fa fa-paper-plane" />
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">
                <p-form-check-box
                  id="subscibe"
                  name="subscibe"
                  :is-form="false"
                  :checked="isRowsChecked(salesPaymentCollections, checkedRow)"
                  class="text-center"
                  @click.native="toggleCheckRows()"
                />
              </th>
              <th class="text-center">
                Date Form
              </th>
              <th class="text-center">
                Form Number
              </th>
              <th class="text-center">
                Customer
              </th>
              <th class="text-center">
                Notes
              </th>
              <th class="text-center">
                Value
              </th>
              <th class="text-center">
                Approval Status
              </th>
              <th class="text-center">
                Last Request
              </th>
            </tr>
            <template v-for="(salesPaymentCollection, index) in salesPaymentCollections">
              <tr
                slot="p-body"
                :key="index"
              >
                <td>
                  <p-form-check-box
                    id="subscibe"
                    :is-form="false"
                    name="subscibe"
                    :checked="isRowChecked(salesPaymentCollection.id)"
                    class="text-center"
                    @click.native="toggleCheckRow(salesPaymentCollection.id)"
                  />
                </td>
                <td class="text-center">
                  {{ salesPaymentCollection.date | dateFormat('DD MMMM YYYY') }}
                </td>
                <th class="text-center">
                  <router-link :to="{ name: 'sales.payment-collection.show', params: { id: salesPaymentCollection.id }}">
                    {{ salesPaymentCollection.number }}
                  </router-link>
                </th>
                <td class="text-center">
                  {{ salesPaymentCollection.customer }}
                </td>
                <td class="text-center">
                  {{ salesPaymentCollection.notes }}
                </td>
                <td class="text-center">
                  {{ salesPaymentCollection.amount | numberFormat }}
                </td>
                <td class="text-center">
                  <div
                    v-if="salesPaymentCollection.approval_status == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-if="salesPaymentCollection.approval_status == -1"
                    class="badge badge-danger"
                  >
                    {{ $t('rejected') | uppercase }}
                  </div>
                  <div
                    v-if="salesPaymentCollection.approval_status == 1"
                    class="badge badge-success"
                  >
                    {{ $t('approved') | uppercase }}
                  </div>
                </td>
                <td class="text-center">
                  <span v-if="salesPaymentCollection.last_request_date">
                    {{ salesPaymentCollection.last_request_date | dateFormat('DD MMMM YYYY HH:mm') }}
                  </span>
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
    <m-form-approval-status
      ref="formApprovalStatus"
      @choosen="chooseFormApprovalStatus($event)"
    />
    <m-form-status
      ref="formStatus"
      @choosen="chooseFormStatus($event)"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '@/views/sales/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'
import momentjs from 'moment-timezone'
export default {
  components: {
    Breadcrumb,
    BreadcrumbSales,
    PointTable
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10,
      checkedRow: [],
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  computed: {
    ...mapGetters('salesPaymentCollectionApproval', ['salesPaymentCollections', 'pagination'])
  },
  watch: {
    date: {
      handler: function () {
        this.$router.push({
          query: {
            ...this.$route.query,
            date_from: this.date.start,
            date_to: this.date.end
          }
        })
        this.getSalesPaymentCollection()
      },
      deep: true
    }
  },
  created () {
    this.$router.push({
      query: {
        ...this.$route.query,
        date_from: this.date.start,
        date_to: this.date.end
      }
    })
    this.getSalesPaymentCollection()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('salesPaymentCollection', ['addHistories']),
    ...mapActions('salesPaymentCollectionApproval', ['get', 'send']),
    toggleCheckRow (id) {
      if (!this.isRowChecked(id)) {
        this.checkedRow.push({ id })
      } else {
        this.checkedRow.splice(this.checkedRow.map((o) => o.id).indexOf(id), 1)
      }
    },
    toggleCheckRows () {
      if (!this.isRowsChecked(this.salesPaymentCollections, this.checkedRow)) {
        this.salesPaymentCollections.forEach(element => {
          if (!this.isRowChecked(element.id)) {
            const id = element.id
            this.checkedRow.push({ id })
          }
        })
      } else {
        this.salesPaymentCollections.forEach(element => {
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
        const found = needles.some(element => {
          return element.id == haystack[i].id
        })
        if (!found) {
          return false
        }
      }
      return true
    },
    bulkApprove () {
      this.bulkApprove({
        salesPaymentCollections: this.checkedRow
      }).then(response => {
        this.checkedRow = []
        this.getSalesPaymentCollection()
      })
    },
    chooseFormStatus (option) {
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.getSalesPaymentCollection()
    },
    chooseFormApprovalStatus (option) {
      this.formApprovalStatus.label = option.label
      this.formApprovalStatus.value = option.value
      this.getSalesPaymentCollection()
    },
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          search: value
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getSalesPaymentCollection()
    }, 300),
    getSalesPaymentCollection () {
      this.isLoading = true
      this.get({
        params: {
          filter_like: this.searchText,
          limit: 10,
          page: this.currentPage
        }
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.salesPaymentCollections.forEach(element => {
          if (element.last_request_date != null) {
            const dateUTC = momentjs.utc(element.last_request_date).toDate()
            const localTime = momentjs(dateUTC).local().format('YYYY-MM-DD HH:mm:ss')
            element.last_request_date = localTime
          }
        })
        this.isLoading = false
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getSalesPaymentCollection()
    },
    sendRequest () {
      if (this.checkedRow.length > 0) {
        this.isLoading = true
        this.send({
          ids: this.checkedRow
        })
          .then(response => {
            this.$notification.success('sending email approval success')
            this.checkedRow = []
            this.addHistories({ ids: response.input.ids, activity: 'Request Approval' })
              .then(response => {
                this.getSalesPaymentCollection()
              })
              .catch(error => {
                this.$notification.error(error.message)
                this.form.errors.record(error.errors)
              })
          }).catch(error => {
            this.isLoading = false
            this.$notification.error(error.message)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
