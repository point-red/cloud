<template>
  <div>
    <breadcrumb>
      <breadcrumb-plugin></breadcrumb-plugin>
      <breadcrumb-play-book></breadcrumb-play-book>
      <breadcrumb-glossary></breadcrumb-glossary>
      <span class="breadcrumb-item active">{{ form.code || $t('SHOW') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="text-right">
            <button
              type="button"
              @click="$refs.modalAddGlossary.open()"
              v-if="$permission.has('create play book glossary')"
              class="btn btn-sm btn-outline-secondary mr-5">
              {{ $t('create') | uppercase }}
            </button>
            <button
              type="button"
              @click="$refs.modalEditGlossary.open()"
              v-if="$permission.has('update play book glossary')"
              class="btn btn-sm btn-outline-secondary mr-5">
              {{ $t('edit') | uppercase }}
            </button>
            <button
              type="button"
              @click="confirmDelete"
              v-if="$permission.has('delete play book glossary')"
              :disabled="isDeleting"
              class="btn btn-sm btn-outline-secondary mr-5">
              <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> {{ $t('delete') | uppercase }}
            </button>
            <router-link
              class="btn btn-sm btn-outline-secondary"
              :to="`/plugin/play-book/glossary/${form.id}/histories`">
              SEE HISTORY
            </router-link>
          </div>
          <hr>
          <div class="alert alert-success" v-if="updateSucess">
            Glossary updated
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
                <p-form-input
                  id="code"
                  name="code"
                  :placeholder="$t('code') | capitalize"
                  :label="$t('code')"
                  :disabled="!isEditMode"
                  :errors="errors && errors.code"
                  v-model="form.code" />
              </div>
            </p-form-row>
            <p-form-row
              id="name"
              name="name"
              :label="$t('name')">
              <div slot="body" class="col-lg-9">
                <p-form-input
                  id="name"
                  name="name"
                  :placeholder="$t('name') | capitalize"
                  :label="$t('name')"
                  :disabled="!isEditMode"
                  :errors="errors && errors.name"
                  v-model="form.name" />
              </div>
            </p-form-row>
            <p-form-row
              id="abbreviation"
              name="abbreviation"
              :label="$t('abbreviation')">
              <div slot="body" class="col-lg-9">
                <p-form-input
                  id="abbreviation"
                  name="abbreviation"
                  :placeholder="$t('abbreviation') | capitalize"
                  :label="$t('abbreviation')"
                  :disabled="!isEditMode"
                  :errors="errors && errors.abbreviation"
                  v-model="form.abbreviation" />
              </div>
            </p-form-row>
            <p-form-row
              id="note"
              name="note"
              :label="$t('note')">
              <div slot="body" class="col-lg-9">
                <textarea
                  id="note"
                  name="note"
                  :placeholder="$t('note') | capitalize"
                  class="form-control"
                  :label="$t('note')"
                  :disabled="!isEditMode"
                  v-model="form.note"></textarea>
              </div>
            </p-form-row>
            <div class="mt-4" v-if="isEditMode">
              <button type="button" class="btn btn-sm btn-light mr-2" @click="isEditMode = false">Cancel</button>
              <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('update') | uppercase }}
              </button>
            </div>
          </form>
        </p-block-inner>
      </p-block>
    </div>
    <m-add-glossary ref="modalAddGlossary" @added="$router.push('/plugin/play-book/glossary')"></m-add-glossary>
    <m-edit-glossary ref="modalEditGlossary" @added="getData"></m-edit-glossary>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPlugin from '@/views/plugin/Breadcrumb'
import BreadcrumbPlayBook from '@/views/plugin/play-book/Breadcrumb'
import BreadcrumbGlossary from '@/views/plugin/play-book/glossary/components/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

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

        let glossary = await this.show(id)
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
          this.$router.push('../glossary')
        } catch (error) {
        } finally {
          this.isDeleteing = false
          this.isLoading = false
        }
      })
    }
  },
  watch: {
    isEditMode () {
      this.errors = null
    }
  }
}
</script>
