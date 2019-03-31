<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">Item</span>
    </breadcrumb>

    <tab-menu/>

    <br>

    <div class="row">
      <p-block :title="title" :header="true">
        <p-block-inner :is-loading="loading">
          <p-table>
            <tr slot="p-head">
              <th>Name</th>
              <th>Account</th>
              <th>Stock</th>
            </tr>
            <tr
              v-for="item in items"
              :key="item.id"
              slot="p-body">
              <td>
                <router-link :to="{ name: 'item.show', params: { id: item.id }}">
                  {{ item.name }}
                </router-link>
              </td>
              <td>
                {{ item.account.number }} - {{ item.account.name | titlecase }}
              </td>
              <td>
                {{ item.stock | numberFormat }} {{ item.units[0].label }}
              </td>
            </tr>
          </p-table>
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
      title: 'Item',
      loading: true
    }
  },
  computed: {
    ...mapGetters('Item', ['items'])
  },
  methods: {
    ...mapActions('Item', {
      getItem: 'get'
    })
  },
  created () {
    this.loading = true
    this.getItem({
      params: {
        sort_by: 'name',
        includes: 'account;units'
      }
    }).then((response) => {
      this.loading = false
    }, (error) => {
      this.loading = false
      this.$notifications.error(error.message)
    })
  }
}
</script>
