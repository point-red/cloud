<template>
  <div>
    <plugin-study-tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create study sheets')"
            href="javascript:void(0)"
            class="input-group-prepend"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </a>
          <p-form-input
            id="search-text"
            name="search-text"
            :placeholder="$t('search') | capitalize"
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
              <th>
                {{ $t('date') }}
              </th>
              <th class="text-center">
                {{ $t('study subject') }}
              </th>
              <th>
                {{ $t('study competency') }}
              </th>
              <th
                class="text-center"
                width="1px"
              >
                {{ $t('action') }}
              </th>
            </tr>
            <tr
              v-for="(sheet, index) in sheets"
              :key="sheet.id"
              slot="p-body"
            >
              <th>{{ pagination.from + index | numberFormat }}</th>
              <!-- <td>{{ subject.name }}</td>
              <td class="text-center">
                <router-link
                  class="border-bottom"
                  :to="{name: 'PluginStudySheetIndex', query: {subject: subject.id}}"
                >
                  {{ subject.count_sheet | numberFormat }}
                </router-link>
              </td>
              <td class="text-center">
                <div style="display: flex;">
                  <button
                    v-if="$permission.has('edit study sheets')"
                    class="btn btn-light btn-action mr-2"
                    :title="$t('edit') | capitalize"
                    @click="$refs.modalEdit.open(subject)"
                  >
                    <i class="fa fa-edit" />
                  </button>
                  <button
                    v-if="$permission.has('delete study sheets')"
                    class="btn btn-light btn-action"
                    :title="$t('delete') | capitalize"
                    @click="$refs.modalDelete.open(subject)"
                  >
                    <i class="fa fa-trash" />
                  </button>
                </div>
              </td> -->
            </tr>
          </point-table>
        </p-block-inner>
      </p-block>
      {{ sheets }}
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import axios from '@/axios'
import PointTable from 'point-table-vue'
import PluginStudyTabMenu from '../TabMenu.vue'
export default {
  name: 'PluginStudySheet',
  components: {
    PointTable,
    PluginStudyTabMenu
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      page: this.$route.query.page ?? 1,
      limit: 10,
      lastPage: 1,
      sheets: [],
      pagination: {}
    }
  },
  created () {
    this.isLoading = true
    this.getStudySheets()
  },
  methods: {
    getStudySheets () {
      const apiParams = {
        sort_by: '-id'
      }
      axios.get('/plugin/study/sheet', apiParams)
        .then(response => {
          this.sheets = response.data
          this.pagination = response.meta
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value, page: 1 } })
      this.searchText = value
      this.getStudySheets()
    }, 300)
  }
}
</script>
