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
    </breadcrumb>

    <tab-menu />

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block
        :title="$t('scale weight truck')"
        :header="true"
      >
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="machine_code"
            v-model="form.machine_code"
            name="machine_code"
            label="Machine"
          />
          <p-form-row
            id="form_number"
            v-model="form.form_number"
            name="form_number"
            label="Form"
          />
          <p-form-row
            id="vendor"
            v-model="form.vendor"
            name="vendor"
            label="Vendor"
          />
          <p-form-row
            id="driver"
            v-model="form.driver"
            name="driver"
            label="Driver"
          />
          <p-form-row
            id="license_number"
            v-model="form.license_number"
            name="license_number"
            label="License Number"
          />
          <p-form-row
            id="item"
            v-model="form.item"
            name="item"
            label="Item"
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
                v-model="form.gross_weight"
                :is-text-right="false"
                name="gross_weight"
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
                v-model="form.tare_weight"
                :is-text-right="false"
                name="tare_weight"
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
                v-model="form.net_weight"
                :is-text-right="false"
                name="net_weight"
              />
            </div>
          </p-form-row>
          <p-form-row
            id="time_in"
            name="time_in"
            :label="$t('time in')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-date-time-picker
                id="time-in"
                v-model="form.time_in"
                name="time-in"
              />
            </div>
          </p-form-row>
          <p-form-row
            id="time_out"
            name="time_out"
            :label="$t('time out')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-date-time-picker
                id="time-out"
                v-model="form.time_out"
                name="time-out"
              />
            </div>
          </p-form-row>
          <p-form-row
            id="user"
            v-model="form.user"
            name="user"
            label="User"
          />

          <hr>

          <button
            type="submit"
            class="btn btn-sm btn-primary"
            :disabled="isSaving"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('save') | uppercase }}
          </button>
        </p-block-inner>
      </p-block>
    </form>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/master/Breadcrumb'
import Form from '@/utils/Form'
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
      isSaving: false,
      form: new Form({
        id: this.$route.params.id,
        machine_code: null,
        form_number: null,
        vendor: null,
        driver: null,
        license_number: null,
        item: null,
        gross_weight: null,
        net_weight: null,
        tare_weight: null,
        time_in: this.serverDateTime(),
        time_out: this.serverDateTime(),
        user: null,
        is_delivery: 0
      })
    }
  },
  computed: {
    ...mapGetters('pluginScaleWeightTruck', ['scaleWeight'])
  },
  methods: {
    ...mapActions('pluginScaleWeightTruck', ['find', 'create']),
    onSubmit () {
      this.isSaving = true
      this.create(this.form).then(response => {
        this.isSaving = false
        this.form.reset()
        this.$notification.success('Create success')
        this.$router.push('/plugin/scale-weight/truck/' + response.data.id)
      }).catch(error => {
        this.isSaving = false
        this.$notification.error('Create failed')
        this.form.errors.record(error.errors)
      })
    }
  }
}
</script>
