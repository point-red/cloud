<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <router-link
        to="/master/allocation"
        class="breadcrumb-item"
      >
        {{ $t('allocation') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ allocation.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <a
            v-if="$permission.has('create allocation')"
            href="javascript:void(0)"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addAllocation.open()"
          >
            {{ $t('create') | uppercase }}
          </a>
          <a
            v-if="$permission.has('update allocation')"
            href="javascript:void(0)"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.editAllocation.open(allocation.id)"
          >
            {{ $t('edit') | uppercase }}
          </a>
          <button
            v-if="$permission.has('delete allocation')"
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
            v-model="allocation.name"
            label="Name"
            name="name"
            readonly
          />
        </p-block-inner>
      </p-block>
    </div>
    <m-add-allocation
      ref="addAllocation"
      @added="onAddedAllocation($event)"
    />
    <m-edit-allocation
      ref="editAllocation"
      @updated="onUpdatedAllocation($event)"
    />
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters('masterAllocation', ['allocation'])
  },
  created () {
    this.findAllocation()
  },
  methods: {
    ...mapActions('masterAllocation', ['find', 'delete']),
    onAddedAllocation (allocation) {
      this.$router.push('/master/allocation/' + allocation.id)
      this.id = allocation.id
      this.findAllocation()
    },
    onUpdatedAllocation (allocation) {
      this.findAllocation()
    },
    findAllocation () {
      this.isLoading = true
      this.find({ id: this.id })
        .then(response => {
          this.isLoading = false
        }).catch(error => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({ id: this.id })
          .then(response => {
            this.isDeleting = false
            this.$router.push('/master/allocation')
          }).catch(error => {
            this.isDeleting = false
            this.$notification.error('cannot delete this allocation')
          })
      })
    }
  }
}
</script>
