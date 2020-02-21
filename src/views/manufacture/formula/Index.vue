<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture/>
      <span class="breadcrumb-item active">{{ $t('formula') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu/>

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            to="/manufacture/formula/create"
            v-if="$permission.has('create manufacture formula')"
            class="input-group-prepend">
            <span class="input-group-text">
              <i class="fa fa-plus"></i>
            </span>
          </router-link>
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            :value="searchText"
            class="btn-block"
            @input="filterSearch"/>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">#</th>
              <th>{{ $t('form') | titlecase }}</th>
              <th>{{ $t('formula') | titlecase }}</th>
              <th>{{ $t('finished goods') | titlecase }}</th>
              <th>{{ $t('raw materials') | titlecase }}</th>
              <th class="text-center">Approval Status</th>
              <th></th>
            </tr>
            <template v-for="(formula, index) in formulas">
              <tr
                :key="'mm-' + index"
                slot="p-body">
                <th>{{ index + 1 + ( ( currentPage - 1 ) * limit ) }}</th>
                <td>
                  <router-link :to="{ name: 'manufacture.formula.show', params: { id: formula.id }}">
                    {{ formula.form.number }}
                  </router-link>
                </td>
                <td>
                  {{ formula.name }}
                </td>
                <td>
                  <span v-for="(finishGood, index2) in formula.finished_goods" :key="finishGood.id">
                    {{ ++index2 }}.
                    <router-link :to="{ name: 'item.show', params: { id: finishGood.item.id }}">
                        {{ finishGood.item.label }}
                    </router-link>
                    = {{ finishGood.quantity }} {{ finishGood.item.units[0].name }}
                    <br>
                  </span>
                </td>
                <td>
                  <span v-for="(rawMaterial, index2) in formula.raw_materials" :key="rawMaterial.id">
                    {{ ++index2 }}.
                    <router-link :to="{ name: 'item.show', params: { id: rawMaterial.item.id }}">
                      {{ rawMaterial.item.label }}
                    </router-link>
                    = {{ rawMaterial.quantity | numberFormat }} {{ rawMaterial.item.units[0].name }}
                    <br>
                  </span>
                </td>
                <td class="text-center">
                  <div v-if="formula.form.approved == null" class="badge badge-primary">{{ $t('pending') | uppercase }}</div>
                  <div v-if="formula.form.approved == 0" class="badge badge-danger">{{ $t('rejected') | uppercase }}</div>
                  <div v-if="formula.form.approved == 1" class="badge badge-success">{{ $t('approved') | uppercase }}</div>
                </td>
                <td class="text-right">
                  <router-link v-if="formula.form.approved" class="btn btn-sm btn-secondary" :to="{ name: 'manufacture.process.io.input.use.formula', params: { id: formula.manufacture_process_id, formulaId: formula.id }}">
                    <i class="fa fa-share-square-o"></i> {{ $t('start production') | uppercase }}
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
import ManufactureMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbManufacture from '@/views/manufacture/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ManufactureMenu,
    Breadcrumb,
    BreadcrumbManufacture,
    PointTable
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10
    }
  },
  computed: {
    ...mapGetters('manufactureFormula', ['formulas', 'pagination'])
  },
  methods: {
    ...mapActions('manufactureFormula', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          search: value
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getManufactureFormulas()
    }, 300),
    getManufactureFormulas () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form',
          sort_by: '-forms.number',
          fields: 'manufacture_formulas.*',
          filter_form: 'notArchived',
          filter_like: {
            'form.number': this.searchText,
            'name': this.searchText,
            'rawMaterials.item.name': this.searchText,
            'rawMaterials.quantity': this.searchText,
            'finishedGoods.item.name': this.searchText,
            'finishedGoods.quantity': this.searchText
          },
          limit: this.limit,
          includes: 'form;rawMaterials.item.units;finishedGoods.item.units',
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
      this.getManufactureFormulas()
    }
  },
  created () {
    this.getManufactureFormulas()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
