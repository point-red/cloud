<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <span class="breadcrumb-item active">{{ $t('expedition') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create expedition')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.addExpedition.open()"
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
              <th>Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
            <tr
              v-for="(expedition, index) in expeditions"
              :key="expedition.id"
              slot="p-body"
            >
              <th>{{ (page - 1) * 10 + index + 1 }}</th>
              <td>{{ expedition.code }}</td>
              <td>
                <router-link :to="{ name: 'expedition.show', params: { id: expedition.id }}">
                  {{ expedition.name }}
                </router-link>
              </td>
              <td>{{ expedition.email }}</td>
              <td>{{ expedition.address }}</td>
              <td>{{ expedition.phone }}</td>
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

    <m-add-expedition
      ref="addExpedition"
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
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster,
    PointTable
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      page: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterExpedition', ['expeditions', 'pagination'])
  },
  created () {
    this.getExpeditionRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('masterExpedition', ['get']),
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.page = 1
      this.getExpeditionRequest()
    }, 300),
    getExpeditionRequest () {
      this.isLoading = true
      this.get({
        params: {
          fields: 'expedition.*',
          sort_by: 'name',
          filter_like: {
            'expedition.code': this.searchText,
            'expedition.name': this.searchText,
            'expedition.address': this.searchText,
            'expedition.phone': this.searchText,
            'expedition.email': this.searchText
          },
          limit: 10,
          page: this.page
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    updatePage (value) {
      this.page = value
      this.getExpeditionRequest()
    },
    onAdded () {
      this.getExpeditionRequest()
    }
  }
}
</script>
