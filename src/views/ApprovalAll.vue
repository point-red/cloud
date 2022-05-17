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
        <tbody class="tbody">
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
                  v-if="resource.form.approval_status === 1"
                  class="font-white bg-success"
                >
                  Success
                </div>

                <div
                  v-if="resource.form.approval_status === -1"
                  class="font-white bg-success"
                >
                  Success
                </div>

                <div
                  v-if="resource.form.approval_status === 0"
                  class="font-white bg-secondary"
                >
                  {{ resourceType === 'TransferSend' ? 'Stock not enough' : 'pending' }}
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

export default {
  data: () => {
    return {
      crudType: '',
      action: '',
      token: '',
      resourceType: '',
      resources: [],
      projectName: '',
      approvalStatus: null,
      collectif: false
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
          this.resources = response.data
          this.projectName = this.tenantName
          this.approvalStatus = -1
        }).catch(error => {
          console.log(error.message)
        })
      }
    },
    async handleApprovalDeliveryOrder () {
      if (this.action === 'approve') {
        this.$store.dispatch('salesDeliveryOrder/approveByEmail', {
          ids: this.ids,
          token: this.token,
          approver_id: this.approver_id
        }).then(response => {
          this.resources = response.data
          this.projectName = this.tenantName
          this.approvalStatus = response.data[0].form.approval_status
        }).catch(error => {
          console.log(error.message)
        })
      }
      if (this.action === 'reject') {
        this.$store.dispatch('salesDeliveryOrder/rejectByEmail', {
          ids: this.ids,
          token: this.token,
          approver_id: this.approver_id,
          reason: 'Rejected by email'
        }).then(response => {
          this.resources = response.data
          this.projectName = this.tenantName
          this.approvalStatus = response.data[0].form.approval_status
        }).catch(error => {
          console.log(error.message)
        })
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
