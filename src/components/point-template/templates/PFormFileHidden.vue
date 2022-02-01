<template>
  <input
    :id="id"
    ref="file"
    type="file"
    :name="name"
    @change="onFileChange()"
  >
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
    }
  },
  methods: {
    onFileChange (e) {
      this.$emit('fileChanged', this.$refs.file.files[0])
      this.reset()
    },
    reset () {
      this.$refs.file.value = ''
    },
    click () {
      this.$refs.file.click()
    }
  }
}
</script>

<style scoped>
input {
  display: none;
}
</style>
