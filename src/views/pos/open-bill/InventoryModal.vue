<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitInventory">
      <p-modal
        ref="inventoryModal"
        id="inventoryModal"
        :title="title | uppercase">
        <template slot="content">
          <div v-if="isLoading">
            <h5 class="text-center">Loading ...</h5>
          </div>
          <div v-else class="list-group push">
            <div class="list-group">
              <template v-if="item">
                <template v-for="(detail, index) in itemDetails">
                  <a
                    :key="index"
                    @click="onSubmitInventory(detail, index)"
                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    href="javascript:void(0)">
                      <span><i class="fa fa-fw fa-hand-o-right mr-5"></i>
                        <template v-if="detail.production_number && detail.expiry_date">
                          {{ detail.production_number | uppercase }}. Expires on {{ detail.expiry_date | dateFormat('DD MMMM YYYY') }}
                        </template>
                        <template v-else-if="detail.production_number && !detail.expiry_date">
                          {{ detail.production_number | uppercase }}
                        </template>
                        <template v-else-if="!detail.production_number && detail.expiry_date">
                          <label style="color:red">Production No. Not Available.</label> Expires on {{ detail.expiry_date | dateFormat('DD MMMM YYYY') }}
                        </template>
                        <template v-else>
                          <label style="color:red">Production No. Not Available</label>
                        </template>
                      </span>
                  </a>
                </template>
              </template>
            </div>
          </div>
          <template v-if="item">
            <div class="alert alert-info text-center" v-if="item.details.length == 0 && !isLoading">
              {{ $t('you don\'t have any') | capitalize }} {{ $t('inventory') | capitalize }}
            </div>
          </template>
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
      title: 'Inventory',
      isLoading: false,
      givenItem: null,
      itemDetails: []
    }
  },
  computed: {
    ...mapGetters('masterItem', ['item'])
  },
  methods: {
    ...mapActions('masterItem', {
      findItem: 'find'
    }),
    show (item) {
      this.givenItem = item
      this.itemDetails = []
      this.isLoading = true
      this.$refs.inventoryModal.show()
      this.findItem({
        id: item.item_id,
        params: {
          includes: 'details'
        }
      }).then((response) => {
        this.item.details.forEach(detail => {
          if (detail.stock > 0) {
            this.itemDetails.push(detail)
          }
        })
        if (this.itemDetails.length === 1) {
          this.givenItem.production_number = this.itemDetails[0].production_number || null
          this.givenItem.expiry_date = this.itemDetails[0].expiry_date || null
          this.$emit('updateInventory', {
            item: this.givenItem
          })
          this.givenItem = null
          this.$refs.inventoryModal.close()
        }
        this.isLoading = false
      }, (error) => {
        console.log(error.message)
        this.isLoading = false
      })
    },
    onSubmitInventory (inventory) {
      this.givenItem.production_number = inventory.production_number || null
      this.givenItem.expiry_date = inventory.expiry_date || null
      this.$emit('updateInventory', {
        item: this.givenItem
      })
      this.givenItem = null
      this.$refs.inventoryModal.close()
    }
  }
}
</script>
