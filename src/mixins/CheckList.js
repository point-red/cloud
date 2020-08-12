export default {
  data () {
    return {
      $_checkList_checkedRow: []
    }
  },
  methods: {
    $_checkList_toggleCheckRow (id) {
      if (!this.$_checkList_isRowChecked(id)) {
        this.$data.$_checkList_checkedRow.push({ id })
      } else {
        this.$data.$_checkList_checkedRow.splice(this.$data.$_checkList_checkedRow.map((o) => o.id).indexOf(id), 1)
      }
    },
    $_checkList_toggleCheckRows (data) {
      if (!this.$_checkList_isRowsChecked(data, this.$data.$_checkList_checkedRow)) {
        data.forEach(element => {
          if (!this.$_checkList_isRowChecked(element.id)) {
            const id = element.id
            this.$data.$_checkList_checkedRow.push({ id })
          }
        })
      } else {
        data.forEach(element => {
          this.$data.$_checkList_checkedRow.splice(this.$data.$_checkList_checkedRow.map((o) => o.id).indexOf(element.id), 1)
        })
      }
    },
    $_checkList_isRowChecked (id) {
      return this.$data.$_checkList_checkedRow.some(element => {
        return element.id == id
      })
    },
    $_checkList_isRowsChecked (haystack, needles) {
      if (needles.length == 0) {
        return false
      }
      for (let i = 0; i < haystack.length; i++) {
        const found = needles.some(element => {
          return element.id == haystack[i].id
        })
        if (!found) {
          return false
        }
      }
      return true
    }
  }
}
