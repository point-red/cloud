<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture />
      <span class="breadcrumb-item active">{{ $t('formula') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            v-if="$permission.has('create manufacture formula')"
            to="/manufacture/formula/create"
            class="input-group-prepend"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </router-link>
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            :value="searchText"
            class="btn-block"
            @input="filterSearch"
          />
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th />
              <th />
              <th
                colspan="2"
                class="text-center bg-gray-light"
              >
                {{ $t('finished goods') }}
              </th>
              <th
                colspan="2"
                class="text-center bg-success-light"
              >
                {{ $t('raw materials') }}
              </th>
              <th />
            </tr>
            <tr slot="p-head">
              <th>{{ $t('formula') }}</th>
              <th>{{ $t('notes') }}</th>
              <th class="text-center bg-gray-light">
                {{ $t('name') }}
              </th>
              <th class="text-center bg-gray-light">
                {{ $t('quantity') }}
              </th>
              <th class="text-center bg-success-light">
                {{ $t('name') }}
              </th>
              <th class="text-center bg-success-light">
                {{ $t('quantity') }}
              </th>
              <th class="text-center">
                {{ $t('approval status') }}
              </th>
            </tr>
            <template v-for="(formula, index) in formulas">
              <template v-for="(rawMaterial, index2) in formula.raw_materials">
                <tr
                  :key="'mm-' + index + '-' + index2"
                  slot="p-body"
                >
                  <th>
                    <router-link
                      v-if="index2 == 0"
                      :to="{ name: 'manufacture.formula.show', params: { id: formula.id }}"
                    >
                      {{ formula.name }}
                    </router-link>
                  </th>
                  <td>
                    <template v-if="index2 == 0">
                      {{ formula.form.notes }}
                    </template>
                  </td>
                  <td class="text-center bg-gray-light">
                    <template v-if="index2 == 0">
                      <span
                        v-for="(finishedGood) in formula.finished_goods"
                        :key="finishedGood.id"
                      >
                        <router-link :to="{ name: 'item.show', params: { id: finishedGood.item.id }}">
                          {{ finishedGood.item.label }}
                        </router-link>
                      </span>
                    </template>
                  </td>
                  <td class="text-center bg-gray-light">
                    <template v-if="index2 == 0">
                      <span
                        v-for="(finishedGood) in formula.finished_goods"
                        :key="finishedGood.id"
                      >
                        {{ finishedGood.quantity }} {{ finishedGood.unit }}
                      </span>
                    </template>
                  </td>
                  <td class="text-center bg-success-light">
                    <router-link :to="{ name: 'item.show', params: { id: rawMaterial.item.id }}">
                      {{ rawMaterial.item.label }}
                    </router-link>
                  </td>
                  <td class="text-center bg-success-light">
                    {{ rawMaterial.quantity | numberFormat }} {{ rawMaterial.unit }}
                  </td>
                  <td class="text-center">
                    <template v-if="index2 == 0">
                      <div
                        v-if="formula.form.approval_status == 0"
                        class="badge badge-primary"
                      >
                        {{ $t('pending') | uppercase }}
                      </div>
                      <div
                        v-if="formula.form.approval_status == -1"
                        class="badge badge-danger"
                      >
                        {{ $t('rejected') | uppercase }}
                      </div>
                      <div
                        v-if="formula.form.approval_status == 1"
                        class="badge badge-success"
                      >
                        {{ $t('approved') | uppercase }}
                      </div>
                    </template>
                  </td>
                </tr>
              </template>
            </template>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
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
  created () {
    this.getManufactureFormulas()
  },
  updated () {
    this.lastPage = this.pagination.last_page
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
          join: 'form,raw_materials,finished_goods,item',
          fields: 'manufacture_formula.*',
          sort_by: '-form.number',
          group_by: 'manufacture_formula.id',
          filter_form: 'active',
          filter_like: {
            'form.number': this.searchText,
            'form.notes': this.searchText,
            'manufacture_formula.name': this.searchText,
            'raw_material_item.code': this.searchText,
            'raw_material_item.name': this.searchText,
            'manufacture_formula_raw_material.quantity': this.searchText,
            'finished_goods_item.code': this.searchText,
            'finished_goods_item.name': this.searchText,
            'manufacture_formula_finished_goods.quantity': this.searchText
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
  }
}
</script>
