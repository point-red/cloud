<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-psychotest />
      <router-link
        to="/human-resource/psychotest/position-category"
        class="breadcrumb-item"
      >
        {{ $t("position category") | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">{{
        positionCategory.position.position | titlecase
      }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block :title="$t('candidate')" :header="true">
        <p-block-inner :is-loading="loading">
          <div class="row">
            <div class="col-sm-6">
              <p-table>
                <template slot="p-body">
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("position") | titlecase
                      }}</span>
                    </td>
                    <td>{{ positionCategory.position.position }}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{
                        $t("category") | titlecase
                      }}</span>
                    </td>
                    <td>{{ positionCategory.category.name }}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{ $t("max") | titlecase }}</span>
                    </td>
                    <td>{{ positionCategory.category_max }}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-w700">{{ $t("min") | titlecase }}</span>
                    </td>
                    <td>{{ positionCategory.category_min }}</td>
                  </tr>
                </template>
              </p-table>
            </div>
            <div class="col-sm-12 mb-20">
              <hr />
              <router-link
                :to="{
                  path:
                    '/human-resource/psychotest/position-category/' +
                    positionCategory.id +
                    '/edit',
                  params: { id: positionCategory.id }
                }"
                v-if="$permission.has('update employee')"
                class="btn btn-sm btn-primary mr-5"
              >
                Edit
              </router-link>
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
    ...mapState('humanResourcePsychotestPositionCategory', ['positionCategory'])
  },
  created () {
    this.loading = true
    this.findPositionCategory({
      id: this.id,
      params: { expand: 1, includes: 'position;category' }
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
    ...mapActions('humanResourcePsychotestPositionCategory', {
      findPositionCategory: 'find',
      deletePositionCategory: 'delete'
    }),
    onDelete () {
      this.loadingSaveButton = true
      this.deletePositionCategory({ id: this.id }).then(
        response => {
          this.loadingSaveButton = false
          this.$router.push('/human-resource/psychotest/position-category')
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
