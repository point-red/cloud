import FormError from './FormError'

export default class Form {
  /**
   * Create a new Form instance.
   *
   * @param {object} data
   */
  constructor (data) {
    this.originalData = data

    for (const field in data) {
      this[field] = data[field]
    }

    this.errors = new FormError()
  }

  /**
   * Reset the form fields.
   */
  reset () {
    for (const field in this.originalData) {
      if (!this.originalData[field]) this[field] = null
      else this[field] = this.originalData[field]
    }

    this.errors.clear()
  }

  /**
   * Handle a successful form submission.
   *
   * @param {object} data
   */
  onSuccess (data) {
    this.reset()
  }
}
