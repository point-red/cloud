<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <breadcrumb-play-book />
      <span class="breadcrumb-item active">{{ 'Approval' | uppercase }}</span>
      <span class="breadcrumb-item active">{{ 'Instruction' | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row mb-5">
      <p-block>
        <div class="input-group block mb-5">
          <router-link
            v-if="$permission.has('create play book instruction')"
            class="btn btn-outline-primary mr-3"
            to="/plugin/play-book/approval/instruction/send"
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
            v-if="!$permission.has('approve play book instruction')"
            class="alert alert-danger"
          >
            <span>You don't have permission to see this page</span>
          </div>
          <point-table v-else>
            <tr slot="p-head">
              <th width="50px">
                #
              </th>
              <th>Number</th>
              <th>Procedure</th>
              <th>To</th>
              <th>Action</th>
              <th>Note</th>
              <th>Status</th>
            </tr>
            <template
              v-for="(instruction, index) in instructions"
            >
              <tr
                :key="instruction.id"
                slot="p-body"
              >
                <th>{{ (++index) + ((page - 1) * limit) }}</th>
                <td>
                  <div>
                    <a
                      v-if="!instruction.approved_at && authUser.id === instruction.approval_request_to"
                      :href="`#${instruction.id}`"
                      @click.stop="showInstructionModal(instruction.id)"
                    >
                      {{ instruction.number }} - {{ instruction.name }}
                    </a>
                    <span v-else>
                      {{ instruction.number }} - {{ instruction.name }}
                    </span>
                  </div>
                  <span class="text-muted">
                    {{ new Date(instruction.approval_request_at).toLocaleString() }}
                  </span>
                </td>
                <td>
                  <router-link :to="`/plugin/play-book/procedure/${instruction.procedure.id}`">
                    {{ instruction.procedure.code }} - {{ instruction.procedure.name }}
                  </router-link>
                </td>
                <td>{{ instruction.approver.name | uppercase }}</td>
                <td>{{ instruction.approval_action | uppercase }}</td>
                <td>{{ instruction.approval_note || '-' }}</td>
                <td>
                  <span
                    class="badge"
                    :class="getClasses(instruction)"
                  >
                    {{ getStatus(instruction) | uppercase }}
                  </span>
                </td>
              </tr>
              <tr
                v-for="step in instruction.steps"
                :key="step.id"
                slot="p-body"
              >
                <td />
                <td colspan="2">
                  <div class="d-flex align-items-center">
                    <i class="fa fa-long-arrow-right mr-3" />
                    <div>
                      <div>
                        <a
                          v-if="!step.approved_at"
                          :href="`#step-${step.id}`"
                          @click.stop="showInstructionStepModal(step)"
                        >
                          {{ step.name }}
                        </a>
                        <span v-else>{{ step.name }}</span>
                      </div>
                      <span class="text-muted">
                        {{ new Date(instruction.approval_request_at).toLocaleString() }}
                      </span>
                    </div>
                  </div>
                </td>
                <td>{{ instruction.approver.name | uppercase }}</td>
                <td>
                  {{ step.approval_action | uppercase }}
                </td>
                <td>
                  {{ step.approval_note || '-' }}
                </td>
                <td>
                  <span
                    class="badge"
                    :class="getClasses(step)"
                  >
                    {{ getStatus(step) | uppercase }}
                  </span>
                </td>
              </tr>
            </template>
            <tr
              v-if="instructions.length < 1"
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
    <m-show-instruction
      ref="modalShowInstruction"
      :instruction-id="selectedInstructionId"
      @added="getInstructions"
    />
    <m-show-instruction-step
      ref="modalShowInstructionStep"
      :step="selectedStep"
      @added="getInstructions"
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
      selectedInstructionId: null,
      selectedStep: null
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('pluginPlayBookInstructionApproval', ['instructions', 'pagination'])
  },
  mounted () {
    this.getInstructions().then(() => {
      if (this.$route.query.step_id && this.$route.query.action) {
        let step = null

        this.instructions.forEach(_ins => {
          step = _ins.steps.find(_step => _step.id === parseInt(this.$route.query.step_id))
        })

        this.showInstructionStepModal(step)
      }

      if (this.$route.query.id && this.$route.query.action) {
        this.showInstructionModal(this.$route.query.id)
      }
    })
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('pluginPlayBookInstructionApproval', [
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
      this.getInstructions()
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
      this.getInstructions()
    }, 300),
    async getInstructions () {
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
    getStatus (request) {
      return request.approved_at
        ? 'approved' : (request.declined_at
          ? 'declined' : 'pending'
        )
    },
    getClasses (request) {
      const btnClass = request.approved_at
        ? 'btn-success' : (request.declined_at
          ? 'btn-danger' : 'btn-secondary'
        )

      return {
        [btnClass]: true
      }
    },
    updatePage (value) {
      this.page = value
      this.getInstructions()
    },
    showInstructionModal (instructionId) {
      this.selectedInstructionId = instructionId
      this.$refs.modalShowInstruction.open()
    },
    showInstructionStepModal (step) {
      this.selectedStep = step
      this.$refs.modalShowInstructionStep.open()
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
