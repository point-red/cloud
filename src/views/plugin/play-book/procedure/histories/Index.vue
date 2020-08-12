<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <breadcrumb-play-book />
      <breadcrumb-procedure />
      <span class="breadcrumb-item active">{{ procedure && procedure.code || 'Loading' | uppercase }}</span>
      <span class="breadcrumb-item active">{{ 'Histories' | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <h4>{{ 'histories' | uppercase }}</h4>
          <point-table>
            <tr slot="p-head">
              <th width="50px">
                #
              </th>
              <th>Code</th>
              <th>Name</th>
              <th>Purpose</th>
              <th>Note</th>
            </tr>
            <tr
              v-for="(history, index) in histories"
              :key="history.id"
              slot="p-body"
            >
              <th>{{ (++index) + ((page - 1) * limit) }}</th>
              <td>{{ history.code }}</td>
              <td>{{ history.name }}</td>
              <td>{{ history.purpose | uppercase }}</td>
              <td>{{ history.note }}</td>
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
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPlayBook from '@/views/plugin/play-book/Breadcrumb'
import BreadcrumbProcedure from '@/views/plugin/play-book/procedure/components/Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPlugin,
    BreadcrumbPlayBook,
    BreadcrumbProcedure,
    PointTable
  },
  data () {
    return {
      isLoading: true,
      page: this.$route.query.page * 1 || 1,
      limit: 10,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('pluginPlayBookProcedureHistories', ['procedure', 'histories', 'pagination'])
  },
  mounted () {
    this.getHistories()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('pluginPlayBookProcedureHistories', [
      'get'
    ]),
    onChoosenStatus (option) {
      this.statusId = option.id
      this.statusLabel = option.label
      this.$router.push({
        query: {
          search: this.searchText,
          statusId: this.statusId,
          groupId: this.groupId,
          pricingGroupId: this.pricingGroupId
        }
      })
      this.getHistories()
    },
    filterSearch: debounce(function (value) {
      this.$router.push({
        query: {
          search: value,
          statusId: this.statusId
        }
      })
      this.searchText = value
      this.page = 1
      this.getHistories()
    }, 300),
    async getHistories () {
      try {
        this.isLoading = true
        await this.get({
          procedureId: this.$route.params.id,
          params: {
            search: this.searchText,
            page: this.page,
            limit: this.limit,
            status: this.status
          }
        })
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
    updatePage (value) {
      this.page = value
      this.getHistories()
    }
  }
}
</script>

<style lang="scss">
.row {
  -webkit-user-select: none !important;
  -webkit-touch-callout: none !important;
  user-select: none;
}
</style>
