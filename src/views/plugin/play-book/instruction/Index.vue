<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <breadcrumb-play-book />
      <span class="breadcrumb-item active">{{ 'Instruction' | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div
          v-if="isDirty"
          class="alert alert-warning pb-5"
        >
          This is preview mode. Some of the contents is not published.
        </div>
        <div class="input-group block mb-5">
          <button
            v-if="$permission.has('create play book instruction')"
            class="btn btn-sm btn-light"
            :disabled="!!!form.procedure_id"
            @click="$refs.modalAddInstruction.open()"
          >
            ADD INSTRUCTION
            <i class="fa fa-plus ml-2" />
          </button>
          <button
            v-if="$permission.has('create play book instruction')"
            class="btn btn-sm btn-light ml-2"
            :disabled="!(form.procedure_id && form.instruction_id)"
            @click="$refs.modalAddStep.open()"
          >
            ADD STEP
            <i class="fa fa-plus ml-2" />
          </button>
          <router-link
            v-if="isDirty"
            class="btn btn-sm btn-primary ml-2"
            to="/plugin/play-book/approval/instruction/send"
          >
            Send Approval <i class="fa fa-paper-plane" />
          </router-link>
        </div>
        <div class="mt-3">
          <p-form-row
            id="procedure"
            name="procedure"
            :label="$t('procedure')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-select
                id="procedure"
                v-model="form.procedure_id"
                name="procedure"
                :options="procedures"
              />
            </div>
          </p-form-row>
          <p-form-row
            id="instruction"
            name="instruction"
            :label="$t('instruction')"
          >
            <div
              slot="body"
              class="col-lg-9 d-flex"
            >
              <p-select
                id="instruction"
                :key="selectInstructionKey"
                v-model="form.instruction_id"
                name="instruction"
                :options="instructions"
              />

              <div v-if="instruction">
                <button
                  v-if="$permission.has('update play book instruction')"
                  class="btn btn-light ml-2"
                  @click="$refs.modalEditInstruction.open()"
                >
                  Edit
                </button>
                <button
                  v-if="$permission.has('delete play book instruction')"
                  class="btn btn-light ml-2"
                  @click="confirmDeleteInstruction"
                >
                  Delete
                </button>
              </div>
            </div>
          </p-form-row>
        </div>
        <p-block-inner
          v-if="instruction"
          :is-loading="isLoading"
        >
          <div class="text-right">
            <button
              v-if="stepActive.id"
              class="btn btn-sm btn-light mr-1"
              @click.stop="$refs.modalEditStep.open()"
            >
              Edit
            </button>
            <button
              v-if="stepActive.id"
              class="btn btn-sm btn-light"
              @click.stop="confirmDeleteStep()"
            >
              Delete
            </button>
            <router-link
              class="btn btn-sm btn-light"
              :to="`/plugin/play-book/instruction/${instruction.id}/histories`"
            >
              See Histories
            </router-link>
          </div>
          <hr>
          <point-table>
            <tr slot="p-head">
              <th width="50px">
                #
              </th>
              <th>Step</th>
              <th
                v-for="glossary in glossaries"
                :key="glossary.id"
              >
                {{ glossary.name }}
              </th>
              <th
                v-if="$route.query['review[]']"
                class="text-center"
              >
                Action
              </th>
            </tr>
            <tr
              v-for="(step, i) in steps"
              :key="i"
              slot="p-body"
              :class="{ 'bg-primary text-white': stepActive.id === step.id }"
            >
              <td>
                <strong>{{ (++i) + ((page - 1) * limit) }}</strong>
              </td>
              <td>
                <a
                  v-if="step.approved_at"
                  href="javascript:void(0)"
                  :style="{ [stepActive.id === step.id ? 'color' : null]: 'white' }"
                  @click.stop="setStepActive(step)"
                >
                  {{ step.name }}
                </a>
                <span
                  v-else-if="step.approval_action !== 'destroy'"
                  class="text-success"
                >
                  {{ step.name }}
                </span>
                <strike
                  v-else
                  class="text-danger"
                >
                  {{ step.name }}
                </strike>
              </td>
              <!-- eslint-disable vue/no-v-html -->
              <td
                v-for="glossary in glossaries"
                :key="glossary.id"
                v-html="$sanitize(step.contentsForView[`${glossary.id}`] || '-')"
              >
                <div
                  v-if="step.approved_at"
                  v-html="step.contentsForView[`${glossary.id}`] || '-'"
                />
                <div
                  v-else-if="step.approval_action !== 'destroy'"
                  class="text-success"
                  v-html="step.contentsForView[`${glossary.id}`] || '-'"
                />
                <strike
                  v-else
                  class="text-danger"
                  v-html="step.contentsForView[`${glossary.id}`] || '-'"
                />
              </td>
              <td
                v-if="$route.query['review[]']"
                class="text-center"
              >
                <button
                  v-if="!step.approved_at && step.approval_request_to === authUser.id && !step.declined_at"
                  type="button"
                  class="btn btn-sm btn-secondary"
                  @click="stepIdToDelete = step.id; $refs.modalDeclineInstructionStep.open()"
                >
                  {{ $t('decline') | uppercase }}
                </button>
                <button
                  v-if="!step.approved_at && step.approval_request_to === authUser.id && !step.declined_at"
                  type="submit"
                  class="btn btn-sm btn-success ml-2"
                  :disabled="isSaving === step.id"
                  @click="approveStep(step)"
                >
                  <i
                    v-show="isSaving === step.id"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('approve') | uppercase }}
                </button>
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
    <m-add-instruction
      ref="modalAddInstruction"
      :procedure-id="parseInt(form.procedure_id)"
      @added="$router.push('/plugin/play-book/approval/instruction/send')"
    />
    <m-edit-instruction
      ref="modalEditInstruction"
      :instruction="instruction"
      @added="$router.push('/plugin/play-book/approval/instruction/send')"
    />
    <m-add-instruction-step
      ref="modalAddStep"
      :instruction-id="parseInt(form.instruction_id)"
      @added="isDirty = true; getSteps()"
    />
    <m-edit-instruction-step
      ref="modalEditStep"
      :step="stepActive"
      @added="isDirty = true; getSteps()"
    />
    <m-decline-instruction-step
      ref="modalDeclineInstructionStep"
      :instruction-id="form.instruction_id"
      :instruction-step-id="stepIdToDelete"
      @added="getSteps()"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPlayBook from '@/views/plugin/play-book/Breadcrumb'
