<template>
  <div>
    <breadcrumb>
      <breadcrumb-inventory />
      <span class="breadcrumb-item active">{{ $t('inventory audit') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            v-if="$permission.has('create inventory audit')"
            to="/inventory/audit/create"
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
        <div class="text-center font-size-sm mb-10">
          <a
            href="javascript:void(0)"
            @click="isAdvanceFilter = !isAdvanceFilter"
          >
            {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down" />
          </a>
        </div>
        <div
          v-show="isAdvanceFilter"
          class="card"
          :class="{ 'fadeIn': isAdvanceFilter }"
        >
          <div class="row">
            <div class="col-sm-6 text-center">
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
            <div class="col-sm-6 text-center">
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
            <div class="col-sm-6 text-center">
              <p-form-row
                id="form-approval-status"
                name="form-approval-status"
                :label="$t('approval status')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <m-form-approval-status
                    :id="'form-approval-status-id'"
                    v-model="formApprovalStatus.id"
                    :label="formApprovalStatus.label"
                    @choosen="chooseFormApprovalStatus($event)"
                    @clear="chooseFormApprovalStatus($event)"
                  />
                </div>
              </p-form-row>
            </div>
            <div class="col-sm-6 text-center">
              <p-form-row
                id="form-status"
                name="form-status"
                :label="$t('form status')"
                :is-horizontal="false"
              >
                <div slot="body">
                  <m-form-status
                    :id="'status-id'"
                    :label="formStatus.label"
                    @choosen="chooseFormStatus($event)"
                    @clear="chooseFormStatus($event)"
                  />
                </div>
              </p-form-row>
            </div>
          </div>
        </div>
        <div class="mt-10">
          <label class="css-control css-control-primary css-checkbox mr-10">
            <input
              type="checkbox"
              class="css-control-input"
              :checked="isRowsChecked(inventoryAudits, checkedRow)"
              @click="toggleCheckRows()"
            >
            <span class="css-control-indicator" />
          </label>
          <span
            v-show="checkedRow.length > 0"
            class="mr-15 animated fadeIn"
          >
            <!-- <button
              type="button"
              class="btn btn-sm btn-secondary mr-5"
              @click="bulkCancel()"
            >
              {{ $t('request approval') | uppercase }}
            </button>
            <button
              type="button"
              class="btn btn-sm btn-secondary mr-5"
              @click="bulkApprove()"
            >
              {{ $t('approve') | uppercase }}
            </button>
            <button
              type="button"
              class="btn btn-sm btn-secondary mr-5"
              @click="bulkReject()"
            >
              {{ $t('reject') | uppercase }}
            </button>
            <button
              type="button"
              class="btn btn-sm btn-secondary"
              @click="bulkCancel()"
            >
              {{ $t('archive') | uppercase }}
            </button> -->
          </span>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">
                #
              </th>
              <!-- <th width="50px" /> -->
              <th>Form</th>
              <th>Date</th>
              <th>Item</th>
              <th>Production Number</th>
              <th>Notes</th>
              <th class="text-right">
                Quantity
              </th>
              <th class="text-center">
                Approval Status
              </th>
            </tr>
            <template v-for="(inventoryAudit, index) in inventoryAudits">
              <tr
                v-for="(inventoryAuditItem, index2) in inventoryAudit.items"
                :key="'pr-' + index + '-i-' + index2"
                slot="p-body"
              >
                <th>
                  {{ ((currentPage - 1) * limit) + index + 1 }}<template v-if="inventoryAudit.items.length > 1">
                    .{{ index2 + 1 }}
                  </template>
                </th>
                <!-- <td>
                  <p-form-check-box
                    id="check-box"
                    :is-form="false"
                    name="check-box"
                    :checked="isRowChecked(inventoryAudit.id)"
                    class="text-center"
                    @click.native="toggleCheckRow(inventoryAudit.id)"
                  />
                </td> -->
                <td>
                  <router-link :to="{ name: 'inventory.audit.show', params: { id: inventoryAudit.id }}">
                    {{ inventoryAudit.form.number }}
                  </router-link>
                </td>
                <td>{{ inventoryAudit.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>{{ inventoryAuditItem.item.name }}</td>
                <td>{{ inventoryAuditItem.production_number }}</td>
                <td>{{ inventoryAuditItem.notes }}</td>
                <td class="text-right">
                  {{ inventoryAuditItem.quantity | numberFormat }}
                </td>
                <td class="text-center">
                  <div
                    v-if="inventoryAudit.form.approved == null"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-if="inventoryAudit.form.approved == 0"
                    class="badge badge-danger"
                  >
                    {{ $t('rejected') | uppercase }}
                  </div>
                  <div
                    v-if="inventoryAudit.form.approved == 1"
                    class="badge badge-success"
                  >
                    {{ $t('approved') | uppercase }}
                  </div>
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
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbInventory from '@/views/inventory/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbInventory,
    PointTable
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10,
      isAdvanceFilter: false,
      checkedRow: [],
      formStatus: {
        id: null,
        label: null,
        value: 'notArchived'
      },
      formApprovalStatus: {
        id: null,
        label: null,
        value: null
      },
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  computed: {
    ...mapGetters('inventoryAudit', ['inventoryAudits', 'pagination'])
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
        this.getInventoryAudit()
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
    this.getInventoryAudit()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('inventoryAudit', ['get']),
    toggleCheckRow (id) {
      if (!this.isRowChecked(id)) {
        this.checkedRow.push({ id })
      } else {
        this.checkedRow.splice(this.checkedRow.map((o) => o.id).indexOf(id), 1)
      }
    },
    toggleCheckRows () {
      if (!this.isRowsChecked(this.inventoryAudits, this.checkedRow)) {
        this.inventoryAudits.forEach(element => {
          if (!this.isRowChecked(element.id)) {
            const id = element.id
            this.checkedRow.push({ id })
          }
        })
      } else {
        this.inventoryAudits.forEach(element => {
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
        inventoryAudits: this.checkedRow
      }).then(response => {
        this.checkedRow = []
        this.getInventoryAudit()
      })
    },
    chooseFormStatus (option) {
      this.formStatus.label = option.label
      this.formStatus.value = option.value
      this.getInventoryAudit()
    },
    chooseFormApprovalStatus (option) {
      this.formApprovalStatus.label = option.label
      this.formApprovalStatus.value = option.value
      this.getInventoryAudit()
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
      this.getInventoryAudit()
    }, 300),
    getInventoryAudit () {
      this.isLoading = true
      this.get({
        params: {
          fields: 'inventory_audit.*',
          join: 'form,warehouse',
          is_archived: this.statusId,
          limit: 10,
          includes: 'form;warehouse;items.item',
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
      this.getInventoryAudit()
    }
  }
}
</script>
