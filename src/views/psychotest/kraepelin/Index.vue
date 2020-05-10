<template>
  <div class="full-width">
    <div v-if="isStarted">
      <p-block :title="$t('kraepelin')" :header="true" :show-options="false">
        <div class="text-right" style="margin-bottom: 20px">
          <vue-countdown
            ref="countdown"
            :auto-start="false"
            :time="timer"
            @progress="onCountdown"
            @end="onCountdownEnd"
          >
            <template #default="props">
              <div class="h5 mb-0">
                {{ props.minutes }}':{{ props.seconds }}"
              </div>
            </template>
          </vue-countdown>
        </div>
        <div
          class="text-center"
          style="padding: 20px 0; background-color: #f5f5f5; margin-bottom: 20px"
        >
          <div class="h1 mb-0">
            <span>{{ firstNumber }} + {{ secondNumber }} = </span>
            <span>{{ result }}</span>
          </div>
        </div>
      </p-block>
      <p-block>
        <div class="btn-container" style="margin-bottom: 20px">
          <button class="btn btn-custom" @click="result = 7">7</button>
          <button class="btn btn-custom" @click="result = 8">8</button>
          <button class="btn btn-custom" @click="result = 9">9</button>
          <button class="btn btn-custom" @click="result = 4">4</button>
          <button class="btn btn-custom" @click="result = 5">5</button>
          <button class="btn btn-custom" @click="result = 6">6</button>
          <button class="btn btn-custom" @click="result = 1">1</button>
          <button class="btn btn-custom" @click="result = 2">2</button>
          <button class="btn btn-custom" @click="result = 3">3</button>
          <button class="btn btn-custom" @click="result = 0">0</button>
        </div>
      </p-block>
    </div>
    <div v-else="">
      <p-block :title="$t('instruction')" :header="true" :show-options="false">
        <div style="margin-bottom: 20px">
          <h3 class="h4">
            <strong>
              BACA INSTRUKSI DI BAWAH INI SEBELUM MENEKAN TOMBOL
              ‘START’
            </strong>
          </h3>
          <p>
            Dalam tes ini anda akan menghadapi penjumlahan angka-angka. Tugas
            anda adalah:
          </p>
          <ol>
            <li>Jumlahkan tiap – tiap angka.</li>
            <li>
              Dari angka hasil penjumlahan tersebut, anda cukup memilih angka satuannya saja. Misalnya hasil penjumlahan itu adalah 14, maka anda hanya memilih angka 4.
            </li>
            <li>Anda hendaknya bekerja secepat dan seteliti mungkin.</li>
            <li>
              Jika sudah memahami no 1-3, tes bisa dimulai dengan menekan tombol
              ‘Start’.
            </li>
          </ol>
        </div>
      </p-block>
      <p-block :title="$t('kraepelin')" :header="true" :show-options="false">
        <div style="margin-bottom: 20px" class="text-center">
          <router-link class="btn" to="/psychotest">Cancel</router-link>
          <button
            :disabled="loading"
            class="btn btn-primary mr-5"
            @click="onStart"
          >
            <i v-show="loading" class="fa fa-asterisk fa-spin" />
            Start
          </button>
        </div>
      </p-block>
    </div>
  </div>
</template>

<script>
import VueCountdown from '@chenfengyuan/vue-countdown'
import { mapState, mapActions } from 'vuex'
import pTimeout from 'p-timeout'

const isExists = data => data !== null && typeof data !== 'undefined'

