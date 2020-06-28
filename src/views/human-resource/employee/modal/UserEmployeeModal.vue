<template>
  <div>
    <form class="row">
      <p-modal
        :id="id"
        ref="userEmployeeModal"
        :title="title"
      >
        <template slot="content">
          <div class="list-group mb-20">
            <template v-for="(user_employee, index) in user_employees">
              <a
                :key="index"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                href="javascript:void(0)"
                @click="onSubmitUserEmployee(user_employee, index)"
              >
                <span><i class="fa fa-fw fa-hand-o-right mr-5" /> {{ user_employee.first_name + ' ' + user_employee.last_name }}</span>
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
      type: String,
      default: ''
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
    ...mapGetters('humanResourceEmployeeUserEmployee', ['user_employees'])
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
    ...mapActions('humanResourceEmployeeUserEmployee', ['get']),
    show () {
      this.$refs.userEmployeeModal.show()
    },
    close () {
      this.$refs.userEmployeeModal.close()
    },
    onSubmitUserEmployee (userEmployee) {
      this.$emit('add', {
        id: userEmployee.id,
        name: userEmployee.first_name + ' ' + userEmployee.last_name
      })
      this.user_employee = ''
      this.$refs.userEmployeeModal.close()
    }
  }
}
</script>
