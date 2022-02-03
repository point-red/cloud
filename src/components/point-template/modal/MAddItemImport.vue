<template>
  <div>
    <form @submit.prevent="onSubmit">
      <sweet-modal
        ref="modal"
        :title="$t('import item') | uppercase"
        overlay-theme="dark"
        @close="onClose()"
      >
        <div class="row">
          <div class="col-12">
            <table class="table">
              <thead class="thead-light">
                <tr>
                  <th scope="col">
                    column
                  </th>
                  <th scope="col">
                    source data
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Code</td>
                  <td>
                    <p-select
                      id="code"
                      v-model="form_code.code"
                      name="code"
                      :query="query"
                      :disabled="isSaving"
                      :options="header"
                      :errors="form_code.code"
                      @errors="form_code.code = null"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td>
                    <p-select
                      id="name"
                      v-model="form_code.name"
                      name="name"
                      :query="query"
                      :disabled="isSaving"
                      :options="header"
                      :errors="form_code.name"
                      @errors="form_code.name = null"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Chart of Account</td>
                  <td>
                    <p-select
                      id="chart_of_account"
                      v-model="form_code.chart_of_account"
                      name="chart_of_account"
                      :query="query"
                      :disabled="isSaving"
                      :options="header"
                      :errors="form_code.chart_of_account"
                      @errors="form_code.chart_of_account = null"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Unit of Measurement 1</td>
                  <td>
                    <p-select
                      id="unit_measurement_1"
                      v-model="form_code.units_measurement_1"
                      name="units_measurement_1"
                      :query="query"
                      :disabled="isSaving"
                      :options="header"
                      :errors="form_code.units_measurement_1"
                      @errors="form_code.units_measurement_1 = null"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Units of Measurement 2</td>
                  <td>
                    <p-select
                      id="units_measurement_2"
                      v-model="form_code.units_measurement_2"
                      name="units_measurement_2"
                      :query="query"
                      :disabled="isSaving"
                      :options="header"
                      :errors="form_code.units_measurement_2"
                      @errors="form_code.units_measurement_2 = null"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Units Converter 1</td>
                  <td>
                    <p-select
                      id="units_converter_1"
                      v-model="form_code.units_converter_1"
                      name="units_converter_1"
                      :query="query"
                      :disabled="isSaving"
                      :options="header"
                      :errors="form_code.units_converter_1"
                      @errors="form_code.units_converter_1 = null"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Units Converter 2</td>
                  <td>
                    <p-select
                      id="units_converter_2"
                      v-model="form_code.units_converter_2"
                      name="units_converter_2"
                      :query="query"
                      :disabled="isSaving"
                      :options="header"
                      :errors="form_code.units_converter_2"
                      @errors="form_code.units_converter_2 = null"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Expired Date</td>
                  <td>
                    <p-select
                      id="require_expiry_date"
                      v-model="form_code.require_expiry_date"
                      name="require_expiry_date"
                      :query="query"
                      :disabled="isSaving"
                      :options="header"
                      :errors="form_code.require_expiry_date"
                      @errors="form_code.require_expiry_date = null"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Production Number</td>
                  <td>
                    <p-select
                      id="require_production_number"
                      v-model="form_code.require_production_number"
                      name="require_production_number"
                      :query="query"
                      :disabled="isSaving"
                      :options="header"
                      :errors="form_code.require_production_number"
                      @errors="form_code.require_production_number = null"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Group</td>
                  <td>
                    <p-select
                      id="group_name"
                      v-model="form_code.group_name"
                      name="group_name"
                      :query="query"
                      :disabled="isSaving"
                      :options="header"
                      :errors="form_code.group_name"
                      @errors="form_code.group_name = null"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="pull-right">
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
      </sweet-modal>
    </form>
  </div>
</template>

<script>
import readXlsxFile from 'read-excel-file'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isSaving: false,
      isFailed: false,
      query: false,
      header: [],
      file: null,
      form_code: {
        start_row: null,
        code: null,
        name: null,
        chart_of_account: null,
        units_measurement_1: null,
        units_measurement_2: null,
        units_converter_1: null,
        units_converter_2: null,
        require_expiry_date: null,
        require_production_number: null,
        group_name: null
      }
    }
  },
  computed: {
    ...mapGetters('masterItem', ['item'])
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('masterItem', ['import']),
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onSubmit () {
      this.isSaving = true
      const requiredField = ['code', 'name', 'chart_of_account']
      let validate = true
      requiredField.forEach(key => {
        if (this.form_code[key] == null) {
          validate = false
          this.isSaving = false
          this.$notification.error('Field ' + key + ' is required')
        }
      })
      if (validate) {
        const data = new FormData()
        data.set('file', this.file)
        for (const [key, value] of Object.entries(this.form_code)) {
          data.set(key, value)
        }
        const payload = data
        this.import(payload)
          .then(response => {
            if (response.data) {
              this.isSaving = false
              this.$notification.success('Import success <br> Success : ' + response.data.success + '<br> Fail : ' + response.data.fail)
              // Object.assign(this.$data, this.$options.data.call(this))
              this.$emit('imported')
              this.close()
            } else {
              this.isSaving = false
              this.$notification.error('Import failed')
            }
          })
      }
    },
    open () {
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
    },
    setValue (file) {
      this.file = file
      readXlsxFile(file).then((rows) => {
        for (let i = 0; i < rows.length; i++) {
          let header = false
          for (let k = 0; k < rows[i].length; k++) {
            if (rows[i][k] !== null) {
              header = true
              this.form_code.start_row = i + 1
              this.header.push({
                id: k,
                label: rows[i][k]
              })
            }
          }
          if (header == true) {
            break
          }
        }
      })
    }
  }
}
</script>

<style>
  h2 {
    line-height: 3;
  }
</style>
