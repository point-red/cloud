<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">Warehouse</span>
    </breadcrumb>

    <tab-menu/>

    <br>

    <div class="row">
      <p-block :title="title" :header="true">
        <p-block-inner :is-loading="loading">
          <p-table>
            <tr slot="p-head">
              <th>Name</th>
            </tr>
            <tr
              v-for="warehouse in warehouses"
              :key="warehouse.id"
              slot="p-body">
              <td>
                <router-link :to="{ name: 'warehouse.show', params: { id: warehouse.id }}">
                  {{ warehouse.name | titlecase }}
                </router-link>
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
      title: 'Warehouse',
      loading: true
    }
  },
  computed: {
    ...mapGetters('masterWarehouse', ['warehouses'])
  },
  methods: {
    ...mapActions('masterWarehouse', {
      getWarehouse: 'get'
    })
  },
  created () {
    this.loading = true
    this.getWarehouse({
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