import PointTable from 'point-table-vue'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPlugin,
    BreadcrumbPlayBook,
    PointTable
  },
  data () {
    return {
      isLoading: true,
      isSaving: false,
      searchText: this.$route.query.search,
      page: this.$route.query.page * 1 || 1,
      limit: 10,
      lastPage: 1,
      isAdvanceFilter: false,
      statusId: this.$route.query.statusId,
      statusLabel: null,
      form: {
        procedure_id: null,
        instruction_id: null
      },
      isDirty: false || this.$route.query.dirty,
      stepActive: {},
      selectInstructionKey: (new Date()).toString(),
      stepIdToDelete: null
    }
  },
  computed: {
    ...mapState('pluginPlayBookInstruction', [
      'pagination'
    ]),
    ...mapGetters('auth', ['authUser']),
    glossaries () {
      const stepGlossaryIds = []

      if (this.instruction) {
        this.$store.getters['pluginPlayBookInstruction/steps'].forEach(_step => {
          _step.contents.forEach(_content => {
            if (!stepGlossaryIds.find(id => id === _content.glossary_id)) {
              stepGlossaryIds.push(_content.glossary_id)
            }
          })
        })
      }

      return this.$store.getters['pluginPlayBookGlossary/glossaries'].filter(_glossary => {
        return stepGlossaryIds.find(_id => parseInt(_id) === _glossary.id)
      })
    },
    procedures () {
      try {
        return this.$store.getters['pluginPlayBookProcedure/allProcedures'](
          this.$store.getters['pluginPlayBookProcedure/procedures']
        ).map(_procedure => ({
          id: _procedure.id,
          label: `${_procedure.code} - ${_procedure.name}`
        }))
      } catch (error) {
        return []
      }
    },
    instructions () {
      return this.$store.getters['pluginPlayBookInstruction/instructions']
        .map(_instruction => ({
          id: _instruction.id,
          label: `${_instruction.number} - ${_instruction.name}`
        }))
    },
    instruction () {
      const instruction = this.$store.getters['pluginPlayBookInstruction/instructions']
        .find(_instruction => parseInt(_instruction.id) === parseInt(this.form.instruction_id))

      if (instruction) {
        return { ...instruction }
      }

      return null
    },
    steps () {
      if (!this.instruction) {
        return []
      }

      return this.$store.getters['pluginPlayBookInstruction/steps'].map(_step => {
        const contents = {}
        _step = { ..._step }

        _step.contents.forEach(_content => {
          contents[`${_content.glossary_id}`] = _content.content
        })

        _step.contentsForView = contents

        return _step
      })
    }
  },
  watch: {
    'form.procedure_id' (newValue) {
      this.getInstructions()
      const query = this.$route.query

      if (
        parseInt(this.$route.query.procedure) === parseInt(this.form.procedure_id)
      ) {
        return
      }

      this.$router.replace({
        query: {
          ...query,
          procedure: newValue
        }
      })
    },
    'form.instruction_id' (newValue) {
      const query = {
        ...this.$route.query,
        instruction: newValue
      }

      if (!newValue) {
        delete query.instruction
      }

      if (
        parseInt(this.$route.query.procedure) === parseInt(this.form.procedure_id) &&
        parseInt(this.$route.query.instruction) === parseInt(this.form.instruction_id)
      ) {
        return
      }

      this.$router.replace({ query })
    },
    async '$route.query.procedure' () {
      await this.getInstructions()
    },
    async '$route.query.instruction' () {
      await this.getSteps()
    }
  },
  async mounted () {
    this.$store.dispatch('pluginPlayBookGlossary/get')
    await this.getProcedures()

    if (this.$route.query.procedure) {
      this.form.procedure_id = this.$route.query.procedure
      await this.getInstructions()
      this.form.instruction_id = this.$route.query.instruction
      this.getSteps()
    }

    window.addEventListener('click', this.setStepActive)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.setStepActive)
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    async getProcedures () {
      try {
        this.isLoading = true
        this.$store.commit('pluginPlayBookProcedure/SET_PROCEDURES', [])
        this.$store.commit('pluginPlayBookInstruction/SET_INSTRUCTIONS', [])
        await this.$store.dispatch('pluginPlayBookProcedure/get', {
          search: this.searchText,
          limit: 100
        })
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
    async getInstructions () {
      await this.$store.dispatch('pluginPlayBookInstruction/get', {
        procedure_id: this.form.procedure_id
      })

      this.selectInstructionKey = (new Date()).toString()
    },
    async getSteps () {
      try {
        this.isLoading = true

        let reviewIds = this.$route.query['review[]']

        if (!Array.isArray(reviewIds)) {
          reviewIds = [reviewIds]
        }

        await this.$store.dispatch('pluginPlayBookInstruction/getSteps', {
          page: this.page,
          limit: 10,
          instruction_id: this.instruction.id,
          is_dirty: this.isDirty || null,
          review: reviewIds
        })
        this.stepActive = {}
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
    updatePage (value) {
      this.page = value
      this.getSteps()
    },
    setStepActive (step) {
      if (!step.instruction_id) {
        step = {}
      }

      this.stepActive = step || {}
    },
    async confirmDeleteInstruction () {
      const title = `${this.$t('delete')} Instruction "${this.instruction.name}"`
      this.$alert.confirm(
        title, this.$t('confirmation delete message')
      ).then(async response => {
        try {
          this.isLoading = true
          this.isDeleteing = true

          await this.$store.dispatch('pluginPlayBookInstruction/delete', this.instruction.id)

          this.$router.push('/plugin/play-book/approval/instruction/send')
        } catch (error) {
        } finally {
          this.isDeleteing = false
          this.isLoading = false
        }
      })
    },
    async confirmDeleteStep () {
      const title = `${this.$t('delete')} Step "${this.stepActive.name}"`
      this.$alert.confirm(
        title, this.$t('confirmation delete message')
      ).then(async response => {
        try {
          this.isLoading = true
          this.isDeleteing = true

          await this.$store.dispatch('pluginPlayBookInstruction/deleteStep', this.stepActive)

          this.isDirty = true
          this.getSteps()
        } catch (error) {
        } finally {
          this.isDeleteing = false
          this.isLoading = false
        }
      })
    },
    async approveStep (step) {
      try {
        this.isSaving = step.id

        await this.$store.dispatch('pluginPlayBookInstructionApproval/approveStep', step)

        this.getSteps()
      } catch (error) {
      } finally {
        this.isSaving = false
      }
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
