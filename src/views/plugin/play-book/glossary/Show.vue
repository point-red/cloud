<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin />
      <breadcrumb-play-book />
      <breadcrumb-glossary />
      <span class="breadcrumb-item active">{{ form.code || $t('SHOW') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="text-right">
            <button
              v-if="$permission.has('create play book glossary')"
              type="button"
              class="btn btn-sm btn-outline-secondary mr-5"
              @click="$refs.modalAddGlossary.open()"
            >
              {{ $t('create') | uppercase }}
            </button>
            <button
              v-if="$permission.has('update play book glossary')"
              type="button"
              class="btn btn-sm btn-outline-secondary mr-5"
              @click="$refs.modalEditGlossary.open()"
            >
              {{ $t('edit') | uppercase }}
            </button>
            <button
              v-if="$permission.has('delete play book glossary')"
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
              class="btn btn-sm btn-outline-secondary"
              :to="`/plugin/play-book/glossary/${form.id}/histories`"
            >
              SEE HISTORY
            </router-link>
          </div>
          <hr>
          <div
            v-if="updateSucess"
            class="alert alert-success"
          >
            Glossary updated
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
                <p-form-input
                  id="code"
                  v-model="form.code"
                  name="code"
                  :placeholder="$t('code') | capitalize"
                  :label="$t('code')"
                  :disabled="!isEditMode"
                  :errors="errors && errors.code"
                />
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
                <p-form-input
                  id="name"
                  v-model="form.name"
                  name="name"
                  :placeholder="$t('name') | capitalize"
                  :label="$t('name')"
                  :disabled="!isEditMode"
                  :errors="errors && errors.name"
                />
              </div>
            </p-form-row>
            <p-form-row
              id="abbreviation"
              name="abbreviation"
              :label="$t('abbreviation')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-input
                  id="abbreviation"
                  v-model="form.abbreviation"
                  name="abbreviation"
                  :placeholder="$t('abbreviation') | capitalize"
                  :label="$t('abbreviation')"
                  :disabled="!isEditMode"
                  :errors="errors && errors.abbreviation"
                />
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
                <textarea
                  id="note"
                  v-model="form.note"
                  name="note"
                  :placeholder="$t('note') | capitalize"
                  class="form-control"
                  :label="$t('note')"
                  :disabled="!isEditMode"
                />
              </div>
            </p-form-row>
            <div
              v-if="isEditMode"
              class="mt-4"
            >
              <button
                type="button"
                class="btn btn-sm btn-light mr-2"
                @click="isEditMode = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-sm btn-primary"
                :disabled="isSaving"
              >
                <i
                  v-show="isSaving"
                  class="fa fa-asterisk fa-spin"
                /> {{ $t('update') | uppercase }}
              </button>
            </div>
          </form>
        </p-block-inner>
      </p-block>
    </div>
    <m-add-glossary
      ref="modalAddGlossary"
      @added="$router.push('/plugin/play-book/glossary')"
    />
    <m-edit-glossary
      ref="modalEditGlossary"
      @added="getData"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPlayBook from '@/views/plugin/play-book/Breadcrumb'
import BreadcrumbGlossary from '@/views/plugin/play-book/glossary/components/Breadcrumb'
import { mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPlugin,
    BreadcrumbPlayBook,
    BreadcrumbGlossary
  },
  data () {
    return {
      isSaving: false,
      isEditMode: false,
      isLoading: false,
      isDeleteing: false,
      updateSucess: false,
      form: {
        code: null,
        name: null,
        abbreviation: null,
        note: null
      },
      errors: null
    }
  },
  watch: {
    isEditMode () {
      this.errors = null
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    ...mapActions('pluginPlayBookGlossary', [
      'update', 'show', 'delete'
    ]),
    async getData () {
      try {
        const id = this.$route.params.id
        this.isLoading = true

        const glossary = await this.show(id)
        this.form = { ...glossary }
      } catch (error) {
      } finally {
        this.isLoading = false
      }
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
          this.$router.push('../glossary')
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
