<template>
  <div>
    <p-loading-block message="generate new database, this may take a while, please wait and do not close this page" v-show="isSaving"/>

    <breadcrumb>
      <router-link to="/account/project" class="breadcrumb-item">{{ $t('project') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <tab-menu></tab-menu>

    <div class="row">
      <p-block>
        <form @submit.prevent="onSubmit">
          <p-form-row
            id="code"
            name="code"
            v-model="form.code"
            :disabled="isSaving"
            :label="$t('company identifier')"
            :help="'WEBSITE URL : ' + form.code + '.cloud.point.red'"
            :errors="form.errors.get('code')"
            @errors="form.errors.set('code', null)">
          </p-form-row>

          <p-form-row
            id="name"
            name="name"
            v-model="form.name"
            :disabled="isSaving"
            :label="$t('company name')"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)">
          </p-form-row>

          <p-form-row
            id="total_user"
            name="total_user"
            :is-text-right="false"
            v-model="form.total_user"
            :disabled="isSaving"
            :label="$t('total user')"
            :errors="form.errors.get('total_user')"
            @errors="form.errors.set('total_user', null)">
            <div slot="body" class="col-lg-9">
              <p-form-number
                id="total_user"
                name="total_user"
                :is-text-right="false"
                v-model="form.total_user"
                :disabled="isSaving"
                :label="$t('total user')"
                :errors="form.errors.get('total_user')"
                @errors="form.errors.set('total_user', null)">
              </p-form-number>
            </div>
          </p-form-row>

          <p-separator></p-separator>

          <p-form-row
            id="group"
            name="group"
            v-model="form.group"
            :disabled="isSaving"
            :label="$t('company group')"
            :errors="form.errors.get('group')"
            @errors="form.errors.set('group', null)">
          </p-form-row>

          <p-form-row
            id="address"
            name="address"
            v-model="form.address"
            :disabled="isSaving"
            :label="$t('company address')">
          </p-form-row>

          <p-form-row
            id="phone"
            name="phone"
            v-model="form.phone"
            :disabled="isSaving"
            :label="$t('company phone')">
          </p-form-row>

          <p-form-row
            id="whatsapp"
            name="whatsapp"
            v-model="form.whatsapp"
            :disabled="isSaving"
            :label="$t('company whatsapp')">
          </p-form-row>

          <p-form-row
            id="website"
            name="website"
            v-model="form.website"
            :disabled="isSaving"
            :label="$t('company website')">
          </p-form-row>

          <p-form-row
            id="marketplace-notes"
            name="marketplace-notes"
            v-model="form.marketplace_notes"
            :disabled="isSaving"
            :label="$t('marketplace notes')">
          </p-form-row>

          <p-form-row
            id="vat-id-number"
            name="vat_id_number"
            v-model="form.vat_id_number"
            :disabled="isSaving"
            :label="$t('vat identification number')">
          </p-form-row>

          <p-form-row
            id="timezone"
            name="timezone"
            :label="$t('timezone')">
            <div slot="body" class="col-form-label col-lg-9">
              <p-select-modal
                id="timezone"
                :title="'select timezone'"
                :value="form.timezone"
                :choosen="form.timezone"
                :options="timezoneOptions"
                @choosen="chooseTimezone"
                @search="searchTimezone"/>
            </div>
          </p-form-row>

          <p-separator></p-separator>

          <h5>{{ $t('choose package') | uppercase }}</h5>

          <hr>

          <div class="row gutters-tiny">
            <div class="col-md-6 col-xl-3" v-for="packageErp in packages" :key="packageErp.code">
              <div class="block block-link-shadow">
                <div class="block-content block-content-full clearfix">
                  <div class="font-size-h5 font-w600">
                    {{ packageErp.name }}
                  </div>
                  <hr>
                  <div class="font-size-sm plugin-description" style="height:70px">
                    <pre>{{ packageErp.description }}</pre>
                  </div>
                  <hr>
                  <div class="text-uppercase">
                    <span class="font-size-lg">IDR {{ packageErp.price | numberFormat }}</span> <small>/ month</small>
                  </div>
                  <hr>
                  <div class="font-size-sm font-w600 text-uppercase text-muted">
                    <button type="button" @click="choosePackage(packageErp)" v-if="form.package_id == packageErp.id" class="btn btn-sm btn-primary">SUBSCRIBED</button>
                    <button type="button" @click="choosePackage(packageErp)" v-else class="btn btn-sm btn-secondary">SUBSCRIBE</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p-separator></p-separator>

          <h5>{{ $t('choose plugin') | uppercase }}</h5>

          <hr>

          <div class="row gutters-tiny">
            <template v-for="(plugin, index) in plugins">
              <div class="col-md-6 col-xl-3" :key="index" v-if="plugin.is_active">
                <div class="block block-link-shadow">
                  <div class="block-content block-content-full clearfix">
                    <div class="font-size-h5 font-w600">
                      {{ plugin.name }}
                    </div>
                    <hr>
                    <div class="font-size-sm plugin-description">
                      {{ plugin.description }}
                    </div>
                    <hr>
                    <div class="text-uppercase">
                      <span class="font-size-lg" v-if="plugin.price != 0">IDR {{ plugin.price | numberFormat }}</span> <small v-if="plugin.is_monthly_price">/ month</small>
                      <span class="font-size-lg" v-if="plugin.price_per_user != 0">IDR {{ plugin.price_per_user | numberFormat }}</span> <small v-if="plugin.is_monthly_price_per_user">/ user / month</small>
                      <span class="font-size-lg" v-if="plugin.price == 0 && plugin.price_per_user == 0">FREE</span>
                    </div>
                    <hr>
                    <div class="font-size-sm font-w600 text-uppercase text-muted">
                      <button type="button" @click="choosePlugin(plugin)" v-if="form.plugins.findIndex(element => element.id == plugin.id) >= 0" class="btn btn-sm btn-primary">SUBSCRIBED</button>
                      <button type="button" @click="choosePlugin(plugin)" v-else class="btn btn-sm btn-secondary">SUBSCRIBE</button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <p-separator></p-separator>

          <h5>{{ $t('invoice') | uppercase }}</h5>

          <hr>

          <div class="block-content">
            <div class="row my-20">
                <div class="col-6">
                  <p class="h3">POINT</p>
                  <address>
                    Jl Musi no 21<br>
                    Jawa Timur, Surabaya<br>
                    billing@point.red<br>
                  </address>
                </div>
                <div class="col-6 text-right">
                  <p class="h3">{{ form.name }}</p>
                  <address>
                    {{ form.address }}<br>
                    {{ form.phone }}<br>
                  </address>
                </div>
            </div>
            <div class="table-responsive push">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th class="text-center" style="width: 60px;"></th>
                            <th>Product</th>
                            <th class="text-center" style="width: 90px;">Qnt</th>
                            <th class="text-right" style="width: 120px;">Price</th>
                            <th class="text-right" style="width: 120px;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="form.package_id > 1">
                            <td class="text-center">1</td>
                            <td>{{ form.package_notes }}</td>
                            <td class="text-center">{{ form.total_user }}</td>
                            <td class="text-right">{{ form.package_price | numberFormat }}</td>
                            <td class="text-right">{{ form.package_total_price | numberFormat }}</td>
                        </tr>
                        <tr v-for="(plugin, index) in form.plugins" :key="index">
                            <td class="text-center">
                              <template v-if="form.package_id == 1">{{ 1 + index }}</template>
                              <template v-if="form.package_id > 1">{{ 2 + index }}</template>
                            </td>
                            <td>
                                {{ plugin.notes | uppercase }}
                            </td>
                            <td class="text-center">
                              <template v-if="plugin.price_per_user > 0">
                                {{ form.total_user }}
                              </template>
                              <template v-else>
                                1
                              </template>
                            </td>
                            <td class="text-right">
                              {{ plugin.current_price | numberFormat }}
                            </td>
                            <td class="text-right">
                              {{ plugin.current_total_price | numberFormat }}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" class="font-w600 text-right">SUBTOTAL</td>
                            <td class="text-right">{{ form.sub_total_price | numberFormat }}</td>
                        </tr>
                        <tr>
                            <td colspan="4" class="font-w600 text-right">PPN (10%)</td>
                            <td class="text-right">{{ form.vat | numberFormat }}</td>
                        </tr>
                        <tr class="table-warning">
                            <td colspan="4" class="font-w700 text-uppercase text-right">Total Due</td>
                            <td class="font-w700 text-right">{{ form.total_price | numberFormat }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p class="text-muted text-center">Thank you very much for doing business with us. We look forward to working with you again!</p>
          </div>

          <div class="form-group row">
            <div class="col-md-12">
              <button
                :disabled="isSaving"
                type="submit"
                class="btn btn-sm btn-primary">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('create project') | uppercase }}
              </button>
            </div>
          </div>
        </form>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import TabMenu from './TabMenu'
