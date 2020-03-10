<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting/>
      <span class="breadcrumb-item">
        <router-link to="/accounting/cut-off" class="breadcrumb-item">{{ $t('cut off') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <div class="col-sm-12">
        <div class="row">
          <p-block class="text-center">
            <nav class="breadcrumb bg-white text-center" style="display:block !important">
              <span class="breadcrumb-item active">{{ $t('start') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('account') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('inventory') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('account payable') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('purchase down payment') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('account receivable') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('sales down payment') | uppercase }}</span>
              <span class="breadcrumb-item">{{ $t('review') | uppercase }}</span>
            </nav>
            <hr>
            <h5>CUT OFF</h5>
            <p-block-inner :is-loading="isLoading">
              <div class="col-sm-6 offset-sm-3 text-left">
                <form @submit.prevent="onSubmit">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Cumque quis odio consectetur iste dolorem, ad reiciendis odit assumenda ullam
                    tempora ipsa rerum placeat esse quo ab id eveniet quam nostrum.
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Molestiae necessitatibus ex itaque, deserunt nam,
                    quo dolor similique optio atque hic quis nostrum minus nisi perspiciatis
                    error beatae ut labore distinctio!
                  </p>
                  <p-form-row
                    id="date"
                    name="date"
                    v-if="!isLoading"
                    :label="$t('date')">
                    <div slot="body" class="col-lg-9">
                      <p-date-picker
                        id="date"
                        name="date"
                        :label="$t('date')"
                        v-model="form.date"
                        :errors="form.errors.get('date')"
                        @errors="form.errors.set('date', null)"/>
                    </div>
                  </p-form-row>
                  <hr>
                  <p-form-row
                    id="start"
                    name="start"
                    v-if="!isLoading"
                    label="">
                    <div slot="body" class="col-lg-9">
                      <button type="submit" class="btn btn-sm btn-primary mb-15" :disabled="isSaving">
                        <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('start') | uppercase }}
                      </button>
                    </div>
                  </p-form-row>
                </form>
              </div>
            </p-block-inner>
          </p-block>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isSaving: false,
      isLoading: false,
      isCutOffStarted: false,
      form: new Form({
        date: this.$moment().format('YYYY-MM-DD')
      })
    }
  },
  components: {
    Breadcrumb,
    BreadcrumbAccounting
  },
  computed: {
    ...mapGetters('accountingCutOff', ['cutOffs'])
  },
  created () {
    this.isLoading = true
    this.get({
      params: {
        includes: 'form'
      }
    }).then(response => {
      if (this.cutOffs.length > 0) {
        this.cutOffs.forEach(element => {
          this.form.date = element.form.date
          this.form.id = element.id
        })
        this.isCutOffStarted = true
      }
      this.isLoading = false
    }).catch(error => {
      this.isLoading = false
    })
  },
  methods: {
    ...mapActions('accountingCutOff', ['create', 'update', 'get']),
    onSubmit () {
      if (this.isCutOffStarted) {
        this.isSaving = true
        this.$router.push('/accounting/cut-off/create/account')
        this.update(this.form).then(response => {
          this.isSaving = false
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/accounting/cut-off/create/account')
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
        })
      } else {
        this.isSaving = true
        this.create(this.form)
          .then(response => {
            this.isSaving = false
            Object.assign(this.$data, this.$options.data.call(this))
            this.$router.push('/accounting/cut-off/create/account')
          }).catch(error => {
            this.isSaving = false
            this.$notification.error(error.message)
          })
      }
    }
  }
}
</script>
