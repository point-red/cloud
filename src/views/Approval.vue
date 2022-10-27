<template>
  <div class="approval-container">
    <div class="approve-container">
      <h1 class="text-center text-white">
        {{ projectName }}
      </h1>
      <div class="floating-approve">
        <div class="header text-center">
          <strong>{{ crudType | uppercase }} APPROVAL STATUS</strong>
        </div>
        <div class="body">
          <p-block v-if="isLoading">
            <p-block-inner :is-loading="isLoading" />
          </p-block>

          <div v-if="!isLoading && resource && resource.form">
            <div class="form-number">
              {{ resource.form.number }}
            </div>
            <template>
              <div
                v-if="approvalStatus === 1"
                class="form-status bg-success"
              >
                Approved
              </div>

              <div
                v-else-if="approvalStatus === -1"
                class="form-status bg-danger"
              >
                Rejected
              </div>

              <div
                v-else-if="approvalStatus === 0"
                class="form-status bg-secondary"
              >
                Pending
              </div>
              <!-- <div
                v-else
                class="form-status bg-secondary"
              >
                Unknown
              </div> -->
            </template>
            <div
              v-if="warningMessage"
              class="m-0 mt-4 alert alert-danger"
            >
              {{ warningMessage }}
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-2">
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
import axiosNode from '@/axiosNode'
import axios from '@/axios'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      crudType: '',
      action: '',
      token: '',
      resourceType: '',
      resource: {},
      projectName: '',
      id: '',
      approvalStatus: null,
      warningMessage: '',
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
    this.id = this.$route.query.id || ''
    this.projectName = this.$route.query['project-name'] || ''
    this.approver_id = this.$route.query.approver_id || ''
    if (this.$route.query.ids != undefined) {
      this.ids = JSON.parse('[' + this.$route.query.ids + ']') || ''
    }
    if (this.$route.query.form_send_done != undefined) {
      this.formSendDone = this.$route.query.form_send_done
    }
    this.handleAction()
  },
  methods: {
    ...mapActions('inventoryTransferItem', {
      approveByEmail: 'approveByEmail',
      rejectByEmail: 'rejectByEmail'
    }),
    ...mapActions('inventoryReceiveItem', {
      approveByEmailReceive: 'approveByEmail',
      rejectByEmailReceive: 'rejectByEmail'
    }),
    ...mapActions('salesPaymentCollection', {
      approveByEmailPaymentCollection: 'approveByEmail',
      rejectByEmailPaymentCollection: 'rejectByEmail'
    }),
    ...mapActions('accountingMemoJournal', {
      approveByEmailMemo: 'approveByEmail',
      rejectByEmailMemo: 'rejectByEmail'
    }),
    ...mapActions('salesReturn', {
      approveByEmailSalesReturn: 'approveByEmail',
      rejectByEmailSalesReturn: 'rejectByEmail'
    }),
    close () {
      open(location, '_self').close()
    },
    async handleAction () {
      // this.validate()
      const headers = {
        Tenant: this.tenant,
        Authorization: undefined
      }

      let resource, projectName, approvalStatus
      console.log(this.resourceType)
      try {
        if (this.resourceType === 'SalesInvoice') {
          ({ resource, projectName, approvalStatus } = await this.handleApprovalSalesInvoice(headers))
        }
        if (this.resourceType === 'StockCorrection') {
          ({ resource, projectName, approvalStatus } = await this.handleApprovalStockCorrection(headers))
        }
        if (this.resourceType === 'CashAdvance') {
          ({ resource, projectName, approvalStatus } = await this.handleApprovalCashAdvance(headers))
        }
        if (this.resourceType === 'TransferSend') {
          this.handleApprovalTransferSend()
        }
        if (this.resourceType === 'TransferReceive') {
          this.handleApprovalTransferReceive()
        }
        if (this.resourceType === 'PaymentCollection') {
          this.handleApprovalPaymentCollection()
        }
        if (this.resourceType === 'SalesDeliveryOrder') {
          this.handleApprovalDeliveryOrder()
        }
        if (this.resourceType === 'MemoJournal') {
          this.handleApprovalMemoJournal()
        }
        if (this.resourceType === 'SalesReturn') {
          this.handleApprovalSalesReturn()
        }
      } catch (error) {
        alert(error)
        if (error.data && error.data.message) {
          this.$notification.error(error.data.message)
          if (error.data.message === 'Stock can not be minus') {
            this.warningMessage = 'Stock not enough'
          }
        }
        if (error.data && error.data.meta) {
          const meta = error.data.meta
          resource = {
            form: {
              ...(meta.formNumber ? { number: meta.formNumber } : {})
            }
          }
          approvalStatus = meta.formStatus
          projectName = meta.projectName
        }
      }

      this.resource = resource
      this.projectName = projectName
      this.approvalStatus = approvalStatus !== undefined && approvalStatus !== null ? approvalStatus : 2
    },
    async handleApprovalSalesInvoice (headers) {
      if (this.crudType === 'create' || this.crudType === 'update') {
        if (this.action === 'approve') {
          const { data: { data: salesInvoice, meta: { projectName } } } = await axiosNode.post('/sales/invoices/create-approve-with-token', { token: this.token }, { headers })
          return { resource: salesInvoice, projectName, approvalStatus: salesInvoice.form.approvalStatus }
        }
        if (this.action === 'reject') {
          const { data: { data: salesInvoice, meta: { projectName } } } = await axiosNode.post('/sales/invoices/create-reject-with-token', { token: this.token }, { headers })
          return { resource: salesInvoice, projectName, approvalStatus: salesInvoice.form.approvalStatus }
        }
      }

      if (this.crudType === 'delete') {
        if (this.action === 'approve') {
          const { data: { data: salesInvoice, meta: { projectName } } } = await axiosNode.post('/sales/invoices/delete-approve-with-token', { token: this.token }, { headers })
          return { resource: salesInvoice, projectName, approvalStatus: salesInvoice.form.cancellationStatus }
        }
        if (this.action === 'reject') {
          const { data: { data: salesInvoice, meta: { projectName } } } = await axiosNode.post('/sales/invoices/delete-reject-with-token', { token: this.token }, { headers })
          return { resource: salesInvoice, projectName, approvalStatus: salesInvoice.form.cancellationStatus }
        }
      }
    },
    async handleApprovalStockCorrection (headers) {
      if (this.crudType === 'create' || this.crudType === 'update') {
        if (this.action === 'approve') {
          const { data: { data: stockCorrection, meta: { projectName } } } = await axiosNode.post('/inventory/corrections/create-approve-with-token', { token: this.token }, { headers })
          return { resource: stockCorrection, projectName, approvalStatus: stockCorrection.form.approvalStatus }
        }
        if (this.action === 'reject') {
          const { data: { data: stockCorrection, meta: { projectName } } } = await axiosNode.post('/inventory/corrections/create-reject-with-token', { token: this.token }, { headers })
          return { resource: stockCorrection, projectName, approvalStatus: stockCorrection.form.approvalStatus }
        }
      }

      if (this.crudType === 'delete') {
        if (this.action === 'approve') {
          const { data: { data: stockCorrection, meta: { projectName } } } = await axiosNode.post('/inventory/corrections/delete-approve-with-token', { token: this.token }, { headers })
          return { resource: stockCorrection, projectName, approvalStatus: stockCorrection.form.cancellationStatus }
        }
        if (this.action === 'reject') {
          const { data: { data: stockCorrection, meta: { projectName } } } = await axiosNode.post('/inventory/corrections/delete-reject-with-token', { token: this.token }, { headers })
          return { resource: stockCorrection, projectName, approvalStatus: stockCorrection.form.cancellationStatus }
        }
      }
    },
    async handleApprovalCashAdvance (headers) {
      let status = 0
      if (this.action === 'approve') {
        status = 1
      } else if (this.action === 'reject') {
        status = -1
      }
      const { data: { data: cashAdvance } } = await axios.post('approval-with-token/finance/cash-advances', { token: this.token, id: this.id, status: status, activity: 'approved by email' }, { headers })
      if (cashAdvance.form.approval_status == 0) {
        this.warningMessage = 'Balance Not Enough'
      } else if (cashAdvance.form.approval_status != status) {
        if (cashAdvance.form.approval_status == 1) {
          this.warningMessage = 'Cash Advance was approved before'
        } else if (cashAdvance.form.approval_status == -1) {
          this.warningMessage = 'Cash Advance was rejected before'
        }
      }
      return { resource: cashAdvance, projectName: this.projectName, approvalStatus: cashAdvance.form.approval_status }
    },
    async handleApprovalTransferSend () {
      if (this.action === 'approve') {
        this.approveByEmail({
          ids: this.ids,
          token: this.token,
          approver_id: this.approver_id
        }).then(response => {
          this.resource = response.data[0]
          this.projectName = this.tenantName
          this.approvalStatus = response.data[0].form.approval_status
          if (this.approvalStatus === 0) {
            this.warningMessage = 'Stock not enough'
          }
        }).catch(error => {
          console.log(error.message)
        })
      }
      if (this.action === 'reject') {
        this.rejectByEmail({
          ids: this.ids,
          token: this.token,
          approver_id: this.approver_id,
          reason: 'Rejected by email'
        }).then(response => {
          this.resource = response.data[0]
          this.projectName = this.tenantName
          this.approvalStatus = response.data[0].form.approval_status
        }).catch(error => {
          console.log(error.message)
        })
      }
    },
    async handleApprovalTransferReceive () {
      if (this.crudType === 'update') {
        if (this.action === 'approve') {
          this.approveByEmailReceive({
            ids: this.ids,
            token: this.token,
            approver_id: this.approver_id,
            form_send_done: this.formSendDone
          }).then(response => {
            this.resource = response.data
            this.projectName = this.tenantName
            this.approvalStatus = response.data.form.approval_status
          }).catch(error => {
            console.log(error.message)
          })
        }
        if (this.action === 'reject') {
          this.rejectByEmailReceive({
            ids: this.ids,
            token: this.token,
            approver_id: this.approver_id,
            reason: 'Rejected by email'
          }).then(response => {
            this.resource = response.data
            this.projectName = this.tenantName
            this.approvalStatus = response.data.form.approval_status
          }).catch(error => {
            console.log(error.message)
          })
        }
      }
      if (this.crudType === 'delete') {
        if (this.action === 'approve') {
          this.approveByEmailReceive({
            ids: this.ids,
            token: this.token,
            approver_id: this.approver_id,
            form_send_done: this.formSendDone
          }).then(response => {
            this.resource = response.data
            this.projectName = this.tenantName
            this.approvalStatus = response.data.form.cancellation_status
          }).catch(error => {
            console.log(error.message)
          })
        }
        if (this.action === 'reject') {
          this.rejectByEmailReceive({
            ids: this.ids,
            token: this.token,
            approver_id: this.approver_id,
            reason: 'Rejected by email'
          }).then(response => {
            this.resource = response.data
            this.projectName = this.tenantName
            this.approvalStatus = response.data.form.cancellation_status
          }).catch(error => {
            console.log(error.message)
          })
        }
      }
    },
    async handleApprovalDeliveryOrder () {
      let statusKey = 'approval_status'
      if (this.crudType === 'delete') statusKey = 'cancellation_status'
      if (this.crudType === 'close') statusKey = 'close_status'

      this.isLoading = true

      if (this.action === 'approve') {
        this.$store.dispatch('salesDeliveryOrder/approveByEmail', {
          ids: this.ids,
          token: this.token,
          approver_id: this.approver_id
        }).then(response => {
          this.resource = response.data[0]
          this.projectName = this.tenantName
          this.approvalStatus = response.data[0].form[statusKey]
        }).catch(error => {
          this.$notification.error(error.message)
        }).finally(() => { this.isLoading = false })
      }
      if (this.action === 'reject') {
        this.$store.dispatch('salesDeliveryOrder/rejectByEmail', {
          ids: this.ids,
          token: this.token,
          approver_id: this.approver_id,
          reason: 'Rejected by email'
        }).then(response => {
          this.resource = response.data[0]
          this.projectName = this.tenantName
          this.approvalStatus = response.data[0].form[statusKey]
        }).catch(error => {
          this.$notification.error(error.message)
        }).finally(() => { this.isLoading = false })
      }
    },
    async handleApprovalPaymentCollection () {
      if (this.crudType === 'delete') {
        if (this.action === 'approve') {
          this.approveByEmailPaymentCollection({
            ids: this.ids,
            token: this.token,
            approver_id: this.approver_id
          }).then(response => {
            this.resource = response.data[0]
            this.projectName = this.tenantName
            this.approvalStatus = response.data[0].form.cancellation_status
          }).catch(error => {
            console.log(error.message)
          })
        }
        if (this.action === 'reject') {
          this.rejectByEmailPaymentCollection({
            ids: this.ids,
            token: this.token,
            approver_id: this.approver_id,
            reason: 'Rejected by email'
          }).then(response => {
            this.resource = response.data[0]
            this.projectName = this.tenantName
            this.approvalStatus = response.data[0].form.cancellation_status
          }).catch(error => {
            console.log(error.message)
          })
        }
      } else {
        if (this.action === 'approve') {
          this.approveByEmailPaymentCollection({
            ids: this.ids,
            token: this.token,
            approver_id: this.approver_id
          }).then(response => {
            this.resource = response.data[0]
            this.projectName = this.tenantName
            this.approvalStatus = response.data[0].form.approval_status
          }).catch(error => {
            this.$notification.error(error.message)
          })
        }
        if (this.action === 'reject') {
          this.rejectByEmailPaymentCollection({
            ids: this.ids,
            token: this.token,
            approver_id: this.approver_id,
            reason: 'Rejected by email'
          }).then(response => {
            this.resource = response.data[0]
            this.projectName = this.tenantName
            this.approvalStatus = response.data[0].form.approval_status
          }).catch(error => {
            console.log(error.message)
          })
        }
      }
    },
    async handleApprovalMemoJournal () {
      if (this.crudType === 'create' || this.crudType === 'update') {
        if (this.action === 'approve') {
          this.approveByEmailMemo({
            ids: this.ids,
            token: this.token,
            approver_id: this.approver_id
          }).then(response => {
            this.resource = response.data[0]
            this.projectName = this.tenantName
            this.approvalStatus = response.data[0].form.approval_status
          }).catch(error => {
            console.log(error.message)
          })
        }
        if (this.action === 'reject') {
          this.rejectByEmailMemo({
            ids: this.ids,
            token: this.token,
            approver_id: this.approver_id,
            reason: 'Rejected by email'
          }).then(response => {
            this.resource = response.data[0]
            this.projectName = this.tenantName
            this.approvalStatus = response.data[0].form.approval_status
          }).catch(error => {
            console.log(error.message)
          })
        }
      }
      if (this.crudType === 'delete') {
        if (this.action === 'approve') {
          this.approveByEmailMemo({
            ids: this.ids,
            token: this.token,
            approver_id: this.approver_id
          }).then(response => {
            this.resource = response.data[0]
            this.projectName = this.tenantName
            this.approvalStatus = response.data[0].form.cancellation_status
          }).catch(error => {
            console.log(error.message)
          })
        }
        if (this.action === 'reject') {
          this.rejectByEmailemo({
            ids: this.ids,
            token: this.token,
            approver_id: this.approver_id,
            reason: 'Rejected by email'
          }).then(response => {
            this.resource = response.data[0]
            this.projectName = this.tenantName
            this.approvalStatus = response.data[0].form.cancellation_status
          }).catch(error => {
            console.log(error.message)
          })
        }
      }
    },
    async handleApprovalSalesReturn () {
      let statusKey = 'approval_status'
      if (this.crudType === 'delete') statusKey = 'cancellation_status'
      if (this.crudType === 'close') statusKey = 'close_status'

      this.isLoading = true

      if (this.action === 'approve') {
        this.$store.dispatch('salesReturn/approveByEmail', {
          ids: this.ids,
          token: this.token,
          approver_id: this.approver_id
        }).then(response => {
          this.resource = response.data[0]
          this.projectName = this.tenantName
          this.approvalStatus = response.data[0].form[statusKey]
        }).catch(error => {
          this.$notification.error(error.message)
        }).finally(() => { this.isLoading = false })
      }
      if (this.action === 'reject') {
        this.$store.dispatch('salesReturn/rejectByEmail', {
          ids: this.ids,
          token: this.token,
          approver_id: this.approver_id,
          reason: 'Rejected by email'
        }).then(response => {
          this.resource = response.data[0]
          this.projectName = this.tenantName
          this.approvalStatus = response.data[0].form[statusKey]
        }).catch(error => {
          this.$notification.error(error.message)
        }).finally(() => { this.isLoading = false })
      }
    }
  }
}
</script>

<style>
.approval-container {
  background-color: #434e57;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.approve-container {
  width: 300px;
  height: 300px;
  margin: 20px;
  margin-top: -100px;
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

.bg-success {
  background-color: #acdd5e;
}

.bg-danger {
  background-color: #e3805d;
}

.bg-secondary {
  background-color: gray;
}
</style>
