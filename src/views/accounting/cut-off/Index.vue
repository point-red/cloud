<template>
  <div>
    <breadcrumb>
      <breadcrumb-accounting />
      <span class="breadcrumb-item active">{{ $t('cut off') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block
        :title="$t('cut off')"
        :header="false"
      >
        <div class="input-group block">
          <router-link
            v-if="$permission.has('create cut off')"
            to="/accounting/cut-off/create"
            class="input-group-prepend"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </router-link>
          <p-form-input
            id="search-text"
            ref="searchText"
            name="search-text"
            placeholder="Search"
            class="btn-block"
            :value="searchText"
            @input="filterSearch"
          />
        </div>
        <p-block-inner :is-loading="isLoading">
          <p-table />
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
  components: {
    Breadcrumb,
    BreadcrumbAccounting
  },
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
  computed: {
    ...mapGetters('accountingCutOff', ['cutOffs'])
  },
  methods: {
    ...mapActions('accountingCutOff', ['get']),
    filterSearch () {

    },
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
