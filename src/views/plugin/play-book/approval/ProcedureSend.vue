<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <breadcrumb-play-book />
      <span class="breadcrumb-item active">{{ 'Approval' | uppercase }}</span>
      <router-link
        to="/plugin/play-book/approval/procedure"
        class="breadcrumb-item"
      >
        {{ 'Procedure' | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ 'Sent' | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block mb-5">
          <router-link
            class="btn btn-outline-primary mr-3"
            to="/plugin/play-book/approval/procedure"
          >
            <i class="fa fa-arrow-left mr-2" /> List
          </router-link>
          <button
            v-if="!!selectedIds.length"
            class="btn btn-primary mr-3"
            @click="$refs.modelSendProcedureRequest.open()"
          >
            Sent {{ selectedIds.length }} {{ `Request${selectedIds.length > 1 ? 's' : ''}` }} <i class="fa fa-paper-plane" />
          </button>
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
              <th>#</th>
              <th>Code</th>
              <th>Name</th>
              <th>Action</th>
              <th>Note</th>
              <th>Status</th>
              <th class="text-center">
                Edit
              </th>
            </tr>
            <tr
              v-for="(procedure) in procedures"
              :key="procedure.id"
              slot="p-body"
            >
              <td>
                <input
                  v-model="form.ids[procedure.id]"
                  type="checkbox"
                  style="min-width: auto"
                >
              </td>
              <td>{{ procedure.code }}</td>
              <td>{{ procedure.name }}</td>
              <td>{{ procedure.approval_action | uppercase }}</td>
              <td>{{ procedure.note }}</td>
              <td>
                <span
                  class="badge"
                  :class="{ [procedure.approved_at ? 'badge-success' : 'badge-secondary']: true }"
                >
                  {{ procedure.approved_at ? 'APPROVED' : 'PENDING' }}
                </span>
              </td>
              <td class="text-center">
                <button
                  class="btn btn-sm btn-light"
                  @click="procedureIdToEdit = procedure.id; $refs.modalEditProcedure.open()"
                >
                  <i class="fa fa-edit" />
                </button>
              </td>
            </tr>
            <tr
              v-if="procedures.length < 1"
              slot="p-body"
              class="text-center"
            >
              <td
                colspan="7"
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

    <m-send-procedure-request
      ref="modelSendProcedureRequest"
      :ids="selectedIds"
      @added="getProcedures"
    />
    <m-edit-procedure
      ref="modalEditProcedure"
      :procedure-id="procedureIdToEdit"
      @added="getProcedures"
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
      statusLabel: null,
      form: {
        ids: {}
      },
      procedureIdToEdit: null
    }
  },
  computed: {
    ...mapGetters('pluginPlayBookProcedureApproval', ['procedures', 'pagination']),
    selectedIds () {
      const ids = []

      for (const id in this.form.ids) {
        if (this.form.ids[id]) {
          ids.push(id)
        }
      }

      return ids
    }
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
        this.form.ids = {}
        await this.get({
          search: this.searchText,
          page: this.page,
          limit: this.limit,
          status: this.status,
          want: 'send'
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
