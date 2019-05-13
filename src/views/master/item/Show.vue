<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link
        to="/master/item"
        class="breadcrumb-item">Item</router-link>
      <span class="breadcrumb-item active">{{ item.name | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="title" :header="true">
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
            name="name"
            v-model="item.name"
            readonly/>

          <p-form-row
            id="chart-of-account"
            :label="$t('chart of account')"
            name="chart-of-account"
            v-model="item.account.alias"
            readonly/>

          <p-form-row
            id="unit"
            :label="$t('unit')"
            name="unit"
            v-model="item.units[0].label"
            readonly/>

          <p-form-row
            id="stock"
            :label="$t('stock')"
            name="stock"
            readonly>
            <div slot="body" class="col-lg-9">
              <p-form-number
                id="stock"
                label="Stock"
                name="stock"
                v-model="item.stock"
                :is-text-right="false"
                readonly/>
            </div>
          </p-form-row>

          <hr>

          <router-link
            :to="{ path: '/master/item/' + item.id + '/edit', params: { id: item.id }}"
            v-if="$permission.has('update item')"
            class="btn btn-sm btn-primary mr-5">
            Edit
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete item')"
            :disabled="isDeleting"
            class="btn btn-sm btn-danger">
            <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> Delete
          </button>

          <p-separator></p-separator>

          <h3>Stock History</h3>

          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Date</th>
              <th>Warehouse</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Total Quantity</th>
            </tr>
            <tr slot="p-body" v-for="(row, index) in item.inventories" :key="index">
              <th>{{ index + 1 }}</th>
              <td>{{ row.form.date | dateFormat }}</td>
              <td>{{ row.warehouse.name }}</td>
              <td class="text-right">{{ row.quantity | numberFormat }}</td>
              <td class="text-right">{{ row.total_quantity | numberFormat }}</td>
            </tr>
          </point-table>
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
      title: 'Item',
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
    }
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id,
      params: {
        includes: 'account;units;groups;inventories.form;inventories.warehouse'
      }
    }).then(response => {
      this.isLoading = false
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  }
}
</script>
