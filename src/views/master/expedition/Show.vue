<template>
  <div>
    <breadcrumb>
      <breadcrumb-master />
      <router-link
        to="/master/expedition"
        class="breadcrumb-item"
      >
        {{ $t('expedition') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ expedition.name | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="text-right">
          <button
            v-if="$permission.has('create expedition')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.addExpedition.open()"
          >
            {{ $t('create') | uppercase }}
          </button>
          <button
            v-if="$permission.has('update expedition')"
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="$refs.editExpedition.open(expedition.id)"
          >
            {{ $t('edit') | uppercase }}
          </button>
          <button
            v-if="$permission.has('delete expedition')"
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
            id="code"
            v-model="code"
            label="Name"
            name="code"
            readonly
          />
          <p-form-row
            id="name"
            v-model="name"
            label="Name"
            name="name"
            readonly
          />
          <p-form-row
            id="email"
            v-model="email"
            label="Email"
            name="email"
            readonly
          />
          <p-form-row
            id="address"
            v-model="address"
            label="Address"
            name="address"
            readonly
          />
          <p-form-row
            id="phone"
            v-model="phone"
            label="Phone"
            name="phone"
            readonly
          />
        </p-block-inner>
      </p-block>
    </div>
    <m-add-expedition
      ref="addExpedition"
      @added="onAddedExpedition($event)"
    />
    <m-edit-expedition
      ref="editExpedition"
      @updated="onUpdatedExpedition($event)"
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
      isDeleting: false,
      code: null,
      name: null,
      email: null,
      address: null,
      phone: null
    }
  },
  computed: {
    ...mapGetters('masterExpedition', ['expedition'])
  },
  created () {
    this.findExpedition()
  },
  methods: {
    ...mapActions('masterExpedition', ['find', 'delete']),
    findExpedition () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          includes: 'addresses;phones;emails'
        }
      }).then(response => {
        this.isLoading = false
        this.code = response.data.code
        this.name = response.data.name
        this.email = response.data.email
        this.address = response.data.address
        this.phone = response.data.phone
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    onAddedExpedition (expedition) {
      this.$router.push('/master/expedition/' + expedition.id)
      this.id = expedition.id
      this.findExpedition()
    },
    onUpdatedExpedition (expedition) {
      this.findExpedition()
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$router.push('/master/expedition')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this expedition')
        })
      })
    }
  }
}
</script>
