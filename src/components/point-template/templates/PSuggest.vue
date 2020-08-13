<template>
  <div>
    <vue-autosuggest
      ref="autoSuggest"
      :suggestions="vSuggestions"
      :limit="10"
      :input-props="inputProps"
      @selected="onSelected"
    >
      <template slot-scope="{suggestion}">
        {{ suggestion.label.name }}
      </template>
    </vue-autosuggest>
    <i
      :class="{ 'si si-refresh fa-spin': loading }"
      style="position: absolute; right: 25px; top: 10px"
    />
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
import { VueAutosuggest } from 'vue-autosuggest'

export default {
  components: {
    VueAutosuggest
  },
  props: {
    initialValue: {
      type: String,
      default: ''
    },
    suggestions: {
      type: Array,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
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
  data () {
    return {
      vSuggestions: [],
      inputProps: {
        id: 'autosuggest__input',
        onInputChange: this.onInputChange,
        initialValue: this.initialValue
      }
    }
  },
  watch: {
    suggestions () {
      this.$emit('errors', null)
      this.vSuggestions = this.suggestions
    }
  },
  methods: {
    onSelected (option) {
      this.$emit('selected', option.label.name)
    },
    onInputChange (text) {
      this.$emit('selected', text)
    },
    clear () {
      this.$refs.autoSuggest.searchInput = ''
    }
  }
}
</script>

<style>
#autosuggest__input {
  outline: none;
  position: relative;
  display: block;
  padding: 10px 15px;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

#autosuggest__input.autosuggest__input-open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.autosuggest__results-container {
  position: relative;
  width: 100%;
}

.autosuggest__results {
  border: 1px solid lightgray;
  font-weight: 300;
  margin: 0;
  position: absolute;
  z-index: 10000001;
  width: 100%;
  background: white;
  padding: 0px;
  max-height: 400px;
  overflow-y: scroll;
}

.autosuggest__results ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.autosuggest__results .autosuggest__results_item {
  cursor: pointer;
  padding: 10px;
}

#autosuggest ul:nth-child(1) > .autosuggest__results_title {
  border-top: none;
}

.autosuggest__results .autosuggest__results_title {
  color: gray;
  font-size: 11px;
  margin-left: 0;
  padding: 15px 13px 5px;
  border-top: 1px solid lightgray;
}

.autosuggest__results .autosuggest__results_item:active,
.autosuggest__results .autosuggest__results_item:hover,
.autosuggest__results .autosuggest__results_item:focus,
.autosuggest__results
  .autosuggest__results_item.autosuggest__results_item-highlighted {
  background-color: #f6f6f6;
}
</style>
