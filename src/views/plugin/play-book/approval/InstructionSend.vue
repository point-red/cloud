<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <breadcrumb-play-book />
      <span class="breadcrumb-item active">{{ 'Approval' | uppercase }}</span>
      <router-link
        to="/plugin/play-book/approval/instruction"
        class="breadcrumb-item"
      >
        {{ 'Instruction' | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ 'Sent' | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block mb-5">
          <router-link
            class="btn btn-outline-primary mr-3"
            to="/plugin/play-book/approval/instruction"
          >
            <i class="fa fa-arrow-left mr-2" /> List
          </router-link>
          <button
            v-if="!!selectedIds.length || !!selectedStepIds.length"
            class="btn btn-primary mr-3"
            @click="$refs.modelSendInstructionRequest.open()"
          >
            Sent {{ (selectedIds.length) }} {{ `Request${selectedIds.length > 1 ? 's' : ''}` }} <i class="fa fa-paper-plane" />
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
              <th>Name</th>
              <th>Action</th>
              <th>Status</th>
              <th class="text-center">
                Edit
              </th>
            </tr>
            <template
              v-for="(instruction) in instructions"
            >
              <tr
                :key="instruction.id"
                slot="p-body"
              >
                <td>
                  <input
                    v-model="form.ids[instruction.id]"
                    type="checkbox"
                    style="min-width: auto"
                  >
                </td>
                <td>
                  {{ instruction.number }} - {{ instruction.name }}
                </td>
                <td>{{ instruction.approval_action | uppercase }}</td>
                <td>
                  <span
                    class="badge"
                    :class="{ [instruction.approved_at ? 'badge-success' : 'badge-secondary']: true }"
                  >
                    {{ instruction.approved_at ? 'APPROVED' : 'PENDING' }}
                  </span>
                </td>
                <td class="text-center">
                  <button
                    class="btn btn-sm btn-light"
                    :disabled="instruction.approved_at"
                    @click="instructionToEdit = instruction; $refs.modalEditInstruction.open()"
                  >
                    <i class="fa fa-edit" />
                  </button>
                </td>
              </tr>
              <tr
                v-for="step in instruction.steps"
                :key="step.id"
                slot="p-body"
              >
                <td />
                <td>
                  <i class="fa fa-long-arrow-right mr-2" />
                  {{ step.name }}
                </td>
                <td>
                  {{ step.approval_action | uppercase }}
                </td>
                <td>
                  <span
                    class="badge"
                    :class="{ [step.approved_at ? 'badge-success' : 'badge-secondary']: true }"
                  >
                    {{ step.approved_at ? 'APPROVED' : 'PENDING' }}
                  </span>
                </td>
                <td class="text-center">
                  <button
                    class="btn btn-sm btn-light"
                    :disabled="step.approved_at"
                    @click="stepToEdit = step; $refs.modalEditStep.open()"
                  >
                    <i class="fa fa-edit" />
                  </button>
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
    <m-send-instruction-request
      ref="modelSendInstructionRequest"
      :ids="selectedIds"
      :step-ids="selectedStepIds"
      @added="getInstructions"
    />
    <m-edit-instruction
      ref="modalEditInstruction"
      :instruction="instructionToEdit"
      @added="getInstructions"
    />
    <m-edit-instruction-step
      ref="modalEditStep"
      :step="stepToEdit"
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
      form: {
        ids: {},
        stepIds: {}
      },
      instructionToEdit: null,
      stepToEdit: null
    }
  },
  computed: {
    ...mapGetters('pluginPlayBookInstructionApproval', ['instructions', 'pagination']),
    selectedIds () {
      const ids = []

      for (const id in this.form.ids) {
        if (this.form.ids[id]) {
          ids.push(id)
        }
      }

      return ids
    },
    selectedStepIds () {
      const ids = []

      for (const id in this.form.stepIds) {
        if (this.form.stepIds[id]) {
          ids.push(id)
        }
      }

      return ids
    }
  },
  watch: {
    /**
     * Select all steps id of an instruction id
     */
    'selectedIds' () {
      this.form.stepIds = {}
      this.selectedIds.forEach(id => {
        const instruction = this.instructions.find(_instruction => _instruction.id === parseInt(id))

        instruction.steps.forEach(_step => {
          this.form.stepIds[`${_step.id}`] = true
        })
      })
    }
  },
  mounted () {
    this.getInstructions()
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
        this.form.ids = {}
        this.form.stepIds = {}
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
      this.getInstructions()
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
