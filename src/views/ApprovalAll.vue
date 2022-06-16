<template>
  <div class="approval-all-container">
    <div class="approve-all-container">
      <h1 class="text-center text-white">
        {{ projectName }}
      </h1>
      <table class="table">
        <thead class="thead-light">
          <tr>
            <th class="text-center">
              Form Number
            </th>
            <th class="text-center">
              Status
            </th>
            <th class="text-center">
              <i
                class="fa fa-info-circle"
              />
            </th>
          </tr>
        </thead>

        <tbody v-if="isLoading">
          <tr>
            <td
              colspan="3"
              style="background: white"
            >
              <p-block>
                <p-block-inner :is-loading="isLoading" />
              </p-block>
            </td>
          </tr>
        </tbody>

        <tbody
          v-if="!isLoading && resources"
          class="tbody"
        >
          <tr
            v-for="(resource, index) in resources"
            :key="index"
          >
            <td class="text-center">
              {{ resource.form.number }}
            </td>
            <td class="text-center">
              <template>
                <div
                  v-if="resource.form.approval_status === 1"
                  class="font-white bg-success"
                >
                  Approved
                </div>

                <div
                  v-if="resource.form.approval_status === -1"
                  class="font-white bg-danger"
                >
                  Rejected
                </div>

                <div
                  v-if="resource.form.approval_status === 0"
                  class="font-white bg-secondary"
                >
                  Pending
                </div>
              </template>
            </td>
            <td class="text-center">
              <template>
                <div
                  v-if="resource.form.approval_status === 1 && resource.form.approval_status == actionCode"
                  class="font-white bg-success"
                >
                  Success
                </div>

                <div
                  v-if="resource.form.approval_status === -1 && resource.form.approval_status == actionCode"
                  class="font-white bg-success"
                >
                  Success
                </div>

                <div
                  v-if="resource.form.approval_status === 0 && resourceType != 'CashAdvance'"
                  class="font-white bg-danger"
                >
                  {{ resourceType === 'TransferSend' ? 'Stock not enough' : 'pending' }}
                </div>
                <div
                  v-if="resource.form.approval_status === 0 && resourceType == 'CashAdvance'"
                  class="font-white bg-danger"
                >
                  Balance is not enough
                </div>
                <div
                  v-else-if="resource.form.approval_status != actionCode && resource.form.approval_status == 1"
                  class="font-white bg-danger"
                >
                  Form was approved before
                </div>
                <div
                  v-else-if="resource.form.approval_status != actionCode && resource.form.approval_status == -1"
                  class="font-white bg-danger"
                >
                  Form was rejected before
                </div>
                <div
                  v-if="resource.form.approval_notes"
                  style="color: red; font-size: 14px; text-align: left"
                >
                  {{ resource.form.approval_notes }}
                </div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-center">
        <button
          class="footer text-center text-white bg-secondary"
          type="button"
          @click="close"
        >
          <strong>{{ uppercase }} BACK</strong>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import axios from '@/axios'

