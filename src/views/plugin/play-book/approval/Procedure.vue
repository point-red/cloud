<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <breadcrumb-play-book />
      <span class="breadcrumb-item active">{{ 'Approval' | uppercase }}</span>
      <span class="breadcrumb-item active">{{ 'Procedure' | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block mb-5">
          <router-link
            v-if="$permission.has('create play book procedure')"
            class="btn btn-outline-primary mr-3"
            to="/plugin/play-book/approval/procedure/send"
          >
            Sent Request <i class="fa fa-paper-plane" />
          </router-link>
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
          <div
            v-if="!$permission.has('approve play book procedure')"
            class="alert alert-danger"
          >
            <span>You don't have permission to see this page</span>
          </div>
          <point-table v-else>
            <tr slot="p-head">
              <th width="50px">
                #
              </th>
              <th>Code</th>
              <th>To</th>
              <th>Action</th>
              <th>Note</th>
              <th>Status</th>
            </tr>
            <tr
              v-for="(procedure, index) in procedures"
              :key="procedure.id"
              slot="p-body"
            >
              <th>{{ (++index) + ((page - 1) * limit) }}</th>
              <td>
                <div>
                  <router-link :to="`/plugin/play-book/procedure/${procedure.id}`">
                    {{ procedure.code }} - {{ procedure.name }}
                  </router-link>
                </div>
                <span class="text-muted">
                  {{ new Date(procedure.approval_request_at).toLocaleString() }}
                </span>
              </td>
              <td>{{ (procedure.approver ? procedure.approver.name : '-') | uppercase }}</td>
              <td>{{ procedure.approval_action | uppercase }}</td>
              <td>{{ procedure.approval_note || '-' }}</td>
              <td>
                <span
                  class="badge"
                  :class="getClasses(procedure)"
                >
                  {{ getStatus(procedure) | uppercase }}
                </span>
              </td>
            </tr>
            <tr
              v-if="procedures.length < 1"
              slot="p-body"
              class="text-center"
            >
              <td
                colspan="6"
                class="my-2 py-5"
              >
                No data
              </td>
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

    <m-status
      ref="status"
      @choosen="onChoosenStatus"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPlayBook from '@/views/plugin/play-book/Breadcrumb'
import TabMenu from './components/TabMenu'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPlugin,
    BreadcrumbPlayBook,
    PointTable,
    TabMenu
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      page: this.$route.query.page * 1 || 1,
      limit: 10,
      lastPage: 1,
      isAdvanceFilter: false,
      statusId: this.$route.query.statusId,
      statusLabel: null
    }
  },
  computed: {
    ...mapGetters('pluginPlayBookProcedureApproval', ['procedures', 'pagination'])
  },
  mounted () {
    this.getProcedures()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('pluginPlayBookProcedureApproval', [
      'get'
    ]),
    getStatus (procedure) {
      return procedure.approved_at
        ? 'approved' : (procedure.declined_at
          ? 'declined' : 'pending'
        )
    },
    getClasses (procedure) {
      const btnClass = procedure.approved_at
        ? 'btn-success' : (procedure.declined_at
          ? 'btn-danger' : 'btn-secondary'
        )

      return {
        [btnClass]: true
      }
    },
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
      this.getProcedures()
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
      this.getProcedures()
    }, 300),
    async getProcedures () {
      try {
        this.isLoading = true
        await this.get({
          search: this.searchText,
          page: this.page,
          limit: this.limit,
          status: this.status
        })
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
    updatePage (value) {
      this.page = value
      this.getProcedures()
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
