<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitWarehouse">
      <p-modal
        ref="warehouseModal"
        id="warehouseModal"
        :can-close="false"
        :title="title | uppercase">
        <template slot="content">
          <div v-if="isLoading">
            <h5 class="text-center">Loading ...</h5>
          </div>
          <div v-else class="list-group push">
            <div class="list-group">
              <template v-for="(warehouse, index) in user.warehouses">
                <a
                  :key="index"
                  @click="onSubmitWarehouse(warehouse, index)"
                  class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  href="javascript:void(0)">
                    <span><i class="fa fa-fw fa-hand-o-right mr-5"></i> {{ warehouse.name | titlecase }}</span>
                </a>
              </template>
            </div>
          </div>
          <!-- <div class="alert alert-info text-center" v-if="user.warehouses.length == 0 && !isLoading">
            {{ $t('you don\'t have any') | capitalize }} {{ $t('warehouse') | capitalize }}, <br/> {{ $t('you can create') }}
            <router-link :to="'/master/user/' + userId">
              <span>{{ $t('new one') }}</span>
            </router-link>
          </div> -->
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
      warehouseId: null,
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
      this.warehouseId = localStorage.getItem('defaultWarehouse')
      this.isLoading = true
      this.$refs.warehouseModal.show()
      this.find({
        id: localStorage.getItem('userId'),
        params: {
          includes: 'warehouses'
        }
      }).then((response) => {
        if (this.warehouseId) {
          this.user.warehouses.forEach(warehouse => {
            if (warehouse.id === parseInt(this.warehouseId)) {
              this.onSubmitWarehouse(warehouse)
            }
          })
        }
        this.isLoading = false
      }, (error) => {
        console.log(error.message)
        this.isLoading = false
      })
    },
    onSubmitWarehouse (warehouse) {
      this.$emit('updateWarehouse', {
        warehouse: warehouse
      })
      this.$refs.warehouseModal.close()
    }
  }
}
</script>
