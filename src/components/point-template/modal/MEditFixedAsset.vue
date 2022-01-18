<template>
  <div>
    <form @submit.prevent="onSubmit">
      <sweet-modal
        ref="modal"
        :title="$t('edit fixed asset') | uppercase"
        overlay-theme="dark"
        @close="onClose()"
      >
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="code"
              ref="code"
              v-model="form.code"
              name="code"
              :label="$t('code')"
              :disabled="true"
              :required="true"
              :errors="form.errors.get('code')"
              @errors="form.errors.set('code', null)"
            />

            <p-form-row
              id="name"
              ref="name"
              v-model="form.name"
              name="name"
              :label="$t('name')"
              :placeholder="$t('required') | uppercase"
              :disabled="isSaving"
              :required="true"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)"
            />

            <p-form-row
              id="name"
              v-model="depreciation_method_name"
              name="name"
              :label="$t('depreciation method')"
              :placeholder="$t('required') | uppercase"
              :disabled="true"
              :required="true"
            />

            <p-separator />

            <h5>{{ $t('chart of account') | uppercase }}</h5>
            {{ $t('create fixed asset helper - chart of account') | capitalize }}
            <hr>

            <p-form-row
              id="require-asset-account-number"
              name="require-asset-account-number"
            >
              <label
                slot="label"
                class="col-form-label col-lg-6"
              >{{ $t('fixed asset account') | uppercase }}</label>
              <div
                slot="body"
                class="col-lg-6"
              >
                <span
                  class=""
                  :disabled="true"
                >{{ form.chart_of_account_label || $t('select') | uppercase }}</span>

                <div
                  v-for="(error, index) in form.errors.get('chart_of_account_id')"
                  :key="index"
                  class="invalid-input"
                >
                  <i class="fa fa-warning" /> {{ error }}
                </div>
              </div>
            </p-form-row>

            <p-form-row
              v-if="form.depreciation_method === 'STRAIGHT_LINE'"
              id="require-asset-accumulation-account-number"
              name="require-asset-accumulation-account-number"
            >
              <label
                slot="label"
                class="col-form-label col-lg-6"
              >{{ $t('fixed asset accumulation account') | uppercase }}</label>
              <div
                slot="body"
                class="col-lg-6"
              >
                <span
                  class=""
                  :disabled="true"
                >{{ form.accumulation_chart_of_account_label || $t('select') | uppercase }}</span>

                <div
                  v-for="(error, index) in form.errors.get('accumulation_chart_of_account_id')"
                  :key="index"
                  class="invalid-input"
                >
                  <i class="fa fa-warning" /> {{ error }}
                </div>
              </div>
            </p-form-row>

            <p-form-row
              v-if="form.depreciation_method === 'STRAIGHT_LINE'"
              id="require-asset-depreciation-account-number"
              name="require-asset-depreciation-account-number"
            >
              <label
                slot="label"
                class="col-form-label col-lg-6"
              >{{ $t('fixed asset depreciation account') | uppercase }}</label>
              <div
                slot="body"
                class="col-lg-6"
              >
                <span
                  class=""
                  :disabled="true"
                >{{ form.depreciation_chart_of_account_label || $t('select') | uppercase }}</span>

                <div
                  v-for="(error, index) in form.errors.get('depreciation_chart_of_account_id')"
                  :key="index"
                  class="invalid-input"
                >
                  <i class="fa fa-warning" /> {{ error }}
                </div>
              </div>
            </p-form-row>

            <p-separator v-if="form.depreciation_method === 'STRAIGHT_LINE'" />

            <div
              v-if="form.depreciation_method === 'STRAIGHT_LINE'"
              class="row"
            >
              <label class="col-form-label col-lg-4">{{ $t('useful life') | uppercase }}</label>
              <div class="col-lg-4 col-md-6">
                <div class="input-group mb-3">
                  <p-form-number
                    id="useful-life-year"
                    v-model="form.useful_life_year"
                    name="useful-life-year"
                    :is-text-right="false"
                    :label="$t('useful life')"
                    :disabled="true"
                    :errors="form.errors.get('useful_life_year')"
                    @errors="form.errors.set('useful_life_year', null)"
                  />
                  <div class="input-group-append">
                    <span
                      id="basic-addon2"
                      class="input-group-text"
                      style="padding: 5px"
                    > /{{ $t("year") }}</span>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="input-group mb-3">
                  <p-form-number
                    id="useful-life-month"
                    v-model="form.useful_life_month"
                    name="useful-life-month"
                    :is-text-right="false"
                    :label="$t('useful life')"
                    :disabled="true"
                    :errors="form.errors.get('useful_life_month')"
                    @errors="form.errors.set('useful_life_month', null)"
                  />
                  <div class="input-group-append">
                    <span
                      id="basic-addon2"
                      class="input-group-text"
                      style="padding: 5px"
                    > /{{ $t("month") }}</span>
                  </div>
                </div>
              </div>
            </div>

            <p-form-row
              v-if="form.depreciation_method === 'STRAIGHT_LINE'"
              id="salvage_value"
              ref="salvage_value"
              v-model="form.salvage_value"
              name="salvage_value"
              :placeholder="$t('required') | uppercase"
              :disabled="true"
              :errors="form.errors.get('salvage_value')"
              @errors="form.errors.set('salvage_value', null)"
            >
              <label
                slot="label"
                class="col-form-label col-lg-4"
              >{{ $t('salvage value') | uppercase }}</label>
              <p-form-number
                id="salvage_value"
                slot="body"
                v-model="form.salvage_value"
                class="col-lg-8"
                name="salvage_value"
                :is-text-right="false"
                :label="$t('salvage value')"
                :disabled="true"
                :errors="form.errors.get('salvage_value')"
                @errors="form.errors.set('salvage_value', null)"
              />
            </p-form-row>

            <p-separator />

            <h5>{{ $t('group') | uppercase }}</h5>
            {{ $t('create fixed asset helper - group') }}
            <hr>

            <span
              class="select-link"
              @click="$refs.fixedAssetGroupRef.open()"
            >
              {{ form.fixed_asset_group_name || $t('select') | uppercase }}
            </span>
          </div>
        </div>
        <div class="pull-right">
          <button
            type="submit"
            class="btn btn-sm btn-primary"
            :disabled="isSaving"
            @click="onSubmit"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('save') | uppercase }}
          </button>
        </div>
      </sweet-modal>
    </form>
    <m-fixed-asset-group
      ref="fixedAssetGroupRef"
      v-model="form.fixed_asset_group_id"
      @choosen="onChoosenFixedAssetGroup"
    />
  </div>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isSaving: false,
      isFailed: false,
      form: new Form({
        code: null,
        name: null,
        depreciation_method: 'STRAIGHT_LINE',
        chart_of_account_id: null,
        depreciation_chart_of_account_id: null,
        accumulation_chart_of_account_id: null,
        fixed_asset_group_id: null,
        useful_life_year: null,
        useful_life_month: null,
        salvage_value: 0
      })
    }
  },
  computed: {
    ...mapGetters('masterFixedAsset', ['fixedAsset']),
    ...mapGetters('masterFixedAssetDepreciationMethod', ['depreciationMethods']),
    depreciation_method_name () {
      const x = this.depreciationMethods.find(dm => dm.id === this.form.depreciation_method)
      if (x) return x.label
      return ''
    },
    useful_life_year () {
      return this.form.useful_life_year
    }
  },
  watch: {
    'form.useful_life_year' () {
      this.form.useful_life_month = this.useful_life_year * 12
    }
  },
  beforeDestroy () {
    this.close()
  },
  created () {
    this.getDepreciationMethods()
      .then((response) => {
        console.log(response.data)
      }, (error) => {
        console.log(JSON.stringify(error))
      })
  },
  methods: {
    ...mapActions('masterFixedAsset', ['find', 'update']),
    ...mapActions('masterFixedAssetDepreciationMethod', {
      getDepreciationMethods: 'get'
    }),
    onChoosenAccount (account) {
      this.form.chart_of_account_id = account.id
      this.form.chart_of_account_label = account.label
    },
    onChoosenAccumulationAccount (account) {
      this.form.accumulation_chart_of_account_id = account.id
      this.form.accumulation_chart_of_account_label = account.label
    },
    onChoosenDepreciationAccount (account) {
      this.form.depreciation_chart_of_account_id = account.id
      this.form.depreciation_chart_of_account_label = account.label
    },
    onChoosenFixedAssetGroup (group) {
      console.log(group)
      this.form.fixed_asset_group_id = group.id
      this.form.fixed_asset_group_name = group.name
    },
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onSubmit () {
      this.isSaving = true
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$emit('updated', response.data)
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.isFailed = true
          this.form.errors.record(error.errors)
        })
    },
    open (item = null) {
      console.log(item)
      if (item) {
        this.form.id = item.id
        this.form.code = item.code
        this.form.name = item.name
        this.form.depreciation_method = item.depreciation_method
        this.form.chart_of_account_id = item.chart_of_account_id
        this.form.chart_of_account_label = item.account ? item.account.label : null
        this.form.depreciation_chart_of_account_id = item.depreciation_chart_of_account_id
        this.form.depreciation_chart_of_account_label = item.depreciation_account ? item.depreciation_account.label : null
        this.form.accumulation_chart_of_account_id = item.accumulation_chart_of_account_id
        this.form.accumulation_chart_of_account_label = item.accumulation_account ? item.accumulation_account.label : null
        this.form.fixed_asset_group_id = item.fixed_asset_group_id
        this.form.fixed_asset_group_id = item.fixed_asset_group_id
        this.form.useful_life_year = item.useful_life_year
        this.form.useful_life_month = item.useful_life_month
        this.form.salvage_value = item.salvage_value
        if (item.salvage_value) this.form.salvage_value = this.form.salvage_value.toString().replace(/\.0+/)
        this.form.fixed_asset_group_name = item.groups ? item.groups.name : null
      }
      this.$refs.modal.open()
      this.$nextTick(() => {
        this.$refs.name.setFocus()
      })
    },
    close () {
      this.$refs.modal.close()
    }
  }
}
</script>

<style>
  h2 {
    line-height: 3;
  }
</style>
