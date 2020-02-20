<template>
  <div>
    <span @click="show" class="link">{{ mutableLabel || 'SELECT' | uppercase }}</span>
    <a href="javascript:void(0)" class="ml-5" @click="clear" v-show="mutableId != null">
      <i class="clickable fa fa-close"></i>
    </a>
    <p-modal :ref="'select-' + id" :id="'select-' + id" title="select pricing group">
      <template slot="content">
        <input type="text" class="form-control" v-model="searchText" placeholder="Search..." @keydown.enter.prevent="">
        <hr>
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
        <div class="alert alert-info text-center" v-if="!searchText && options.length == 0 && !isLoading">
          {{ $t('you don\'t have any') | capitalize }} {{ $t('pricing group') | capitalize }}, <br/> {{ $t('you can create') }}
          <router-link :to="'/master/item-price-list'">
            <span>{{ $t('new one') }}</span>
          </router-link>
        </div>
      </template>
      <template slot="footer">
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
      options: [],
      mutableId: this.value,
      mutableLabel: this.label,
      mutableClassReference: this.classReference,
      mutableType: this.type,
      isSaving: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('masterPricingGroup', ['groups', 'pagination'])
  },
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number]
    },
    label: {
      type: String
    }
  },
  watch: {
    value () {
      this.mutableId = this.value
    },
    label () {
      this.mutableLabel = this.label
    },
    searchText: debounce(function () {
      this.search()
    }, 300)
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('masterPricingGroup', ['get']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'label',
          limit: 50,
          filter_like: {
            label: this.searchText
          }
        }
      }).then(response => {
        this.options = []
        this.mutableLabel = ''
        response.data.map((key, value) => {
          this.options.push({
            'id': key['id'],
            'label': key['label']
          })

          if (this.value == key['id']) {
            this.mutableLabel = key['label']
          }
        })
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
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
      this.$emit('choosen', '')
    },
    show () {
      this.$refs['select-' + this.id].show()
    },
    close () {
      this.$refs['select-' + this.id].close()
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