import Form from '@/utils/Form'
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      form: new Form({
        code: '',
        name: null,
        group: null,
        address: null,
        phone: null,
        whatsapp: null,
        website: null,
        marketplace_notes: null,
        vat_id_number: null,
        timezone: null,
        package_id: 1,
        package_notes: '',
        package_price: 0,
        package_total_price: 0,
        plugins: [],
        total_user: 1,
        sub_total_price: 0,
        vat: 0,
        total_price: 0
      }),
      localTimezone: '',
      timezoneOptions: [],
      isSaving: false
    }
  },
  components: {
    Breadcrumb,
    TabMenu
  },
  computed: {
    ...mapGetters('accountPlugin', ['plugins', 'pagination']),
    ...mapGetters('accountPackage', ['packages'])
  },
  watch: {
    'form.total_user' () {
      this.calculate()
    },
    'form.plugins': {
      handler: function () {
        this.calculate()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('accountProject', ['create']),
    ...mapActions('accountPlugin', ['get']),
    ...mapActions('accountPackage', {
      getPackages: 'get'
    }),
    calculate () {
      this.form.sub_total_price = this.form.package_total_price
      this.form.vat = 0
      this.form.total_price = 0
      this.form.plugins.forEach(el => {
        el.current_price = 0
        el.current_total_price = 0
        if (el.is_monthly_price) {
          el.current_price = el.price_proportional
          el.current_total_price = el.price_proportional
        } else if (el.is_monthly_price_per_user) {
          el.current_price = el.price_per_user_proportional
          el.current_total_price = el.price_per_user_proportional * this.form.total_user
        } else {
          el.current_price = parseFloat(el.price) + parseFloat(el.price_per_user)
          el.current_total_price = parseFloat(el.price) + parseFloat(el.price_per_user)
        }
        this.form.sub_total_price += el.current_total_price
      })
      this.form.vat = this.form.sub_total_price * 10 / 100
      this.form.total_price = this.form.sub_total_price + this.form.vat
    },
    getAvailableTimezone () {
      var tzNames = this.$moment.tz.names()
      this.timezoneOptions = []
      for (var i in tzNames) {
        let tz = '(GMT' + this.$moment.tz(tzNames[i]).format('Z') + ') ' + tzNames[i]
        this.timezoneOptions.push({
          id: tzNames[i],
          label: tz
        })
      }
    },
    choosePackage (packageErp) {
      let dateNow = this.$moment(new Date()).format('DD')
      let dateEnd = this.$moment(new Date()).endOf('month').format('DD')
      this.form.package_id = packageErp.id
      this.form.package_price = (dateEnd - dateNow) / dateEnd * packageErp.price
      this.form.package_total_price = this.form.package_price
      this.form.package_notes = 'ERP ' + packageErp.name + ' ( ' + this.$moment(new Date()).format('DD MMMM YYYY') + ' - ' + this.$moment(new Date()).endOf('month').format('DD MMMM YYYY') + ' )'
      this.calculate()
    },
    choosePlugin (plugin) {
      let dateNow = this.$moment(new Date()).format('DD')
      let dateEnd = this.$moment(new Date()).endOf('month').format('DD')
      plugin.price_proportional = (dateEnd - dateNow) / dateEnd * plugin.price
      plugin.price_per_user_proportional = (dateEnd - dateNow) / dateEnd * plugin.price_per_user
      plugin.notes = plugin.name
      if (plugin.is_monthly_price || plugin.is_monthly_price_per_user) {
        plugin.notes += ' ( ' + this.$moment(new Date()).format('DD MMMM YYYY') + ' - ' + this.$moment(new Date()).endOf('month').format('DD MMMM YYYY') + ' )'
      }
      let index = this.form.plugins.findIndex(element => element.id == plugin.id)
      if (index >= 0) {
        this.form.plugins.splice(index, 1)
      } else {
        this.form.plugins.push(plugin)
      }
      this.calculate()
    },
    searchTimezone (value) {
      this.getAvailableTimezone()

      var filtered = this.timezoneOptions.filter((str) => {
        return str.label.toLowerCase().indexOf(value.toLowerCase()) >= 0
      })

      this.timezoneOptions = []
      for (var i = 0; i < filtered.length; i++) {
        this.timezoneOptions.push({
          id: filtered[i].id,
          label: filtered[i].label
        })
      }
    },
    chooseTimezone (value) {
      this.form.timezone = value.id
    },
    onSubmit () {
      this.isSaving = true
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.form.reset()
          this.$notification.success('create success')
          this.$router.push('/account/billing/' + response.data.invoice_id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  },
  created () {
    this.getAvailableTimezone()
    this.localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (this.localTimezone) {
      this.form.timezone = this.localTimezone
    }
    this.get()
    this.getPackages()
  }
}
</script>

<style scoped>
  .plugin-description {
    height: 80px;
    overflow: auto;
  }
</style>
