<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitWarehouse"
    >
      <p-modal
        id="assignWarehouse"
        ref="assignWarehouse"
        :title="title"
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
              <template v-for="(warehouse, index) in warehouseList">
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
            v-if="warehouseList.length == 0 && !isLoading"
            class="alert alert-info text-center"
          >
            {{ $t('you don\'t have any') | capitalize }} {{ $t('warehouse') | capitalize }}, <br> {{ $t('you can create') }}
            <router-link :to="'/master/warehouse/create'">
              <span>{{ $t('new one') }}</span>
            </router-link>
          </div>
        </template>
        <template slot="footer">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            :disabled="isSaving"
            @click="$refs.assignWarehouse.close()"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('close') | uppercase }}
          </button>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      user: {},
      warehouseList: [],
      isLoading: false,
      isSaving: false
    }
  },
  computed: {
    ...mapGetters('masterWarehouse', ['warehouses'])
  },
  watch: {
    'assignWarehouse' () {
      this.$emit('value', this.assignWarehouse)
    }
  },
  created () {
    this.get()
  },
  methods: {
    ...mapActions('masterWarehouse', ['get']),
    ...mapActions('masterUserWarehouse', ['create']),
    ...mapActions('masterUser', {
      findUser: 'find'
    }),
    show (user) {
      this.isLoading = true
      this.$refs.assignWarehouse.show()
      this.get({
        params: {
          sort_by: 'name'
        }
      }).then((response) => {
        this.user = user
        this.warehouseList = []
        for (const warehouseIndex in this.warehouses) {
          const warehouse = this.warehouses[warehouseIndex]
          const userWarehouseIndex = this.user.warehouses.findIndex(o => o.id === warehouse.id)
          if (userWarehouseIndex < 0) {
            this.warehouseList.push(warehouse)
          }
        }
        this.isLoading = false
      }, (error) => {
        console.log(error.message)
        this.isLoading = false
      })
    },
    close () {
      this.$refs.assignWarehouse.close()
    },
    onSubmitWarehouse (warehouse, index) {
      if (!this.isSaving) {
        this.isSaving = true
        this.create({ id: this.user.id, warehouse_id: warehouse.id })
          .then((response) => {
            this.findUser({
              id: this.user.id,
              params: {
                includes: 'roles;branches;warehouses'
              }
            }).then((response) => {
              this.isSaving = false
              this.$notification.success('Update success')
              this.$refs.assignWarehouse.close()
            }, (error) => {
              this.isSaving = false
              console.log(error.message)
            })
          }, (error) => {
            this.isSaving = false
            console.log(error.message)
          })
      }
    }
  }
}
</script>
