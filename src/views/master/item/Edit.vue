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
      <p-block :title="$t('edit') + ' ' + $t('item')" :header="true">
        <p-block-inner>
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
            <div slot="body" class="col-lg-9 mt-5">
              <m-chart-of-account id="chart-of-account" v-model="form.chart_of_account_id" type="inventory"/>
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

          <p-form-row
            id="item-group"
            name="item-group"
            :label="$t('group')">
            <div slot="body" class="col-lg-9 mt-5">
              <template v-for="(group, index) in form.groups">
                <m-item-group
                  :key="'item-group-'+index"
                  :id="'item-group-'+index"
                  :label="form.groups[index].label"
                  type="pos"
                  v-model="form.groups[index].id"
                  @choosen="chooseItemGroup($event, index)"
                  @clear="removeItemGroupRow(index)"/>
                <hr :key="'item-group-hr-'+index"/>
              </template>
              <button type="button" class="btn btn-sm btn-secondary" @click="addItemGroupRow">
                <i class="fa fa-plus"/> Add More Group
              </button>
            </div>
          </p-form-row>

          <hr/>

          <button type="submit" class="btn btn-sm btn-primary" :disabled="loadingSaveButton">
            <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Save
          </button>
        </p-block-inner>
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
        ],
        groups: []
      })
    }
  },
  computed: {
    ...mapGetters('masterItem', ['item'])
  },
  watch: {
    'form.units': {
      handler: function (newValue) {
        this.form.units.forEach(function (element) {
          element.name = element.label
        })
      },
      deep: true
    }
  },
  created () {
    this.isLoading = true
    this.find({
      id: this.id,
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
    addItemGroupRow () {
      this.form.groups.push({
        id: null,
        label: null,
        name: null,
        type: 'pos',
        class_reference: 'Item'
      })
    },
    removeItemGroupRow (group) {
      this.$delete(this.form.groups, group)
    },
    chooseItemGroup (event, index) {
      this.$set(this.form.groups, index, event)
    },
    onSubmit () {
      this.update(this.form)
        .then(response => {
          this.loadingSaveButton = false
          this.form.reset()
          this.$notification.success('Update success')
          this.$router.push('/master/item/' + this.id)
        }).catch(error => {
          this.loadingSaveButton = false
          this.$notification.error('Update failed')
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
