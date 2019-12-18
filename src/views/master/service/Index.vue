<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <span class="breadcrumb-item active">{{ $t('service') | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
        <div class="input-group block">
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            ref="searchText"
            :value="searchText"
            class="btn-block"
            @input="filterSearch"/>
          <router-link
            to="/master/service/create"
            v-if="$permission.has('create service')"
            class="input-group-append">
            <span class="input-group-text">
              <i class="fa fa-plus"></i>
            </span>
          </router-link>
        </div>
        <hr/>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">#</th>
              <th>Name</th>
            </tr>
            <tr
              v-for="(service, index) in services"
              :key="service.id"
              slot="p-body">
              <th>{{ ++index }}</th>
              <td>
                <router-link :to="{ name: 'service.show', params: { id: service.id }}">
                  {{ service.name | titlecase }}
                </router-link>
              </td>
            </tr>
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
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbMaster,
    PointTable,
    TabMenu
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterService', ['services'])
  },
  methods: {
    ...mapActions('masterService', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getServiceRequest()
    }, 300),
    getServiceRequest () {
      this.isLoading = true
      this.get({
        params: {
          fields: 'services.*',
          sort_by: 'name',
          filter_like: {
            'name': this.searchText
          },
          limit: 10,
          page: this.currentPage
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getServiceRequest()
    }
  },
  created () {
    this.getServiceRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  }
}
</script>
