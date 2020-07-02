<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <breadcrumb-play-book />
      <router-link
        to="/plugin/play-book/instruction"
        class="breadcrumb-item"
      >
        {{ 'Instruction' | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ 'Histories' | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            v-if="instruction"
            id="procedure"
            name="procedure"
            :label="$t('procedure')"
          >
            <div
              v-if="instruction && instruction.procedure"
              slot="body"
              class="col-lg-9"
              :label="$t('procedure')"
            >
              {{ `${instruction.procedure.code} - ${instruction.procedure.name}` }}
            </div>
          </p-form-row>
          <p-form-row
            id="instruction"
            name="instruction"
            :label="$t('instruction')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <div
                v-for="(history, i) in instructionHistory"
                :key="i"
                class="form-group"
              >
                {{ `${history.number} - ${history.name}` }}
              </div>
            </div>
          </p-form-row>
          <point-table class="mt-5">
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
            </tr>
            <tr
              v-for="(step, i) in steps"
              :key="i"
              slot="p-body"
            >
              <td>
                <strong>{{ (++i) }}</strong>
              </td>
              <td>
                {{ step.name }}
              </td>
              <!-- eslint-disable vue/no-v-html -->
              <td
                v-for="glossary in glossaries"
                :key="glossary.id"
                v-html="$sanitize(step.contentsForView[`${glossary.id}`] || '-')"
              />
            </tr>
          </point-table>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPlayBook from '@/views/plugin/play-book/Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPlugin,
    BreadcrumbPlayBook,
    PointTable
  },
  data () {
    return {
      isLoading: true
    }
  },
  computed: {
    ...mapGetters('pluginPlayBookInstructionHistories', [
      'instruction',
      'instructionHistory',
      'glossaries',
      'steps'
    ])
  },
  mounted () {
    this.getHistories()
  },
  methods: {
    async getHistories () {
      try {
        this.isLoading = true
        await this.$store.dispatch('pluginPlayBookInstructionHistories/get', this.$route.params.id)
      } catch (error) {
      } finally {
        this.isLoading = false
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
