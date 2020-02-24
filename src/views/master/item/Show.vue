<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/item" class="breadcrumb-item">{{ $t('item') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ item.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
        <div class="text-right">
          <router-link
            to="/master/item/create"
            v-if="$permission.has('create item')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('create') | uppercase }}
          </router-link>
          <router-link
            :to="{ path: '/master/item/' + item.id + '/edit', params: { id: item.id }}"
            v-if="$permission.has('update item')"
            class="btn btn-sm btn-outline-secondary mr-5">
            {{ $t('edit') | uppercase }}
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete item')"
            :disabled="isDeleting"
            class="btn btn-sm btn-outline-secondary">
            <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> {{ $t('delete') | uppercase }}
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="code"
            :label="$t('code')"
            name="code"
            v-model="item.code"
            readonly/>

          <p-form-row
            id="name"
            :label="$t('name')"
            :placeholder="$t('required') | uppercase"
            name="name"
            v-model="item.name"
            readonly/>

          <p-separator></p-separator>

          <h5>{{ $t('chart of account') | uppercase }}</h5>

          {{ $t('create item helper - chart of account') }}

          <hr>

          <p-form-row
            id="chart-of-account"
            :label="$t('chart of account')"
            name="chart-of-account"
            v-model="item.account.label"
            readonly/>

          <p-separator></p-separator>

          <h5>{{ $t('unit') | uppercase }}</h5>

          {{ $t('create item helper - unit') }}

          <hr>

          <point-table>
            <tr slot="p-head">
              <th width="50px">#</th>
              <th>Unit Converter</th>
              <th class="text-center">Default Unit Purchasing</th>
              <th class="text-center">Default Unit Sales</th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in item.units" :key="index">
              <th>{{ ++index }}</th>
              <td>
                <template v-if="index == 1">
                  {{ row.converter }} {{ row.name }}
                </template>
                <template v-else>
                  1 {{ row.name | uppercase }} = {{ row.converter }} {{ item.units[0].name | uppercase }}
                </template>
              </td>
              <td class="text-center">
                <i class="fa fa-check" v-if="row.id == item.unit_default_purchase"></i>
              </td>
              <td class="text-center">
                <i class="fa fa-check" v-if="row.id == item.unit_default_sales"></i>
              </td>
            </tr>
          </point-table>

          <p-separator></p-separator>

          <h5>{{ $t('group') | uppercase }}</h5>

          {{ $t('create item helper - group') }}

          <hr>

          <point-table>
            <tr slot="p-head">
              <th width="50px">#</th>
              <th>Group</th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in item.groups" :key="index">
              <th>{{ ++index }}</th>
              <td>
                {{ row.name }}
              </td>
            </tr>
          </point-table>

          <p-separator></p-separator>

          <h5>{{ $t('stock dna') | uppercase }}</h5>

          {{ $t('create item helper - stock dna') }}

          <hr>

          <p-form-row
            id="require-production-number"
            name="require-production-number"
            :label="$t('production number')">
            <div slot="body" class="col-lg-9 mt-10">
              <i class="fa fa-check" v-if="item.require_production_number"></i>
            </div>
          </p-form-row>

          <p-form-row
            id="require-expiry-date"
            name="require-expiry-date"
            :label="$t('expiry date')">
            <div slot="body" class="col-lg-9 mt-10">
              <i class="fa fa-check" v-if="item.require_expiry_date"></i>
            </div>
          </p-form-row>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster,
    PointTable
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters('masterItem', ['item'])
  },
  methods: {
    ...mapActions('masterItem', ['find', 'delete']),
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({ id: this.id })
          .then(response => {
            this.$notification.success('delete success')
            this.$router.replace('/master/item')
            this.isDeleting = false
          }).catch(error => {
            this.$notification.error(error.message)
            this.isDeleting = false
          })
      })
    },
    getItemRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          includes: 'account;units;groups'
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  },
  created () {
    this.getItemRequest()
  }
}
</script>
