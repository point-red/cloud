<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture />
      <router-link
        :to="'/manufacture/processing/' + id"
        class="breadcrumb-item"
      >
        {{ $t('process') | uppercase }}
      </router-link>
      <router-link
        :to="'/manufacture/processing/' + id + '/input'"
        class="breadcrumb-item"
      >
        {{ $t('input') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('choose formula') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu />

    <tab-menu />

    <div class="row">
      <p-block
        :title="$t('formula')"
        :header="true"
      >
        <div class="row mb-10">
          <p-date-range-picker
            id="date"
            v-model="date"
            name="date"
            class="col-sm-4"
          />
        </div>
        <div class="input-group block">
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            :value="searchText"
            class="btn-block"
            @input="filterSearch"
          />
          <router-link
            v-if="$permission.has('create manufacture formula')"
            to="/manufacture/formula/create"
            class="input-group-append"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </router-link>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>{{ $t('number') | titlecase }}</th>
              <th>{{ $t('finished goods') | titlecase }}</th>
              <th>{{ $t('raw materials') | titlecase }}</th>
              <th>&nbsp;</th>
            </tr>
            <template v-for="(formula, index) in formulas">
              <tr
                :key="'mm-' + index"
                slot="p-body"
              >
                <th>{{ index + 1 + ( ( currentPage - 1 ) * limit ) }}</th>
                <td>
                  <router-link :to="{ name: 'manufacture.formula.show', params: { id: formula.id }}">
                    {{ formula.form.number }}
                  </router-link>
                </td>
                <td>
                  <ol>
                    <li
                      v-for="finishGood in formula.finished_goods"
                      :key="finishGood.id"
                    >
                      <router-link :to="{ name: 'item.show', params: { id: finishGood.item.id }}">
                        {{ finishGood.item.label }}
                      </router-link>
                      = {{ finishGood.quantity }} {{ finishGood.item.units[0].name }}
                    </li>
                  </ol>
                </td>
                <td>
                  <ol>
                    <li
                      v-for="rawMaterial in formula.raw_materials"
                      :key="rawMaterial.id"
                    >
                      <router-link :to="{ name: 'item.show', params: { id: rawMaterial.item.id }}">
                        {{ rawMaterial.item.label }}
                      </router-link>
                      = {{ rawMaterial.quantity }} {{ rawMaterial.item.units[0].name }}
                    </li>
                  </ol>
                </td>
                <td>
                  <router-link
                    :to="{ name: 'manufacture.process.io.input.use.formula', params: { id: id, formulaId: formula.id }}"
                    class="btn btn-primary mr-5"
                  >
                    <span><i class="si si-share-alt" /> {{ $t('use') | titlecase }}</span>
                  </router-link>
                </td>
              </tr>
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
  computed: {
    ...mapGetters('manufactureFormula', ['formulas', 'pagination'])
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
      this.getManufactureFormulas()
    }
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
          join: 'form',
          sort_by: '-forms.number',
          fields: 'manufacture_formulas.*',
          filter_form: 'active',
          filter_equal: {
            manufacture_process_id: this.id
          },
          filter_like: {
            'form.number': this.searchText,
            name: this.searchText,
            'rawMaterials.item.name': this.searchText,
            'rawMaterials.quantity': this.searchText,
            'finishedGoods.item.name': this.searchText,
            'finishedGoods.quantity': this.searchText
          },
          filter_min: {
            'form.date': this.serverDateTime(this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00'))
          },
          filter_max: {
            'form.date': this.serverDateTime(this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59'))
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