export default {
  data () {
    return {
      loading: false,
      result: null,
      firstNumber: 0,
      secondNumber: 0,
      isStarted: false,
      currentTimer: null,
      kraepelinColumn: null
    }
  },
  components: {
    VueCountdown
  },
  computed: {
    ...mapState('psychotestCandidate', ['candidate']),
    timer () {
      if (
        this.currentTimer !== null &&
        typeof this.currentTimer !== 'undefined'
      ) {
        return this.currentTimer.totalMilliseconds
      }
      // return 15 * 60 * 1000
      // return 10 * 60 * 1000
      return (1 / 2) * 60 * 1000
    }
  },
  watch: {
    result (result) {
      if (result !== null && typeof result !== 'undefined') {
        pTimeout(this.onUpdate(result), 300)
      }
    },
    isStarted (isStarted) {
      if (isStarted) {
        this.$nextTick(() => {
          this.$refs.countdown.start()
        })
      }
    }
  },
  mounted () {
    this.init()
    this.onInit()
  },
  methods: {
    ...mapActions('psychotestCandidate', {
      findCandidate: 'find',
      updateCandidate: 'update'
    }),
    ...mapActions('psychotestKraepelin', {
      createKraepelin: 'create'
    }),
    ...mapActions('psychotestKraepelinColumn', {
      createKraepelinColumn: 'create',
      updateKraepelinColumn: 'update'
    }),
    init () {
      let currentKraepelinTimer = this.$cookie.get('currentKraepelinTimer')
      if (
        currentKraepelinTimer !== null &&
        typeof currentKraepelinTimer !== 'undefined'
      ) {
        currentKraepelinTimer = JSON.parse(currentKraepelinTimer)

        this.currentTimer = currentKraepelinTimer
        this.isStarted = true
      }
    },
    onCountdown (data) {
      this.$cookie.set('currentKraepelinTimer', JSON.stringify(data))
    },
    async onCountdownEnd () {
      try {
        await this.updateCandidate({
          ...this.candidate,
          is_kraepelin_finished: true
        })
        const { data: candidate } = await this.findCandidate({
          id: this.candidate.id
        })
        await (() => {
          if (isExists(candidate)) {
            // if (
            //   candidate.is_kraepelin_finished &&
            //   candidate.is_papikostick_finished
            // ) {
            //   this.$cookie.delete('candidate')
            //   this.$cookie.delete('candidate_id')
            // }
            this.$cookie.delete('currentKraepelinTimer')
            this.$cookie.delete('kraepelin')
            this.$cookie.delete('kraepelin_id')
            this.$router.replace('/psychotest')
          }
        })()
      } catch (error) {
        console.log(error)
      }
    },
    async onInit () {
      try {
        // let kraepelin = this.$cookie.get('kraepelin')
        // if (kraepelin) {
        //   kraepelin = JSON.parse(kraepelin)
        const kraepelinId = this.$cookie.get('kraepelin_id')
        if (kraepelinId) {
          const { data: kraepelinColumn } = await this.createKraepelinColumn({
            kraepelin_id: kraepelinId
          })
          if (kraepelinColumn) {
            this.firstNumber = kraepelinColumn.resource.current_first_number
            this.secondNumber = kraepelinColumn.resource.current_second_number
            this.isStarted = true
            this.kraepelinColumn = kraepelinColumn
            this.result = null
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async onStart () {
      try {
        const { data: kraepelin } = await this.createKraepelin({
          candidate_id: this.candidate.id
        })
        await this.updateCandidate({
          ...this.candidate,
          is_kraepelin_started: true
        })
        await (async () => {
          if (kraepelin) {
            // this.$cookie.set('kraepelin', JSON.stringify(kraepelin))
            this.$cookie.set('kraepelin_id', kraepelin.id)
            const { data: kraepelinColumn } = await this.createKraepelinColumn({
              kraepelin_id: kraepelin.id
            })
            if (kraepelinColumn) {
              this.firstNumber = kraepelinColumn.resource.current_first_number
              this.secondNumber =
                kraepelinColumn.resource.current_second_number
              this.isStarted = true
              this.kraepelinColumn = kraepelinColumn
              this.result = null
            }
          }
        })()
      } catch (error) {
        console.log(error)
      }
    },
    async onUpdate (answer) {
      try {
        const { data: kraepelinColumn } = await this.updateKraepelinColumn({
          id: this.kraepelinColumn.resource.id,
          payload: {
            kraepelin_id: this.kraepelinColumn.resource.kraepelin_id,
            answer
          }
        })

        if (kraepelinColumn) {
          this.kraepelinColumn = kraepelinColumn
          this.firstNumber = kraepelinColumn.resource.current_first_number
          this.secondNumber = kraepelinColumn.resource.current_second_number
          this.result = null
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
.btn-custom {
  width: 33.33333333333%;
  height: 70px;
}
</style>
