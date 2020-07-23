export default class FormError {
  /**
   * Create a new Errors instance.
   */
  constructor () {
    this.errors = {}
  }

  /**
   * Determine if an errors exists for the given field.
   *
   * @param {string} field
   */
  has (field) {
    // eslint-disable-next-line no-prototype-builtins
    return this.errors.hasOwnProperty(field)
  }

  /**
   * Determine if we have any errors.
   */
  any () {
    return Object.keys(this.errors).length > 0
  }

  /**
   * Retrieve the error message for a field.
   *
   * @param {string} field
   */
  get (field) {
    if (this.errors !== undefined && this.errors[field]) {
      return this.errors[field]
    }
  }

  /**
   * Set the error message for a field.
   *
   * @param {string} field
   */
  set (field, value) {
    if (this.errors[field]) {
      this.errors[field] = value
    }
  }

  /**
   * Record the new errors.
   *
   * @param {object} errors
   */
  record (errors) {
    this.errors = errors
  }

  /**
   * Clear one or all error fields.
   *
   * @param {string|null} field
   */
  clear (field) {
    if (field) {
      delete this.errors[field]

      return
    }

    this.errors = {}
  }
}
