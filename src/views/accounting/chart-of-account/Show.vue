<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting/>
      <router-link to="/accounting/chart-of-account" class="breadcrumb-item">Chart of Account</router-link>
      <span class="breadcrumb-item active">{{ chartOfAccount.number }} - {{ chartOfAccount.name | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <div class="col-lg-4">
        <p-block :title="'chart of account'" :header="true">
          <p-block-inner :is-loading="isLoading">
            <p-form-row
              id="account-type"
              name="account-type"
              :label="$t('account type')">
              <div slot="body" class="col-lg-9 mt-5">
                {{ chartOfAccount.type.alias }}
              </div>
            </p-form-row>

            <p-form-row
              id="name"
              :label="$t('name')"
              name="name">
              <div slot="body" class="col-lg-9 mt-5">
                {{ chartOfAccount.alias }}
              </div>
            </p-form-row>

            <p-form-row
              id="number"
              :label="$t('number')"
              name="number">
              <div slot="body" class="col-lg-9 mt-5">
                {{ chartOfAccount.number }}
              </div>
            </p-form-row>

            <hr>

            <router-link
              :to="{ path: '/accounting/chart-of-account/' + chartOfAccount.id + '/edit', params: { id: chartOfAccount.id }}"
              v-if="$permission.has('update chart of account')"
              class="btn btn-sm btn-primary mr-5">
              Edit
            </router-link>
          </p-block-inner>
        </p-block>
      </div>
      <div class="col-lg-8">
        <p-block :title="'chart of account'" :header="true">
          <p-block-inner :is-loading="isLoading">
            <p-form-row
              id="account-type"
              name="account-type"
              :label="$t('account type')">
              <div slot="body" class="col-lg-9 mt-5">
                {{ chartOfAccount.type.alias }}
              </div>
            </p-form-row>

            <p-form-row
              id="name"
              :label="$t('name')"
              name="name">
              <div slot="body" class="col-lg-9 mt-5">
                {{ chartOfAccount.alias }}
              </div>
            </p-form-row>

            <p-form-row
              id="number"
              :label="$t('number')"
              name="number">
              <div slot="body" class="col-lg-9 mt-5">
                {{ chartOfAccount.number }}
              </div>
            </p-form-row>

            <hr>

            <router-link
              :to="{ path: '/accounting/chart-of-account/' + chartOfAccount.id + '/edit', params: { id: chartOfAccount.id }}"
              v-if="$permission.has('update chart of account')"
              class="btn btn-sm btn-primary mr-5">
              Edit
            </router-link>
          </p-block-inner>
        </p-block>
      </div>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbAccounting
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('accountingChartOfAccount', ['chartOfAccount']),
  },
  methods: {
    ...mapActions('accountingChartOfAccount', ['find']),
  },
  created () {
    this.isLoading = true
    this.find({ id: this.id })
      .then((response) => {
        this.isLoading = false
        this.find({
          id: this.id
        }).then(response => {
          this.isLoading = false
        }).catch(error => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
      }, (error) => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
  }
}
</script>
