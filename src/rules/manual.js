function mapManuals (vuet, path) {
  const { manuals = {} } = vuet._options.modules[path]
  const methods = {}
  Object.keys(manuals).forEach(k => {
    const fn = manuals[k]
    if (typeof fn === 'function') {
      methods[`${k}`] = (...arg) => {
        return fn.apply(methods, [{
          state: vuet.getState(path),
          app: vuet.app,
          vuet: vuet
        }, ...arg])
      }
    }
  })
  methods.reset = (...arg) => {
    return vuet.reset(path, ...arg)
  }
  methods.getState = (...arg) => {
    return vuet.getState(path, ...arg)
  }
  methods.setState = (...arg) => {
    return vuet.setState(path, ...arg)
  }
  methods.fetch = (...arg) => {
    return vuet.fetch(path, ...arg)
  }
  methods.data = (...arg) => {
    return vuet.data(path, ...arg)
  }
  methods.mapManuals = path => {
    return mapManuals(vuet, path)
  }
  return methods
}

export default {
  install (Vue, Vuet) {
    Vuet.prototype.mapManuals = function (path) {
      return mapManuals(this, path)
    }
  },
  rule ({ path, name }) {
    return {
      beforeCreate () {
        const { manuals = {} } = this.$vuet._options.modules[path]
        const newName = name || manuals.name || `$${this.$vuet.names[path]}`
        this[newName] = mapManuals(this.$vuet, path)
      }
    }
  }
}
