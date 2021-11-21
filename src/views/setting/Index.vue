<template>
  <div class="p-3 row">
    <div class="col-xl-2 col-lg-4 col-sm-12">
      <div class="block block-rounded text-center">
        <div class="block-content block-content-full block-content-sm">
          <div class="d-flex justify-content-center my-3">
            <i class="si si-settings font-size-h1" />
          </div>
          <hr>
          <ul class="nav nav-pills flex-column push mt-3">
            <li class="nav-item">
              <button
                :class="{'d-block btn btn-secondary mt-2 col-12 text-left': true, active: currentPage === 'end_notes' }"
                @click="currentPage = 'end_notes'"
              >
                <span> {{ $t('end notes') | uppercase }}</span>
              </button>
            </li>
            <li class="nav-item">
              <button
                :class="{'d-block btn btn-secondary mt-2 col-12 text-left': true, active: currentPage === 'company_logo' }"
                @click="currentPage = 'company_logo'"
              >
                <span> {{ $t('company logo') | uppercase }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <p-block
      v-if="currentPage === 'company_logo'"
      class="col-xl-10 col-lg-8 col-sm-12"
      :header="true"
      title="Company Logo"
    >
      <div class="p-3">
        <div class="preview">
          <img
            v-if="imageUrl"
            :src="imageUrl"
          >
        </div>
        <div>
          <input
            :disabled="!$permission.has('update setting')"
            class="mt-2"
            type="file"
            accept="image/png, image/jpeg"
            @change="onFileChange"
          >
        </div>
        <div class="mt-3">
          <button
            class="btn btn-primary btn-sm"
            :disabled="!localUrl || onLoadingLogo || !$permission.has('update setting')"
            @click="uploadLogo"
          >
            {{ onLoadingLogo ? 'Loading...' : 'Save' }}
          </button>
        </div>
      </div>
    </p-block>

    <p-block
      v-if="currentPage === 'end_notes'"
      class="col-xl-10 col-lg-8"
      :header="true"
      title="End Notes"
    >
      <div class="p-3">
        <p-table>
          <tr slot="p-head">
            <th>Menu</th>
            <th>Description</th>
          </tr>
          <template
            v-for="(key) in Object.keys(endNote)"
          >
            <tr
              v-if="menuName[key]"
              :key="key"
              slot="p-body"
            >
              <td class="pr-3">
                {{ menuName[key] }}
              </td>
              <td>
                <input
                  v-model="endNote[key]"
                  :disabled="!$permission.has('update setting')"
                  type="text"
                  style="border: none;"
                >
              </td>
            </tr>
          </template>
        </p-table>
        <button
          class="mt-3 btn btn-primary btn-sm"
          :disabled="onLoadingEndNote || !$permission.has('update setting')"
          @click="updateSettingEndNote"
        >
          Save
        </button>
      </div>
    </p-block>
  </div>
</template>

<script>
import axiosNode from '@/axiosNode'
export default {
  components: {
  },
  data: () => {
    return {
      currentPage: 'company_logo',
      currentLogo: null,
      uploadedUrl: null,
      localUrl: null,
      image: [],
      endNote: {},
      onLoadingLogo: false,
      onLoadingEndNote: false,
      menuName: {
        purchaseRequest: 'Purchase Request',
        purchaseOrder: 'Purchase Order',
        purchaseDownPayment: 'Purchase Down Payment',
        purchaseReceive: 'Purchase Receive',
        purchaseInvoice: 'Purchase Invoice',
        purchaseReturn: 'Purchase Return',
        paymentOrderPurchase: 'Payment Order - Purchase',
        pointOfSales: 'Point of Sales',
        salesQuotation: 'Sales Quotation',
        salesOrder: 'Sales Order',
        salesDownPayment: 'Sales Down Payment',
        salesInvoice: 'Sales Invoice',
        salesReturn: 'Sales Return',
        paymentCollectionSales: 'Payment Collection - Sales',
        expeditionOrder: 'Expedition Order',
        expeditionDownPayment: 'Expediton Down Payment',
        expeditionInvoice: 'Expedition Invoice',
        paymentOrderExpedition: 'Payment Order Expedition',
        stockCorrection: 'Stock Correction'
      }
    }
  },
  computed: {
    imageUrl () {
      return this.localUrl || (this.currentLogo && this.currentLogo.publicUrl) || null
    }
  },
  async created () {
    this.getSettingLogo()
    this.getSettingEndNote()
  },
  methods: {
    async getSettingLogo () {
      this.onLoadingLogo = false
      try {
        const { data: { data: currentLogo } } = await axiosNode.get('/setting/logo')
        this.currentLogo = currentLogo
      } catch (e) {
        console.log(e)
      }
      this.onLoadingLogo = false
    },
    onFileChange (e) {
      const file = e.target.files[0]
      this.localUrl = URL.createObjectURL(file)
      this.image = e.target.files[0]
    },
    async uploadLogo () {
      this.onLoadingLogo = true
      try {
        const formData = new FormData()
        formData.append('image', this.image)
        const { data: { data: currentLogo } } = await axiosNode.post('/setting/logo', formData)
        this.currentLogo = currentLogo
        this.$notification.success('update success')
      } catch (error) {
        this.$notification.error(error.message)
      }
      this.onLoadingLogo = false
    },
    async getSettingEndNote () {
      this.onLoadingEndNote = true
      try {
        const { data: { data: endNote } } = await axiosNode.get('/setting/end-note')
        this.endNote = endNote
      } catch (e) {
        console.log(e)
      }
      this.onLoadingEndNote = false
    },
    async updateSettingEndNote () {
      this.onLoadingEndNote = true
      try {
        const requestBody = {
          purchaseRequest: this.endNote.purchaseRequest,
          purchaseOrder: this.endNote.purchaseOrder,
          purchaseDownPayment: this.endNote.purchaseDownPayment,
          purchaseReceive: this.endNote.purchaseReceive,
          purchaseInvoice: this.endNote.purchaseInvoice,
          purchaseReturn: this.endNote.purchaseReturn,
          paymentOrderPurchase: this.endNote.paymentOrderPurchase,
          pointOfSales: this.endNote.pointOfSales,
          salesQuotation: this.endNote.salesQuotation,
          salesOrder: this.endNote.salesOrder,
          salesDownPayment: this.endNote.salesDownPayment,
          salesInvoice: this.endNote.salesInvoice,
          salesReturn: this.endNote.salesReturn,
          paymentCollectionSales: this.endNote.paymentCollectionSales,
          expeditionOrder: this.endNote.expeditionOrder,
          expeditionDownPayment: this.endNote.expeditionDownPayment,
          expeditionInvoice: this.endNote.expeditionInvoice,
          paymentOrderExpedition: this.endNote.paymentOrderExpedition,
          stockCorrection: this.endNote.stockCorrection
        }
        const { data: { data: endNote } } = await axiosNode.post('/setting/end-note', requestBody)
        this.endNote = endNote
        this.$notification.success('update success')
      } catch (error) {
        this.$notification.error(error.message)
      }
      this.onLoadingEndNote = false
    }
  }
}
</script>

<style scoped>
.preview {
  width: 200px;
}
.preview img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
</style>
