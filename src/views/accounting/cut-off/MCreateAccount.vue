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

            <p-form-row
              id="balance"
              :disabled="isLoading"
              :label="$t('balance')"
              name="balance"
              :errors="form.errors.get('balance')"
              @errors="form.errors.set('balance', null)">
              <div slot="body" class="col-lg-9">
                <p-form-number
                  id="balance"
                  name="balance"
                  :is-text-right="false"
                  v-model="form.balance"/>
              </div>
            </p-form-row>

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
      isLoading: false,
      form: new Form({
        type_id: null,
        sub_ledger_id: null,
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
    this.search()
  },
  methods: {
    ...mapActions('accountingCutOffAccount', ['create']),
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
