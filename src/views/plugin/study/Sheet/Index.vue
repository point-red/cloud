<template>
  <div>
    <plugin-study-tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <router-link
            v-if="$permission.has('create study sheets')"
            class="input-group-prepend"
            :to="{name: 'PluginStudySheetCreate'}"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </router-link>
          <p-form-input
            id="search-text"
            name="search-text"
            :placeholder="$t('search') | capitalize"
            :value="searchText"
            class="btn-block"
            @input="filterSearch"
          />
        </div>

        <advance-filter @change="getStudySheets" />

        <hr>

        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>
                #
              </th>
              <th>
                {{ $t('date') }}
              </th>
              <th>
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
              class="d-relative"
            >
              <th>{{ pagination.from + index | numberFormat }}</th>
              <td>{{ sheet.started_at | dateFormat('DD MMM YYYY') }}</td>
              <td>{{ sheet.subject ? sheet.subject.name : '' }}</td>
              <td>{{ sheet.competency }}</td>
              <td class="text-center">
                <div style="display: flex;">
                  <router-link
                    class="btn btn-light btn-action mr-2"
                    :title="$t('open') | capitalize"
                    :to="{name: 'PluginStudySheetShow', params: {id: sheet.id}}"
                  >
                    <i class="fa fa-search" />
                  </router-link>
                  <router-link
                    v-if="$permission.has('edit study sheets')"
                    class="btn btn-light btn-action mr-2"
                    :title="$t('edit') | capitalize"
                    :to="{name: 'PluginStudySheetEdit', params: {id: sheet.id}}"
                  >
                    <i class="fa fa-edit" />
                  </router-link>
                  <button
                    v-if="$permission.has('delete study sheets')"
                    class="btn btn-light btn-action"
                    :title="$t('delete') | capitalize"
                    @click="$refs.modalDelete.open(sheet)"
                  >
                    <i class="fa fa-trash" />
                  </button>
                </div>
              </td>
            </tr>
          </point-table>
        </p-block-inner>

        <p-pagination
          :current-page="pagination.current_page"
          :last-page="pagination.last_page"
          @updatePage="updatePage"
        />
      </p-block>
    </div>

    <m-delete
      ref="modalDelete"
      @delete="sheetDeleted"
    />
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import axios from '@/axios'
import PointTable from 'point-table-vue'
import PluginStudyTabMenu from '../TabMenu.vue'
import MDelete from './Delete.vue'
import AdvanceFilter from './AdvanceFilter'
export default {
  name: 'PluginStudySheet',
  components: {
    PointTable,
    PluginStudyTabMenu,
    MDelete,
    AdvanceFilter
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      page: this.$route.query.page ?? 1,
      sheets: [],
      pagination: {}
    }
  },
  created () {
    this.getStudySheets()
  },
  methods: {
    getStudySheets () {
      const apiParams = {
        sort_by: '-started_at',
        page: this.$route.query.page,
        filter_like: {
          competency: this.searchText
        },
        filter_equal: {
          is_draft: 0,
          subject_id: this.$route.query.subject_id
        },
        filter_date_min: {
          started_at: this.serverDateTime(this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00'))
        },
        filter_date_max: {
          started_at: this.serverDateTime(this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59'))
        }
      }
      this.isLoading = true
      axios.get('/plugin/study/sheet', { params: apiParams })
        .then(response => {
          this.sheets = response.data.data
          this.pagination = response.data.meta
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value, page: 1 } })
      this.searchText = value
      this.getStudySheets()
    }, 300),
    updatePage (value) {
      this.$route.query.page = value
      this.getStudySheets()
    },
    sheetDeleted (sheetId) {
      this.sheets = this.sheets.filter(({ id }) => id !== sheetId)
      this.getStudySheets()
    }
  }
}
</script>

<style scoped>
>>> .btn-action {
  padding: 0;
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
