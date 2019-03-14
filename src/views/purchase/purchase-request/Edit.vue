<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link
        to="/purchase/purchase-request"
        class="breadcrumb-item">Purchase Request</router-link>
      <span class="breadcrumb-item active">Edit</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="'Purchase Request'" :header="true">
        <div class="form-group row">
          <div class="col-md-3"></div>
          <div class="col-md-9">
            <button type="submit" class="btn btn-sm btn-primary" :disabled="loadingSaveButton">
              <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Save
            </button>
          </div>
        </div>
      </p-block>
    </form>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbPurchase
  },
  data () {
    return {
      id: this.$route.params.id,
      loading: true,
      loadingSaveButton: false,
      form: new Form({
        id: this.$route.params.id,
        date: null
      })
    }
  },
  computed: {
    ...mapGetters('PurchaseRequest', ['purchaseRequest'])
  },
  created () {
    this.isLoading = true
    this.find({ id: this.id })
      .then((response) => {
        this.isLoading = false
        this.form.date = this.purchaseRequest.date
      }, (error) => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
  },
  methods: {
    ...mapActions('PurchaseRequest', ['find', 'update']),
    onSubmit () {
      this.update(this.form)
        .then(
          (response) => {
            this.loadingSaveButton = false
            this.form.reset()
            this.$notification.success('Update success')
            this.$router.push('/master/allocation/' + this.id)
          },
          (error) => {
            this.loadingSaveButton = false
            this.$notification.error('Update failed')
            this.form.errors.record(error.errors)
          }
        )
    }
  }
}
</script>
