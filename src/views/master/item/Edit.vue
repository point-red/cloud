<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/item" class="breadcrumb-item">{{ $t('item') | uppercase }}</router-link>
      <router-link :to="'/master/item/' + id" class="breadcrumb-item">{{ form.name | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="$t('edit') + ' ' + $t('item')" :header="true">
        <router-link
          to="/master/item/create"
          v-if="$permission.has('create item')"
          slot="header"
          exact
          class="btn btn-sm btn-outline-secondary mr-5">
          <span><i class="si si-plus"></i> {{ $t('new') | uppercase }}</span>
        </router-link>
        <p-block-inner>
          <p-form-row
            id="code"
            v-model="form.code"
            :disabled="isSaving"
            :label="$t('code')"
            name="code"
            :errors="form.errors.get('code')"
            @errors="form.errors.set('code', null)"/>

          <p-form-row
            id="name"
            v-model="form.name"
            :disabled="isSaving"
            :label="$t('name')"
            name="name"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)"/>

          <p-separator></p-separator>

          <h5>{{ $t('chart of account') | uppercase }}</h5>

          {{ $t('create item helper - chart of account') }}

          <hr>

          <m-chart-of-account id="chart-of-account" v-model="form.chart_of_account_id" :label="form.chart_of_account_label" sub-ledger="account payable"/>

          <p-separator></p-separator>

          <h5>{{ $t('unit') | uppercase }}</h5>

          {{ $t('create item helper - unit') }}

          <hr>

          <point-table>
            <tr slot="p-head">
              <th width="50px">#</th>
              <th>Unit Converter</th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in form.units" :key="index">
              <th>{{ ++index }}</th>
              <td>
                <template v-if="index == 1">
                  {{ row.converter }} {{ row.name }}
                </template>
                <template v-else>
                  1 {{ row.name | uppercase }} = {{ row.converter }} {{ form.units[0].name | uppercase }}
                  <span style="font-size: 10px" v-if="row.default_purchase">(DEFAULT UNIT FOR PURCHASE)</span>
                  <span style="font-size: 10px" v-if="row.default_sales">(DEFAULT UNIT FOR SALES)</span>
                </template>
              </td>
            </tr>
          </point-table>

          <p-separator></p-separator>

          <h5>{{ $t('group') | uppercase }}</h5>

          {{ $t('create item helper - group') }}

          <hr>

          <p-form-row
            id="item-group"
            name="item-group"
            :label="$t('group')">
            <div slot="body" class="col-lg-9 mt-5">
              <template v-for="(group, index) in form.groups">
                <m-item-group
                  :key="'item-group-'+index"
                  :id="'item-group-'+index"
                  :label="form.groups[index].name"
                  v-model="form.groups[index].id"
                  @choosen="chooseItemGroup($event, index)"
                  @clear="removeItemGroupRow(index)"/>
                <hr :key="'item-group-hr-'+index"/>
              </template>
              <button type="button" class="btn btn-sm btn-secondary" @click="addItemGroupRow">
                <i class="fa fa-plus"/>
              </button>
            </div>
          </p-form-row>

          <p-separator></p-separator>

          <h5>{{ $t('stock dna') | uppercase }}</h5>

          {{ $t('create item helper - stock dna') }}

          <hr>

          <p-form-row
            id="require-production-number"
            name="require-production-number"
            :label="$t('production number')">
            <div slot="body" class="col-lg-9">
              <p-form-check-box
                class="mb-0"
                style="float:left"
                id="require-production-number"
                name="require-production-number"
                :checked="form.require_production_number"/>
            </div>
          </p-form-row>

          <p-form-row
            id="require-expiry-date"
            name="require-expiry-date"
            :label="$t('expiry date')">
            <div slot="body" class="col-lg-9">
              <p-form-check-box
                id="require-expiry-date"
                name="require-expiry-date"
                @click.native="chooseExpiryDate()"
                :checked="form.require_expiry_date"/>
            </div>
          </p-form-row>

          <hr/>

          <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
            <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('update') | uppercase }}
          </button>
        </p-block-inner>
      </p-block>
    </form>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    PointTable,
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      title: 'Edit Item',
      id: this.$route.params.id,
      isLoading: true,
      isSaving: false,
      form: new Form({
        id: this.$route.params.id,
        code: null,
        name: null,
        chart_of_account_id: null,
        chart_of_account_label: null,
        units: [{
          label: '',
          name: '',
          converter: null
        }],
        groups: []
      })
    }
  },
  computed: {
    ...mapGetters('masterItem', ['item'])
  },
  watch: {
    'form.units': {
      handler: function (newValue) {
        this.form.units.forEach(function (element) {
          element.name = element.label
        })
      },
      deep: true
    }
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id,
      params: {
        includes: 'units;account;groups'
      }
    }).then(response => {
      this.isLoading = false
      this.form.code = this.item.code
      this.form.name = this.item.name
      this.form.groups = this.item.groups
      this.form.chart_of_account_id = this.item.chart_of_account_id
      this.form.chart_of_account_label = this.item.account.label
      this.form.units = this.item.units
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  },
  methods: {
    ...mapActions('masterItem', ['find', 'update']),
    addItemGroupRow () {
      this.form.groups.push({
        id: null,
        name: null
      })
    },
    removeItemGroupRow (group) {
      this.$delete(this.form.groups, group)
    },
    chooseItemGroup (event, index) {
      this.$set(this.form.groups, index, event)
    },
    onSubmit () {
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.form.reset()
          this.$notification.success('Update success')
          this.$router.push('/master/item/' + this.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error('Update failed')
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
