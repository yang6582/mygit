const _e = Symbol()
class Events {
  constructor () {
    this[_e] = Object.create(null)
  }

  on (eventStr, fn) {
    const _events = this[_e]
    if (Array.isArray(eventStr)) {
      eventStr.forEach(item => {
        this.on(item, fn)
      })
      return
    }
    if (typeof eventStr !== 'string') {
      throw new Error('events name must be a string.')
    }
    if (_events[eventStr]) {
      if (Array.isArray(_events[eventStr])) {
        _events[eventStr].push(fn)
      } else {
        _events[eventStr] = [_events[eventStr], fn]
      }
    } else {
      _events[eventStr] = fn
    }
  }

  emit () {
    const _events = this[_e]
    const eventStr = arguments[0]
    const args = [].slice.call(arguments, 1)
    if (Array.isArray(eventStr)) {
      return eventStr.map(item => {
        return this.emit(item, ...args)
      })
    }
    if (typeof eventStr !== 'string') {
      throw new Error('events name must be a string.')
    }
    if (_events[eventStr]) {
      if (Array.isArray(_events[eventStr])) {
        return _events[eventStr].map(fn => fn(...args))
      } else {
        return _events[eventStr](...args)
      }
    }
  }

  off (eventStr, fn) {
    const _events = this[_e]
    if (Array.isArray(eventStr)) {
      eventStr.forEach(item => {
        this.off(item, fn)
      })
      return
    }
    if (typeof eventStr !== 'string') {
      throw new Error('events name must be a string.')
    }

    if (_events[eventStr]) {
      if (Array.isArray(_events[eventStr]) && !!fn) {
        const index = _events[eventStr].indexOf(fn)
        if (index >= 0) _events[eventStr].splice(index, 1)
      } else {
        _events[eventStr] = null
      }
    }
  }

  once (eventStr, fn) {
    if (Array.isArray(eventStr)) {
      eventStr.forEach(item => {
        this.off(item, fn)
      })
    }
    if (typeof eventStr !== 'string') {
      throw new Error('events name must be a string.')
    }
    const cb = (...args) => {
      const res = fn(...args)
      this.off(eventStr, cb)
      return res
    }

    this.on(eventStr, cb)
  }
}

export default Events
