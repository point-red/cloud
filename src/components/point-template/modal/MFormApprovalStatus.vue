<template>
  <div>
    <span @click="show" class="link">{{ mutableLabel || 'SELECT' | uppercase }}</span>
    <p-modal :ref="'select-form-approval-' + id" :id="'select-form-approval-' + id" title="select form approval status">
      <template slot="content">
        <div v-if="isLoading">
          <h3 class="text-center">Loading ...</h3>
        </div>
        <div v-else class="list-group push">
          <template v-for="(option, index) in options">
          <a
            :key="index"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            :class="{'active': option.id == mutableId }"
            @click="choose(option)"
            href="javascript:void(0)">
            {{ option.label | uppercase }}
          </a>
          </template>
        </div>
      </template>
      <template slot="footer">
        <button type="button" @click="clear()" class="btn btn-sm btn-outline-danger">{{ $t('clear') | uppercase }}</button>
        <button type="button" @click="close()" class="btn btn-sm btn-outline-danger">{{ $t('close') | uppercase }}</button>
      </template>
    </p-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      searchText: '',
      options: [
        { id: null, label: 'pending', value: 'approvalPending' },
        { id: 1, label: 'approved', value: 'approvalApproved' },
        { id: 0, label: 'rejected', value: 'approvalRejected' }
      ],
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoading: false
    }
  },
  props: {
    id: {
      type: String,
      default: null
    },
    value: {
      type: [Number, String]
    },
    label: {
      type: String
    }
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300),
    label () {
      this.mutableLabel = this.label
    }
  },
  methods: {
    choose (option) {
      this.mutableId = option.id
      this.mutableLabel = option.label
      this.$emit('input', option.id)
      this.$emit('choosen', option)
      this.close()
    },
    clear () {
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('input', null)
      this.$emit('choosen', {
        value: null
      })
      this.close()
    },
    show () {
      this.$refs['select-form-approval-' + this.id].show()
    },
    close () {
      this.$refs['select-form-approval-' + this.id].close()
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
