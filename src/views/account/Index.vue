<template>
  <div>
    <div class="row gutters-tiny">
      <p-box
        name="Profile"
        link="/account/profile"
        icon="si si-user"
      />
      <p-box
        name="Project"
        link="/account/project"
        icon="si si-notebook"
      />
      <p-box
        name="Billing"
        link="/account/billing"
        icon="si si-docs"
      />
      <!-- <p-box
        name="Reward"
        link="/account/reward"
        icon="si si-diamond"/>
      <p-box
        name="Referral"
        link="/account/referral"
        icon="si si-share"/>
      <p-box
        name="Email Subscription"
        link="/account/email-subscription"
        icon="si si-envelope"/> -->
    </div>
    <p-loading-block v-show="isLoading" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('accountProject', ['projects'])
  },
  created () {
    if (this.projects.length == 0) {
      this.isLoading = true
      this.get()
        .then((response) => {
          this.isLoading = false
        }, (error) => {
          this.isLoading = false
          console.log(JSON.stringify(error))
        })
    }
  },
  methods: {
    ...mapActions('accountProject', ['get'])
  }
}
</script>
