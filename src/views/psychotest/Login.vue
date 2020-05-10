<template>
  <div class="full-width">
    <div class="mb-20">
      <ul class="nav nav-tabs nav-tabs-alt" data-toggle="tabs" role="tablist">
        <li class="nav-item ml-auto">
          <router-link
            to="/psychotest/register"
            exact
            class="nav-link"
            active-class="active"
          >
            <span><i class="si si-plus"></i> Register</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/psychotest/login"
            exact
            class="nav-link"
            active-class="active"
          >
            <span><i class="si si-login"></i> Login</span>
          </router-link>
        </li>
      </ul>
    </div>
    <form class="row" @submit.prevent="onSubmit">
      <p-block :is-loading="loading" :header="false" column="col-sm-12">
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="password"
              :name="$t('password') | titlecase"
              label="password"
              v-model="form.password"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('password')"
              @errors="form.errors.set('password', null)"
            >
            </p-form-row>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-12">
            <button
              :disabled="loadingSaveButton"
              type="submit"
              class="btn btn-sm btn-primary"
            >
              <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin" />
              Login
            </button>
          </div>
        </div>
      </p-block>
    </form>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import { mapActions, mapGetters } from 'vuex'
import { types as candidateTypes } from '../../modules/psychotest/candidate'

const isExists = data => data !== null && typeof data !== 'undefined'

export default {
  data () {
    return {
      loading: false,
      loadingSaveButton: false,
      form: new Form({
        password: ''
      })
    }
  },
  computed: {
    ...mapGetters('psychotestCandidate', ['isAuth'])
  },
  mounted () {
    console.log('LOGIN')
    this.$nextTick(() => {
      this.initKraepelin()
      this.initPapikostick()
    })
  },
  methods: {
    ...mapActions('psychotestCandidate', {
      loginCandidate: 'login',
      updateCandidate: 'update'
    }),
    async onSubmit () {
      this.loadingSaveButton = true
      const { data: candidate } = await this.loginCandidate(this.form)
      if (isExists(candidate)) {
        // if (candidate.is_password_used) {
        //   this.loadingSaveButton = false
        //   this.$notification.error('Password is already used')
        //   return
        // }
        try {
          const { data: _candidate } = await this.updateCandidate({
            ...candidate,
            is_password_used: true
          })
          this.$store.commit(
            `psychotestCandidate/${candidateTypes.FETCH_OBJECT}`,
            _candidate
          )
          this.loadingSaveButton = false
          this.$notification.success('Login success')
          // this.$cookie.set('candidate', JSON.stringify(_candidate))

          this.$cookie.set('candidate_id', _candidate.id)
          this.$router.replace('/psychotest')
        } catch (error) {
          console.log(error)
          this.$notification.error('Login failed', 'User not found')
          this.form.errors.record(error.errors)
        } finally {
          this.loadingSaveButton = false
        }
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
