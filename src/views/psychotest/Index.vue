<template>
  <div class="full-width col-sm-12">
    <div v-if="isAuth" class="row gutters-tiny">
      <p-box
        v-if="!candidate.is_kraepelin_finished"
        class="col-xl-6"
        :name="$t('kraepelin')"
        icon="si si-calculator"
        :link="candidate.is_kraepelin_finished ? '' : '/psychotest/kraepelin'"
      />
      <p-box
        v-if="!candidate.is_papikostick_finished"
        class="col-xl-6"
        :name="$t('papikostick')"
        icon="si si-list"
        :link="
          candidate.is_papikostick_finished ? '' : '/psychotest/papikostick'
        "
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { types as candidateTypes } from '../../modules/psychotest/candidate'

export default {
  computed: {
    ...mapGetters('psychotestCandidate', ['isAuth']),
    ...mapState('psychotestCandidate', ['candidate'])
  },
  async mounted () {
    if (
      this.isAuth &&
      this.candidate.is_kraepelin_finished &&
      this.candidate.is_papikostick_finished
    ) {
      this.$store.commit(
        `psychotestCandidate/${candidateTypes.FETCH_OBJECT}`,
        null
      )
      this.$cookie.delete('currentPapikostickTimer')
      this.$cookie.delete('papikostick')
      this.$cookie.delete('currentKraepelinTimer')
      this.$cookie.delete('kraepelin')
      this.$cookie.delete('currentQuestion')
      // this.$router.replace('/psychotest/login')
    }
    await this.initAuth()
    this.$nextTick(() => {
      this.initKraepelin()
      this.initPapikostick()
    })
  },
  methods: {
    ...mapActions('psychotestCandidate', {
      findCandidate: 'find'
    }),
    async initAuth () {
      // let candidate = this.$cookie.get('candidate')
      let candidateId = this.$cookie.get('candidate_id')
      // if (candidate) {
      //   candidate = JSON.parse(candidate)
      if (candidateId !== null && typeof candidateId !== 'undefined') {
        // candidateId = JSON.parse(candidateId)
        try {
          const { data: _candidate } = await this.findCandidate({
            id: candidateId
          })
          if (_candidate) {
            // if (
            //   _candidate.is_kraepelin_finished &&
            //   _candidate.is_papikostick_finisihed
            // ) {
            //   this.onLogout()
            //   return
            // }
            // this.candidate = _candidate
            // this.$notification.success('Login success')
            this.$router.replace('/psychotest')
          }
        } catch (error) {
          this.onLogout()
        }
      } else {
        this.onLogout()
      }
    },
    initKraepelin () {
      // const kraepelin = this.$cookie.get('kraepelin')
      const kraepelinId = this.$cookie.get('kraepelin_id')
      const currentKraepelinTimer = this.$cookie.get('currentKraepelinTimer')
      if (this.isAuth && kraepelinId && currentKraepelinTimer) {
        this.$router.replace('/psychotest/kraepelin')
      }
    },
    initPapikostick () {
      // const papikostick = this.$cookie.get('papikostick')
      const papikostickId = this.$cookie.get('papikostick_id')
      const currentPapikostickTimer = this.$cookie.get(
        'currentPapikostickTimer'
      )
      if (this.isAuth && papikostickId && currentPapikostickTimer) {
        this.$router.replace('/psychotest/papikostick')
      }
    }
  }
}
</script>
