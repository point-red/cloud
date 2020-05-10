<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-psychotest />
      <router-link
        to="/human-resource/psychotest/candidate-position"
        class="breadcrumb-item"
      >
        {{ "candidate position" | titlecase }}
      </router-link>
      <router-link
        :to="
          '/human-resource/psychotest/candidate-position/' +
            candidatePosition.id
        "
        class="breadcrumb-item"
      >
        {{ candidatePosition.position | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">Edit</span>
    </breadcrumb>

    <tab-menu />

    <form class="row" @submit.prevent="onSubmit">
      <p-block
        :is-loading="loading"
        :header="true"
        :title="$t('candidate position')"
        column="col-sm-12"
      >
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="position"
              :name="$t('position') | titlecase"
              label="position"
              v-model="form.position"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('position')"
              @errors="form.errors.set('position', null)"
            >
            </p-form-row>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-12">
            <button
              type="submit"
              :disabled="loadingSaveButton"
              class="btn btn-sm btn-primary mr-5"
            >
              <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin" />
              Update
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              @click="
                $router.push(
                  '/human-resource/psychotest/candidate-position/' + id
                )
              "
            >
              Close
            </button>
          </div>
        </div>
      </p-block>
    </form>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import Form from '@/utils/Form'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource
  },
  data () {
    return {
      id: this.$route.params.id,
      loading: false,
      loadingSaveButton: false,
      form: new Form({
        position: ''
      })
    }
  },
  computed: {
    ...mapState('humanResourcePsychotestCandidatePosition', [
      'candidatePosition'
    ])
  },
  created () {
    this.loading = true
    this.findCandidatePosition({
      id: this.id
    }).then(
      response => {
        this.loading = false
        for (let field in this.form) {
          console.log(JSON.stringify(field))
          if (response.data[field]) this.form[field] = response.data[field]
        }
        this.form.id = response.data.id
        console.log(response.data)
      },
      error => {
        this.loading = false
        console.log(JSON.stringify(error))
      }
    )
  },
  methods: {
    ...mapActions('humanResourcePsychotestCandidatePosition', {
      findCandidatePosition: 'find',
      updateCandidatePosition: 'update'
    }),
    onSubmit () {
      this.loadingSaveButton = true
      this.updateCandidatePosition(this.form).then(
        response => {
          this.loadingSaveButton = false
          this.$notification.success('Update success')
          this.$router.replace(
            '/human-resource/psychotest/candidate-position/' +
              this.candidatePosition.id
          )
        },
        error => {
          this.loadingSaveButton = false
          this.$notification.error('Update failed', error.message)
          this.form.errors.record(error.errors)
        }
      )
    }
  }
}
</script>
