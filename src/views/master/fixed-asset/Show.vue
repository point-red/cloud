<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <router-link
        to="/master/fixed-assets"
        class="breadcrumb-item"
      >
        {{ $t('fixed asset') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ fixedAsset.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <button
            v-if="$permission.has('create fixed asset')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addFixedAsset.open()"
          >
            {{ $t('create') | uppercase }}
          </button>
          <button
            v-if="$permission.has('update fixed asset')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.editFixedAsset.open(fixedAsset)"
          >
            {{ $t('edit') | uppercase }}
          </button>
          <button
            v-if="$permission.has('delete fixed asset')"
            type="button"
            :disabled="isDeleting"
            class="btn btn-sm btn-outline-secondary"
            @click="onDelete()"
          >
            <i
              v-show="isDeleting"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('delete') | uppercase }}
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="code"
            v-model="fixedAsset.code"
            name="code"
            :label="$t('code')"
            :disabled="true"
            :required="true"
          />

          <p-form-row
            id="name"
            ref="name"
            v-model="fixedAsset.name"
            name="name"
            :label="$t('name')"
            :placeholder="$t('required') | uppercase"
            :disabled="true"
            :required="true"
          />

          <p-form-row
            id="name"
            ref="name"
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
                @click="$refs.chartOfAccountRef.open()"
              >{{ fixedAsset.account ? fixedAsset.account.label : null || $t('select') | uppercase }}</span>
            </div>
          </p-form-row>

          <p-form-row
            v-if="fixedAsset.depreciation_method === 'STRAIGHT_LINE'"
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
                @click="$refs.accumulationChartOfAccountRef.open()"
              >{{ fixedAsset.accumulation_account ? fixedAsset.accumulation_account.label : null || $t('select') | uppercase }}</span>
            </div>
          </p-form-row>

          <p-form-row
            v-if="fixedAsset.depreciation_method === 'STRAIGHT_LINE'"
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
                @click="$refs.depreciationChartOfAccountRef.open()"
              >{{ fixedAsset.depreciation_account ? fixedAsset.depreciation_account.label : null || $t('select') | uppercase }}</span>
            </div>
          </p-form-row>

          <p-separator />

          <div
            v-if="fixedAsset.depreciation_method === 'STRAIGHT_LINE'"
            class="row"
          >
            <label class="col-form-label col-lg-4">{{ $t('useful life') | uppercase }}</label>
            <div class="col-lg-4 col-md-6">
              <div class="input-group mb-3">
                <p-form-number
                  id="useful-life-year"
                  v-model="fixedAsset.useful_life_year"
                  name="useful-life-year"
                  :is-text-right="false"
                  :label="$t('useful life')"
                  :disabled="true"
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
                  v-model="fixedAsset.useful_life_month"
                  name="useful-life-month"
                  :is-text-right="false"
                  :label="$t('useful life')"
                  :disabled="true"
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
            v-if="fixedAsset.depreciation_method === 'STRAIGHT_LINE'"
            id="salvage_value"
            ref="salvage_value"
            v-model="salvage_value"
            name="salvage_value"
            :placeholder="$t('required') | uppercase"
            :disabled="true"
          >
            <label
              slot="label"
              class="col-form-label col-lg-4"
            >{{ $t('salvage value') | uppercase }}</label>
            <p-form-number
              id="salvage_value"
              slot="body"
              v-model="salvage_value"
              class="col-lg-8"
              name="salvage_value"
              :is-text-right="false"
              :label="$t('salvage value')"
              :disabled="true"
            />
          </p-form-row>

          <p-separator v-if="fixedAsset.depreciation_method === 'STRAIGHT_LINE'" />

          <h5>{{ $t('group') | uppercase }}</h5>
          {{ $t('create fixed asset helper - group') }}
          <hr>

          <span
            class=""
          >
            {{ fixedAsset.groups ? fixedAsset.groups.name : null || $t('no group') | uppercase }}
          </span>
        </p-block-inner>
      </p-block>
    </div>
    <m-add-fixed-asset
      ref="addFixedAsset"
      @added="onAddedItem($event)"
    />
    <m-edit-fixed-asset
      ref="editFixedAsset"
      @updated="onUpdatedItem($event)"
    />
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters('masterFixedAsset', ['fixedAsset']),
    ...mapGetters('masterFixedAssetDepreciationMethod', ['depreciationMethods']),
    depreciation_method_name () {
      const x = this.depreciationMethods.find(dm => dm.id === this.fixedAsset.depreciation_method)
      if (x) return x.label
      return ''
    },
    salvage_value () {
      if (this.fixedAsset) return this.fixedAsset.salvage_value.replace(/\.0+/)
      return ''
    }
  },
  created () {
    this.getDepreciationMethods()
    this.findItem()
  },
  methods: {
    ...mapActions('masterFixedAsset', ['find', 'delete']),
    ...mapActions('masterFixedAssetDepreciationMethod', {
      getDepreciationMethods: 'get'
    }),
    onAddedItem (item) {
      this.$router.push('/master/fixed-assets/' + item.id)
      this.id = item.id
      this.findItem()
    },
    onUpdatedItem (item) {
      this.findItem()
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({ id: this.id })
          .then(response => {
            this.$notification.success('delete success')
            this.$router.replace('/master/fixed-assets')
            this.isDeleting = false
          }).catch(error => {
            this.$notification.error(error.message)
            this.isDeleting = false
          })
      })
    },
    findItem () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          includes: 'groups;account;accumulationAccount;depreciationAccount'
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  }
}
</script>
