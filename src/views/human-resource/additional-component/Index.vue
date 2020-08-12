<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <span class="breadcrumb-item active">{{ $t('additional component') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create employee salary additional component')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.addAdditionalComponent.open()"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </a>
          <p-form-input
            id="search-text"
            ref="searchText"
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
              <th width="50px">
                #
              </th>
              <th width="50%">
                {{ $t('name') }}
              </th>
              <th width="40%">
                {{ $t('source') }}
              </th>
              <th width="10%">
                {{ $t('weight') }}
              </th>
            </tr>
            <tr
              v-for="(additionalComponent, index) in additionalComponents"
              :key="index"
              slot="p-body"
            >
              <th>{{ (page - 1) * limit + index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'additional-component.show', params: { id: additionalComponent.id }}">
                  {{ additionalComponent.name }}
                </router-link>
              </td>
              <td>{{ additionalComponent.automated_code_name }}</td>
              <td>{{ additionalComponent.weight | numberFormat }}%</td>
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="page"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>

    <m-add-additional-component
      ref="addAdditionalComponent"
      @added="onAdded"
    />
  </div>
</template>

<script>
import TabMenu from '@/views/human-resource/TabMenu'

import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource,
    PointTable
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
    ...mapGetters('humanResourceEmployeeAdditionalComponent', ['additionalComponents', 'pagination'])
  },
  created () {
    this.getAdditionalComponentRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('humanResourceEmployeeAdditionalComponent', {
      getAdditionalComponent: 'get'
    }),
    updatePage (value) {
      this.page = value
      this.getAdditionalComponentRequest()
    },
    getAdditionalComponentRequest () {
      this.isLoading = true
      this.getAdditionalComponent({
        params: {
          sort_by: 'name',
          filter_like: {
            name: this.searchText,
            automated_code_name: this.searchText
          },
          limit: this.limit,
          page: this.page
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
      this.getAdditionalComponentRequest()
    }, 300),
    onAdded (additionalComponent) {
      this.searchText = additionalComponent.name
      this.getAdditionalComponentRequest()
    }
  }
}
</script>
