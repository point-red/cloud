<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link to="/master/warehouse" class="breadcrumb-item">Warehouse</router-link>
      <span class="breadcrumb-item active">{{ warehouse.name | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('warehouse')" :header="true">
        <router-link
          to="/master/warehouse/create"
          v-if="$permission.has('create warehouse')"
          slot="header"
          exact
          class="btn btn-outline-secondary btn-sm mr-5">
          <span><i class="si si-plus"></i> {{ $t('new') | uppercase }}</span>
        </router-link>
        <p-block-inner :is-loading="isLoading">
          <p-form-row
            id="name"
            label="Name"
            name="name"
            v-model="data.name"
            readonly/>

          <hr/>

          <router-link
            :to="{ path: '/master/warehouse/' + warehouse.id + '/edit', params: { id: warehouse.id }}"
            v-if="$permission.has('update warehouse')"
            class="btn btn-sm btn-primary mr-5">
            Edit
          </router-link>
          <button
            type="button"
            @click="onDelete()"
            v-if="$permission.has('delete warehouse')"
            :disabled="isDeleting"
            class="btn btn-sm btn-danger">
            <i v-show="isDeleting" class="fa fa-asterisk fa-spin"/> Delete
          </button>
        </p-block-inner>
      </p-block>
    </div>
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
      title: 'Warehouse',
      isLoading: false,
      isDeleting: false,
      data: {
        name: null
      }
    }
  },
  computed: {
    ...mapGetters('masterWarehouse', ['warehouse'])
  },
  methods: {
    ...mapActions('masterWarehouse', ['find', 'delete']),
    onDelete () {
      this.isDeleting = true
      this.delete({ id: this.id })
        .then(response => {
          this.isDeleting = false
          this.$router.push('/master/warehouse')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this service')
        })
    }
  },
  created () {
    this.isLoading = true
    this.find({ id: this.id })
      .then((response) => {
        this.isLoading = false
        this.data.name = response.data.name
        this.get({
          params: {
            warehouse_id: this.warehouse.id
          }
        }).then(response => {
          this.isLoading = false
        }).catch(error => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
      }, (error) => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
  }
}
</script>
