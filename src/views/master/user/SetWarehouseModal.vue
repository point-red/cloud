<template>
  <div>
    <div class="row">
      <p-modal
        id="modal"
        ref="modal"
        :title="$t('set warehouse')"
      >
        <template slot="content">
          {{ $t('set warehouse helper') }}
          <hr>
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th
                v-for="(warehouse, index) in warehouses"
                :key="index"
                class="text-center"
              >
                {{ warehouse.name | uppercase }}
              </th>
            </tr>
            <tr
              v-for="(user, userIndex) in users"
              :key="userIndex"
              slot="p-body"
            >
              <th>{{ user.name }}</th>
              <td
                v-for="(warehouse, warehouseIndex) in warehouses"
                :key="warehouseIndex"
                class="text-center"
              >
                <p-form-check-box
                  :is-form="false"
                  :checked="isChecked(user.id, warehouse.id)"
                  @click.native="toggle(user.id, warehouse.id)"
                />
              </td>
            </tr>
          </point-table>
        </template>
        <template slot="footer">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="$refs.modal.close()"
          >
            {{ $t('close') | uppercase }}
          </button>
        </template>
      </p-modal>
    </div>
  </div>
</template>

<script>
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PointTable
  },
  computed: {
    ...mapGetters('masterUser', ['users']),
    ...mapGetters('masterWarehouse', ['warehouses'])
  },
  created () {
    this.getUserRequest()
    this.getWarehouse()
  },
  methods: {
    ...mapActions('masterUser', {
      getUser: 'get'
    }),
    ...mapActions('masterWarehouse', {
      getWarehouse: 'get'
    }),
    ...mapActions('masterUserWarehouse', ['attach', 'detach']),
    getUserRequest () {
      this.getUser({
        params: {
          includes: 'roles;branches;warehouses'
        }
      })
    },
    toggle (userId, warehouseId) {
      if (this.isChecked(userId, warehouseId)) {
        this.detach({
          user_id: userId,
          warehouse_id: warehouseId
        }).then(response => {
          this.getUserRequest()
        })
      } else {
        this.attach({
          user_id: userId,
          warehouse_id: warehouseId
        }).then(response => {
          this.getUserRequest()
        })
      }
    },
    isChecked (userId, warehouseId) {
      return this.users.some(user => {
        if (user.id == userId && user.warehouses) {
          return user.warehouses.some(warehouse => {
            return warehouse.id == warehouseId
          })
        }
      })
    },
    show () {
      this.$refs.modal.show()
    },
    close () {
      this.$refs.modal.close()
    }
  }
}
</script>
