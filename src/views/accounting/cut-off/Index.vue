<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting/>
      <span class="breadcrumb-item active">{{ $t('cut off') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block :title="$t('cut off')" :header="false">
        <div class="input-group block">
          <router-link
            to="/accounting/cut-off/create"
            v-if="$permission.has('create cut off')"
            class="input-group-prepend">
            <span class="input-group-text">
              <i class="fa fa-plus"></i>
            </span>
          </router-link>
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            ref="searchText"
            class="btn-block"
            :value="searchText"
            @input="filterSearch"/>
        </div>
        <p-block-inner :is-loading="isLoading">
          <p-table>
            <tr slot="p-head">
              <th>Date</th>
              <th>Cut Off</th>
              <th>Created By</th>
              <th>Approval Status</th>
            </tr>
            <tr
              v-for="(cutOff, index) in cutOffs"
              :key="index"
              slot="p-body">
              <td>{{ cutOff.date | dateFormat('DD MMM YYYY') }}</td>
              <td>
                <router-link :to="{ name: 'AccountingCutOffShow', params: { id: cutOff.id }}">
                  {{ cutOff.number }}
                </router-link>
              </td>
              <td>
                {{ cutOff.form.created_by.full_name }}
              </td>
              <td>
                <div v-if="cutOff.form.approved == null" class="badge badge-primary">{{ $t('pending') | uppercase }}</div>
                <div v-if="cutOff.form.approved == 0" class="badge badge-danger">{{ $t('rejected') | uppercase }}</div>
                <div v-if="cutOff.form.approved == 1" class="badge badge-success">{{ $t('approved') | uppercase }}</div>
              </td>
            </tr>
          </p-table>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbAccounting from '@/views/accounting/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isLoading: false,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 10,
      isAdvanceFilter: false,
      checkedRow: [],
      formStatus: {
        id: null,
        label: null,
        value: 'notArchived'
      },
      formApprovalStatus: {
        id: null,
        label: null,
        value: null
      },
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  components: {
    Breadcrumb,
    BreadcrumbAccounting
  },
  computed: {
    ...mapGetters('accountingCutOff', ['cutOffs'])
  },
  methods: {
    ...mapActions('accountingCutOff', ['get']),
    getCutOffs () {
      this.isLoading = true
      console.log('getting data')
      this.get({
        params: {
          join: 'form',
          fields: 'cut_offs.*',
          sort_by: '-forms.number',
          filter_form: this.formStatus.value + ';' + this.formApprovalStatus.value,
          filter_like: {
            'form.number': this.searchText
          },
          filter_min: {
            'form.date': this.serverDateTime(this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00'))
          },
          filter_max: {
            'form.date': this.serverDateTime(this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59'))
          },
          limit: 10,
          includes: 'form.createdBy',
          page: this.currentPage
        }
      }).then((response) => {
        this.isLoading = false
      }, (error) => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  },
  created () {
    this.getCutOffs()
  }
}
</script>
