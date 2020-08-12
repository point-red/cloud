<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <breadcrumb-play-book />
      <breadcrumb-procedure />
      <span class="breadcrumb-item active">{{ form.code || 'Show' | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="d-flex justify-content-between align-items-center">
            <h5
              v-if="!form.approved_at"
              class="my-0"
            >
              {{ `${form.approval_action} submission` | uppercase }}
            </h5>
            <h5
              v-else
              class="my-0"
            >
              {{ `code` | uppercase }}
            </h5>
            <div class="text-right">
              <button
                v-if="$permission.has('update play book procedure') && form.approved_at"
                type="button"
                class="btn btn-sm btn-outline-secondary mr-5"
                @click="$refs.modalEditProcedure.open()"
              >
                {{ $t('edit') | uppercase }}
              </button>
              <button
                v-if="$permission.has('delete play book procedure') && (form.approved_at || form.declined_at)"
                type="button"
                :disabled="isDeleting"
                class="btn btn-sm btn-outline-secondary mr-5"
                @click="confirmDelete"
              >
                <i
                  v-show="isDeleting"
                  class="fa fa-asterisk fa-spin"
                /> {{ $t('delete') | uppercase }}
              </button>
              <router-link
                v-if="form.approved_at"
                class="btn btn-sm btn-outline-secondary"
                :to="`/plugin/play-book/procedure/${form.id}/histories`"
              >
                SEE HISTORY
              </router-link>
            </div>
            <div
              v-if="$permission.has('approve play book procedure')
                && form.approval_request_to === authUser.id
                && !form.declined_at
                && !form.approved_at"
              class="text-right"
            >
              <button
                type="button"
                class="btn btn-sm btn-secondary mr-5"
                @click="$refs.modalDeclineProcedure.open()"
              >
                {{ $t('decline') | uppercase }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-secondary mr-5"
                @click="approve"
              >
                {{ $t('approve') | uppercase }}
              </button>
            </div>
          </div>
          <hr>
          <div
            v-if="updateSucess"
            class="alert alert-success"
          >
            Procedure updated
          </div>
          <div
            v-if="errors"
            class="alert alert-danger"
          >
            <strong>{{ errors.message }}</strong>
          </div>
          <form
            class="col-lg-6"
            @submit.prevent="submit"
          >
            <p-form-row
              id="code"
              name="code"
              :label="$t('code')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <div
                  class="form-control bg-light"
                  style="height: fit-content"
                >
                  {{ form.code }}
                </div>
              </div>
            </p-form-row>
            <p-form-row
              id="name"
              name="name"
              :label="$t('name')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <div
                  class="form-control bg-light"
                  style="height: fit-content"
                >
                  {{ form.name }}
                </div>
              </div>
            </p-form-row>
            <p-form-row
              id="purpose"
              name="purpose"
              :label="$t('purpose')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <div
                  class="form-control bg-light"
                  style="height: fit-content"
                >
                  {{ form.purpose || '-' }}
                </div>
              </div>
            </p-form-row>
            <p-form-row
              v-if="form.procedure_id"
              id="content"
              name="content"
              :label="$t('content')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <div
                  class="form-control bg-light"
                  style="height: fit-content"
                >
                  {{ form.content || '-' }}
                </div>
              </div>
            </p-form-row>
            <p-form-row
              id="note"
              name="note"
              :label="$t('note')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <div
                  class="form-control bg-light"
                  style="height: fit-content"
                >
                  {{ form.note || '-' }}
                </div>
              </div>
            </p-form-row>
          </form>
        </p-block-inner>
        <hr>
        <p-block-inner
          :is-loading="isLoading"
          class="mt-5"
        >
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <router-link
                v-if="form.procedure_id"
                class="btn btn-sm btn-light mr-3"
                :to="`/plugin/play-book/procedure/${form.procedure_id}`"
              >
                <i class="fa fa-arrow-left" />
              </router-link>
              <h5 class="my-0">
                {{ $t('content') | uppercase }}
              </h5>
            </div>
            <button
              v-if="$permission.has('create play book procedure') && form.approved_at"
              class="btn btn-sm btn-light"
              @click="$refs.modalAddProcedure.open()"
            >
              <i class="fa fa-plus" />
            </button>
          </div>
          <div class="pt-5">
            {{ form.procedures.length }}
            <procedure-code-item
              v-for="(procedure, i) in form.procedures"
              :key="procedure.id"
              :i="(++i)"
              :procedure="procedure"
              :with-add-button="true"
              :is-parent="true"
              @added="getData"
            />

            <div v-if="form.procedures && form.procedures.length < 1">
              No content.
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>
    <m-add-procedure
      ref="modalAddProcedure"
      :parent-id="parseInt($route.params.id)"
      @added="$router.push('/plugin/play-book/approval/procedure/send')"
    />
    <m-edit-procedure
      ref="modalEditProcedure"
      :procedure-id="parseInt($route.params.id)"
      @added="$router.push('/plugin/play-book/approval/procedure/send')"
    />
    <m-decline-procedure
      ref="modalDeclineProcedure"
      :procedure-id="parseInt($route.params.id)"
      @added="getData()"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPlayBook from '@/views/plugin/play-book/Breadcrumb'
import BreadcrumbProcedure from '@/views/plugin/play-book/procedure/components/Breadcrumb'
import ProcedureCodeItem from './components/ProcedureCodeItem'
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
        note: null,
        procedures: []
      },
      errors: null
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    '$route.params.id' () {
      this.getData()
    }
  },
  mounted () {
    this.getData().then(() => {
      if (this.form.approval_request_to === this.authUser.id && !this.form.declined_at && !this.form.approved_at) {
        if (this.$route.query.action === 'approve') {
          this.approve()
        } else if (this.$route.query.action === 'reject') {
          this.$refs.modalDeclineProcedure.open()
        }
      }
    })
  },
  methods: {
    ...mapActions('pluginPlayBookProcedure', [
      'update', 'show', 'delete'
    ]),
    async getData () {
      try {
        const id = this.$route.params.id
        this.isLoading = true

        const procedure = await this.show(id)
        this.form = { ...procedure }
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
    async approve () {
      this.$alert.confirm(this.$t('approve'), this.$t('are you sure you want to approve this approval?')).then(async response => {
        try {
          const id = this.$route.params.id
          this.isLoading = true

          await this.$store.dispatch('pluginPlayBookProcedureApproval/approve', id)

          if (this.form.approval_action === 'update') {
            this.$router.replace(
              `/plugin/play-book/procedure/${this.form.procedure_pending_id}`
            )
          } else if (this.form.approval_action === 'destroy') {
            this.$alert.success('Delete success', 'This item has been removed.')
              .then(() => {
                this.$router.replace(
                  '/plugin/play-book/procedure/'
                )
              })
          } else {
            this.getData()
          }
        } catch (error) {
        } finally {
          this.isLoading = false
        }
      })
    },
    async submit () {
      try {
        this.errors = null
        this.isSaving = true
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
  }
}
</script>

<style lang="scss">
.row {
  -webkit-user-select: none !important;
  -webkit-touch-callout: none !important;
  user-select: none;
}
</style>
