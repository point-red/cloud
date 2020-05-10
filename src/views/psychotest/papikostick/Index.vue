<template>
  <div class="full-width">
    <div v-if="isStarted">
      <p-block :title="$t('papikostick')" :header="true" :show-options="false">
        <div style="display: flex; justify-content: space-between">
          <div class="h5">Soal No. {{ currentPapikostickIndex + 1 }}</div>
          <div>
            <vue-countdown
              ref="countdown"
              :auto-start="false"
              :time="timer"
              @progress="onCountdown"
              @end="onCountdownEnd"
            >
              <template #default="props">
                <div class="h5">{{ props.minutes }}':{{ props.seconds }}"</div>
              </template>
            </vue-countdown>
          </div>
        </div>
        <div
          style="padding: 20px 0; background-color: #f5f5f5; margin-bottom: 20px"
        >
          <div v-if="question" class="ml-10">
            <div
              v-for="(option, index) in question.options"
              :key="option.id"
              class="radio"
            >
              <label :for="`option_${index}`">
                <input
                  style="min-width: 0"
                  type="radio"
                  :id="`option_${index}`"
                  :value="option.category_id"
                  v-model="selectedOptionCategory"
                />
                <span class="ml-10">{{ option.content }}</span>
              </label>
            </div>
          </div>
        </div>
      </p-block>
    </div>
    <div v-else="">
      <p-block :title="$t('instruction')" :header="true" :show-options="false">
        <div style="margin-bottom: 20px">
          <h3 class="h4">
            BACA INSTRUKSI DI BAWAH INI SEBELUM MENEKAN TOMBOL ‘START’
          </h3>
          <p>
            Total pertanyaan tes yang harus anda selesaikan berjumlah 90
            pertanyaan, dimana tiap pertanyaan mempunyai 2 pilihan jawaban.
            Tugas anda adalah:
          </p>
          <ol>
            <li>
              Memilih salah satu dari jawaban yang anda anggap paling dekat
              menggambarkan kepribadian atau diri anda.
            </li>
            <li>
              Apabila kedua jawaban tersebut sesuai dengan kepribadian anda,
              ataupun tidak satupun yang menggambarkan diri anda, maka cobalah
              pertimbangkan kembali secara teliti hingga anda menemukan jawaban
              yang paling dapat mencerminkan diri anda.
            </li>
            <li>
              Jika sudah memahami no 1 & 2, tes bisa dimulai dengan menekan
              tombol ‘Start’.
            </li>
          </ol>
        </div>
      </p-block>
      <p-block :title="$t('papikostick')" :header="true" :show-options="false">
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

const isExists = data => data !== null && typeof data !== 'undefined'

