<template>
  <div>
    <p-modal
      :id="'select-' + id"
      :ref="'select-' + id"
      title="create account payable"
    >
      <template slot="content">
        <form
          class="row"
          @submit.prevent="onSubmit"
        >
          <p-block>
            <p-form-row
              id="account"
              name="account"
              :label="$t('account')"
              :disabled="isSaving"
              :errors="form.errors.get('account')"
              @errors="form.errors.set('account', null)"
            >
              <div
                slot="body"
                class="col-lg-9 mt-5"
              >
                <m-chart-of-account
                  id="chart-of-account"
                  v-model="form.chart_of_account_id"
                  :label="form.chart_of_account_name"
                  sub-ledger="account payable"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="supplier_id"
              v-model="form.supplier_id"
              name="supplier_id"
              :label="$t('supplier')"
              :disabled="isSaving"
              :errors="form.errors.get('supplier_id')"
              @errors="form.errors.set('supplier_id', null)"
            >
              <div
                slot="body"
                class="col-lg-9 mt-5"
              >
                <m-supplier
                  id="supplier"
                  v-model="form.supplier_id"
                  :label="form.supplier_name"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="date"
              name="date"
              :label="$t('date')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-date-picker
                  id="date"
                  v-model="form.date"
                  name="date"
                  :label="$t('date')"
                  :errors="form.errors.get('date')"
                  @errors="form.errors.set('date', null)"
                />
              </div>
            </p-form-row>

            <p-form-row
              id="notes"
              v-model="form.notes"
              name="notes"
              :label="$t('notes')"
              :disabled="isSaving"
              :errors="form.errors.get('notes')"
              @errors="form.errors.set('notes', null)"
            />

            <p-form-row
              id="amount"
              name="amount"
              :label="$t('amount')"
              :disabled="isSaving"
              :errors="form.errors.get('amount')"
              @errors="form.errors.set('amount', null)"
            >
              <div
                slot="body"
                class="col-lg-9 mt-5"
              >
                <p-form-number
                  :id="'amount'"
                  v-model="form.amount"
                  :name="'amount'"
                  :is-text-right="false"
                />
              </div>
            </p-form-row>

            <div class="row">
              <div class="col-lg-9 offset-3">
                <button
                  type="submit"
                  class="btn btn-sm btn-primary"
                  :disabled="isSaving"
                >
                  <i
                    v-show="isSaving"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('save') | uppercase }}
                </button>
              </div>
            </div>
          </p-block>
        </form>
      </template>
      <template slot="footer">
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="close()"
        >
          {{ $t('close') | uppercase }}
        </button>
      </template>
    </p-modal>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import debounce from 'lodash/debounce'
import { mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isSaving: false,
      form: new Form({
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        supplier_id: null,
        supplier_name: null,
        chart_of_account_id: null,
        chart_of_account_name: null,
        notes: null,
        amount: 0
      })
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
    ...mapActions('accountingCutOffAccountPayable', ['create']),
    onSubmit () {
      this.isSaving = true

      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          this.form.supplier_name = 'select'
          this.form.chart_of_account_name = null
          this.form.reset()
          this.$emit('updated', true)
          window.location.reload(true)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    },
    show () {
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
