<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="$t('send instruction approval') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <div class="row">
        <div class="col-sm-12">
          <div
            v-if="errors"
            class="alert alert-danger"
          >
            <strong>{{ errors.message }}</strong>
          </div>
          <form @submit.prevent="onSubmit">
            <div class="row">
              <div class="col text-center">
                <h6 class="mb-0">
                  {{ $t('requested by') | uppercase }}
                </h6>
                <div
                  class="mb-50"
                  style="font-size:11px"
                >
                  {{ Date.now() | dateFormat('DD MMMM YYYY') }}
                </div>
                {{ requestedBy | uppercase }}
                <div class="d-sm-block d-md-none mt-10" />
              </div>
              <div class="col text-center">
                <h6 class="mb-0">
                  {{ $t('approved by') | uppercase }}
                </h6>
                <div
                  class="mb-50"
                  style="font-size:11px"
                >
                  _______________
                </div>
                <span
                  class="select-link"
                  @click="$refs.approver.open()"
                >{{ form.approver_name || $t('select') | uppercase }}</span><br>
                <span style="font-size:9px">{{ form.approver_email | uppercase }}</span>
              </div>
            </div>
          </form>
        </div>
      </div>
      <hr>
      <div class="pull-right">
        <button
          type="submit"
          class="btn btn-sm btn-primary"
          :disabled="isSaving"
          @click="onSubmit"
        >
          <i
            v-show="isSaving"
            class="fa fa-asterisk fa-spin"
          /> {{ $t('send') | uppercase }}
        </button>
      </div>
    </sweet-modal>
    <m-user
      ref="approver"
      :permission="'approve play book instruction'"
      @choosen="chooseApprover"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    ids: {
      type: Array,
      default: null
    },
    stepIds: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      isSaving: false,
      isFailed: false,
      requestedBy: localStorage.getItem('userName'),
      form: {
        approver_id: null,
        approver_name: null,
        approver_email: null
      },
      errors: null
    }
  },
  computed: {
    ...mapGetters('masterUser', {
      approvers: 'userList'
    })
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('pluginPlayBookInstructionApproval', [
      'send'
    ]),
    chooseApprover (value) {
      this.form.approver_id = value.id
      this.form.approver_name = value.fullName
      this.form.approver_email = value.email
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
        payload.step_ids = this.stepIds

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
