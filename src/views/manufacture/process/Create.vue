<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture />
      <router-link
        to="/manufacture/process"
        class="breadcrumb-item"
      >
        {{ $t('process') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu />

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            v-model="form.name"
            name="name"
            :label="$t('name')"
            :placeholder="$t('required') | uppercase"
            :disabled="isSaving"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)"
          />

          <p-form-row
            id="notes"
            v-model="form.notes"
            name="notes"
            :label="$t('notes')"
            :disabled="isSaving"
            :errors="form.errors.get('notes')"
            @errors="form.errors.set('notes', null)"
          />

          <hr>

          <div class="row">
            <div class="col-lg-3" />
            <div class="col-lg-9">
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
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </form>
  </div>
</template>

<script>
import ManufactureMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbManufacture from '@/views/manufacture/Breadcrumb'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ManufactureMenu,
    Breadcrumb,
    BreadcrumbManufacture
  },
  data () {
    return {
      isLoading: false,
      isSaving: false,
      form: new Form({
        name: null,
        note: null
      })
    }
  },
  computed: {
    ...mapGetters('manufactureProcess', ['processs'])
  },
  created () {
    this.getProcesss()
  },
  methods: {
    ...mapActions('manufactureProcess', ['create', 'get']),
    getProcesss () {
      this.isLoading = true
      this.get()
        .then(response => {
          this.isLoading = false
        }).catch(error => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
    },
    onSubmit () {
      this.isSaving = true
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/manufacture/process/' + response.data.id)
        }).catch(error => {
          this.getProcesss()
          this.isSaving = false
          this.$alert.error(error.message, '<pre class="text-left">' + JSON.stringify(error.errors, null, 2) + '</pre>')
          this.form.errors.record(error.errors)
        })
    }
  }
}
</script>
