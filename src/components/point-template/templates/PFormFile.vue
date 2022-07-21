<template>
  <div>
    <input
      :id="id"
      ref="file"
      type="file"
      :name="name"
      :accept="accept"
      @change="onFileChange()"
    >
    <div
      v-for="(error, index) in errors"
      :key="index"
      class="invalid-input"
    >
      <i class="fa fa-warning" /> {{ error }}
    </div>
    <div
      v-show="help"
      class="form-text text-muted"
    >
      {{ help }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    help: {
      type: String,
      default: null
    },
    errors: {
      type: Array,
      default: null
    },
    accept: {
      type: String,
      default: '*'
    }
  },
  methods: {
    onFileChange (e) {
      this.$emit('fileChanged', this.$refs.file.files[0])
    },
    reset () {
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped>
.invalid-input {
  display: block;
  margin-top: .25rem;
  font-size: .875rem;
  color: #ef5350;
}
input {
  min-width: 200px;
}
</style>
