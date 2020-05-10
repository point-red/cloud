<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-psychotest />
      <router-link
        to="/human-resource/psychotest/candidate"
        class="breadcrumb-item"
      >
        {{ $t("candidate") | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">{{
        candidate.name | titlecase
      }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block :title="$t('candidate')" :header="true">
        <p-block-inner :is-loading="loading">
          <div class="row mb-10">
            <div class="col-sm-2">
              <button
                @click="onExport"
                :disabled="loading || !kraepelin || !papikostick"
                class="btn btn-sm btn-primary"
                style="margin: 10px"
              >
                <i v-show="loading" class="fa fa-asterisk fa-spin" /> Export
              </button>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <p-table>
                <template slot="p-body">
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("position") | titlecase
                      }}</span>
                    </td>
                    <td>
                      {{ candidate.position && candidate.position.position }}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("name") | titlecase
                      }}</span>
                    </td>
                    <td>{{ candidate.name }}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("phone") | titlecase
                      }}</span>
                    </td>
                    <td>{{ candidate.phone }}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("password") | titlecase
                      }}</span>
                    </td>
                    <td>{{ candidate.password }}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("level") | titlecase
                      }}</span>
                    </td>
                    <td>{{ candidate.level }}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("ktp number") | titlecase
                      }}</span>
                    </td>
                    <td>{{ candidate.ktp_number }}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("place of birth") | titlecase
                      }}</span>
                    </td>
                    <td>{{ candidate.place_of_birth }}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("date of birth") | titlecase
                      }}</span>
                    </td>
                    <td>{{ candidate.date_of_birth }}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{ $t("sex") | titlecase }}</span>
                    </td>
                    <td>{{ candidate.sex }}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("religion") | titlecase
                      }}</span>
                    </td>
                    <td>{{ candidate.religion }}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("marital status") | titlecase
                      }}</span>
                    </td>
                    <td>{{ candidate.marital_status }}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("is password used") | titlecase
                      }}</span>
                    </td>
                    <td>{{ candidate.is_password_used }}</td>
                  </tr>
                </template>
              </p-table>
            </div>
            <div class="col-sm-12 mb-20">
              <hr />
              <router-link
                :to="{
                  path:
                    '/human-resource/psychotest/candidate/' +
                    candidate.id +
                    '/edit',
                  params: { id: candidate.id }
                }"
                v-if="$permission.has('update employee')"
                class="btn btn-sm btn-primary mr-5"
              >
                Edit
              </router-link>
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
import { mapState, mapActions } from 'vuex'
import xlsxPopulate from 'xlsx-populate'
import { save } from 'save-file'
import { round } from 'mathjs'

