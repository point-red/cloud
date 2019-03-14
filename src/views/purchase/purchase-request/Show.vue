<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase/>
      <router-link
        to="/purchase/purchase-request"
        class="breadcrumb-item">PurchaseRequest</router-link>
      <span class="breadcrumb-item active">{{ purchaseRequest.form.number | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <br/>

    <div class="row">
      <p-block :title="title" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            label="Name"
            name="name"
            v-model="data.name"
            readonly/>

          <hr>

          <router-link
            :to="{ path: '/purchase/purchase-request/' + purchaseRequest.id + '/edit', params: { id: purchaseRequest.id }}"
            v-if="$permission.has('update purchase request')"
            class="btn btn-sm btn-primary mr-5">
            Edit
          </router-link>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    PurchaseMenu,
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      data: {
        name: null,
        email: null,
        address: null,
        phone: null,
        priority: false,
      }
    }
  },
  computed: {
    ...mapGetters('PurchaseRequest', ['purchaseRequest'])
  },
  methods: {
    ...mapActions('PurchaseRequest', ['find'])
  },
  created () {
    this.isLoading = true
    this.find({ id: this.id })
      .then(response => {
        this.isLoading = false          
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
  }
}
</script>
