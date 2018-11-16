<template>
  <div class="form-group row">
    <div class="col-12">
      <label class="css-control css-control-primary css-checkbox" @click.prevent>
        <input
          :id="id"
          :name="name"
          :checked="mutableChecked"
          class="css-control-input"
          type="checkbox">
        <span class="css-control-indicator"></span>{{ description }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mutableChecked: false
    }
  },
  props: {
    description: {
      type: String
    },
    id: {
      type: String
    },
    name: {
      type: String
    },
    checked: {
      type: [Boolean, Number]
    }
  },
  methods: {
    togglePerm () {
      this.mutableChecked = !this.mutableChecked
    }
  },
  mounted () {
    this.mutableChecked = this.checked
  },
  watch: {
    'mutableChecked' () {
      this.$emit('input', this.mutableChecked)
    },
    'checked' () {
      this.mutableChecked = this.checked
    }
  }
}
</script>
