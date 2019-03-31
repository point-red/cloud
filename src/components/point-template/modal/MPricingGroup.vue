<template>
  <div>
    <p-modal :ref="'pricing-group-' + id" :id="'pricing-group-' + id" title="pricing group">
      <form class="row" @submit.prevent="onSubmit">
        <p-block :title="'Create Warehouse'" :header="true">
          <p-form-row
            id="name"
            v-model="form.name"
            :disabled="loadingSaveButton"
            :label="$t('name')"
            name="name"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)"/>

          <div class="form-group row">
            <div class="col-md-3"></div>
            <div class="col-md-9">
              <button type="submit" class="btn btn-sm btn-primary" :disabled="loadingSaveButton">
                <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Save
              </button>
            </div>
          </div>
        </p-block>
      </form>
    </p-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      searchText: '',
      options: [],
      mutableId: null,
      mutableLabel: this.value,
      isSaving: false,
      isLoading: false,
      form: new Form({
        name: ''
      })
    }
  },
  computed: {
    ...mapGetters('PricingGroup', ['pricingGroups', 'pagination'])
  },
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number]
    }
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300),
    value () {
      this.search()
    }
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('PricingGroup', ['get', 'create']),
    search () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'name',
          limit: 50,
          filter_like: {
            name: this.searchText
          }
        }
      }).then(response => {
        this.options = []
        response.data.map((key, value) => {
          this.options.push({
            'id': key['id'],
            'label': key['name']
          })

          if (this.value == key['id']) {
            this.mutableLabel = key['number'] + ' - ' + key['alias']
          }
        })
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    add () {
      this.isSaving = true
      this.create({
        code: this.searchText,
        name: this.searchText
      }).then(response => {
        this.search()
        this.isSaving = false
      }).catch(error => {
        this.$notification.error(error.message)
        this.isSaving = false
      })
    },
    show () {
      this.$refs['pricing-group-' + this.id].show()
    },
    close () {
      this.$refs['pricing-group-' + this.id].close()
    }
  }
}
</script>

<style>
input:readonly {
  background-color: white
}
input {
  min-width: 200px;
}
.link {
  border-bottom: dotted 1px blueviolet;
  cursor: pointer;
}
</style>
