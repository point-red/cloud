<template>
  <div>
    <form class="row">
      <p-modal
        ref="scorerModal"
        :id="id"
        :title="title">
        <template slot="content">
          <div class="list-group mb-20">
            <template v-for="(user, index) in users">
              <a
                :key="index"
                @click="onSubmitScorer(user, index)"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                href="javascript:void(0)">
                  <span><i class="fa fa-fw fa-hand-o-right mr-5"></i> {{ user.first_name + ' ' + user.last_name }}</span>
              </a>
            </template>
          </div>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    title: {
      type: String
    },
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      scorer: null
    }
  },
  computed: {
    ...mapGetters('masterUser', ['users'])
  },
  watch: {
    'scorer' () {
      this.$emit('value', this.scorer)
    }
  },
  created () {
    this.get()
  },
  methods: {
    ...mapActions('masterUser', ['get']),
    show () {
      this.$refs.scorerModal.show()
    },
    close () {
      this.$refs.scorerModal.close()
    },
    onSubmitScorer (scorer) {
      this.$emit('add', {
        id: scorer.id,
        name: scorer.first_name + ' ' + scorer.last_name
      })
      this.scorer = ''
      this.$refs.scorerModal.close()
    }
  }
}
</script>
