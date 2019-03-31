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

    <br/>

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
        </p-block-inner>
      </p-block>
    </div>
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
      title: 'Item',
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('masterItem', ['item']),
  },
  methods: {
    ...mapActions('masterItem', ['find']),
  },
  created () {
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
}
</script>
