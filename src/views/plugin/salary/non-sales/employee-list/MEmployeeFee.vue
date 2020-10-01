<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('Employee Fee') | uppercase"
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
                      id="date"
                      v-model="date.start"
                      name="date"
                      label="date"
                    />
                    <div style="margin-left: 20px">
                      <p-date-picker
                        id="date"
                        v-model="date.start"
                        name="date"
                        label="date"
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
                :label="$t('fee')"
                name="fee"
                :errors="form.errors.get('fee')"
                readonly
                @errors="form.errors.set('fee', null)"
              />
            </div>
            <div class="row">
              <p-block>
                <div style="display:flex; justify-content: space-between; align-items: center">
                  <h3>{{ $t('Factor Criteria') }}</h3>
                </div>
                <p-block-inner :is-loading="isLoading">
                  <div class="table-responsive">
                    <table
                      v-for="(group) in dataGroup"
                      :key="group.id"
                      class="table table-hover"
                    >
                      <thead class="thead-light">
                        <tr
                          slot="p-head"
                        >
                          <th
                            width="10%"
                          >
                            <b>No</b>
                          </th>
                          <th>
                            <b>{{ $t(group.name) }}</b>
                          </th>
                          <th
                            width="100px"
                          >
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
                          <th>{{ index+1 }}</th>
                          <th>{{ factor.name }}</th>
                          <td>
                            <span v-if="factor.score">{{ factor.score }}</span>
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
            <div
              v-if="isEdit"
              class="text-center"
            >
              <a
                href="#"
                @click="onCancelEdit"
              >Cancel Edit</a>
            </div>
          </div>
        </div>
        <div class="pull-right">
          <button
            type="submit"
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
          :class="selectedCriteria.id === criteria.id ? 'list-group-item list-group-item-action list-group-item-dark font-weight-bold' : 'list-group-item list-group-item-action'"
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
        employee_id: null,
        id: null,
        name: null,
        assestmentPeriod: null,
        fee: null
      }),
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  computed: {
    ...mapGetters('pluginSalarySalaryNonSalesGroup', ['groupList']),
    totalScore () {
      return _.sumBy(this.scores, 'score')
    },
    totalFee () {
      const umk = Number(this.selectedJobLocation.base_salary)
      const jobValue = 1
      return (umk / jobValue) * this.totalScore
    }
  },
  watch: {
    groupList () {
      this.setGroup()
    },
    totalFee () {
      this.form.fee = this.totalFee
    },
    scores () {
      this.scores.map(score => {
        const groupIndex = _.findIndex(this.dataGroup, { factors: [{ id: score.factor_id }] })
        const factorIndex = _.findIndex(this.dataGroup[groupIndex].factors, { id: score.factor_id })

        // set factor to group data
        const tempFactors = [...this.dataGroup[groupIndex].factors]
        tempFactors[factorIndex] = {
          ...tempFactors[factorIndex],
          score: score.score
        }

        this.dataGroup[groupIndex] = Object.assign({}, {
          ...this.dataGroup[groupIndex],
          factors: tempFactors
        })
      })
      this.$forceUpdate()
    }
  },
  methods: {
    ...mapActions('pluginSalarySalaryNonSalesGroup', [
      'create',
      'delete',
      'update'
    ]),
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
      this.dataGroup = []
      this.scores = []
    },
    onSubmit () {
      this.isSaving = true
      if (this.isEdit) {
        this.update(this.form)
          .then(response => {
            this.isSaving = false
            this.$notification.success('update success')
            Object.assign(this.$data, this.$options.data.call(this))
            this.$emit('added', response.data)
            this.close()
          })
          .catch(error => {
            this.isSaving = false
            this.isFailed = true
            this.form.errors.record(error.errors)
          })
      } else {
        this.create(this.form)
          .then(response => {
            this.isSaving = false
            this.$notification.success('create success')
            Object.assign(this.$data, this.$options.data.call(this))
            this.$emit('added', response.data)
            this.close()
          })
          .catch(error => {
            this.isSaving = false
            this.isFailed = true
            this.form.errors.record(error.errors)
          })
      }
    },
    setGroup () {
      console.log('setGroup -> this.dataGroup called', this.dataGroup)
      if (_.isEmpty(this.dataGroup)) {
        console.log('setGroup DISINI')
        this.dataGroup = this.groupList.map(group => {
          group.factors = group.factors.map(f => {
            f.score = 0
            return f
          })
          return group
        })
      }
    },
    open (employee) {
      this.$refs.modal.open()
      this.dataGroup = []
      this.scores = []
      console.log('SCORE', this.scores)
      this.form.name = employee.name
      this.selectedJobLocation = employee.job_location
      this.setGroup()
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
    handleOpenCriteria (factor) {
      this.selectedFactor = factor
      this.$refs.selectedFactor.open()
    },
    handleSelectCriteria (criteria) {
      this.selectedCriteria = criteria
    },
    handleSetScore () {
      const check = _.findIndex(this.scores, { factor_id: this.selectedCriteria.factor_id })
      const data = {
        score: this.selectedCriteria.score,
        factor_id: this.selectedCriteria.factor_id
      }
      if (check < 0) {
        this.scores.push(data)
      } else {
        this.scores[check] = data
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
