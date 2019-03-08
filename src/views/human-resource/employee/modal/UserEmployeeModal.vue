<template>
  <div>
    <form class="row">
      <p-modal
        ref="userEmployeeModal"
        :id="id"
        :title="title">
        <template slot="content">
          <div class="list-group mb-20">
            <template v-for="(user_employee, index) in user_employees">
              <a
                :key="index"
                @click="onSubmitUserEmployee(user_employee, index)"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                href="javascript:void(0)">
                  <span><i class="fa fa-fw fa-hand-o-right mr-5"></i> {{ user_employee.first_name + ' ' + user_employee.last_name }}</span>
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
      user_employee: null
    }
  },
  computed: {
    ...mapGetters('UserEmployee', ['user_employees'])
  },
  watch: {
    'user_employee' () {
      this.$emit('value', this.user_employee)
    }
  },
  created () {
    this.get()
  },
  methods: {
    ...mapActions('UserEmployee', ['get']),
    show () {
      this.$refs.userEmployeeModal.show()
    },
    close () {
      this.$refs.userEmployeeModal.close()
    },
    onSubmitUserEmployee (user_employee) {
      this.$emit('add', {
        id: user_employee.id,
        name: user_employee.first_name + ' ' + user_employee.last_name
      })
      this.user_employee = ''
      this.$refs.userEmployeeModal.close()
    }
  }
}
</script>
