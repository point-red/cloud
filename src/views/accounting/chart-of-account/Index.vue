<template>
  <div>
    <breadcrumb>
      <span class="breadcrumb-item active">Chart of Account</span>
    </breadcrumb>

    <div class="row">
      <div class="col-sm-3">
        <form
          class="row"
          @submit.prevent="onSubmit">
          <p-block :header="true">
            <p-form-row
              id="type"
              name="type"
              :is-horizontal="false"
              :label="$t('type')">
              <div slot="body">
                <p-select
                  id="type_id"
                  name="type_id"
                  :disabled="loadingSaveButton"
                  v-model="form.type_id"
                  :options="chartOfAccountTypeList"
                  :errors="form.errors.get('type_id')"
                  @errors="form.errors.set('type_id', null)"/>
              </div>
            </p-form-row>

            <p-form-row
              id="number"
              v-model="form.number"
              :disabled="loadingSaveButton"
              :is-horizontal="false"
              :label="$t('number')"
              name="number"
              :errors="form.errors.get('number')"
              @errors="form.errors.set('number', null)"/>

            <p-form-row
              id="name"
              v-model="form.name"
              :disabled="loadingSaveButton"
              :is-horizontal="false"
              :label="$t('name')"
              name="name"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)"/>

            <p-form-row
              id="notes"
              v-model="form.notes"
              :disabled="loadingSaveButton"
              :is-horizontal="false"
              :label="$t('notes')"
              name="notes"
              :errors="form.errors.get('notes')"
              @errors="form.errors.set('notes', null)"/>

            <div class="form-group row">
              <div class="col-md-12">
                <button
                  type="submit"
                  :disabled="loadingSaveButton"
                  class="btn btn-sm btn-primary">
                  <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Save
                </button>
              </div>
            </div>
          </p-block>
        </form>
      </div>
      <div class="col-sm-9">
        <p-block :header="true" :column="''" title="Chart Of Account">
          <p-block-inner :is-loading="loading">
            <p-table>
              <tr slot="p-head">
                <th>Number</th>
                <th>Name</th>
                <th>Type</th>
                <th></th>
              </tr>
              <tr
                v-for="chartOfAccount in chartOfAccounts"
                :key="chartOfAccount.id"
                slot="p-body">
                <td>{{ chartOfAccount.number }}</td>
                <td>{{ chartOfAccount.name }}</td>
                <td>{{ chartOfAccount.type.name }}</td>
                <td>
                  <button type="button" class="btn btn-sm btn-secondary" @click="edit(chartOfAccount)">Edit</button>
                  <button type="button" class="btn btn-sm btn-danger" :disabled="loadingSaveButton" @click="remove(chartOfAccount)"><i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Delete</button>
                </td>
              </tr>
            </p-table>
          </p-block-inner>
        </p-block>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/accounting/Breadcrumb'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      loading: false,
      loadingSaveButton: false,
      form: new Form({
        id: null,
        type_id: null,
        number: null,
        name: null,
        alias: null
      })
    }
  },
  components: {
    Breadcrumb
  },
  computed: {
    ...mapGetters('ChartOfAccount', ['chartOfAccounts']),
    ...mapGetters('ChartOfAccountType', ['chartOfAccountTypeList'])
  },
  methods: {
    ...mapActions('ChartOfAccount', {
      getChartOfAccounts: 'get',
      storeChartOfAccount: 'create',
      updateChartOfAccount: 'update',
      deleteChartOfAccount: 'delete'
    }),
    ...mapActions('ChartOfAccountType', {
      getChartOfAccountTypes: 'get'
    }),
    onSubmit () {
      if (this.form.id === null) {
        this.create()
      } else {
        this.update()
      }
    },
    edit (chartOfAccount) {
      this.form.id = chartOfAccount.id
      this.form.type_id = chartOfAccount.type.id
      this.form.number = chartOfAccount.number
      this.form.name = chartOfAccount.name
      this.form.alias = chartOfAccount.alias
    },
    create () {
      this.loadingSaveButton = true
      this.storeChartOfAccount(this.form)
        .then((response) => {
          this.loadingSaveButton = false
          this.$notification.success('Create success')
        }, (error) => {
          this.loadingSaveButton = false
          this.$notification.error(error.message)
        })
    },
    update () {
      this.loadingSaveButton = true
      this.updateChartOfAccount(this.form)
        .then((response) => {
          this.loadingSaveButton = false
          this.form.reset()
          this.$notification.success('Update success')
        }, (error) => {
          this.loadingSaveButton = false
          this.$notification.error(error.message)
        })
    },
    remove (chartOfAccount) {
      this.deleteChartOfAccount(chartOfAccount)
        .then((response) => {
          this.$notification.success('Delete success')
        }, (error) => {
          this.$notification.error(error.message)
        })
    }
  },
  created () {
    this.loading = true
    this.getChartOfAccounts()
    this.getChartOfAccountTypes()
      .then((response) => {
        this.loading = false
        console.log(response.data)
      }, (error) => {
        this.loading = false
        console.log(JSON.stringify(error))
      })
  }
}
</script>
