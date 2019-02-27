<template>
  <div>
    <breadcrumb>
      <breadcrumb-master/>
      <router-link
        to="/master/customer"
        class="breadcrumb-item">Customer</router-link>
      <span class="breadcrumb-item active">Edit</span>
    </breadcrumb>

    <tab-menu/>

    <h2 class="content-heading">Customer</h2>

    <p-block
      :title="title"
      :is-loading="loading">
      <form
        class="px-30"
        @submit.prevent="onSubmit">
        <p-form-input
          id="name"
          v-model="form.name"
          :errors="form.errors.get('name')"
          label="Name"
          name="name"
          placeholder="Customer Name (required)"
          @errors="form.errors.errors.name = null"/>

        <p-form-input
          id="email"
          v-model="form.email"
          label="Email"
          name="email"
          placeholder="Email"/>

        <div class="form-group row">
          <div class="col-md-9">
            <button
              type="submit"
              class="btn btn-sm btn-primary">Save</button>
          </div>
        </div>
      </form>
    </p-block>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbMaster from '@/views/master/Breadcrumb'
import Form from '@/utils/Form'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbMaster
  },
  data () {
    return {
      title: 'Edit Customer',
      id: this.$route.params.id,
      loading: true,
      form: new Form({
        name: '',
        email: ''
      })
    }
  },
  created () {
    //
  },
  methods: {
    onSubmit () {
      //
    }
  }
}
</script>
