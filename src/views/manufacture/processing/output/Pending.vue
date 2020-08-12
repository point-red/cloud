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
      <span class="breadcrumb-item active">{{ $t('output') | uppercase }}</span>
    </breadcrumb>

    <manufacture-menu />

    <tab-menu />

    <div class="row">
      <p-block
        :title="$t('output')"
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
            v-if="$permission.has('create manufacture')"
            :to="'/manufacture/processing/' + id + '/output/create-step-1'"
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
              <th>{{ $t('date') | titlecase }}</th>
              <th>{{ $t('number') | titlecase }}</th>
              <th>{{ $t('process') | titlecase }}</th>
              <th>{{ $t('machine') | titlecase }}</th>
              <th>{{ $t('notes') | titlecase }}</th>
            </tr>
            <template v-for="(output, index) in outputs">
              <tr
                :key="'mi-' + index"
                slot="p-body"
              >
                <th>{{ index + 1 + ( ( currentPage - 1 ) * limit ) }}</th>
                <td>{{ output.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>
                  <router-link :to="{ name: 'manufacture.process.io.output.show', params: { id: id, outputId: output.id }}">
                    {{ output.form.number }}
                  </router-link>
                </td>
                <td>{{ output.manufacture_process_name }}</td>
                <td>{{ output.manufacture_machine_name }}</td>
                <td>{{ output.notes }}</td>
              </tr>
              <tr
                :key="'moa-' + index"
                slot="p-body"
              >
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td><b>{{ $t('finished goods') | titlecase }}</b></td>
                <td><b>{{ $t('quantity produced') | titlecase }}</b></td>
                <td><b>{{ $t('warehouse') | titlecase }}</b></td>
              </tr>
              <tr
                v-for="finishGood in output.finished_goods_temporary"
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
                  <router-link :to="{ name: 'warehouse.show', params: { id: finishGood.warehouse.id }}">
                    {{ finishGood.warehouse.name }}
                  </router-link>
                </td>
              </tr>
              <tr
                :key="'mob-' + index"
                slot="p-body"
              >
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
    ...mapGetters('manufactureOutput', ['outputs', 'pagination'])
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
      this.getManufactureOutputs()
    }
  },
  created () {
    this.getManufactureOutputs()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('manufactureOutput', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          search: value
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getManufactureOutputs()
    }, 300),
    getManufactureOutputs () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form',
          sort_by: '-forms.number',
          fields: 'manufacture_outputs.*',
          filter_form: 'activePending',
          filter_equal: {
            manufacture_process_id: this.id
          },
          filter_like: {
            'form.number': this.searchText,
            name: this.searchText,
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
          includes: 'form;manufactureMachine;manufactureProcess;finishedGoods.item.units;finishedGoods.warehouse',
          page: this.currentPage
        }
      }).then(response => {
        for (const index in this.outputs) {
          this.outputs[index].finished_goods_temporary = []
        }
        for (const index in this.outputs) {
          const output = this.outputs[index]
          for (const finishGoodIndex in output.finished_goods) {
            const finishGood = output.finished_goods[finishGoodIndex]
            const finishGoodTemporaryIndex = this.outputs[index].finished_goods_temporary.findIndex(o => o.item_id === finishGood.item_id && o.warehouse_id === finishGood.warehouse_id)
            var finishGoodTemporary
            if (finishGoodTemporaryIndex < 0) {
              finishGoodTemporary = Object.assign({}, finishGood)
              this.outputs[index].finished_goods_temporary.push(finishGoodTemporary)
            } else {
              finishGoodTemporary = this.outputs[index].finished_goods_temporary[finishGoodTemporaryIndex]
              finishGoodTemporary.quantity += finishGood.quantity
              this.outputs[index].finished_goods_temporary[finishGoodTemporaryIndex] = finishGoodTemporary
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
      this.getManufactureOutputs()
    }
  }
}
</script>
