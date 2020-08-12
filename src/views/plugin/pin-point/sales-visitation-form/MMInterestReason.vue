<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select interest reason') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <input
        v-model="searchText"
        type="text"
        class="form-control"
        placeholder="Search..."
        @keydown.enter.prevent=""
      >
      <hr>
      <div v-if="isLoading">
        <h3 class="text-center">
          Loading ...
        </h3>
      </div>
      <div
        v-else
        class="list-group push"
      >
        <template v-for="(option, index) in options">
          <a
            :key="index"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            :class="{ 'active': isChoosen(option) }"
            href="javascript:void(0)"
            @click="choose(option)"
          >
            {{ option.name | uppercase }}
          </a>
        </template>
      </div>
      <div
        v-if="searchText && options.length == 0 && !isLoading"
        class="alert alert-info text-center"
      >
        {{ $t('searching not found', [searchText]) | capitalize }} <br>
      </div>
      <div class="pull-left">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary mr-5"
          @click="$refs.addInterestReason.open()"
        >
          {{ $t('create new') | uppercase }}
        </button>
      </div>
      <div class="pull-right">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary mr-5"
          @click="clear"
        >
          {{ $t('clear') | uppercase }}
        </button>
        <button
          type="submit"
          class="btn btn-sm btn-primary"
          @click="onSubmit"
        >
          {{ $t('submit') | uppercase }}
        </button>
      </div>
    </sweet-modal>
    <m-add-interest-reason
      id="add-interest-reason"
      ref="addInterestReason"
      @added="onAddedInterestReason($event)"
    />
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import _ from 'lodash'
import MAddInterestReason from './MAddInterestReason'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    MAddInterestReason
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      searchText: '',
      options: [],
      choosen: [],
      limit: 20,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('pluginPinPointInterestReason', ['interestReasons', 'pagination'])
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300)
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('pluginPinPointInterestReason', ['get', 'create']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          limit: this.limit,
          filter_like: {
            name: this.searchText
          }
        }
      }).then(response => {
        this.options = []
        response.data.map((key, value) => {
          this.options.push({
            id: key.id,
            name: key.name
          })
        })
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    onAddedInterestReason () {
      this.search()
    },
    onSubmit () {
      this.$emit('choosen', this.choosen)
      this.close()
    },
    isChoosen (option) {
      return this.choosen.some(element => {
        return element.id == option.id
      })
    },
    choose (option) {
      const isChoosen = this.choosen.some(element => {
        return element.id == option.id
      })
      if (isChoosen) {
        this.choosen = _.reject(this.choosen, function (el) {
          return el.id === option.id
        })
      } else {
        this.choosen.push({
          id: option.id,
          name: option.name
        })
      }
    },
    onClose () {
      this.$emit('close', true)
    },
    clear () {
      this.choosen = []
      this.$emit('choosen', this.choosen)
      this.close()
    },
    open (choosen = []) {
      this.$refs['select-' + this.id].open()
      this.choosen = choosen
    },
    close () {
      this.$refs['select-' + this.id].close()
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
