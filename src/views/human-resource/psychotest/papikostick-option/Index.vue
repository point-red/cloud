<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-psychotest />
      <span class="breadcrumb-item active">{{
        "papikostick option" | titlecase
      }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block :title="$t('papikostick option')" :header="true">
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
              <th width="25%">Content</th>
            </tr>
            <template v-if="$permission.has('read employee')">
              <tr
                v-for="papikostickOption in papikostickOptions"
                :key="papikostickOption.id"
                slot="p-body"
              >
                <td>
                  <router-link
                    :to="{
                      name: 'PapikostickOptionShow',
                      params: { id: papikostickOption.id }
                    }"
                  >
                    {{ papikostickOption.content }}
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
    ...mapState('humanResourcePsychotestPapikostickOption', [
      'papikostickOptions'
    ])
  },
  methods: {
    ...mapActions('humanResourcePsychotestPapikostickOption', {
      getPapikostickOptions: 'get'
    }),
    updatePage (value) {
      this.currentPage = value
      this.getPapikostickOptionsRequest()
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getPapikostickOptionsRequest()
    }, 300),
    getPapikostickOptionsRequest () {
      this.loading = true
      this.getPapikostickOptions({
        params: {
          filter_like: {
            content: this.searchText
          },
          limit: 0,
          page: this.currentPage,
          sort_by: 'id'
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
    this.getPapikostickOptionsRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
