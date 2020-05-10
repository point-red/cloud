<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-psychotest />
      <router-link
        to="/human-resource/psychotest/papikostick-question"
        class="breadcrumb-item"
      >
        {{ $t("papikostick question") | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">{{
        papikostickQuestion.number | titlecase
      }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block :title="$t('papikostick question')" :header="true">
        <p-block-inner :is-loading="loading">
          <div class="row">
            <div class="col-sm-6">
              <p-table>
                <template slot="p-body">
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("papikostick question") | titlecase
                      }}</span>
                    </td>
                    <td>{{ papikostickQuestion.number }}</td>
                  </tr>
                </template>
              </p-table>
            </div>
            <div class="col-sm-12 mb-20">
              <hr />
              <router-link
                :to="{
                  path:
                    '/human-resource/psychotest/papikostick-question/' +
                    papikostickQuestion.id +
                    '/edit',
                  params: { id: papikostickQuestion.id }
                }"
                v-if="$permission.has('update employee')"
                class="btn btn-sm btn-primary mr-5"
              >
                Edit
              </router-link>
              <!-- <button
                type="button"
                @click="onDelete()"
                v-if="$permission.has('delete employee')"
                :disabled="loadingSaveButton"
                class="btn btn-sm btn-danger">
                <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Delete
              </button> -->
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
      loadingSaveButton: false
    }
  },
  computed: {
    ...mapState('humanResourcePsychotestPapikostickQuestion', [
      'papikostickQuestion'
    ])
  },
  created () {
    this.loading = true
    this.findPapikostickQuestion({ id: this.id }).then(
      response => {
        this.loading = false
      },
      error => {
        console.log(JSON.stringify(error))
      }
    )
  },
  methods: {
    ...mapActions('humanResourcePsychotestPapikostickQuestion', {
      findPapikostickQuestion: 'find',
      deletePapikostickQuestion: 'delete'
    }),
    onDelete () {
      this.loadingSaveButton = true
      this.deletePapikostickQuestion({ id: this.id }).then(
        response => {
          this.loadingSaveButton = false
          this.$router.push('/human-resource/psychotest/papikostick-question')
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
