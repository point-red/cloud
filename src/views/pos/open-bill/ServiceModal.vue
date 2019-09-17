<template>
  <div>
    <form
      class="row">
      <p-modal
        ref="serviceModal"
        :id="id"
        :isLoading="loading"
        :title="title | uppercase">
        <template slot="content">
          <p-form-row
            id="name"
            name="name"
            label="name"
            :disabled="true"
            v-model="service_name">
          </p-form-row>
          <p-form-row
            id="price"
            name="price"
            :label="$t('price')">
            <div slot="body" class="col-lg-9">
              <p-form-number
                v-model="price"
                :disabled="true"
                :is-text-right="false"/>
            </div>
          </p-form-row>
          <p-form-row
            id="quantity"
            name="quantity"
            :label="$t('quantity')">
            <div slot="body" class="col-lg-9">
              <p-quantity
                v-model="quantity"
                :readonly="loadingSaveButton"
                :is-text-right="false"
                :unsigned="true"
                :showAddReduceButtons="true"/>
            </div>
          </p-form-row>
          <p-form-row
            id="discount-percent"
            name="discount-percent"
            :label="$t('discount')">
            <div slot="body" class="col-lg-9">
              <p-quantity
                v-model="discount_percent"
                :readonly="loadingSaveButton"
                :is-text-right="false"
                :unsigned="true"
                unit="%"/>
            </div>
          </p-form-row>
          <p-form-row
            id="notes"
            name="notes"
            :label="$t('notes')">
            <div slot="body" class="col-lg-12 mt-5">
              <textarea rows="5" class="form-control" placeholder="Notes" v-model="notes" :readonly="loadingSaveButton"></textarea>
            </div>
          </p-form-row>
        </template>
        <template slot="footer">
          <button
            :disabled="loadingSaveButton"
            type="button"
            class="btn btn-primary"
            @click="update">
            <i
              v-show="loadingSaveButton"
              class="fa fa-asterisk fa-spin"/> Update
          </button>
          <button
            :disabled="loadingSaveButton"
            type="button"
            class="btn btn-danger"
            @click="remove">
            <i
              v-show="loadingSaveButton"
              class="fa fa-asterisk fa-spin"/> Delete
          </button>
          <button :disabled="loadingSaveButton" type="button" class="btn btn-outline-danger" @click="close">
            <i
              v-show="loadingSaveButton"
              class="fa fa-asterisk fa-spin"/> Close
          </button>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      title: 'Service',
      loadingSaveButton: false,
      index: null,
      service_name: null,
      quantity: null,
      price: null,
      discount_percent: null,
      notes: null
    }
  },
  methods: {
    show (index, service) {
      this.index = index
      this.service_name = service.service_name
      this.quantity = service.quantity
      this.price = service.price
      this.discount_percent = service.discount_percent
      this.notes = service.notes
      this.$refs.serviceModal.show()
    },
    close () {
      this.$refs.serviceModal.close()
    },
    update () {
      if (this.discount_percent > 100) {
        this.discount_percent = 100
      } else if (this.discount_percent < 0) {
        this.discount_percent = 0
      }
      this.$emit('updateService', {
        service: {
          index: this.index,
          quantity: parseFloat(this.quantity),
          discount_percent: parseFloat(this.discount_percent),
          notes: this.notes
        }
      })
      this.index = null
      this.service_name = null
      this.quantity = null
      this.price = null
      this.discount_percent = null
      this.notes = null
      this.$refs.serviceModal.close()
    },
    remove () {
      this.$emit('deleteService', {
        service: {
          index: this.index
        }
      })
      this.index = null
      this.service_name = null
      this.quantity = null
      this.price = null
      this.discount_percent = null
      this.notes = null
      this.$refs.serviceModal.close()
    }
  }
}
</script>
