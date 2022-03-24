<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance />
      <router-link
        to="/finance/cash-advance"
        class="breadcrumb-item"
      >
        {{ $t('cash advance') | uppercase }}
      </router-link>
      <span
        v-if="status=='approve'"
        class="breadcrumb-item"
      >
        {{ $t('approval all') | uppercase }}
      </span>
      <span
        v-if="status=='reject'"
        class="breadcrumb-item"
      >
        {{ $t('reject all') | uppercase }}
      </span>
    </breadcrumb>
    <div class="row">
      <p-block :title="$t('cash advance')">
        <p-block-inner :is-loading="isLoading">
          <div class="col-12 approval-content d-flex justify-content-center align-items-center">
            <h5>{{ $t(message) | uppercase }}</h5>
          </div>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbFinance
  },
  data () {
    return {
      status: this.$route.params.status,
      bulkId: JSON.parse(atob(this.$route.params.bulkId)),
      message: null,
      isLoading: true
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.onApprovalAll()
  },
  methods: {
    ...mapActions('financeCashAdvance', ['bulkApproval']),
    onApprovalAll () {
      if (this.status == 'approve' || this.status == 'reject') {
        const statusCode = this.status == 'approve' ? 1 : -1
        const activityCode = this.status == 'approve' ? 'approved by email' : 'rejected by email'
        this.bulkApproval({
          bulk_id: this.bulkId,
          status: statusCode,
          activity: activityCode
        }).then(response => {
          this.message = this.status + ' Cash Advance All Success'
          this.isLoading = false
        }).catch(error => {
          this.message = this.status + ' Cash Advance All Fail (' + error.message + ')'
          this.isLoading = false
        })
      }
    }
  }
}
</script>

<style scoped>
.approval-content{
  height: 60vh;
}
</style>
