<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <router-link
        to="/human-resource/kpi"
        class="breadcrumb-item">{{ $t('kpi') | titlecase }}</router-link>
      <span class="breadcrumb-item active">{{ template.name | titlecase }}</span>
    </breadcrumb>

    <p-modal
      id="modal-delete"
      title="Confirmation">
      <div slot="content"><p>Are you sure want to delete template "[{{ template.code }}] {{ template.name }}" ?</p></div>
      <div slot="footer">
        <button
          type="button"
          class="btn btn-alt-secondary"
          data-dismiss="modal">Cancel</button>
        <button
          type="button"
          class="btn btn-danger"
          data-dismiss="modal">Delete</button>
      </div>
    </p-modal>

    <div class="row">
      <p-block
        :title="template.name"
        :header="true"
        :is-loading="loading">
        <p-table>
          <tr slot="p-head">
            <td class="font-size-h6 font-w700">{{ 'No' | uppercase }}</td>
            <td class="font-size-h6 font-w700">{{ 'Key Performance Indicator' | uppercase }}</td>
            <td class="font-size-h6 font-w700 text-center">{{ 'Weight' | uppercase }}</td>
            <td class="font-size-h6 font-w700 text-center">{{ 'Target' | uppercase }}</td>
            <td class="text-center">
              <button
                class="btn btn-secondary btn-sm mr-5"
                v-if="$permission.has('create employee kpi') || $permission.has('update employee kpi')"
                @click="$refs.group.show(template)">
                <i class="si si-note"></i> Group
              </button>
            </td>
          </tr>
          <template
            v-for="group in template.groups"
            slot="p-body">
            <tr :key="'group' + group.id" class="bg-info-light">
              <td class="text-center font-w600" colspan="2">{{ group.name }}</td>
              <td class="text-center font-w600">{{ group.weight | numberFormat }}%</td>
              <td class="text-center font-w600">{{ group.target }}</td>
              <td class="text-center">
                <button
                  class="btn btn-secondary btn-sm mr-5"
                  v-if="$permission.has('create employee kpi') || $permission.has('update employee kpi')"
                  @click="$refs.indicator.show(group)">
                  <i class="si si-note"></i> Indicator
                </button>
              </td>
            </tr>
            <tr v-for="(indicator, index) in group.indicators" :key="'indicator' + indicator.id">
              <td>{{ index+1 }}</td>
              <td>{{ indicator.name }}</td>
              <td class="text-center">{{ indicator.weight | numberFormat }}%</td>
              <td class="text-center">{{ indicator.target }}</td>
              <td class="text-center">
                <button
                  class="btn btn-secondary btn-sm mr-5"
                  v-if="$permission.has('create employee kpi') || $permission.has('update employee kpi')"
                  @click="$refs.score.show(indicator)">
                  <i class="si si-badge"></i> Score
                </button>
              </td>
            </tr>
          </template>
          <tr slot="p-body">
            <td></td>
            <td></td>
            <td class="text-center font-w700"><span class="btn btn-outline-danger">{{ template.weight | numberFormat }}%</span></td>
            <td class="text-center font-w700"><span class="btn btn-outline-danger">{{ template.target }}</span></td>
            <td></td>
          </tr>
        </p-table>
      </p-block>
    </div>

    <score-modal
      id="score"
      ref="score"/>

    <indicator-modal
      id="indicator"
      ref="indicator"/>

    <group-modal
      id="group"
      ref="group"/>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import ScoreModal from './ScoreModal'
import IndicatorModal from './IndicatorModal'
import GroupModal from './GroupModal'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ScoreModal,
    GroupModal,
    IndicatorModal,
    Breadcrumb,
    BreadcrumbHumanResource
  },
  data () {
    return {
      id: this.$route.params.id,
      form: new Form(),
      loading: false
    }
  },
  computed: {
    ...mapGetters('humanResourceKpiTemplate', ['template', 'templates'])
  },
  created () {
    this.loading = true
    this.templates.find((element) => {
      if (element.id === this.id) {
        this.$store.commit('humanResourceKpiTemplate/FETCH_OBJECT', element)
        this.loading = false
      }
    })
    this.findKpiTemplate({ id: this.id })
      .then(response => {
        this.loading = false
      })
  },
  methods: {
    ...mapActions('humanResourceKpiTemplate', {
      findKpiTemplate: 'find'
    })
  }
}
</script>
