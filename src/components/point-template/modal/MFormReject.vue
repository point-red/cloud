<template>
  <div>
    <p-modal :ref="'form-reject-' + id" :id="'form-reject-' + id" title="form reject">
      <template slot="content">
        <div class="row">
          <p-block class="m-0 p-0">
            <textarea rows="5" class="form-control" ref="reason" placeholder="reason" v-model="reason"></textarea>
          </p-block>
        </div>
      </template>
      <template slot="footer">
        <button type="submit" @click="reject()" class="btn btn-sm btn-danger">{{ $t('reject') | uppercase }}</button>
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
    reject () {
      this.$emit('reject', this.reason)
    },
    show () {
      this.$refs['form-reject-' + this.id].show()
      this.$refs.reason.focus()
    },
    close () {
      this.$refs['form-reject-' + this.id].close()
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