const isExists = data => data !== null && typeof data !== 'undefined'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource,
    BreadcrumbPsychotest
  },
  data () {
    return {
      id: this.$route.params.id,
      loading: false,
      loadingSaveButton: false
    }
  },
  computed: {
    ...mapState('humanResourcePsychotestCandidate', ['candidate']),
    ...mapState('humanResourcePsychotestPapikostick', ['papikostick']),
    ...mapState('humanResourcePsychotestKraepelin', ['kraepelin']),
    ...mapState('humanResourcePsychotestCandidatePosition', [
      'candidatePositions'
    ]),
    ...mapState('humanResourcePsychotestPositionCategory', [
      'positionCategories'
    ]),
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
    },
    kraepelinColumnsData () {
      if (this.kraepelin && this.kraepelin.kraepelin_columns.length > 0) {
        return this.kraepelin.kraepelin_columns.map(({ count }) => count)
      }
      return []
    },
    totalWrong () {
      if (this.kraepelin) {
        return this.kraepelin.total_count - this.kraepelin.total_correct
      }
      return 0
    },
    accuracy () {
      if (this.kraepelin) {
        return (
          (this.kraepelin.total_correct / this.kraepelin.total_count) * 100
        )
      }
      return 0
    },
    speed () {
      if (
        this.kraepelin &&
        this.kraepelin.kraepelin_columns &&
        this.kraepelin.kraepelin_columns.length > 0
      ) {
        if (this.kraepelin.kraepelin_columns.length > 1) {
          const diff = this.$moment(this.kraepelin.updated_at).diff(
            this.$moment(this.kraepelin.created_at),
            'seconds'
          )
          const perSec = (this.kraepelin.kraepelin_columns.length + 1) / diff // 900 seconds -> 15 minutes
          return round(perSec, 2)
        }
        return this.kraepelin.kraepelin_columns.length + 1
      }
      return 0
    }
  },
  async mounted () {
    try {
      this.loadingSaveButton = true
      await Promise.all([
        this.findCandidate({
          id: this.id,
          params: { expand: true, includes: 'position' }
        }),
        this.getCandidatePositions()
      ])
      await Promise.all([
        this.getPapikostickRequest(this.id),
        this.getKraepelinRequest(this.id),
        await this.getPositionCategoriesRequest(this.candidate.position_id)
      ])
    } catch (error) {
      console.log(error)
    } finally {
      this.loadingSaveButton = false
    }
  },
  methods: {
    ...mapActions('humanResourcePsychotestCandidate', {
      findCandidate: 'find',
      deleteCandidate: 'delete'
    }),
    ...mapActions('humanResourcePsychotestPapikostick', {
      getPapikostick: 'get'
    }),
    ...mapActions('humanResourcePsychotestKraepelin', { getKraepelin: 'get' }),
    ...mapActions('humanResourcePsychotestCandidatePosition', {
      getCandidatePositions: 'get'
    }),
    ...mapActions('humanResourcePsychotestPositionCategory', {
      getPositionCategories: 'get'
    }),
    onDelete () {
      this.loadingSaveButton = true
      this.deleteCandidate({ id: this.id }).then(
        response => {
          this.loadingSaveButton = false
          this.$router.push('/human-resource/psychotest/candidate')
        },
        error => {
          this.loadingSaveButton = false
          console.log(JSON.stringify(error))
        }
      )
    },
    async getPapikostickRequest (candidateId) {
      try {
        this.loadingSaveButton = true
        const { data } = await this.getPapikostick({
          params: {
            filter_equal: {
              candidate_id: candidateId
            },
            expand: true,
            includes:
              'papikostick_results;papikostick_results.category;papikostick_results.category.position_category'
          }
        })
        await this.$store.commit(
          `humanResourcePsychotestPapikostick/FETCH_OBJECT`,
          data[0]
        )
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingSaveButton = false
      }
    },
    async getKraepelinRequest (candidateId) {
      try {
        this.loadingSaveButton = true
        const { data } = await this.getKraepelin({
          params: {
            filter_equal: {
              candidate_id: candidateId
            },
            expand: true,
            includes: 'kraepelin_columns'
          }
        })
        await this.$store.commit(
          `humanResourcePsychotestKraepelin/FETCH_OBJECT`,
          data[0]
        )
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingSaveButton = false
      }
    },
    async getPositionCategoriesRequest (positionId) {
      if (positionId) {
        await this.getPositionCategories({
          params: {
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
        const response = await fetch('/assets/xlsx/papikostick-2.xlsx')
        const blob = await response.blob()
        const workbook = await xlsxPopulate.fromDataAsync(blob)
        const sheet = workbook.sheet(0)
        // Date
        sheet.cell('G1').value(new Date())

        // Candidate
        // Name
        sheet.cell('B3').value(this.candidate.name)
        // Phone
        sheet.cell('B4').value(this.candidate.phone)
        // Position
        sheet.cell('B5').value(this.candidate.position.position)
        // Level
        sheet.cell('B6').value(this.candidate.level)
        // KTP No.
        sheet.cell('B7').value(this.candidate.ktp_number)
        // Place and Date of Birth
        sheet
          .cell('B8')
          .value(
            `${this.candidate.place_of_birth}, ${this.candidate.date_of_birth}`
          )
        // Sex
        sheet.cell('B9').value(this.candidate.sex)
        // Religion
        sheet.cell('B10').value(this.candidate.religion)

        // Papikostick
        // Min
        sheet
          .range('E17:E36')
          .value(this.papikostickCategoryMinData.map(v => [v]))
        // Max
        sheet
          .range('F17:F36')
          .value(this.papikostickCategoryMaxData.map(v => [v]))
        // Candidate
        sheet.range('G17:G36').value(this.papikostickResultData.map(v => [v]))

        // Kraepelin
        // Total Count
        sheet.cell('B65').value(this.kraepelin.total_count)
        // Total Correct
        sheet.cell('B66').value(this.kraepelin.total_correct)
        // Total Wrong
        sheet.cell('B67').value(this.totalWrong)
        // Accuracy
        sheet.cell('B68').value(`${this.accuracy.toFixed(2)}%`)
        // Speed
        sheet.cell('B69').value(this.speed)

        // Table
        // Column
        sheet
          .range(`H66:H${66 + this.kraepelinColumnsData.length}`)
          .value(this.kraepelinColumnsData.map((v, i) => [i + 1]))
        // Total
        sheet
          .range(`I66:I${66 + this.kraepelinColumnsData.length}`)
          .value(this.kraepelinColumnsData.map(v => [v]))

        const resultBlob = await workbook.outputAsync()
        save(resultBlob, `papikostick-${new Date().toISOString()}.xlsx`)
      } catch (error) {
        this.$notification.error('Failed to generate')
        console.log(error)
      } finally {
        this.loadingSaveButton = false
      }
    }
  }
}
</script>
