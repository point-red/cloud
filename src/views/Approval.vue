<template>
  <div class="approval-container">
    <div class="approve-container">
      <h1 class="text-center text-white">
        {{ projectName }}
      </h1>
      <div class="floating-approve">
        <div class="header">
          <strong>APPROVAL STATUS</strong>
        </div>
        <div class="body">
          <div v-if="salesInvoice.form">
            <div class="form-number">
              {{ salesInvoice.form.number }}
            </div>
            <template>
              <div
                v-if="salesInvoice.form.approvalStatus === 1"
                class="form-status bg-success"
              >
                Approved
              </div>

              <div
                v-if="salesInvoice.form.approvalStatus === -1"
                class="form-status bg-danger"
              >
                Rejected
              </div>

              <div
                v-if="salesInvoice.form.approvalStatus === 0"
                class="form-status bg-secondary"
              >
                Pending
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosNode from '@/axiosNode'

export default {
  data: () => {
    return {
      action: '',
      token: '',
      salesInvoice: {},
      projectName: ''
    }
  },
  created () {
    this.tenant = this.$route.query.tenant || ''
    this.action = this.$route.query.action || ''
    this.token = this.$route.query.token || ''

    this.handleAction()
  },
  methods: {
    async handleAction () {
      const headers = {
        Tenant: this.tenant,
        Authorization: undefined
      }
      let salesInvoice, projectName
      if (this.action === 'approve') {
        ({ data: { data: salesInvoice, meta: { projectName } } } = await axiosNode.post('/sales/invoices/approve-with-token', {
          token: this.token
        }, { headers }))
      } else if (this.action === 'reject') {
        ({ data: { data: salesInvoice, meta: { projectName } } } = await axiosNode.post('/sales/invoices/reject-with-token', {
          token: this.token
        }, { headers }))
      }

      this.salesInvoice = salesInvoice
      this.projectName = projectName
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
