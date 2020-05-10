<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-psychotest />
      <router-link
        to="/human-resource/psychotest/kraepelin"
        class="breadcrumb-item"
      >
        {{ $t("kraepelin") | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">{{
        kraepelin && kraepelin.candidate && kraepelin.candidate.name | titlecase
      }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block :title="$t('kraepelin')" :header="true">
        <p-block-inner :is-loading="loading">
          <div class="row">
            <div class="col-sm-6">
              <line-chart
                :chartData="kraepelinColumnsData"
                :chartLabel="kraepelinColumnsLabel"
                style="margin-bottom: 28px"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <p-table>
                <template slot="p-body">
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("name") | titlecase
                      }}</span>
                    </td>
                    <td>
                      {{
                        kraepelin &&
                          kraepelin.candidate &&
                          kraepelin.candidate.name | titlecase
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("total count") | titlecase
                      }}</span>
                    </td>
                    <td>{{ kraepelin && kraepelin.total_count }}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("total correct") | titlecase
                      }}</span>
                    </td>
                    <td>{{ kraepelin && kraepelin.total_correct }}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("total wrong") | titlecase
                      }}</span>
                    </td>
                    <td>{{ totalWrong }}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("accuracy") | titlecase
                      }}</span>
                    </td>
                    <td>{{ accuracy }}%</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("speed") | titlecase
                      }}</span>
                    </td>
                    <td>{{ speed }} answer/s</td>
                  </tr>
                </template>
              </p-table>
            </div>
            <div class="col-sm-12 mb-20">
              <hr />
              <!-- <router-link
                :to="{ path: '/human-resource/psychotest/kraepelin/' + kraepelin.id + '/edit', params: { id: kraepelin.id }}"
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
import LineChart from '@/components/point-chart/KraepelinChart'
import { mapState, mapActions } from 'vuex'
import { round } from 'mathjs'

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
      loadingSaveButton: false
    }
  },
  computed: {
    ...mapState('humanResourcePsychotestKraepelin', ['kraepelin']),
    kraepelinColumnsData () {
      if (this.kraepelin && this.kraepelin.kraepelin_columns.length > 0) {
        return this.kraepelin.kraepelin_columns.map(({ count }) => count)
      }
      return []
    },
    kraepelinColumnsLabel () {
      if (this.kraepelinColumnsData.length > 0) {
        return Array.from(
          { length: this.kraepelinColumnsData.length },
          (v, i) => i + 1
        )
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
  created () {
    this.loading = true
    this.findKraepelin({
      id: this.id,
      params: { expand: 1, includes: 'candidate;kraepelin_columns' }
    }).then(
      response => {
        this.loading = false
      },
      error => {
        console.log(JSON.stringify(error))
      }
    )
  },
  methods: {
    ...mapActions('humanResourcePsychotestKraepelin', {
      findKraepelin: 'find',
      deleteKraepelin: 'delete'
    }),
    onDelete () {
      this.loadingSaveButton = true
      this.deleteKraepelin({ id: this.id }).then(
        response => {
          this.loadingSaveButton = false
          this.$router.push('/human-resource/psychotest/kraepelin')
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
