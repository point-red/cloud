<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <span class="breadcrumb-item active">{{ $t('item') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create item')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.fileInputHidden.click()"
          >
            <span class="input-group-text">
              <i class="fa fa-upload" />
            </span>
          </a>
          <a
            v-if="$permission.has('create item')"
            href="javascript:void(0)"
            class="input-group-prepend"
            @click="$refs.addItem.open()"
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
              <th>Account</th>
              <th>Stock</th>
            </tr>
            <tr
              v-for="(item, index) in items"
              :key="item.id"
              slot="p-body"
            >
              <th>{{ ++index }}</th>
              <td>
                <router-link :to="{ name: 'item.show', params: { id: item.id }}">
                  {{ item.code }}
                </router-link>
              </td>
              <td>
                <router-link :to="{ name: 'item.show', params: { id: item.id }}">
                  {{ item.name }}
                </router-link>
              </td>
              <td>
                <template v-if="item.account">
                  {{ item.account.number }} - {{ item.account.alias }}
                </template>
              </td>
              <td>
                <template v-if="item.units.length">
                  {{ item.stock | numberFormat }} {{ item.units[0].label }}
                </template>
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
    <m-add-item
      ref="addItem"
      @closed="onAdded"
    />
    <m-add-item-import
      ref="addItemImport"
      @imported="onAdded"
    />
    <p-form-file-hidden
      id="file"
      ref="fileInputHidden"
      name="file"
      @fileChanged="importItem"
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
    ...mapGetters('masterItem', ['items', 'pagination']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.search()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('masterItem', ['get']),
    onAdded () {
      this.search()
    },
    updatePage (value) {
      this.currentPage = value
      this.search()
    },
    search () {
      this.isLoading = true
      this.get({
        params: {
          page: this.currentPage,
          limit: 20,
          sort_by: 'name',
          filter_like: {
            code: this.searchText,
            name: this.searchText
          },
          includes: 'account;units'
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.search()
    }, 300),
    importItem (file) {
      if (this.authUser.branch != null) {
        if (file.name.match(/.(xls|xlsx)$/i)) {
          this.$refs.addItemImport.setValue(file)
          this.$refs.addItemImport.open()
        } else {
          this.$notification.error('File not allowed (allowed extension: .xls, .xlsx)')
        }
      } else {
        this.$notification.error('Please set as default branch')
      }
    }
  }
}
</script>
