<template>
  <div>
    <p-modal :ref="'pricing-group-' + id" :id="'pricing-group-' + id" title="pricing group">
      <template slot="content">
        <form class="row" @submit.prevent="onSubmit">
          <p-block>
            <p-form-row
              id="label"
              v-model="form.label"
              :disabled="isSaving"
              :label="$t('label')"
              name="label"
              :errors="form.errors.get('label')"
              @errors="form.errors.set('label', null)"/>

            <div class="form-group row">
              <div class="col-md-3"></div>
              <div class="col-md-9">
                <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                  <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}
                </button>
              </div>
            </div>
          </p-block>
        </form>
      </template>
    </p-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isSaving: false,
      isLoading: false,
      form: new Form({
        label: ''
      })
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions('masterPricingGroup', ['get', 'create']),
    onSubmit () {
      this.isSaving = true
      this.create(this.form).then(response => {
        this.form.label = ''
        this.isSaving = false
        this.$emit('added', true)
      }).catch(error => {
        this.$notification.error(error.message)
        this.isSaving = false
      })
    },
    show () {
      this.$refs['pricing-group-' + this.id].show()
    },
    close () {
      this.$refs['pricing-group-' + this.id].close()
      this.$emit('close', true)
    }
  }
}
</script>

<style scoped>
input:readonly {
  background-color: white
}
input {
  min-width: 200px;
}
.link {
  border-bottom: dotted 1px #2196f3;
  color: #2196f3;
  cursor: pointer;
}
</style>
