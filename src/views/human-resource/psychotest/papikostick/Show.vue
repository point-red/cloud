<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-psychotest />
      <router-link
        to="/human-resource/psychotest/papikostick"
        class="breadcrumb-item"
      >
        {{ $t("papikostick") | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">{{
        papikostick &&
          papikostick.candidate &&
          papikostick.candidate.name | titlecase
      }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block :title="$t('papikostick')" :header="true">
        <p-block-inner :is-loading="loading">
          <div class="row mb-10">
            <div class="col-sm-3">
              <p-select
                id="position_id"
                style="margin: 10px"
                name="position_id"
                key-field="id"
                label-field="position"
                v-model.number="positionId"
                :options="candidatePositions"
              />
            </div>
            <div class="col-sm-2">
              <button
                @click="onExport"
                :disabled="loadingSaveButton || !positionId"
                class="btn btn-sm btn-primary"
                style="margin: 10px"
              >
                <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin" />
                Export
              </button>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <line-chart
                v-if="
                  papikostickResultData.length > 0 &&
                    papikostickResultLabel.length > 0
                "
                :chartData="papikostickResultData"
                :chartLabel="papikostickResultLabel"
                :max-data="papikostickCategoryMaxData"
                :min-data="papikostickCategoryMinData"
                style="margin-bottom: 28px"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <p-table v-if="papikostick">
                <template #p-head="">
                  <tr>
                    <td>{{ $t("no") | titlecase }}</td>
                    <td>{{ $t("factor") | titlecase }}</td>
                    <td>{{ $t("description") | titlecase }}</td>
                    <td>{{ $t("max") | titlecase }}</td>
                    <td>{{ $t("min") | titlecase }}</td>
                    <td>{{ $t("candidate") | titlecase }}</td>
                    <td>{{ $t("status") | titlecase }}</td>
                  </tr>
                </template>
                <template #p-body="">
                  <tr
                    v-for="(positionCategory, index) in positionCategories"
                    :key="positionCategory.id"
                    :class="
                      color(
                        papikostick.papikostick_results[index].total,
                        positionCategory
                      )
                    "
                  >
                    <td class="text-center">
                      {{ index + 1 }}
                    </td>
                    <td class="text-center">
                      {{
                        positionCategory &&
                          positionCategory.category &&
                          positionCategory.category.name
                      }}
                    </td>
                    <td>
                      {{
                        positionCategory &&
                          positionCategory.category &&
                          positionCategory.category.description
                      }}
                    </td>
                    <td class="text-center">
                      {{ positionCategory && positionCategory.category_max }}
                    </td>
                    <td class="text-center">
                      {{ positionCategory && positionCategory.category_min }}
                    </td>
                    <td class="text-center">
                      {{
                        papikostick &&
                          papikostick.papikostick_results &&
                          papikostick.papikostick_results[index].total
                      }}
                    </td>
                    <td class="text-center">
                      {{
                        papikostick &&
                          papikostick.papikostick_results &&
                          status(
                            papikostick.papikostick_results[index].total,
                            positionCategory
                          ) | titlecase
                      }}
                    </td>
                  </tr>
                  <!-- <tr v-for="(papikostickResult, index) in papikostick.papikostick_results" :key="papikostickResult.id" :class="color(papikostickResult.total, papikostickResult.category)">
                    <td class="text-center">
                      {{ papikostickResult && papikostickResult.category && papikostickResult.category.name }}
                    </td>
                    <td>
                      {{ papikostickResult && papikostickResult.category && papikostickResult.category.description }}
                    </td>
                    <td class="text-center">
                      {{ positionCategories[index] && positionCategories[index].category_max }}
                    </td>
                    <td class="text-center">
                      {{ positionCategories[index] && positionCategories[index].category_min }}
                    </td>
                    <td class="text-center">
                      {{ papikostickResult.total }}
                    </td>
                    <td class="text-center">
                      {{ status(papikostickResult.total, papikostickResult.category) | titlecase }}
                    </td>
                  </tr> -->
                </template>
              </p-table>
            </div>
            <div class="col-sm-12 mb-20">
              <hr />
              <!-- <router-link
                :to="{ path: '/human-resource/psychotest/papikostick/' + papikostick.id + '/edit', params: { id: papikostick.id }}"
                v-if="$permission.has('update employee')"
                class="btn btn-sm btn-primary mr-5">
                Edit
              </router-link> -->
              <button
                type="button"
                @click="onDelete"
                v-if="$permission.has('delete employee')"
                :disabled="loadingSaveButton"
                class="btn btn-sm btn-danger"
              >
                <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin" />
                Delete
              </button>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import BreadcrumbPsychotest from '@/views/human-resource/psychotest/Breadcrumb'
import LineChart from '@/components/point-chart/PapikostickChart'
import xlsxPopulate from 'xlsx-populate'
import { save } from 'save-file'
import { mapState, mapActions } from 'vuex'

const isExists = data => data !== null && typeof data !== 'undefined'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource,
    BreadcrumbPsychotest,
    LineChart
  },
  data () {
    return {
      id: this.$route.params.id,
      loading: false,
      loadingSaveButton: false,
      positionId: null
    }
  },
  computed: {
    ...mapState('humanResourcePsychotestCandidatePosition', [
      'candidatePositions'
    ]),
    ...mapState('humanResourcePsychotestPositionCategory', [
      'positionCategories'
    ]),
    ...mapState('humanResourcePsychotestPapikostick', ['papikostick']),
    ...mapState('humanResourcePsychotestPapikostickCategory', [
      'papikostickCategories'
    ]),
    color () {
      return (total, category) => {
        if (!total && !category) {
          return
        }
        const status = this.status(total, category)
        if (status === 'less') {
          return 'text-danger'
        }
        if (status === 'enough') {
          return null
        }
        if (status === 'exceed') {
          return 'text-success'
        }
      }
    },
    status () {
      return (total, category) => {
        if (!total && !category) {
          return
        }
        if (total < category.category_min) {
          return this.$t('less')
        }
        if (total >= category.category_min || total <= category.category_max) {
          return this.$t('enough')
        }
        if (total >= category.category_max) {
          return this.$t('exceed')
        }
        return this.$t('less')
      }
    },
    papikostickResultData () {
      if (
        isExists(this.papikostick) &&
        isExists(this.papikostick.papikostick_results) &&
        this.papikostick.papikostick_results.length
      ) {
        return this.papikostick.papikostick_results.map(({ total }) => total)
      }
      return []
    },
    papikostickResultLabel () {
      if (
        isExists(this.papikostickCategories) &&
        this.papikostickCategories.length > 0
      ) {
        return this.papikostickCategories.map(({ name }) => name)
      }
      return []
    },
    papikostickCategoryMaxData () {
      if (
        isExists(this.positionCategories) &&
        this.positionCategories.length > 0
      ) {
        return this.positionCategories.map(
          ({ category_max: categoryMax }) => categoryMax
        )
      }
      return []
    },
    papikostickCategoryMinData () {
      if (
        isExists(this.positionCategories) &&
        this.positionCategories.length > 0
      ) {
        return this.positionCategories.map(
          ({ category_min: categoryMin }) => categoryMin
        )
      }
      return []
    }
  },
  watch: {
    async positionId (positionId) {
      if (positionId !== null && typeof positionId !== 'undefined') {
        await this.getPositionCategoriesRequest(positionId)
      }
    }
  },
  async created () {
    await Promise.all([
      this.getCandidatePositions(),
      this.getPositionCategoriesRequest(),
      this.getPapikostickRequest(),
      this.getPapikostickCategory()
    ])
  },
  methods: {
    ...mapActions('humanResourcePsychotestCandidatePosition', {
      getCandidatePositions: 'get'
    }),
    ...mapActions('humanResourcePsychotestPositionCategory', {
      getPositionCategories: 'get'
    }),
    ...mapActions('humanResourcePsychotestPapikostick', {
      findPapikostick: 'find'
    }),
    ...mapActions('humanResourcePsychotestPapikostickCategory', {
      getPapikostickCategory: 'get'
    }),
    async getPapikostickRequest () {
      this.loading = true
      await this.findPapikostick({
        id: this.id,
        params: {
          expand: true,
          includes:
            'candidate;candidate.position;papikostick_results;papikostick_results.category;papikostick_results.category.position_category'
        }
      }).then(
        response => {
          // this.$store.commit(`humanResourcePsychotestPapikostick/FETCH_OBJECT`, response.data[0])
          this.loading = false
        },
        error => {
          console.log(JSON.stringify(error))
        }
      )
    },
    async getPositionCategoriesRequest (positionId) {
      if (positionId) {
        await this.getPositionCategories({
          params: {
            // 'filter_equal[position_id]': positionId,
            filter_equal: {
              position_id: positionId
            },
            expand: 1,
            includes: 'position;category'
          }
        })
      }
    },
    async onExport () {
      try {
        this.loadingSaveButton = true
        const response = await fetch('/assets/xlsx/papikostick.xlsx')
        const blob = await response.blob()
        const workbook = await xlsxPopulate.fromDataAsync(blob)
        const sheet = workbook.sheet(0)
        // Min
        sheet
          .range('L5:L24')
          .value(this.papikostickCategoryMinData.map(v => [v]))
        // Max
        sheet
          .range('M5:M24')
          .value(this.papikostickCategoryMaxData.map(v => [v]))
        // Candidate
        sheet.range('N5:N24').value(this.papikostickResultData.map(v => [v]))
        const resultBlob = await workbook.outputAsync()
        save(resultBlob, `papikostick-${new Date().toISOString()}.xlsx`)
      } catch (error) {
        this.$notification.error('Failed to generate')
        console.log(error)
      } finally {
        this.loadingSaveButton = false
      }
    },
    onDelete () {
      this.loadingSaveButton = true
      this.deleteCandidate({ id: this.id }).then(
        response => {
          this.loadingSaveButton = false
          this.$router.push('/human-resource/psychotest/papikostick')
        },
        error => {
          this.loadingSaveButton = false
          console.log(JSON.stringify(error))
        }
      )
    }
  }
}
</script>
