<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin/>
      <router-link to="/plugin/scale-weight" class="breadcrumb-item">Scale Weight</router-link>
      <router-link to="/plugin/scale-weight/truck" class="breadcrumb-item">Truck</router-link>
      <span class="breadcrumb-item active">{{ data.form_number }}</span>
    </breadcrumb>

    <tab-menu></tab-menu>

    <div class="row">
      <p-block :title="$t('scale weight truck')" :header="true">
        <p-block-inner :is-loading="isLoading">
          <p-form-row id="machine_code" name="machine_code" label="Machine" v-model="data.machine_code" readonly/>
          <p-form-row id="form_number" name="form_number" label="Form" v-model="data.form_number" readonly/>
          <p-form-row id="vendor" name="vendor" label="Vendor" v-model="data.vendor" readonly/>
          <p-form-row id="driver" name="driver" label="Driver" v-model="data.driver" readonly/>
          <p-form-row id="license_number" name="license_number" label="License Number" v-model="data.license_number" readonly/>
          <p-form-row id="gross_weight" name="gross_weight" label="Gross Weight">
            <div slot="body" class="col-lg-9">
              <p-form-number :is-text-right="false" id="gross_weight" name="gross_weight" label="Gross Weight" v-model="data.gross_weight" readonly/>
            </div>
          </p-form-row>
          <p-form-row id="tare_weight" name="tare_weight" label="Tare Weight">
            <div slot="body" class="col-lg-9">
              <p-form-number :is-text-right="false" id="tare_weight" name="tare_weight" label="Tare Weight" v-model="data.tare_weight" readonly/>
            </div>
          </p-form-row>
          <p-form-row id="net_weight" name="net_weight" label="Net Weight">
            <div slot="body" class="col-lg-9">
              <p-form-number :is-text-right="false" id="net_weight" name="net_weight" label="Net Weight" v-model="data.net_weight" readonly/>
            </div>
          </p-form-row>
          <p-form-row id="time_in" name="time_in" label="Time In" v-model="data.time_in" readonly/>
          <p-form-row id="time_out" name="time_out" label="Time Out" v-model="data.time_out" readonly/>
          <p-form-row id="user" name="user" label="User" v-model="data.user" readonly/>

          <hr>

          <router-link
            :to="{ path: '/plugin/scale-weight/truck/' + scaleWeight.id + '/edit', params: { id: scaleWeight.id }}"
            v-if="$permission.has('update scale weight truck')"
            class="btn btn-sm btn-primary mr-5">
            Edit
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete scale weight truck')"
            :disabled="isDeleting"
            class="btn btn-sm btn-danger">
            <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> Delete
          </button>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/master/Breadcrumb'
import TabMenu from '../TabMenu'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPlugin,
    TabMenu
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false,
      data: {
        id: null,
        machine_code: null,
        form_number: null,
        vendor: null,
        driver: null,
        license_number: null,
        item: null,
        gross_weight: null,
        net_weight: null,
        tare_weight: null,
        time_in: null,
        time_out: null,
        user: null
      }
    }
  },
  computed: {
    ...mapGetters('pluginScaleWeightTruck', ['scaleWeight'])
  },
  methods: {
    ...mapActions('pluginScaleWeightTruck', ['find', 'delete']),
    onDelete () {
      this.isDeleting = true
      this.delete({
        id: this.id
      }).then(response => {
        this.isDeleting = false
        this.$router.push('/plugin/scale-weight/truck')
      }).catch(response => {
        this.isDeleting = false
        this.$notification.error('cannot delete this scale weight')
      })
    }
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id
    }).then(response => {
      this.isLoading = false
      this.data.machine_code = response.data.machine_code
      this.data.form_number = response.data.form_number
      this.data.vendor = response.data.vendor
      this.data.driver = response.data.driver
      this.data.license_number = response.data.license_number
      this.data.item = response.data.item
      this.data.gross_weight = response.data.gross_weight
      this.data.net_weight = response.data.net_weight
      this.data.tare_weight = response.data.tare_weight
      this.data.time_in = this.formattedDateTime(response.data.time_in)
      this.data.time_out = this.formattedDateTime(response.data.time_out)
      this.data.user = response.data.user
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  }
}
</script>
