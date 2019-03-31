<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link
        to="/master/item"
        class="breadcrumb-item">Item</router-link>
      <span class="breadcrumb-item active">Edit</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block :title="'Create Item'" :header="true">
        <p-form-row
          id="code"
          v-model="form.code"
          :disabled="loadingSaveButton"
          :label="$t('code')"
          name="code"
          :errors="form.errors.get('code')"
          @errors="form.errors.set('code', null)"/>
          
        <p-form-row
          id="name"
          v-model="form.name"
          :disabled="loadingSaveButton"
          :label="$t('name')"
          name="name"
          :errors="form.errors.get('name')"
          @errors="form.errors.set('name', null)"/>

        <p-form-row
          id="chart-of-account"
          name="chart-of-account"
          :label="$t('chart of account')">
          <div slot="body" class="col-lg-9">
            <m-chart-of-account id="chart-of-account" v-model="form.chart_of_account_id"/>
          </div>
        </p-form-row>

        <p-form-row
          id="unit"
          v-model="form.units[0].label"
          :disabled="loadingSaveButton"
          :label="$t('unit')"
          name="unit"
          :errors="form.errors.get('unit')"
          @errors="form.errors.set('unit', null)"/>

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
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      title: 'Edit Item',
      id: this.$route.params.id,
      loading: true,
      loadingSaveButton: false,
      form: new Form({
        id: this.$route.params.id,
        code: null,
        name: null,
        chart_of_account_id: null,
        units: [
          {
            label: '',
            name: '',
            converter: null
          }
        ]
      })
    }
  },
  computed: {
    ...mapGetters('masterItem', ['item'])
  },
  watch: {
    'form.units': {
      handler: function(newValue) {
        this.form.units.forEach(function(element) {
          element.name = element.label
        })
      },
      deep: true
    }
  },
  created () {
    this.isLoading = true
    this.find({ id: this.id }, {
      params: {
        includes: 'units;account'
      }
    }).then(response => {
      this.isLoading = false
      this.form.code = this.item.code
      this.form.name = this.item.name
      this.form.chart_of_account_id = this.item.chart_of_account_id
      this.form.units[0].label = this.item.units[0].label
      this.form.units[0].name = this.item.units[0].name
      this.form.units[0].converter = this.item.units[0].converter
    }).catch(error => {
      this.isLoading = false
      this.$notification.error(error.message)
    })
  },
  methods: {
    ...mapActions('masterItem', ['find', 'update']),
    onSubmit () {
      this.update(this.form)
        .then(
          (response) => {
            this.loadingSaveButton = false
            this.form.reset()
            this.$notification.success('Update success')
            this.$router.push('/master/item/' + this.id)
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
