<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <router-link
        to="/human-resource/kpi"
        class="breadcrumb-item"
      >
        {{ $t('kpi') | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">{{ template.name | titlecase }}</span>
    </breadcrumb>

    <p-modal
      id="modal-delete"
      title="Confirmation"
    >
      <div slot="content">
        <p>Are you sure want to delete template "[{{ template.code }}] {{ template.name }}" ?</p>
      </div>
      <div slot="footer">
        <button
          type="button"
          class="btn btn-alt-secondary"
          data-dismiss="modal"
        >
          {{ $t('cancel') | uppercase }}
        </button>
        <button
          type="button"
          class="btn btn-danger"
          data-dismiss="modal"
        >
          Delete
        </button>
      </div>
    </p-modal>

    <div class="row">
      <p-block
        :title="template.name"
        :header="true"
        :is-loading="isLoading"
      >
        <p-table>
          <tr slot="p-head">
            <td class="font-size-h6 font-w700">
              {{ 'No' | uppercase }}
            </td>
            <td class="font-size-h6 font-w700">
              {{ 'Key Performance Indicator' | uppercase }}
            </td>
            <td class="font-size-h6 font-w700 text-center">
              {{ 'Weight' | uppercase }}
            </td>
            <td class="font-size-h6 font-w700 text-center">
              {{ 'Target' | uppercase }}
            </td>
            <td class="text-center">
              <button
                v-if="$permission.has('create employee kpi') || $permission.has('update employee kpi')"
                class="btn btn-secondary btn-sm mr-5"
                @click="$refs.group.show(template)"
              >
                <i class="si si-note" /> {{ $t('group') | uppercase }}
              </button>
            </td>
          </tr>
          <template
            v-for="group in template.groups"
            slot="p-body"
          >
            <tr
              :key="'group' + group.id"
              class="bg-info-light"
            >
              <td
                class="text-center font-w600"
                colspan="2"
              >
                {{ group.name }}
              </td>
              <td class="text-center font-w600">
                {{ group.weight | numberFormat }}%
              </td>
              <td class="text-center font-w600">
                {{ group.target }}
              </td>
              <td class="text-center">
                <button
                  v-if="$permission.has('create employee kpi') || $permission.has('update employee kpi')"
                  class="btn btn-secondary btn-sm mr-5"
                  @click="$refs.indicator.show(group)"
                >
                  <i class="si si-note" /> {{ $t('indicator') | uppercase }}
                </button>
                <button
                  v-if="$permission.has('create employee kpi') || $permission.has('update employee kpi')"
                  class="btn btn-secondary btn-sm mr-5"
                  @click="$refs.copyGroupModal.show(template.id, group.id)"
                >
                  <i class="si si-bagde" /> {{ $t('copy to') | uppercase }}
                </button>
              </td>
            </tr>
            <tr
              v-for="(indicator, index) in group.indicators"
              :key="'indicator' + indicator.id"
            >
              <td>{{ index+1 }}</td>
              <td>{{ indicator.name }}</td>
              <td class="text-center">
                {{ indicator.weight | numberFormat }}%
              </td>
              <td class="text-center">
                <template v-if="!indicator.automated_code">
                  {{ indicator.target }}
                </template>
              </td>
              <td class="text-center">
                <button
                  v-if="($permission.has('create employee kpi') || $permission.has('update employee kpi')) && !indicator.automated_code"
                  class="btn btn-secondary btn-sm mr-5"
                  @click="$refs.score.show(indicator)"
                >
                  <i class="si si-badge" /> {{ $t('score') | uppercase }}
                </button>
              </td>
            </tr>
          </template>
          <tr slot="p-body">
            <td />
            <td />
            <td class="text-center font-w700">
              <span class="btn btn-sm btn-outline-danger">{{ template.weight | numberFormat }}%</span>
            </td>
            <td class="text-center font-w700">
              <span class="btn btn-sm btn-outline-danger">{{ template.target }}</span>
            </td>
            <td />
          </tr>
        </p-table>
      </p-block>
    </div>

    <score-modal
      id="score"
      ref="score"
    />
    <indicator-modal
      id="indicator"
      ref="indicator"
    />
    <group-modal
      id="group"
      ref="group"
    />
    <copy-group-modal
      id="kpi-template"
      ref="copyGroupModal"
      @copied="onCopySuccess"
    />
  </div>
</template>

<script>
import Form from '@/utils/Form'
import ScoreModal from './ScoreModal'
import CopyGroupModal from './CopyGroupModal'
import IndicatorModal from './IndicatorModal'
import GroupModal from './GroupModal'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ScoreModal,
    CopyGroupModal,
    GroupModal,
    IndicatorModal,
    Breadcrumb,
    BreadcrumbHumanResource
  },
  data () {
    return {
      id: parseInt(this.$route.params.id),
      form: new Form(),
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('humanResourceKpiTemplate', ['template', 'templates'])
  },
  created () {
    this.isLoading = true
    this.templates.find((element) => {
      if (element.id === this.id) {
        this.$store.commit('humanResourceKpiTemplate/FETCH_OBJECT', element)
        this.isLoading = false
      }
    })
    this.findTemplate()
  },
  methods: {
    ...mapActions('humanResourceKpiTemplate', {
      findKpiTemplate: 'find'
    }),
    findTemplate () {
      this.findKpiTemplate({ id: this.id })
        .then(response => {
          this.isLoading = false
        })
    },
    onCopySuccess (templateId) {
      this.id = templateId
      this.$router.push({ params: { id: templateId } })
      this.findTemplate()
    }
  }
}
</script>
