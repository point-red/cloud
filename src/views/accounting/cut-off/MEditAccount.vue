<template>
  <div>
    <p-modal :ref="'select-' + id" :id="'select-' + id" title="edit account">
      <template slot="content">
        <form class="row" @submit.prevent="onSubmit">
          <p-block>
            <p-form-row
              id="account-type"
              name="account-type"
              :label="$t('account type')">
              <div slot="body" class="col-lg-9 mt-5">
                <m-chart-of-account-type
                :id="'edit-account-type'"
                v-model="form.type_id"
                :label="form.type.alias"/>
             </div>
            </p-form-row>

            <p-form-row
              id="sub-ledger"
              name="sub-ledger"
              :label="$t('is sub ledger account')">
              <div slot="body" class="col-lg-9">
                <p-form-check-box
                  id="is-sub-ledger"
                  name="is-sub-ledger"
                  @click.native="form.is_sub_ledger = !form.is_sub_ledger"
                  :checked="form.is_sub_ledger">
                </p-form-check-box>
              </div>
            </p-form-row>

            <p-form-row
              id="number"
              v-model="form.number"
              :disabled="isSaving"
              :label="$t('number')"
              name="number"
              :errors="form.errors.get('number')"
              @errors="form.errors.set('number', null)"/>

            <p-form-row
              id="name"
              v-model="form.alias"
              :disabled="isSaving"
              :label="$t('name')"
              name="name"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)"/>

            <p-form-row
              id="balance"
              :disabled="isSaving"
              :label="$t('balance')"
              name="balance"
              :errors="form.errors.get('balance')"
              @errors="form.errors.set('balance', null)">
              <div slot="body" class="col-lg-9">
                <p-form-number
                  id="balance"
                  name="balance"
                  :disabled="isSaving"
                  :is-text-right="false"
                  v-model="form.balance"/>
              </div>
            </p-form-row>

            <div class="form-group row">
              <div class="col-md-3"></div>
              <div class="col-md-9">
                <button type="submit" class="btn btn-sm btn-primary mr-5" :disabled="isSaving">
                  <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}
                </button>
                <button type="button" class="btn btn-sm btn-danger" :disabled="isSaving" @click="deleteAccount()">
                  <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('delete') | uppercase }}
                </button>
              </div>
            </div>
          </p-block>
        </form>
      </template>
      <template slot="footer">
        <button type="button" @click="close()" class="btn btn-sm btn-outline-danger">{{ $t('close') | uppercase }}</button>
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
        id: null,
        type_id: null,
        type: {
          alias: null
        },
        is_sub_ledger: false,
        name: null,
        alias: null,
        number: null,
        balance: 0
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
    ...mapActions('accountingCutOffAccount', ['update', 'delete']),
    onSubmit () {
      this.isSaving = true
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
          this.$emit('updated', true)
          this.form.type.alias = 'select'
          this.form.reset()
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    },
    deleteAccount () {
      this.delete(this.form)
        .then(response => {
          this.$notification.success('delete success')
          this.$emit('updated', true)
          this.close()
        })
    },
    show (account) {
      this.form.id = account.id
      this.form.type_id = account.chart_of_account.type_id
      this.form.type = account.chart_of_account.type
      this.form.is_sub_ledger = account.chart_of_account.is_sub_ledger
      this.form.number = account.chart_of_account.number
      this.form.name = account.chart_of_account.name
      this.form.alias = account.chart_of_account.alias
      this.form.balance = account.debit || account.credit
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
