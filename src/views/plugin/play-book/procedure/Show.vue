<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin></breadcrumb-plugin>
      <breadcrumb-play-book></breadcrumb-play-book>
      <breadcrumb-procedure></breadcrumb-procedure>
      <span class="breadcrumb-item active">{{ form.code || 'Show' | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="my-0" v-if="!form.approved_at">{{ `${form.approval_action} submission` | uppercase }}</h5>
            <h5 class="my-0" v-else>{{ `code` | uppercase }}</h5>
            <div class="text-right">
              <button
                type="button"
                @click="$refs.modalEditProcedure.open()"
                v-if="$permission.has('update play book procedures code') && form.approved_at"
                class="btn btn-sm btn-outline-secondary mr-5">
                {{ $t('edit') | uppercase }}
              </button>
              <button
                type="button"
                @click="confirmDelete"
                v-if="$permission.has('delete play book procedures code') && (form.approved_at || form.declined_at)"
                :disabled="isDeleting"
                class="btn btn-sm btn-outline-secondary mr-5">
                <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> {{ $t('delete') | uppercase }}
              </button>
              <router-link
                v-if="form.approved_at"
                class="btn btn-sm btn-outline-secondary"
                :to="`/plugin/play-book/procedure/${form.id}/histories`"
              >SEE HISTORY</router-link>
            </div>
            <div class="text-right" v-if="$permission.has('accept play book approval procedures')
              && form.approval_request_to === authUser.id
              && !form.declined_at
              && !form.approved_at">
              <button
                type="button"
                @click="$refs.modalDeclineProcedure.open()"
                class="btn btn-sm btn-outline-danger mr-5">
                {{ $t('decline') | uppercase }}
              </button>
              <button
                @click="approve"
                type="button"
                class="btn btn-sm btn-outline-success mr-5">
                {{ $t('approve') | uppercase }}
              </button>
            </div>
          </div>
          <hr>
          <div class="alert alert-success" v-if="updateSucess">
            Procedure updated
          </div>
          <div class="alert alert-danger" v-if="errors">
            <strong>{{ errors.message }}</strong>
          </div>
          <form @submit.prevent="submit" class="col-lg-6">
            <p-form-row
              id="code"
              name="code"
              :label="$t('code')">
              <div slot="body" class="col-lg-9">
                <div class="form-control bg-light" style="height: fit-content">
                  {{ form.code }}
                </div>
              </div>
            </p-form-row>
            <p-form-row
              id="name"
              name="name"
              :label="$t('name')">
              <div slot="body" class="col-lg-9">
                <div class="form-control bg-light" style="height: fit-content">
                  {{ form.name }}
                </div>
              </div>
            </p-form-row>
            <p-form-row
              id="purpose"
              name="purpose"
              :label="$t('purpose')">
              <div slot="body" class="col-lg-9">
                <div class="form-control bg-light" style="height: fit-content">
                  {{ form.purpose }}
                </div>
              </div>
            </p-form-row>
            <p-form-row
              id="content"
              name="content"
              v-if="form.procedure_id"
              :label="$t('content')">
              <div slot="body" class="col-lg-9">
                <div class="form-control bg-light" style="height: fit-content">
                  {{ form.content }}
                </div>
              </div>
            </p-form-row>
            <p-form-row
              id="note"
              name="note"
              :label="$t('note')">
              <div slot="body" class="col-lg-9">
                <div class="form-control bg-light" style="height: fit-content">
                  {{ form.note }}
                </div>
              </div>
            </p-form-row>
          </form>
        </p-block-inner>
        <hr>
        <p-block-inner :is-loading="isLoading" class="mt-5">
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <router-link
                class="btn btn-sm btn-light mr-3"
                v-if="form.procedure_id"
                :to="`/plugin/play-book/procedure/${form.procedure_id}`">
                <i class="fa fa-arrow-left"></i>
              </router-link>
              <h5 class="my-0">{{ $t('content') | uppercase }}</h5>
            </div>
            <button
              class="btn btn-sm btn-light"
              v-if="$permission.has('create play book procedures code') && form.approved_at"
              @click="$refs.modalAddProcedure.open()">
              <i class="fa fa-plus"></i>
            </button>
          </div>
          <div class="pt-5">
            <procedure-code-item
              v-for="(procedure, i) in form.procedures"
              :i="(++i)"
              :key="procedure.id"
              :procedure="procedure"
              :with-add-button="true"
              :is-parent="true"
              @added="getData"
              ></procedure-code-item>

            <div v-if="form.procedures.length < 1">
              No content.
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>
    <m-add-procedure
      ref="modalAddProcedure"
      :parent-id="$route.params.id"
      @added="$router.push('/plugin/play-book/approval/procedure/send')"></m-add-procedure>
    <m-edit-procedure
      ref="modalEditProcedure"
      :procedure-id="$route.params.id"
      @added="$router.push('/plugin/play-book/approval/procedure/send')"></m-edit-procedure>
    <m-decline-procedure
      ref="modalDeclineProcedure"
      :procedure-id="$route.params.id"
      @added="getData()"></m-decline-procedure>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPlayBook from '@/views/plugin/play-book/Breadcrumb'
import BreadcrumbProcedure from '@/views/plugin/play-book/procedure/components/Breadcrumb'
import ProcedureCodeItem from './components/ProcedureCodeItem'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPlugin,
    BreadcrumbPlayBook,
    BreadcrumbProcedure,
    ProcedureCodeItem
  },
  data () {
    return {
      isSaving: false,
      isEditMode: false,
      isLoading: false,
      isDeleting: false,
      updateSucess: false,
      form: {
        code: null,
        name: null,
        purpose: null,
        note: null
      },
      errors: null
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser'])
  },
  mounted () {
    this.getData()
  },
  methods: {
    ...mapActions('pluginPlayBookProcedure', [
      'update', 'show', 'delete'
    ]),
    async getData () {
      try {
        const id = this.$route.params.id
        this.isLoading = true

        let procedure = await this.show(id)
        this.form = { ...procedure }
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
    async approve () {
      try {
        const id = this.$route.params.id
        this.isLoading = true

        let data = await this.$store.dispatch('pluginPlayBookProcedureApproval/approve', id)

        if (this.form.approval_action === 'update') {
          this.$router.replace(
            `/plugin/play-book/procedure/${this.form.procedure_pending_id}`
          )
        } else if (this.form.approval_action === 'destroy') {
          this.$router.replace(
            `/plugin/play-book/procedure/${this.form.procedure_id ? 'content' : 'code'}/`
          )
        } else {
          this.getData()
        }
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
    async submit () {
      try {
        this.errors = null
        this.isSaving = true
        let { data } = await this.update(this.form)
        this.isEditMode = false
        this.updateSucess = true

        setTimeout(() => {
          this.updateSucess = false
        }, 3000)
      } catch (error) {
        this.errors = {
          message: error.message,
          ...error.errors
        }
      } finally {
        this.isSaving = false
      }
    },
    async confirmDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(async response => {
        try {
          this.isLoading = true
          this.isDeleteing = true
          await this.delete(this.$route.params.id)

          if (!this.form.declined_at) {
            this.$router.push('/plugin/play-book/approval/procedure/send')
          } else {
            this.$router.push('/plugin/play-book/procedure')
          }
        } catch (error) {
        } finally {
          this.isDeleteing = false
          this.isLoading = false
        }
      })
    }
  },
  watch: {
    '$route.params.id' () {
      this.getData()
    }
  }
}
</script>

<style lang="scss">
.row {
  -webkit-user-select: none !important;
  -webkit-touch-callout: none !important;
  touch-action: none;
}
</style>
