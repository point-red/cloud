<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <span class="breadcrumb-item active">{{ $t('item group') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create item')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.addItemGroup.open()"
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
              v-for="(group, index) in groups"
              :key="index"
              slot="p-body"
            >
              <th>{{ index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'item-group.show', params: { id: group.id }}">
                  {{ group.name | titlecase }}
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

    <m-add-item-group
      ref="addItemGroup"
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
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('masterItemGroup', ['groups', 'pagination'])
  },
  created () {
    this.getGroupRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('masterItemGroup', {
      getGroup: 'get'
    }),
    updatePage (value) {
      this.currentPage = value
      this.getGroupRequest()
    },
    getGroupRequest () {
      this.isLoading = true
      this.getGroup({
        params: {
          sort_by: 'name',
          filter_like: {
            name: this.searchText
          },
          limit: 10,
          page: this.currentPage
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
      this.currentPage = 1
      this.getGroupRequest()
    }, 300),
    onAdded (group) {
      this.searchText = group.name
      this.getGroupRequest()
    }
  }
}
</script>
