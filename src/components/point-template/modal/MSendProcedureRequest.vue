<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="$t('send procedure approval') | uppercase"
      overlay-theme="dark"
      @close="onClose()">
      <div class="row">
        <div class="col-sm-12">
          <div class="alert alert-danger" v-if="errors">
            <strong>{{ errors.message }}</strong>
          </div>
          <form @submit.prevent="onSubmit">
            <div class="row">
              <div class="col text-center">
                  <h6 class="mb-0">{{ $t('requested by') | uppercase }}</h6>
                  <div class="mb-50" style="font-size:11px">{{ Date.now() | dateFormat('DD MMMM YYYY') }}</div>
                  {{ requestedBy | uppercase }}
                  <div class="d-sm-block d-md-none mt-10"></div>
              </div>
              <div class="col text-center">
                <h6 class="mb-0">{{ $t('approved by') | uppercase }}</h6>
                <div class="mb-50" style="font-size:11px">_______________</div>
                <p-select
                  id="procedure"
                  name="procedure"
                  :key="approverKey"
                  v-model="form.approver_id"
                  :options="approvers"/>
              </div>
            </div>
          </form>
        </div>
      </div>
      <hr>
      <div class="pull-right">
        <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving" @click="onSubmit">
          <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('send') | uppercase }}
        </button>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: [
    'ids'
  ],
  data () {
    return {
      isSaving: false,
      isFailed: false,
      requestedBy: localStorage.getItem('userName'),
      form: {
        approver_id: null
      },
      errors: null,
      approverKey: (new Date()).toLocaleString()
    }
  },
  computed: {
    ...mapGetters('masterUser', {
      approvers: 'userList'
    })
  },
  methods: {
    ...mapActions('pluginPlayBookProcedureApproval', [
      'send'
    ]),
    async getUser () {
      this.$store.dispatch('masterUser/get', {
        params: {
          permission: 'accept play book approval procedures'
        }
      })
    },
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    async onSubmit () {
      try {
        this.isSaving = true
        this.errors = null
        const payload = this.form
        payload.ids = this.ids

        await this.send(payload)

        this.$emit('added')
        this.close()
      } catch (error) {
        this.errors = {
          message: error.message,
          ...error.errors
        }
      } finally {
        this.isSaving = false
      }
    },
    open () {
      this.$refs.modal.open()
      this.$nextTick(() => {
        this.getUser()
        this.approverKey = (new Date()).toLocaleString()
      })
    },
    close () {
      this.$refs.modal.close()
    }
  }
}
</script>

<style>
  h2 {
    line-height: 3;
  }
</style>
