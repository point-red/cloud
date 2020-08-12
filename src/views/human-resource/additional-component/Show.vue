<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <router-link
        to="/human-resource/additional-component"
        class="breadcrumb-item"
      >
        {{ $t('additional component') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ additionalComponent.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <button
            v-if="$permission.has('create employee salary additional component')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addAdditionalComponent.open()"
          >
            <span>{{ $t('create') | uppercase }}</span>
          </button>
          <button
            v-if="$permission.has('update employee salary additional component')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.editAdditionalComponent.open(additionalComponent)"
          >
            {{ $t('edit') | uppercase }}
          </button>
          <button
            v-if="$permission.has('delete employee salary additional component')"
            type="button"
            :disabled="isDeleting"
            class="btn btn-sm btn-outline-secondary"
            @click="onDelete()"
          >
            <i
              v-show="isDeleting"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('delete') | uppercase }}
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            v-model="additionalComponent.name"
            label="Name"
            name="name"
            readonly
          />
          <p-form-row
            id="weight"
            name="weight"
            :label="$t('weight')"
            readonly
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-form-number
                id="weight"
                v-model="additionalComponent.weight"
                name="weight"
                :is-text-right="false"
                :disabled="true"
                :label="$t('weight')"
              />
            </div>
          </p-form-row>
          <p-form-row
            id="automated-code-name"
            v-model="additionalComponent.automated_code_name"
            label="Source"
            name="automated-code-name"
            readonly
          />
        </p-block-inner>
      </p-block>
    </div>

    <m-add-additional-component
      ref="addAdditionalComponent"
      @added="onAddedAdditionalComponent($event)"
    />
    <m-edit-additional-component
      ref="editAdditionalComponent"
      @updated="onUpdatedAdditionalComponent($event)"
    />
  </div>
</template>

<script>
import TabMenu from '@/views/human-resource/TabMenu'

import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false,
      page: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployeeAdditionalComponent', ['additionalComponent'])
  },
  created () {
    this.findAdditionalComponent()
  },
  methods: {
    ...mapActions('humanResourceEmployeeAdditionalComponent', ['find', 'delete']),
    updatePage (value) {
      this.page = value
    },
    onAddedAdditionalComponent (additionalComponent) {
      this.$router.push('/human-resource/additional-component/' + additionalComponent.id)
      this.id = additionalComponent.id
      this.findAdditionalComponent()
    },
    onUpdatedAdditionalComponent (additionalComponent) {
      this.findAdditionalComponent()
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$router.push('/human-resource/additional-component')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this additional component')
        })
      })
    },
    findAdditionalComponent () {
      this.isLoading = true
      this.find({
        id: this.id
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    }
  }
}
</script>
