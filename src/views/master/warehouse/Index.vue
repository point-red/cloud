<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">Warehouse</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('warehouse')" :header="true">
        <p-block-inner :is-loading="isLoading">
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
      isLoading: true
    }
  },
  computed: {
    ...mapGetters('masterWarehouse', ['warehouses', 'pagination'])
  },
  methods: {
    ...mapActions('masterWarehouse', {
      getWarehouse: 'get'
    })
  },
  created () {
    this.isLoading = true
    this.getWarehouse({
      params: {
        sort_by: 'name'
      }
    }).then(response => {
      this.isLoading = false
    }).catch(error => {
      this.isLoading = false
      this.$notifications.error(error.message)
    })
  }
}
</script>
