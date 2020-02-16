<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmit">
      <p-modal
        id="kpi-assessment-category-modal"
        ref="kpiAssessmentCategory"
        title="Assessment Category">
        <template slot="content">
          <div class="list-group mb-20">
            <template v-for="(template, index) in templates" v-if="templates.length > 0">
              <a
                :key="index"
                @click="choose(index)"
                @dblclick="chooseAndSubmit(index)"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                :class="{
                  'active': selectedIndex === index
                }"
                href="javascript:void(0)">
                  <span><i class="fa fa-fw fa-hand-o-right mr-5"></i> {{ template }}</span>
              </a>
            </template>
            <template v-if="templates.length === 0">
              <h5 class="text-center">Assessment Category not found</h5>
            </template>
          </div>
        </template>
        <template slot="footer">
          <div v-if="templates.length > 0">
            <button type="submit" class="btn btn-primary">Change</button>
          </div>
          <button
            type="button"
            class="btn btn-outline-danger"
            @click="$refs.kpiAssessmentCategory.close()">
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
      selectedIndex: null
    }
  },
  props: {
    value: {
      type: [String, Number]
    },
    templates: {
      type: [Array]
    }
  },
  methods: {
    show () {
      this.selectedIndex = 0
      if (this.value) {
        this.selectedIndex = this.value
      }
      this.$refs.kpiAssessmentCategory.show()
    },
    close () {
      this.$refs.kpiAssessmentCategory.close()
    },
    choose (index) {
      this.selectedIndex = index
    },
    onSubmit () {
      this.$emit('input', this.selectedIndex)
      this.close()
    },
    chooseAndSubmit (index) {
      this.choose(index)
      this.onSubmit()
    }
  }
}
</script>
