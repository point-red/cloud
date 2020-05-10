<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-psychotest />
      <span class="breadcrumb-item active">{{ "kraepelin" | titlecase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block :title="$t('kraepelin')" :header="true">
        <p-form-input
          id="search-text"
          name="search-text"
          placeholder="Search"
          :value="searchText"
          @input="filterSearch"
        />
        <hr />
        <p-block-inner :is-loading="loading">
          <point-table>
            <tr slot="p-head">
              <th width="25%">Name</th>
              <th width="25%">Total Count</th>
              <th width="25%">Total Correct</th>
            </tr>
            <template v-if="$permission.has('read employee')">
              <tr
                v-for="kraepelin in kraepelins"
                :key="kraepelin.id"
                slot="p-body"
              >
                <td>
                  <router-link
                    :to="{
                      name: 'KraepelinShow',
                      params: { id: kraepelin.id }
                    }"
                  >
                    {{ kraepelin.candidate && kraepelin.candidate.name }}
                  </router-link>
                </td>
                <td>{{ kraepelin.total_count }}</td>
                <td>{{ kraepelin.total_correct }}</td>
              </tr>
            </template>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        >
        </p-pagination>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import BreadcrumbPsychotest from '@/views/human-resource/psychotest/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource,
    BreadcrumbPsychotest,
    PointTable
  },
  data () {
    return {
      loading: false,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      pagination: {
        current_page: null,
        from: null,
        to: null,
        path: null,
        last_page: null,
        per_page: null,
        total: null
      }
    }
  },
  computed: {
    ...mapState('humanResourcePsychotestKraepelin', ['kraepelins'])
  },
  methods: {
    ...mapActions('humanResourcePsychotestKraepelin', { getKraepelins: 'get' }),
    updatePage (value) {
      this.currentPage = value
      this.getKraepelinRequest()
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getKraepelinRequest()
    }, 300),
    getKraepelinRequest () {
      this.loading = true
      this.getKraepelins({
        params: {
          filter_like: {
            'candidate.name': this.searchText
          },
          limit: 10,
          page: this.currentPage,
          expand: 1,
          includes: 'candidate',
          sort_by: '-created_at'
        }
      }).then(
        response => {
          this.loading = false
        },
        errors => {
          this.loading = false
          console.log(errors.data)
        }
      )
    }
  },
  created () {
    this.getKraepelinRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
