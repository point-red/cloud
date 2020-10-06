<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="'Employee Fee' | uppercase"
      overlay-theme="dark"
      width="80vw"
      @close="onClose()"
    >
      <p-block-inner :is-loading="isLoading">
        <div class="row">
          <div class="col-sm-12">
            <div class="box">
              <p-form-row
                id="name"
                ref="name"
                v-model="form.name"
                :disabled="isSaving"
                :label="$t('name')"
                name="name"
                :errors="form.errors.get('name')"
                readonly
                @errors="form.errors.set('name', null)"
              />
              <div class="form-group row">
                <label
                  for="fee"
                  class="col-form-label col-lg-3"
                >Assestment Period</label>
                <div class="col-lg-9">
                  <div style="display:flex">
                    <p-date-picker
                      id="start_period"
                      v-model="form.start_period"
                      name="start_period"
                      label="start_period"
                    />
                    <div style="margin-left: 20px">
                      <p-date-picker
                        id="end_period"
                        v-model="form.end_period"
                        name="end_period"
                        label="end_period"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <p-form-row
                id="fee"
                ref="fee"
                v-model="form.fee"
                :disabled="isSaving"
                label="Fee"
                name="fee"
                :errors="form.errors.get('fee')"
                readonly
                @errors="form.errors.set('fee', null)"
              />
            </div>
            <div class="row">
              <p-block>
                <div
                  style="display:flex; justify-content: space-between; align-items: center"
                >
                  <h3>Factor Criteria</h3>
                </div>
                <p-block-inner :is-loading="isLoading">
                  <div class="table-responsive">
                    <table
                      v-for="group in dataGroup"
                      :key="group.id"
                      class="table table-hover"
                    >
                      <thead class="thead-light">
                        <tr slot="p-head">
                          <th width="10%">
                            <b>No</b>
                          </th>
                          <th>
                            <b>{{ group.name }}</b>
                          </th>
                          <th width="100px">
                            Score
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(factor, index) in group.factors"
                          :key="factor.id"
                          slot="p-body"
                        >
                          <th>{{ index + 1 }}</th>
                          <th>{{ factor.name }}</th>
                          <td>
                            <span
                              v-if="factor.score"
                              @click="isEdit ? handleOpenCriteria(factor, factor.selected_criteria) : null"
                            >{{ factor.score }}</span>
                            <button
                              v-else
                              type="button"
                              class="btn border-black btn-default btn-sm"
                              @click="handleOpenCriteria(factor)"
                            >
                              <i class="si si-pencil" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </p-block-inner>
              </p-block>
            </div>
          </div>
        </div>
        <div class="pull-right">
          <button
            type="button"
            class="btn btn-sm btn-primary text-right"
            :disabled="isSaving"
            @click="onSubmit"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            />
            {{ $t("save") | uppercase }}
          </button>
        </div>
      </p-block-inner>
    </sweet-modal>
    <sweet-modal
      ref="selectedFactor"
      :title="selectedFactor.name"
    >
      <div class="list-group">
        <button
          v-for="criteria in selectedFactor.criterias"
          :key="criteria.id"
          type="button"
          :class="
            selectedCriteria.id === criteria.id
              ? 'list-group-item list-group-item-action list-group-item-dark font-weight-bold'
              : 'list-group-item list-group-item-action'
          "
          style="cursor:pointer; outline: none"
          @click="handleSelectCriteria(criteria)"
        >
          {{ criteria.description }}
        </button>
      </div>
      <button
        slot="button"
        class="btn btn-primary"
        type="button"
        :disabled="!selectedCriteria.id"
        @click="handleSetScore()"
      >
        Add
      </button>
    </sweet-modal>
  </form>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isSaving: false,
      isFailed: false,
      isLoading: false,
      isEdit: false,
      selectedCriteria: {},
      scores: [],
      dataGroup: [],
      selectedJobLocation: {},
      selectedFactor: {
        name: null,
        criterias: []
      },
      form: new Form({
        id: null,
        employee_id: null,
        fee: null,
        score: null,
        start_period: this.$moment().format('YYYY-MM-01 00:00:00'),
        end_period: this.$moment().format('YYYY-MM-DD 23:59:59'),
        criterias: []
      })
    }
  },
  computed: {
    ...mapGetters('pluginSalarySalaryNonSalesGroup', ['groupList']),
    totalScore () {
      return _.sumBy(this.scores, 'score')
    },
    totalFee () {
      console.log('totalFee -> this.selectedJobLocation', this)
      console.log('totalFee -> this.selectedJobLocation', this.selectedJobLocation)
      const umk = this.selectedJobLocation.base_salary
      const jobValue = this.selectedJobLocation.job_value
      const hitung = (Number(umk) / Number(jobValue))

      if (!this.totalScore) {
        return 0
      }
      return hitung * this.totalScore
    }
  },
  watch: {
    dataGroup () {
      console.log('DATA GROUP', this.dataGroup)
    },
    groupList () {
      this.setGroup()
    },
    totalFee () {
      this.form.fee = this.totalFee
    },
    scores () {
      this.scores.map(score => {
        const groupIndex = _.findIndex(this.dataGroup, {
          factors: [{ id: score.factor_id }]
        })
        const factorIndex = _.findIndex(this.dataGroup[groupIndex].factors, {
          id: score.factor_id
        })

        // set factor to group data
        const tempFactors = [...this.dataGroup[groupIndex].factors]
        tempFactors[factorIndex] = {
          ...tempFactors[factorIndex],
          score: Number(score.score),
          selected_criteria: score.criteria_id
        }

        this.dataGroup[groupIndex] = Object.assign(
          {},
          {
            ...this.dataGroup[groupIndex],
            factors: tempFactors
          }
        )
      })

      this.$forceUpdate()
      console.log('scores -> this.totalScore', this.totalScore)
      console.log('scores -> sum score', _.sumBy(this.scores, 'score'))
      this.form.fee = this.totalFee
    }
  },
  created () {
    if (_.isEmpty(this.groupList)) {
      this.getGroup()
    }
  },
  methods: {
    ...mapActions('pluginSalarySalaryNonSalesEmployeeFee', ['save']),
    ...mapActions('pluginSalarySalaryNonSalesGroup', {
      getGroup: 'get'
    }),
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
      this.dataGroup = []
      this.scores = []
    },
    onSubmit () {
      this.form.criterias = this.scores
      console.log('FORM', this.form)
      this.isSaving = true
      // if (this.isEdit) {
      //   this.update(this.form)
      //     .then(response => {
      //       this.isSaving = false
      //       this.$notification.success('update success')
      //       Object.assign(this.$data, this.$options.data.call(this))
      //       this.$emit('added', response.data)
      //       this.close()
      //     })
      //     .catch(error => {
      //       this.isSaving = false
      //       this.isFailed = true
      //       this.form.errors.record(error.errors)
      //     })
      // } else {
      this.save(this.form)
        .then(response => {
          this.isSaving = false
          if (this.isEdit) {
            this.$notification.success('saved success')
            this.$emit('updated', response.data)
          } else {
            this.$notification.success('create success')
            this.$emit('added', response.data)
          }
          Object.assign(this.$data, this.$options.data.call(this))
          this.close()
        })
        .catch(error => {
          this.isSaving = false
          this.isFailed = true
          this.form.errors.record(error.errors)
        })
      // }
    },
    setGroup () {
      console.log('setGroup -> this.dataGroup called', this.dataGroup)
      if (_.isEmpty(this.dataGroup)) {
        console.log('setGroup DISINI')
        console.log('groupList DISINI', this.groupList)
        this.dataGroup = this.groupList.map(group => {
          group.factors = group.factors.map(f => {
            f.score = 0
            return f
          })
          return group
        })
      }
    },
    open (employee, isEdit = false) {
      this.$refs.modal.open()
      this.dataGroup = []
      if (isEdit) {
        console.log('open -> employee', employee)
        this.form.id = employee.id
        this.form.name = employee.employee.name
        this.form.employee_id = employee.employee.id
        this.form.fee = employee.fee
        this.scores = employee.factors.map(f => Object.assign({}, {
          ...f.pivot,
          score: Number(f.pivot.score)
        }))
        this.selectedJobLocation = employee.employee.job_location
      } else {
        this.scores = []
        this.form.id = null
        this.form.name = employee.name
        this.form.employee_id = employee.id
        this.form.fee = null
        this.selectedJobLocation = employee.job_location
      }

      this.setGroup()
      this.isEdit = isEdit

      this.$nextTick(() => {
        this.$refs.name.setFocus()
      })
    },
    close () {
      this.$refs.modal.close()
    },
    onEdit (group) {
      this.isEdit = true
      this.form = new Form({
        id: group.id,
        name: group.name
      })
    },
    onDelete (group) {
      this.$alert
        .confirm(this.$t('delete'), this.$t('confirmation delete message'))
        .then(response => {
          this.isLoading = true
          this.delete(group)
            .then(response => {
              this.$notification.success('delete success')
              this.$emit('added', response.data)

              this.isLoading = false
            })
            .catch(response => {
              this.isLoading = false
              this.$notification.error('cannot delete')
            })
        })
    },
    onCancelEdit () {
      this.isEdit = false
      this.form = new Form({
        id: null,
        name: null
      })
    },
    handleOpenCriteria (factor, selectedCriteriaId = null) {
      console.log('handleOpenCriteria -> selected_criteria_id', selectedCriteriaId)
      this.selectedFactor = factor
      this.$refs.selectedFactor.open()
      this.selectedCriteria.id = selectedCriteriaId
    },
    handleSelectCriteria (criteria) {
      console.log('CHECKING => select criteria', criteria)
      this.selectedCriteria = criteria
    },
    handleSetScore () {
      const check = _.findIndex(this.scores, {
        factor_id: this.selectedCriteria.factor_id
      })
      console.log('CHECKING => check', check)
      console.log('CHECKING -> this.selectedCriteria', this.selectedCriteria)
      const data = {
        score: this.selectedCriteria.score,
        factor_id: this.selectedCriteria.factor_id,
        criteria_id: this.selectedCriteria.id
      }
      if (check < 0) {
        this.scores.push(data)
        console.log('CHECKING => push score', data)
      } else {
        console.log('CHECKING => data', data)
        this.scores = [...this.scores].map((v, index) => {
          if (index === check) {
            return data
          }

          return Object.assign({}, v)
        })
        console.log('CHECKING => this.scores[check]', this.scores[check])
      }

      this.$refs.selectedFactor.close()
      this.selectedCriteria = {}
    }
  }
}
</script>

<style>
h2 {
  line-height: 3;
}
.box {
  border: 1px solid black;
  padding: 30px;
}
.box .form-group.row {
  max-width: 700px;
}
</style>
