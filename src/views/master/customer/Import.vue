<template>
  <div class="row">
    <p-block>
      <h1>IMPORT CUSTOMER</h1>

      <a
        v-if="$permission.has('create customer')"
        style="float:left"
        href="javascript:void(0)"
        title="import"
        class="input-group-prepend"
        @click="addFiles()"
      >
        <span class="input-group-text">
          <i class="fa fa-upload" />
          <span style="margin-left: 10px">IMPORT</span>
        </span>

        <input
          id="file"
          ref="file"
          type="file"
          style="display:none"
          @change="onFileChange"
        >
      </a>
      <router-link
        to="/master/customer"
        class="btn btn-danger"
      >
        CLOSE
      </router-link>
      <hr>
      <br>
      <form @submit.prevent="onSubmit">
        <div class="row">
          <div class="col-sm-12">
            <p-block-inner :is-loading="isLoading">
              <div v-show="files">
                <p-form-row
                  id="code"
                  name="code"
                  :label="$t('code')"
                >
                  <div
                    slot="body"
                    class="col-lg-9"
                  >
                    <p-select
                      id="code"
                      v-model="form.code"
                      name="code"
                      :disabled="isSaving"
                      :options="optionList"
                      :errors="form.errors.get('code')"
                      @errors="form.errors.set('code', null)"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="name"
                  name="name"
                  :label="$t('name')"
                >
                  <div
                    slot="body"
                    class="col-lg-9"
                  >
                    <p-select
                      id="name"
                      v-model="form.name"
                      name="name"
                      :disabled="isSaving"
                      :options="optionList"
                      :errors="form.errors.get('name')"
                      @errors="form.errors.set('name', null)"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="phone"
                  name="phone"
                  :label="$t('phone')"
                >
                  <div
                    slot="body"
                    class="col-lg-9"
                  >
                    <p-select
                      id="phone"
                      v-model="form.phone"
                      name="phone"
                      :disabled="isSaving"
                      :options="optionList"
                      :errors="form.errors.get('phone')"
                      @errors="form.errors.set('phone', null)"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="email"
                  name="email"
                  :label="$t('email')"
                >
                  <div
                    slot="body"
                    class="col-lg-9"
                  >
                    <p-select
                      id="email"
                      v-model="form.email"
                      name="email"
                      :disabled="isSaving"
                      :options="optionList"
                      :errors="form.errors.get('email')"
                      @errors="form.errors.set('email', null)"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="address"
                  name="address"
                  :label="$t('address')"
                >
                  <div
                    slot="body"
                    class="col-lg-9"
                  >
                    <p-select
                      id="address"
                      v-model="form.address"
                      name="address"
                      :disabled="isSaving"
                      :options="optionList"
                      :errors="form.errors.get('address')"
                      @errors="form.errors.set('address', null)"
                    />
                  </div>
                </p-form-row>

                <div class="pull-right">
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
          </div>
        </div>
        <hr>
      </form>
    </p-block>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import axios from '@/axios'
import readXlsxFile from 'read-excel-file'

export default {
  data () {
    return {
      optionList: [],
      isLoading: false,
      isSaving: false,
      isFailed: false,
      files: null,
      formData: new FormData(),
      form: new Form({
        code: null,
        name: null,
        email: null,
        address: null,
        phone: null,
        file: {}
      })
    }
  },
  methods: {
    addFiles () {
      this.$refs.file.click()
    },
    onSubmit () {
      const data = new FormData()
      data.append('file', this.files[0])
      data.set('code', this.form.code)
      data.set('name', this.form.name)
      data.set('address', this.form.address)
      data.set('phone', this.form.phone)
      data.set('email', this.form.email)
      var self = this
      self.isLoading = true
      axios.post('/master/customers/import', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response, data) {
        self.isLoading = false
        self.$notification.success('upload success')
        self.$router.push('/master/customer')
        console.log(response)
      }).catch(function (error) {
        self.isLoading = false
        // self.$notification.error('upload error, beberapa data anda mungkin sudah berhasil terupload')
        console.log(error)
      })
    },
    async onFileChange (e) {
      this.files = this.$refs.file.files
      if (!this.files.length) {
        return
      }

      var self = this
      self.isLoading = true
      const rows = await readXlsxFile(this.files[0])
      for (let i = 0; i < rows[0].length; i++) {
        if (rows[0][i] === 'code') {
          this.form.code = i
        } else if (rows[0][i] === 'name') {
          this.form.name = i
        } else if (rows[0][i] === 'address') {
          this.form.address = i
        } else if (rows[0][i] === 'email') {
          this.form.email = i
        } else if (rows[0][i] === 'phone') {
          this.form.phone = i
        }
        this.optionList.push({
          id: i,
          label: rows[0][i]
        })
      }
      self.isLoading = false
    }
  }
}
</script>

<style>
  h2 {
    line-height: 3;
  }
</style>
