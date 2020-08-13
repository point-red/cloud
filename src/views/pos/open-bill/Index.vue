<template>
  <div>
    <breadcrumb>
      <breadcrumb-pos />
      <span class="breadcrumb-item active">{{ $t('open bill') | uppercase }}</span>
    </breadcrumb>

    <pos-menu />

    <div class="row">
      <p-block
        :title="$t('open bill')"
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
          <router-link
            v-if="$permission.has('create pos')"
            to="/pos/open-bill/create"
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
              <th>{{ $t('date') | titlecase }}</th>
              <th>{{ $t('number') | titlecase }}</th>
              <th>{{ $t('customer') | titlecase }}</th>
              <th>{{ $t('amount') | titlecase }}</th>
              <th>&nbsp;</th>
            </tr>
            <template v-for="(bill, index) in bills">
              <tr
                :key="'pb-' + index"
                slot="p-body"
              >
                <th>{{ index + 1 + ( ( currentPage - 1 ) * limit ) }}</th>
                <td>{{ bill.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>
                  <router-link :to="{ name: 'pos.open-bill.show', params: { id: bill.id }}">
                    {{ bill.form.number }}
                  </router-link>
                </td>
                <td>
                  <template v-if="bill.customer">
                    {{ bill.customer.name }}
                  </template>
                </td>
                <td>{{ bill.amount | numberFormat }}</td>
                <td class="text-right">
                  <router-link
                    :to="{ name: 'pos.open-bill.edit', params: { id: bill.id }}"
                    class="btn btn-sm btn-secondary mr-5"
                  >
                    <i class="si si-note" /> {{ $t('edit') | uppercase }}
                  </router-link>
                  &nbsp;
                  <button
                    class="btn btn-sm btn-danger"
                    :disabled="isDeleting"
                    @click="deleteBill(bill.id)"
                  >
                    <i
                      v-show="isDeleting"
                      class="fa fa-asterisk fa-spin"
                    /> {{ $t('delete') | uppercase }}
                  </button>
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
import PosMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPos from '@/views/pos/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PosMenu,
    Breadcrumb,
    BreadcrumbPos,
    PointTable
  },
  data () {
    return {
      isLoading: true,
      isDeleting: false,
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
    ...mapGetters('posBill', ['bills', 'pagination'])
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
      this.getBills()
    }
  },
  created () {
    this.getBills()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('posBill', ['get', 'delete']),
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          search: value
        }
      })
      this.searchText = value
      this.currentPage = 1
      this.getBills()
    }, 300),
    getBills () {
      this.isLoading = true
      this.get({
        params: {
          join: 'form,customer',
          sort_by: '-forms.number',
          fields: 'pos_bill.*',
          filter_form: 'activePending',
          filter_equal: {
            'form.done': 0
          },
          filter_like: {
            'form.number': this.searchText,
            'customer.name': this.searchText
          },
          filter_date_min: {
            'form.date': this.serverDateTime(this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00'))
          },
          filter_date_max: {
            'form.date': this.serverDateTime(this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59'))
          },
          limit: this.limit,
          includes: 'form;customer',
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
      this.getBills()
    },
    deleteBill (id) {
      this.isDeleting = true
      this.delete({
        id: id
      }).then(response => {
        this.isDeleting = false
        this.$notification.success('delete success')
        this.getBills()
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
      })
    }
  }
}
</script>
