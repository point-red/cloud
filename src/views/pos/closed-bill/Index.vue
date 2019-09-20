<template>
  <div>
    <breadcrumb>
      <breadcrumb-pos/>
      <span class="breadcrumb-item active">{{ $t('closed bill') | titlecase }}</span>
    </breadcrumb>

    <pos-menu/>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('closed bill')" :header="true">
        <div class="row mb-10">
          <p-date-range-picker
            id="date"
            name="date"
            class="col-sm-4"
            v-model="date"/>
        </div>
        <p-form-input
          id="search-text"
          name="search-text"
          placeholder="Search"
          :value="searchText"
          @input="filterSearch"/>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Number</th>
              <th>Date</th>
              <th>Customer</th>
              <th class="text-right">Amount</th>
              <th></th>
            </tr>
            <template v-for="(bill, index) in bills">
              <tr
                :key="'pb-' + index"
                slot="p-body">
                <th>{{ index + 1 + ( ( currentPage - 1 ) * limit ) }}</th>
                <td>
                  <router-link v-if="$permission.has('read pos')" :to="{ name: 'pos.closed-bill.show', params: { id: bill.id }}">
                    {{ bill.form.number }}
                  </router-link>
                  <template v-else>
                    {{ bill.form.number }}
                  </template>
                </td>
                <td>{{ bill.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>
                  <template v-if="bill.customer">
                    {{ bill.customer.name }}
                  </template>
                </td>
                <td class="text-right">{{ bill.amount | numberFormat }}</td>
                <td class="text-right">
                  <button class="btn btn-sm btn-danger" @click="deleteBill(bill.id)" v-if="$permission.has('delete pos closed bill')" :disabled="isDeleting">
                    <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> Delete
                  </button>
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
import PosMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPos from '@/views/pos/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    PosMenu,
    Breadcrumb,
    BreadcrumbPos,
    PointTable
  },
  data () {
    return {
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      },
      isLoading: true,
      isDeleting: false,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10
    }
  },
  computed: {
    ...mapGetters('posBill', ['bills', 'pagination'])
  },
  watch: {
    date: function () {
      if (this.date.start && this.date.end) {
        this.$router.push({
          query: {
            ...this.$route.query,
            date_from: this.date.start,
            date_to: this.date.end
          }
        })
        this.getBills()
      }
    }
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
          fields: 'pos_bills.*',
          sort_by: '-forms.number',
          filter_form: 'activeDone',
          filter_like: {
            'form.number': this.searchText,
            'customer.name': this.searchText,
            'form.done': 1
          },
          filter_min: {
            'form.date': this.serverDateTime(this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00'))
          },
          filter_max: {
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
  },
  created () {
    this.getBills()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
