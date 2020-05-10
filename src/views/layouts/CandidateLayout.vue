<template>
  <div class="my-container">
    <div class="my-box">
      <p-block
        v-if="
          isAuth &&
            !(
              $route.path.includes('kraepelin') ||
              $route.path.includes('papikostick')
            )
        "
        :title="`${candidate.name} - ${candidate.phone}`"
        :header="true"
        :show-options="false"
      >
        <div class="text-center" style="margin-bottom: 20px">
          <button class="btn btn-primary" @click="onLogout">
            {{ $t("logout") | titlecase }}
          </button>
        </div>
      </p-block>
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { types as candidateTypes } from '../../modules/psychotest/candidate'

export default {
  data () {
    return {}
  },
  computed: {
    ...mapGetters('psychotestCandidate', ['isAuth']),
    candidate: {
      get () {
        return this.$store.state.psychotestCandidate.candidate
      },
      set (candidate) {
        this.$store.commit(
          `psychotestCandidate/${candidateTypes.FETCH_OBJECT}`,
          candidate
        )
      }
    }
  },
  async mounted () {
    await this.initAuth()
    await Promise.all([this.initKraepelin(), this.initPapikostick()])
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
            this.candidate = _candidate
            this.$notification.success('Login success')
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
    },
    onLogout () {
      // this.$cookie.delete('candidate')
      this.$cookie.delete('candidate_id')
      this.$store.commit(
        `psychotestCandidate/${candidateTypes.FETCH_OBJECT}`,
        null
      )
      this.$router.replace('/psychotest/login')
    }
  }
}
</script>

<style>
.my-container {
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
}
.my-box {
  width: 50%;
  margin: 8px;
  display: flex;
  flex-wrap: wrap;
}

.full-width {
  width: 100%;
}

@media screen and (max-width: 1024px) {
  .my-box {
    width: 50%;
  }
}

@media screen and (max-width: 720px) {
  .my-box {
    width: 100%;
  }
}
</style>
