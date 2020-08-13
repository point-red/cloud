<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <router-link
        to="/plugin/scale-weight"
        class="breadcrumb-item"
      >
        {{ $t('scale weight') | uppercase }}
      </router-link>
      <router-link
        to="/plugin/scale-weight/truck"
        class="breadcrumb-item"
      >
        {{ $t('truck') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ data.id }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block
        :title="$t('scale weight truck')"
        :header="true"
      >
        <router-link
          v-if="$permission.has('create scale weight truck')"
          slot="header"
          to="/plugin/scale-weight/truck/create"
          exact
          class="btn-block-option"
        >
          <span><i class="si si-plus" /> {{ $t('new scale weight') | titlecase }}</span>
        </router-link>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="machine_code"
            v-model="data.machine_code"
            name="machine_code"
            label="Machine"
            readonly
          />
          <p-form-row
            id="form_number"
            v-model="data.form_number"
            name="form_number"
            label="Form"
            readonly
          />
          <p-form-row
            id="vendor"
            v-model="data.vendor"
            name="vendor"
            label="Vendor"
            readonly
          />
          <p-form-row
            id="driver"
            v-model="data.driver"
            name="driver"
            label="Driver"
            readonly
          />
          <p-form-row
            id="license_number"
            v-model="data.license_number"
            name="license_number"
            label="License Number"
            readonly
          />
          <p-form-row
            id="gross_weight"
            name="gross_weight"
            label="Gross Weight"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-form-number
                id="gross_weight"
                v-model="data.gross_weight"
                :is-text-right="false"
                name="gross_weight"
                label="Gross Weight"
                readonly
              />
            </div>
          </p-form-row>
          <p-form-row
            id="tare_weight"
            name="tare_weight"
            label="Tare Weight"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-form-number
                id="tare_weight"
                v-model="data.tare_weight"
                :is-text-right="false"
                name="tare_weight"
                label="Tare Weight"
                readonly
              />
            </div>
          </p-form-row>
          <p-form-row
            id="net_weight"
            name="net_weight"
            label="Net Weight"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-form-number
                id="net_weight"
                v-model="data.net_weight"
                :is-text-right="false"
                name="net_weight"
                label="Net Weight"
                readonly
              />
            </div>
          </p-form-row>
          <p-form-row
            id="time_in"
            v-model="data.time_in"
            name="time_in"
            label="Time In"
            readonly
          />
          <p-form-row
            id="time_out"
            v-model="data.time_out"
            name="time_out"
            label="Time Out"
            readonly
          />
          <p-form-row
            id="user"
            v-model="data.user"
            name="user"
            label="User"
            readonly
          />

          <hr>

          <router-link
            v-if="$permission.has('update scale weight truck')"
            :to="{ path: '/plugin/scale-weight/truck/' + scaleWeight.id + '/edit', params: { id: scaleWeight.id }}"
            class="btn btn-sm btn-primary mr-5"
          >
            {{ $t('edit') | uppercase }}
          </router-link>
          <button
            v-if="$permission.has('delete scale weight truck')"
            type="button"
            :disabled="isDeleting"
            class="btn btn-sm btn-danger"
            @click="onDelete()"
          >
            <i
              v-show="isDeleting"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('delete') | uppercase }}
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
  created () {
    this.isLoading = true
    this.find({
      id: this.id
    }).then(response => {
      this.isLoading = false
      this.data.id = response.data.id
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
  }
}
</script>
