<template>
  <div>
    <p-modal :ref="'select-' + id" :id="'select-' + id" title="edit account payable">
      <template slot="content">
        <form class="row" @submit.prevent="onSubmit">
          <p-block>
            <p-form-row
              id="supplier"
              name="supplier"
              :label="$t('supplier')"
              v-model="form.supplier"
              :disabled="isSaving"
              :errors="form.errors.get('supplier')"
              @errors="form.errors.set('supplier', null)">
              <div slot="body" class="col-lg-9 mt-5">
                <m-supplier id="supplier" v-model="form.supplier_id" :label="form.supplier_name"/>
              </div>
            </p-form-row>

            <p-form-row
              id="account"
              name="account"
              :label="$t('account')"
              :disabled="isSaving"
              :errors="form.errors.get('account')"
              @errors="form.errors.set('account', null)">
              <div slot="body" class="col-lg-9 mt-5">
                <m-chart-of-account
                  id="chart-of-account"
                  v-model="form.chart_of_account_id"
                  :label="form.chart_of_account_name"
                  sub-ledger="account payable"/>
              </div>
            </p-form-row>

            <p-form-row
              id="notes"
              name="notes"
              :label="$t('notes')"
              v-model="form.notes"
              :disabled="isSaving"
              :errors="form.errors.get('notes')"
              @errors="form.errors.set('notes', null)"/>

            <p-form-row
              id="amount"
              name="amount"
              :label="$t('amount')"
              :disabled="isSaving"
              :errors="form.errors.get('amount')"
              @errors="form.errors.set('amount', null)">
              <div slot="body" class="col-lg-9 mt-5">
                <p-form-number
                  :id="'amount'"
                  :name="'amount'"
                  :is-text-right="false"
                  v-model="form.amount"/>
              </div>
            </p-form-row>

            <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
              <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}
            </button>
          </p-block>
        </form>
      </template>
      <template slot="footer">
        <button type="button" @click="close()" class="btn btn-outline-danger">Close</button>
      </template>
    </p-modal>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isSaving: false,
      form: new Form({
        item_id: null,
        chart_of_account_id: null,
        chart_of_account_name: null,
        supplier_id: null,
        supplier_name: null,
        notes: null,
        amount: 0
      })
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number]
    },
    label: {
      type: String
    }
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300),
    label () {
      this.mutableLabel = this.label
    }
  },
  created () {
  },
  methods: {
    ...mapActions('accountingCutOffAccountPayable', ['update']),
    onSubmit () {
      this.isSaving = true

      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$emit('updated', true)
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    },
    show (cutOffAccountPayable) {
      this.form.id = cutOffAccountPayable.id
      this.form.supplier_id = cutOffAccountPayable.supplier_id
      this.form.amount = cutOffAccountPayable.amount
      this.form.chart_of_account_id = cutOffAccountPayable.chart_of_account_id
      this.form.chart_of_account_name = cutOffAccountPayable.account.name
      this.form.notes = cutOffAccountPayable.notes
      this.form.supplier_name = cutOffAccountPayable.supplier.name
      this.$refs['select-' + this.id].show()
    },
    close () {
      this.$refs['select-' + this.id].close()
      this.$emit('close', true)
    }
  }
}
</script>

<style scoped>
input:readonly {
  background-color: white
}
input {
  min-width: 200px;
}
.link {
  border-bottom: dotted 1px #2196f3;
  color: #2196f3;
  cursor: pointer;
}
</style>
