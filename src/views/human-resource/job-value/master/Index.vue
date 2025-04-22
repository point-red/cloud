<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <span class="breadcrumb-item active">{{
        $t("master job value") | uppercase
      }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div
          class="text-right"
        >
          <button
            v-if="$permission.has('read employee job value score')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.updateJobValueScoreSetting.open()"
          >
            <span>
              <i class="fa fa-cog" />
            </span>
          </button>
          <button
            v-if="$permission.has('create employee master job value')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addJobValueCriteria.open()"
          >
            <span>
              {{ $t("create criteria factor") | uppercase }}
            </span>
          </button>
        </div>

        <div class="input-group block mt-10">
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
          <point-table>
            <tr slot="p-head">
              <th width="50px">
                #
              </th>
              <th>
                Category
              </th>
              <th>
                Criteria Factor
              </th>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
            </tr>
            <template v-for="(criteria, index) in criterias">
              <tr
                :key="'criteria-' + index"
                slot="p-body"
              >
                <th>{{ (page - 1) * limit + index + 1 }}</th>
                <td>
                  <router-link
                    :to="{ name: 'MasterJobValueShow', params: { id: criteria.id }}"
                  >
                    {{ criteria.category.category }}
                  </router-link>
                </td>
                <td>{{ criteria.criteria_factor }}</td>
                <td>{{ criteria.scales[0] ? criteria.scales[0].value : '-' }}</td>
                <td>{{ criteria.scales[1] ? criteria.scales[1].value : '-' }}</td>
                <td>{{ criteria.scales[2] ? criteria.scales[2].value : '-' }}</td>
                <td>{{ criteria.scales[3] ? criteria.scales[3].value : '-' }}</td>
                <td>{{ criteria.scales[4] ? criteria.scales[4].value : '-' }}</td>
              </tr>
              <tr
                :key="'criteria-scale-' + index"
                slot="p-body"
              >
                <th />
                <th />
                <th />
                <td>{{ criteria.scales[0] ? criteria.scales[0].description : '-' }}</td>
                <td>{{ criteria.scales[1] ? criteria.scales[1].description : '-' }}</td>
                <td>{{ criteria.scales[2] ? criteria.scales[2].description : '-' }}</td>
                <td>{{ criteria.scales[3] ? criteria.scales[3].description : '-' }}</td>
                <td>{{ criteria.scales[4] ? criteria.scales[4].description : '-' }}</td>
              </tr>
            </template>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="page"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
    <m-job-value-score-setting
      ref="updateJobValueScoreSetting"
    />
    <m-add-job-value-criteria
      ref="addJobValueCriteria"
      @added="onAdded"
    />
  </div>
</template>

<script>
import TabMenu from '@/views/human-resource/job-value/TabMenu'

import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbHumanResource,
    PointTable,
    TabMenu
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      page: this.$route.query.page * 1 || 1,
      limit: 10,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('humanResourceJobValueCriteria', ['criterias', 'pagination'])
  },
  created () {
    if (this.$permission.has('read employee master job value')) {
      this.getCriteriaRequest()
      this.$nextTick(() => {
        this.$refs.searchText.setFocus()
      })
    } else {
      this.$router.push('/403')
    }
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('humanResourceJobValueCriteria', {
      getCriteria: 'get'
    }),
    updatePage (value) {
      this.page = value
      this.getCriteriaRequest()
    },
    getCriteriaRequest () {
      this.isLoading = true
      this.getCriteria({
        params: {
          sort_by: '-id',
          filter_like: {
            criteria_factor: this.searchText,
            'category.category': this.searchText
          },
          limit: this.limit,
          page: this.page,
          includes: 'scales;category'
        }
      }).then((response) => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notifications.error(error.message)
      })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.page = 1
      this.getCriteriaRequest()
    }, 300),
    onAdded (jobLocation) {
      this.getCriteriaRequest()
    }
  }
}
</script>
