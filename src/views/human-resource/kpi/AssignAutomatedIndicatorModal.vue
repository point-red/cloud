<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-modal
        id="assign-automated-indicator-modal"
        ref="assignAutomatedIndicator"
        title="Assign Automated Indicator"
      >
        <template slot="content">
          <div class="list-group mb-20">
            <template v-for="(automatedIndicator, index) in automatedIndicators">
              <a
                :key="index"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                :class="{
                  'active': selectedIndex === index
                }"
                href="javascript:void(0)"
                @click="choose(automatedIndicator, index)"
                @dblclick="chooseAndSubmit(automatedIndicator, index)"
              >
                <span><i class="fa fa-fw fa-hand-o-right mr-5" /> {{ automatedIndicator.label }}</span>
              </a>
            </template>
          </div>
        </template>
        <template slot="footer">
          <div v-if="automatedIndicators.length > 0">
            <button
              type="submit"
              class="btn btn-primary"
            >
              Add
            </button>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger"
            @click="close()"
          >
            {{ $t('close') | uppercase }}
          </button>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      automatedIndicators: [
        { id: '1', label: 'Sales Visitation - Call', indicator: 'C' },
        { id: '2', label: 'Sales Visitation - Effective Call', indicator: 'EC' },
        { id: '3', label: 'Sales Visitation - Value', indicator: 'V' }
      ],
      automated_indicator: '',
      old_automated_indicator: '',
      selectedIndex: null,
      oldSelectedIndex: null
    }
  },
  methods: {
    show (automatedIndicator) {
      if (!automatedIndicator) {
        this.selectedIndex = null
        this.oldSelectedIndex = null
      }

      this.automated_indicator = automatedIndicator
      this.old_automated_indicator = automatedIndicator
      this.$refs.assignAutomatedIndicator.show()
    },
    close () {
      this.automated_indicator = this.old_automated_indicator
      this.selectedIndex = this.oldSelectedIndex
      this.finishSelect()
    },
    choose (automatedIndicator, index) {
      this.automated_indicator = automatedIndicator
      this.selectedIndex = index
    },
    onSubmit () {
      this.finishSelect()
    },
    chooseAndSubmit (automatedIndicator, index) {
      this.choose(automatedIndicator, index)
      this.finishSelect()
    },
    finishSelect () {
      this.oldSelectedIndex = this.selectedIndex
      this.$refs.assignAutomatedIndicator.close()
      this.$emit('assigned', this.automated_indicator)
    }
  }
}
</script>
