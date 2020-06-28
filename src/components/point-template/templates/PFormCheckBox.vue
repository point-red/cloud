<template>
  <div :class="{ 'form-group row': isForm }">
    <div :class="{ 'col-12': isForm }">
      <label
        class="css-control css-control-primary css-checkbox"
        @click.prevent
      >
        <input
          :id="id"
          :name="name"
          :checked="mutableChecked"
          class="css-control-input"
          type="checkbox"
        >
        <span class="css-control-indicator" />{{ description }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    description: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    checked: {
      type: [Boolean, Number],
      default: false
    },
    isForm: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      mutableChecked: false
    }
  },
  watch: {
    'mutableChecked' () {
      this.$emit('input', this.mutableChecked)
    },
    'checked' () {
      this.mutableChecked = this.checked
    }
  },
  mounted () {
    this.mutableChecked = this.checked
  },
  methods: {
    togglePerm () {
      this.mutableChecked = !this.mutableChecked
    }
  }
}
</script>
