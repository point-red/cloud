<template>
  <div>
    <p-modal :ref="'select-' + id" :id="'select-' + id" title="create account">
      <template slot="content">
        <form class="row" @submit.prevent="onSubmit">
          <p-block>
            <p-form-row
              id="account-type"
              name="account-type"
              :label="$t('account type')">
              <div slot="body" class="col-lg-9 mt-5">
                <m-chart-of-account-type :id="'account-type'" v-model="form.type_id" :label="form.type_alias" @choosen="onChooseAccountType($event)"/>
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
              v-model="form.name"
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
                <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                  <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}
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
        type_id: null,
        type_alias: null,
        is_sub_ledger: false,
        name: null,
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
    ...mapActions('accountingCutOffAccount', ['create']),
    onSubmit () {
      this.isSaving = true
      this.form.alias = this.form.name
      this.create(this.form)
        .then(response => {
          this.$notification.success('create success')
          this.$emit('updated', true)
          this.form.type_alias = null
          this.form.reset()
          this.isSaving = false
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    },
    onChooseAccountType (accountType) {
      this.form.type_id = accountType.id
      this.form.type_alias = accountType.alias
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
