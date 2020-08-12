<template>
  <div>
    <breadcrumb>
      <breadcrumb-manufacture />
      <router-link
        :to="'/manufacture/processing'"
        class="breadcrumb-item"
      >
        {{ $t('processing') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('input') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu />

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            v-if="$permission.has('create manufacture formula')"
            to="/manufacture/processing/input/create"
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
              <th>#</th>
              <th>{{ $t('date') | uppercase }}</th>
              <th>{{ $t('number') | uppercase }}</th>
              <th>{{ $t('machine') | uppercase }}</th>
              <th>{{ $t('notes') | uppercase }}</th>
              <th class="text-center">
                {{ $t('approval status') | uppercase }}
              </th>
              <th class="text-center">
                {{ $t('form status') | uppercase }}
              </th>
            </tr>
            <template v-for="(input, index) in inputs">
              <tr
                :key="'mi-' + index"
                slot="p-body"
              >
                <th>{{ index + 1 + ( ( currentPage - 1 ) * limit ) }}</th>
                <td>{{ input.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>
                  <router-link :to="{ name: 'manufacture.processing.input.show', params: { id: input.id }}">
                    {{ input.form.number }}
                  </router-link>
                </td>
                <td>{{ input.manufacture_machine_name }}</td>
                <td>{{ input.notes }}</td>
                <td class="text-center">
                  <div
                    v-if="input.form.approval_status == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-if="input.form.approval_status == -1"
                    class="badge badge-danger"
                  >
                    {{ $t('rejected') | uppercase }}
                  </div>
                  <div
                    v-if="input.form.approval_status == 1"
                    class="badge badge-success"
                  >
                    {{ $t('approved') | uppercase }}
                  </div>
                </td>
                <td class="text-center">
                  <div
                    v-if="input.form.cancellation_status == 1"
                    class="badge badge-danger"
                  >
                    {{ $t('canceled') | uppercase }}
                  </div>
                  <div
                    v-else-if="input.form.done == 0"
                    class="badge badge-primary"
                  >
                    {{ $t('pending') | uppercase }}
                  </div>
                  <div
                    v-else-if="input.form.done == 1"
                    class="badge badge-success"
                  >
                    {{ $t('done') | uppercase }}
                  </div>
                </td>
              </tr>
              <tr
                :key="'mia-' + index"
                slot="p-body"
              >
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td><b>{{ $t('finished goods') | uppercase }}</b></td>
                <td><b>{{ $t('quantity') | uppercase }}</b></td>
                <td><b>{{ $t('warehouse') | uppercase }}</b></td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr
                v-for="finishGood in input.finished_goods"
                :key="'fg-' + finishGood.id"
                slot="p-body"
              >
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>
                  <router-link :to="{ name: 'item.show', params: { id: finishGood.item.id }}">
                    {{ finishGood.item.label }}
                  </router-link>
                </td>
                <td>
                  {{ finishGood.quantity }} {{ finishGood.item.units[0].name }}
                </td>
                <td>
                  {{ finishGood.warehouse.name }}
                </td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr
                :key="'mib-' + index"
                slot="p-body"
              >
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td><b>{{ $t('raw materials') | uppercase }}</b></td>
                <td><b>{{ $t('quantity') | uppercase }}</b></td>
                <td><b>{{ $t('warehouse') | uppercase }}</b></td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr
                v-for="rawMaterial in input.raw_materials_temporary"
                :key="'rm-' + rawMaterial.id"
                slot="p-body"
              >
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>
                  <router-link :to="{ name: 'item.show', params: { id: rawMaterial.item.id }}">
                    {{ rawMaterial.item.label }}
                  </router-link>
                </td>
                <td>
                  {{ rawMaterial.quantity }} {{ rawMaterial.item.units[0].name }}
                </td>
                <td>
                  {{ rawMaterial.warehouse.name }}
                </td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr
                :key="'mic-' + index"
                slot="p-body"
              >
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
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
import TabMenu from '../TabMenu'
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
    ...mapGetters('manufactureInput', ['inputs', 'pagination'])
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
  created () {
    this.getManufactureInputs()
  },
  updated () {
    this.lastPage = this.pagination.last_page
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
          filter_form: 'notArchived',
          filter_like: {
            'form.number': this.searchText,
            'rawMaterials.item.code': this.searchText,
            'rawMaterials.item.name': this.searchText,
            'rawMaterials.quantity': this.searchText,
            'finishedGoods.item.code': this.searchText,
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
          includes: 'form;' +
            'manufactureMachine;' +
            'rawMaterials.item.units;' +
            'finishedGoods.item.units;' +
            'rawMaterials.warehouse;' +
            'finishedGoods.warehouse',
          page: this.currentPage
        }
      }).then(response => {
        for (const index in this.inputs) {
          this.inputs[index].raw_materials_temporary = []
        }
        for (const index in this.inputs) {
          const input = this.inputs[index]
          for (const rawMaterialIndex in input.raw_materials) {
            const rawMaterial = input.raw_materials[rawMaterialIndex]
            const rawMaterialTemporaryIndex = this.inputs[index].raw_materials_temporary.findIndex(o => o.item_id === rawMaterial.item_id && o.warehouse_id === rawMaterial.warehouse_id)
            if (rawMaterialTemporaryIndex < 0) {
              const newItem = Object.assign({}, rawMaterial)
              this.inputs[index].raw_materials_temporary.push(newItem)
            } else {
              var exisiting = this.inputs[index].raw_materials_temporary[rawMaterialTemporaryIndex]
              exisiting.quantity += rawMaterial.quantity
              this.inputs[index].raw_materials_temporary[rawMaterialTemporaryIndex] = exisiting
            }
          }
        }
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
  }
}
</script>
