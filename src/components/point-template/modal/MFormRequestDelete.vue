<template>
  <div>
    <p-modal :ref="'form-request-delete-' + id" :id="'form-request-delete-' + id" title="form request delete">
      <template slot="content">
        <div class="row">
          <p-block class="m-0 p-0">
            <textarea rows="5" class="form-control" ref="reason" placeholder="reason" v-model="reason"></textarea>
          </p-block>
        </div>
      </template>
      <template slot="footer">
        <button type="submit" @click="onDelete()" class="btn btn-sm btn-danger">{{ $t('delete') | uppercase }}</button>
        <button type="button" @click="close()" class="btn btn-sm btn-outline-danger">{{ $t('close') | uppercase }}</button>
      </template>
    </p-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isSaving: false,
      isLoading: false,
      reason: ''
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    onDelete () {
      this.$emit('deleted', this.reason)
      this.close()
    },
    show () {
      this.$refs['form-request-delete-' + this.id].show()
      this.$refs.reason.focus()
    },
    close () {
      this.$refs['form-request-delete-' + this.id].close()
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
