<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <router-link :to="'/manufacture/process-io/' + id" class="breadcrumb-item">{{ $t('process') | titlecase }}</router-link>
      <router-link :to="'/manufacture/process-io/' + id + '/output'" class="breadcrumb-item">{{ $t('output') | titlecase }}</router-link>
      <span class="breadcrumb-item active">Create Step 1</span>
    </breadcrumb>

    <manufacture-menu/>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('input')" :header="true">
        <div class="row mb-10">
          <p-date-range-picker
            id="date"
            name="date"
            class="col-sm-4"
            v-model="date"/>
        </div>
        <div class="input-group block">
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            :value="searchText"
            class="btn-block"
            @input="filterSearch"/>
          <router-link
            to="/manufacture/input/create"
            v-if="$permission.has('create manufacture')"
            class="input-group-append">
            <span class="input-group-text">
              <i class="fa fa-plus"></i>
            </span>
          </router-link>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>{{ $t('date') | titlecase }}</th>
              <th>{{ $t('number') | titlecase }}</th>
              <th>{{ $t('notes') | titlecase }}</th>
              <th>{{ $t('finished goods') | titlecase }}</th>
              <th>{{ $t('raw materials') | titlecase }}</th>
              <th>&nbsp;</th>
            </tr>
            <template v-for="(input, index) in inputs">
              <tr :key="'mm-' + index" slot="p-body">
                <th>{{ ++index }}</th>
                <td>{{ input.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>
                  <router-link :to="'/manufacture/process-io/' + id + '/input/' + input.id">
                    {{ input.form.number }}
                  </router-link>
                </td>
                <td>{{ input.notes }}</td>
                <td>
                  <span v-for="(finishGood, index2) in input.finish_goods" :key="finishGood.id">
                    {{ ++index2 }}.
                    <router-link :to="{ name: 'item.show', params: { id: finishGood.item.id }}">
                      {{ finishGood.item.label }}
                    </router-link>
                      = {{ finishGood.quantity | numberFormat }} {{ finishGood.item.units[0].name }}
                      <br>
                  </span>
                </td>
                <td>
                  <span v-for="(rawMaterial, index3) in input.raw_materials" :key="rawMaterial.id">
                    {{ ++index3 }}.
                    <router-link :to="{ name: 'item.show', params: { id: rawMaterial.item.id }}">
                      {{ rawMaterial.item.label }}
                    </router-link>
                      = {{ rawMaterial.quantity }} {{ rawMaterial.item.units[0].name }}
                      <br>
                  </span>
                </td>
                <td>
                  <router-link class="btn btn-sm btn-secondary" :to="{ name: 'manufacture.process.io.output.create.step.2', params: { id: id, inputId: input.id }}">
                    <span><i class="si si-share-alt"></i> Create Process Output</span>
                  </router-link>
                </td>
              </tr>
            </template>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage">
        </p-pagination>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import ManufactureMenu from '../../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbManufacture from '@/views/manufacture/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    ManufactureMenu,
    Breadcrumb,
    BreadcrumbManufacture,
    PointTable
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10,
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  watch: {
    date: function () {
      this.$router.push({
        query: {
          ...this.$route.query,
          date_from: this.date.start,
          date_to: this.date.end
        }
      })
      this.getManufactureInputs()
    }
  },
  computed: {
    ...mapGetters('manufactureInput', ['inputs', 'pagination'])
  },
  methods: {
    ...mapActions('manufactureInput', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          search: value
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getManufactureInputs()
    }, 300),
    getManufactureInputs () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form',
          sort_by: '-forms.number',
          fields: 'manufacture_inputs.*',
          filter_form: 'active',
          filter_like: {
            'form.number': this.searchText,
            'name': this.searchText,
            'rawMaterials.item.name': this.searchText,
            'rawMaterials.quantity': this.searchText,
            'finishGoods.item.name': this.searchText,
            'finishGoods.quantity': this.searchText
          },
          filter_min: {
            'form.date': this.serverDateTime(this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00'))
          },
          filter_max: {
            'form.date': this.serverDateTime(this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59'))
          },
          limit: this.limit,
          includes: 'form;rawMaterials.item.units;finishGoods.item.units',
          page: this.currentPage
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getManufactureInputs()
    }
  },
  created () {
    this.getManufactureInputs()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