export default {
  data: () => {
    return {
      crudType: '',
      action: '',
      actionCode: '',
      token: '',
      resourceType: '',
      resources: [],
      projectName: '',
      approvalStatus: null,
      collectif: false,
      isLoading: false
    }
  },
  computed: {
    tenantName () {
      return localStorage.getItem('tenantName')
    }
  },
  created () {
    this.tenant = this.$route.query.tenant || ''
    this.resourceType = this.$route.query['resource-type'] || ''
    this.crudType = this.$route.query['crud-type']
    this.action = this.$route.query.action || ''
    this.token = this.$route.query.token || ''
    this.approver_id = this.$route.query.approver_id || ''
    if (this.$route.query.ids != undefined) {
      this.ids = JSON.parse('[' + this.$route.query.ids + ']') || ''
    }
    this.projectName = this.$route.query['project-name'] || ''

    this.setActionCode()
    this.handleAction()
  },
  methods: {
    ...mapActions('inventoryTransferItem', {
      approveByEmail: 'approveByEmail',
      rejectByEmail: 'rejectByEmail'
    }),
    close () {
      open(location, '_self').close()
    },
    async handleAction () {
      if (this.resourceType === 'TransferSend') {
        this.handleApprovalTransferSend()
      } else if (this.resourceType === 'CashAdvance') {
        this.handleApprovalCashAdvance()
      }
      if (this.resourceType === 'SalesDeliveryOrder') {
        this.handleApprovalDeliveryOrder()
      }
    },
    async handleApprovalTransferSend () {
      if (this.action === 'approve') {
        this.approveByEmail({
          ids: this.ids,
          token: this.token,
          approver_id: this.approver_id
        }).then(response => {
          this.resources = response.data
          this.projectName = this.tenantName
          this.approvalStatus = 1
        }).catch(error => {
          this.$notification.error(error.message)
        })
      }
      if (this.action === 'reject') {
        this.rejectByEmail({
          ids: this.ids,
          token: this.token,
          approver_id: this.approver_id,
          reason: 'Rejected by email'
        }).then(response => {
          this.resources = response.data
          this.projectName = this.tenantName
          this.approvalStatus = -1
        }).catch(error => {
          this.$notification.error(error.message)
        })
      }
    },
    async handleApprovalDeliveryOrder () {
      let endpoint = 'salesDeliveryOrder/approveByEmail'
      let params = {
        ids: this.ids,
        token: this.token,
        approver_id: this.approver_id
      }
      if (this.action === 'reject') {
        endpoint = 'salesDeliveryOrder/rejectByEmail'
        params = { ...params, reason: 'Rejected by Email' }
      }

      let statusKey = 'approval_status'
      if (this.crudType === 'close') statusKey = 'close_status'
      if (this.crudType === 'delete') statusKey = 'cancellation_status'

      this.isLoading = true

      try {
        const response = await this.$store.dispatch(endpoint, params)

        this.projectName = this.tenantName
        this.resources = response.data.map((item) => {
          item.approval_status = item.form[statusKey]
          return item
        })
      } catch (error) {
        this.$notification.error(error.message)
      } finally {
        this.isLoading = false
      }
    },
    async handleApprovalCashAdvance (headers) {
      let activity = ''
      if (this.action === 'approve') {
        activity = 'approved by email'
      } else if (this.action === 'reject') {
        activity = 'rejected by email'
      }
      const bulkId = JSON.parse(this.$route.query.ids)
      const { data: { data: cashAdvances } } = await axios.post('approval-with-token/finance/cash-advances/bulk', { token: this.token, bulk_id: bulkId, status: this.actionCode, activity: activity }, { headers })
      this.resources = cashAdvances
    },
    setActionCode () {
      if (this.action === 'approve') {
        this.actionCode = 1
      } else if (this.action === 'reject') {
        this.actionCode = -1
      }
    }
  }
}
</script>

<style>
.approval-all-container {
  background-color: #434e57;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 130vh;
}

.approve-all-container {
  width: 500px;
  height: 400px;
  margin: 20px;
  margin-top: -100px;
  font-size: 14pt;
}

.floating-approve {
  border: solid 2px black;
  border-radius: 5px;
}

.floating-approve .header {
  width: 100%;
  height: 48px;
  padding: 10px 10px;
  font-size: 14pt;
  background-color: #f6fafa;
}

.footer {
  width: 100%;
  height: 48px;
  padding: 10px 10px;
  font-size: 14pt;
}

.floating-approve .body {
  background-color: #fefffe;
  width: 100%;
  height: calc(100% - 34px);
  padding: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.floating-approve .body .form-number {
  margin-top: -20px;
  margin-bottom: 10px;
  font-size: 20pt;
}

.floating-approve .body .form-status {
  font-size: 18pt;
  color: white;
  border-radius: 3px;
  padding: 5px;
}

.font-white {
  color: white;
}

.bg-success {
  background-color: #acdd5e;
}

.bg-danger {
  background-color: #e3805d;
}

.bg-secondary {
  background-color: gray;
}

.tbody {
  background-color: #fefffe;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
