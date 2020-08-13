<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitWarehouse"
    >
      <p-modal
        id="warehouseModal"
        ref="warehouseModal"
        :can-close="false"
        :title="title | uppercase"
      >
        <template slot="content">
          <div v-if="isLoading">
            <h5 class="text-center">
              Loading ...
            </h5>
          </div>
          <div
            v-else
            class="list-group push"
          >
            <div class="list-group">
              <template v-for="(warehouse, index) in user.warehouses">
                <a
                  :key="index"
                  class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  href="javascript:void(0)"
                  @click="onSubmitWarehouse(warehouse, index)"
                >
                  <span><i class="fa fa-fw fa-hand-o-right mr-5" /> {{ warehouse.name | titlecase }}</span>
                </a>
              </template>
            </div>
          </div>
          <div
            v-if="user.warehouses.length == 0 && !isLoading"
            class="alert alert-info text-center"
          >
            {{ $t('you don\'t have access to any') | capitalize }} {{ $t('warehouse') | capitalize }}
            <br>
            <router-link :to="'/master/user/'">
              <span>{{ $t('add access to') | capitalize }} {{ $t('warehouse') | capitalize }}</span>
            </router-link>
          </div>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      title: 'Warehouse',
      isLoading: false,
      userId: localStorage.getItem('userId')
    }
  },
  computed: {
    ...mapGetters('masterUser', ['user'])
  },
  methods: {
    ...mapActions('masterUser', ['find']),
    show () {
      this.isLoading = true
      this.$refs.warehouseModal.show()
      this.find({
        id: localStorage.getItem('userId'),
        params: {
          includes: 'warehouses'
        }
      }).then((response) => {
        const warehouseIndex = this.user.warehouses.findIndex(o => o.id === parseInt(localStorage.getItem('defaultWarehouse')))
        if (warehouseIndex >= 0) {
          this.onSubmitWarehouse(this.user.warehouses[warehouseIndex])
        }
        this.isLoading = false
      }, (error) => {
        console.log(error.message)
        this.isLoading = false
      })
    },
    onSubmitWarehouse (warehouse) {
      localStorage.setItem('defaultWarehouse', warehouse.id)
      this.$emit('updateWarehouse', {
        warehouseId: warehouse.id
      })
      this.$refs.warehouseModal.close()
    }
  }
}
</script>
