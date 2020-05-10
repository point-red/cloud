<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-psychotest />
      <router-link
        to="/human-resource/psychotest/candidate"
        class="breadcrumb-item"
      >
        {{ "candidate" | titlecase }}
      </router-link>
      <router-link
        :to="'/human-resource/psychotest/candidate/' + candidate.id"
        class="breadcrumb-item"
      >
        {{ candidate.name | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">Edit</span>
    </breadcrumb>

    <tab-menu />

    <form class="row" @submit.prevent="onSubmit">
      <p-block
        :is-loading="loading"
        :header="true"
        :title="$t('job location')"
        column="col-sm-12"
      >
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="name"
              :name="$t('name') | titlecase"
              label="name"
              v-model="form.name"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)"
            >
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="phone"
              name="phone"
              :label="$t('phone') | titlecase"
              v-model="form.phone"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('phone')"
              @errors="form.errors.set('phone', null)"
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
                $router.push('/human-resource/psychotest/candidate/' + id)
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
import BreadcrumbPsychotest from '@/views/human-resource/psychotest/Breadcrumb'
import Form from '@/utils/Form'
import { mapState, mapActions } from 'vuex'

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
      loadingSaveButton: false,
      form: new Form({
        name: '',
        phone: null
      })
    }
  },
  computed: {
    ...mapState('humanResourcePsychotestCandidate', ['candidate'])
  },
  created () {
    this.loading = true
    this.findCandidate({
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
    ...mapActions('humanResourcePsychotestCandidate', {
      findCandidate: 'find',
      updateCandidate: 'update'
    }),
    onSubmit () {
      this.loadingSaveButton = true
      this.updateCandidate(this.form).then(
        response => {
          this.loadingSaveButton = false
          this.$notification.success('Update success')
          this.$router.replace(
            '/human-resource/psychotest/candidate/' + this.candidate.id
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
