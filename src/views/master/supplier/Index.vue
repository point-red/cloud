<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">Supplier</span>
    </breadcrumb>

    <tab-menu/>

    <br>

    <div class="row">
      <p-block :title="title" :header="true">
        <p-block-inner :is-loading="loading">
          <p-table>
            <tr slot="p-head">
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
            <tr
              v-for="supplier in suppliers"
              :key="supplier.id"
              slot="p-body">
              <td>
                <router-link :to="{ name: 'supplier.show', params: { id: supplier.id }}">
                  {{ supplier.name | titlecase }}
                </router-link>
              </td>
              <td>
                <template v-for="supplierAddress in supplier.addresses">
                  {{ supplierAddress.address | lowercase }}
                </template>
              </td>
              <td>
                <template v-for="supplierPhone in supplier.phones">
                  {{ supplierPhone.number | lowercase }}
                </template>
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
      title: 'Supplier',
      loading: true
    }
  },
  computed: {
    ...mapGetters('Supplier', ['suppliers'])
  },
  methods: {
    ...mapActions('Supplier', {
      getSupplier: 'get'
    })
  },
  created () {
    this.loading = true
    this.getSupplier({
      params: {
        sort_by: 'name'
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
