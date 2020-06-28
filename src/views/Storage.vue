<template>
  <div>
    <div class="block">
      <nav class="breadcrumb bg-white push">
        <span class="breadcrumb-item active">{{ $t('storage') | titlecase }}</span>
      </nav>
    </div>

    <div class="row">
      <p-block>
        <p-form-input
          id="search-text"
          ref="searchText"
          name="search-text"
          placeholder="Search"
          :value="searchText"
          @input="filterSearch"
        />

        <hr>

        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>#</th>
              <th>Project</th>
              <th>File Name</th>
              <th>File Expired at</th>
              <th>Download URL</th>
            </tr>
            <tr
              v-for="(cloudStorage, index) in cloudStorages"
              :key="cloudStorage.id"
              slot="p-body"
            >
              <th>{{ index + 1 }}</th>
              <td>{{ cloudStorage.project.name }}</td>
              <td>{{ cloudStorage.file_name }}</td>
              <td>
                <template v-if="cloudStorage.expired_at">
                  {{ cloudStorage.expired_at | dateFormat('DD MMM YYYY HH:mm') }}
                </template>
              </td>
              <td><a :href="cloudStorage.download_url">{{ cloudStorage.download_url }}</a></td>
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
  </div>
</template>

<script>
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
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
    ...mapGetters('cloudStorage', ['cloudStorages', 'pagination'])
  },
  created () {
    this.getCloudStorageRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('cloudStorage', ['get']),
    updatePage (value) {
      this.currentPage = value
      this.getCloudStorageRequest()
    },
    getCloudStorageRequest () {
      this.isLoading = true
      this.get({
        params: {
          sort_by: 'file_name',
          limit: 20,
          is_user_protected: true,
          page: this.currentPage,
          file_name: this.searchText
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
      this.getCloudStorageRequest()
    }, 300)
  }
}
</script>
