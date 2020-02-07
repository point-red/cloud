<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting/>
      <router-link to="/accounting/chart-of-account" class="breadcrumb-item">{{ $t('chart of account') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('chart of account')" :header="true">
        <p-form-row
          id="account-type"
          name="account-type"
          :label="$t('account type')">
          <div slot="body" class="col-lg-9 mt-5">
            <m-chart-of-account-type :id="'account-type'" v-model="form.type_id"/>
          </div>
        </p-form-row>

        <p-form-row
          id="account-sub-ledger"
          name="account-sub-ledger"
          :label="$t('account sub ledger')">
          <div slot="body" class="col-lg-9 mt-5">
            <m-chart-of-account-sub-ledger :id="'account-sub-ledger'" v-model="form.sub_ledger_id"/>
          </div>
        </p-form-row>

        <p-form-row
          id="number"
          v-model="form.number"
          :disabled="isLoading"
          :label="$t('number')"
          name="number"
          :errors="form.errors.get('number')"
          @errors="form.errors.set('number', null)"/>

        <p-form-row
          id="name"
          v-model="form.name"
          :disabled="isLoading"
          :label="$t('name')"
          name="name"
          :errors="form.errors.get('name')"
          @errors="form.errors.set('name', null)"/>

        <div class="form-group row">
          <div class="col-md-3"></div>
          <div class="col-md-9">
            <button type="submit" class="btn btn-sm btn-primary" :disabled="isLoading">
              <i v-show="isLoading" class="fa fa-asterisk fa-spin"/> Save
            </button>
          </div>
        </div>
      </p-block>
    </form>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbAccounting
  },
  data () {
    return {
      isLoading: false,
      form: new Form({
        type_id: null,
        sub_ledger_id: null,
        name: null,
        number: null
      })
    }
  },
  watch: {
    'form.name' () {
      this.form.code = this.form.name
    }
  },
  methods: {
    ...mapActions('accountingChartOfAccount', ['create']),
    onSubmit () {
      this.isLoading = true

      this.create(this.form)
        .then(response => {
          this.isLoading = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/accounting/chart-of-account')
        }).catch(error => {
          this.isLoading = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