export default {
  data () {
    return {
      loading: false,
      isStarted: false,
      currentTimer: null,
      currentPapikostickIndex: 0,
      selectedOptionCategory: null
      // isResetButtonDisabled: true
    }
  },
  components: {
    VueCountdown
  },
  computed: {
    ...mapState('psychotestCandidate', ['candidate']),
    ...mapState('psychotestPapikostick', ['papikostick']),
    ...mapState('psychotestPapikostickQuestion', ['papikostickQuestions']),
    ...mapState('psychotestPapikostickResult', ['papikostickResults']),
    timer () {
      if (
        this.currentTimer !== null &&
        typeof this.currentTimer !== 'undefined'
      ) {
        return this.currentTimer.totalMilliseconds
      }
      // return 45 * 60 * 1000
      return 10 * 60 * 1000
      // return (1 / 4) * 60 * 1000
    },
    question () {
      if (this.papikostickQuestions.length > 0) {
        if (
          this.currentPapikostickIndex !== null &&
          typeof this.currentPapikostickIndex !== 'undefined'
        ) {
          return this.papikostickQuestions[this.currentPapikostickIndex]
        }
        return null
      }
      return null
    }
  },
  watch: {
    isStarted (isStarted) {
      if (isStarted) {
        this.$nextTick(() => {
          this.$refs.countdown.start()
        })
      }
    },
    selectedOptionCategory (selectedOptionCategory) {
      if (isExists(selectedOptionCategory)) {
        this.onOptionChoosen(selectedOptionCategory)
      }
    },
    async currentPapikostickIndex (currentPapikostickIndex) {
      if (isExists(currentPapikostickIndex)) {
        try {
          if (currentPapikostickIndex < 90) {
            await this.updateCandidate({
              ...this.candidate,
              current_papikostick_index: currentPapikostickIndex
            })
            await this.findCandidate({
              id: this.candidate.id
            })
          } else {
            this.onCountdownEnd()
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions('psychotestCandidate', {
      findCandidate: 'find',
      updateCandidate: 'update'
    }),
    ...mapActions('psychotestPapikostick', {
      createPapikostick: 'create',
      findPapikostick: 'find'
    }),
    ...mapActions('psychotestPapikostickQuestion', {
      getPapikostickQuestions: 'get'
    }),
    ...mapActions('psychotestPapikostickResult', {
      createPapikostickResult: 'create',
      getPapikostickResults: 'get',
      updatePapikostickResult: 'update'
    }),
    ...mapActions('psychotestPapikostickCategory', {
      getPapikostickCategories: 'get'
    }),
    async init () {
      try {
        await this.getPapikostickQuestions({
          params: {
            limit: 0,
            expand: true,
            includes: 'papikostick_options'
          }
        })

        let currentPapikostickTimer = this.$cookie.get(
          'currentPapikostickTimer'
        )
        if (isExists(this.candidate) && isExists(currentPapikostickTimer)) {
          currentPapikostickTimer = JSON.parse(currentPapikostickTimer)

          this.currentTimer = currentPapikostickTimer
          this.currentPapikostickIndex = this.candidate.current_papikostick_index
          this.isStarted = true
          const papikostickId = this.$cookie.get('papikostick_id')
          if (isExists(papikostickId)) {
            await this.findPapikostick({ id: papikostickId })

            await Promise.all([
              this.getPapikostickCategories(),
              this.getPapikostickResults({
                params: {
                  limit: 0,
                  sort_by: 'id',
                  filter_equal: {
                    'papikostick_id': this.papikostick.id,
                    'psychotest_papikostick.candidate_id': this.candidate.id
                  }
                }
              })
            ])
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    onCountdown (data) {
      this.$cookie.set('currentPapikostickTimer', JSON.stringify(data))
    },
    async onCountdownEnd () {
      try {
        await this.updateCandidate({
          ...this.candidate,
          is_papikostick_finished: true
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
            this.$cookie.delete('currentPapikostickTimer')
            this.$cookie.delete('papikostick')
            this.$cookie.delete('papikostick_id')
            this.$router.replace('/psychotest')
          }
        })()
      } catch (error) {
        console.log(error)
      }
    },
    async onStart () {
      try {
        this.loading = true
        const { data: papikostick } = await this.createPapikostick({
          candidate_id: this.candidate.id
        })
        await (async () => {
          if (isExists(papikostick)) {
            this.$cookie.set('papikostick_id', papikostick.id)
            await this.updateCandidate({
              ...this.candidate,
              is_papikostick_started: true
            })
            await this.getPapikostickResults({
              params: {
                limit: 0,
                sort_by: 'psychotest_papikostick_result.id',
                filter_equal: {
                  'psychotest_papikostick_result.papikostick_id': papikostick.id,
                  'psychotest_papikostick.candidate_id': this.candidate.id
                }
              }
            })
            await (() => {
              this.isStarted = true
            })()
          }
        })()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    async onOptionChoosen (selectedOptionCategory) {
      // eslint-disable-next-line
      const result = this.papikostickResults.find(
        ({ category_id: categoryId }) => categoryId === selectedOptionCategory
      )
      if (isExists(result)) {
        try {
          await this.updatePapikostickResult({
            ...result,
            total: (result.total += 1)
          })
          await (() => {
            this.currentPapikostickIndex += 1
            this.selectedOptionCategory = null
            // this.isResetButtonDisabled = true
          })()
        } catch (error) {
          console.log(error)
          // this.isResetButtonDisabled = false
        }
      }
    }
    // onReset () {
    //   this.selectedOptionCategory = null
    //   if (!this.isResetButtonDisabled) {
    //     this.loading = true
    //     setTimeout(() => {
    //       this.loading = false
    //       this.isResetButtonDisabled = false
    //     }, 3000)
    //   }
    // }
  }
}
</script>

<style>
.btn-custom {
  width: 33.33333333333%;
  height: 70px;
}
</style>
