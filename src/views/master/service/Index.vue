<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <span class="breadcrumb-item active">{{ $t('service') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create service')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.addService.open()"
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
              <th>Name</th>
            </tr>
            <tr
              v-for="(service, index) in services"
              :key="service.id"
              slot="p-body"
            >
              <th>{{ ++index }}</th>
              <td>
                <router-link :to="{ name: 'service.show', params: { id: service.id }}">
                  {{ service.name }}
                </router-link>
              </td>
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
    <m-add-service
      ref="addService"
      @added="onAdded"
    />
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
      limit: 10,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterService', ['services'])
  },
  created () {
    this.getServiceRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
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
          fields: 'service.*',
          sort_by: 'name',
          filter_like: {
            name: this.searchText
          },
          limit: this.limit,
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
    },
    onAdded () {
      this.getServiceRequest()
    }
  }
}
</script>
