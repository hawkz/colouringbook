/*
 TweenJS
 Visit http://createjs.com/ for documentation, updates and examples.

 Copyright (c) 2010 gskinner.com, inc.

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
*/
this.createjs = this.createjs || {};
createjs.extend = function(a, c) {
  function b() {
    this.constructor = a
  }
  b.prototype = c.prototype;
  return a.prototype = new b
};
this.createjs = this.createjs || {};
createjs.promote = function(a, c) {
  var b = a.prototype,
    e = Object.getPrototypeOf && Object.getPrototypeOf(b) || b.__proto__;
  if (e) {
    b[(c += "_") + "constructor"] = e.constructor;
    for (var d in e) b.hasOwnProperty(d) && "function" == typeof e[d] && (b[c + d] = e[d])
  }
  return a
};
this.createjs = this.createjs || {};
createjs.deprecate = function(a, c) {
  return function() {
    var b = "Deprecated property or method '" + c + "'. See docs for info.";
    console && (console.warn ? console.warn(b) : console.log(b));
    return a && a.apply(this, arguments)
  }
};
this.createjs = this.createjs || {};
(function() {
  function a(a, e, d) {
    this.type = a;
    this.currentTarget = this.target = null;
    this.eventPhase = 0;
    this.bubbles = !!e;
    this.cancelable = !!d;
    this.timeStamp = (new Date).getTime();
    this.removed = this.immediatePropagationStopped = this.propagationStopped = this.defaultPrevented = !1
  }
  var c = a.prototype;
  c.preventDefault = function() {
    this.defaultPrevented = this.cancelable && !0
  };
  c.stopPropagation = function() {
    this.propagationStopped = !0
  };
  c.stopImmediatePropagation = function() {
    this.immediatePropagationStopped = this.propagationStopped = !0
  };
  c.remove = function() {
    this.removed = !0
  };
  c.clone = function() {
    return new a(this.type, this.bubbles, this.cancelable)
  };
  c.set = function(a) {
    for (var b in a) this[b] = a[b];
    return this
  };
  c.toString = function() {
    return "[Event (type=" + this.type + ")]"
  };
  createjs.Event = a
})();
this.createjs = this.createjs || {};
(function() {
  function a() {
    this._captureListeners = this._listeners = null
  }
  var c = a.prototype;
  a.initialize = function(a) {
    a.addEventListener = c.addEventListener;
    a.on = c.on;
    a.removeEventListener = a.off = c.removeEventListener;
    a.removeAllEventListeners = c.removeAllEventListeners;
    a.hasEventListener = c.hasEventListener;
    a.dispatchEvent = c.dispatchEvent;
    a._dispatchEvent = c._dispatchEvent;
    a.willTrigger = c.willTrigger
  };
  c.addEventListener = function(a, c, d) {
    var b = d ? this._captureListeners = this._captureListeners || {} : this._listeners =
      this._listeners || {};
    var e = b[a];
    e && this.removeEventListener(a, c, d);
    (e = b[a]) ? e.push(c): b[a] = [c];
    return c
  };
  c.on = function(a, c, d, f, g, h) {
    c.handleEvent && (d = d || c, c = c.handleEvent);
    d = d || this;
    return this.addEventListener(a, function(a) {
      c.call(d, a, g);
      f && a.remove()
    }, h)
  };
  c.removeEventListener = function(a, c, d) {
    if (d = d ? this._captureListeners : this._listeners) {
      var b = d[a];
      if (b)
        for (var e = 0, h = b.length; e < h; e++)
          if (b[e] == c) {
            1 == h ? delete d[a] : b.splice(e, 1);
            break
          }
    }
  };
  c.off = c.removeEventListener;
  c.removeAllEventListeners = function(a) {
    a ?
      (this._listeners && delete this._listeners[a], this._captureListeners && delete this._captureListeners[a]) : this._listeners = this._captureListeners = null
  };
  c.dispatchEvent = function(a, c, d) {
    if ("string" == typeof a) {
      var b = this._listeners;
      if (!(c || b && b[a])) return !0;
      a = new createjs.Event(a, c, d)
    } else a.target && a.clone && (a = a.clone());
    try {
      a.target = this
    } catch (g) {}
    if (a.bubbles && this.parent) {
      d = this;
      for (c = [d]; d.parent;) c.push(d = d.parent);
      b = c.length;
      for (d = b - 1; 0 <= d && !a.propagationStopped; d--) c[d]._dispatchEvent(a, 1 + (0 == d));
      for (d = 1; d < b && !a.propagationStopped; d++) c[d]._dispatchEvent(a, 3)
    } else this._dispatchEvent(a, 2);
    return !a.defaultPrevented
  };
  c.hasEventListener = function(a) {
    var b = this._listeners,
      d = this._captureListeners;
    return !!(b && b[a] || d && d[a])
  };
  c.willTrigger = function(a) {
    for (var b = this; b;) {
      if (b.hasEventListener(a)) return !0;
      b = b.parent
    }
    return !1
  };
  c.toString = function() {
    return "[EventDispatcher]"
  };
  c._dispatchEvent = function(a, c) {
    var b, e, g = 2 >= c ? this._captureListeners : this._listeners;
    if (a && g && (e = g[a.type]) && (b = e.length)) {
      try {
        a.currentTarget =
          this
      } catch (l) {}
      try {
        a.eventPhase = c | 0
      } catch (l) {}
      a.removed = !1;
      e = e.slice();
      for (g = 0; g < b && !a.immediatePropagationStopped; g++) {
        var h = e[g];
        h.handleEvent ? h.handleEvent(a) : h(a);
        a.removed && (this.off(a.type, h, 1 == c), a.removed = !1)
      }
    }
    2 === c && this._dispatchEvent(a, 2.1)
  };
  createjs.EventDispatcher = a
})();
this.createjs = this.createjs || {};
(function() {
  function a() {
    throw "Ticker cannot be instantiated.";
  }
  a.RAF_SYNCHED = "synched";
  a.RAF = "raf";
  a.TIMEOUT = "timeout";
  a.timingMode = null;
  a.maxDelta = 0;
  a.paused = !1;
  a.removeEventListener = null;
  a.removeAllEventListeners = null;
  a.dispatchEvent = null;
  a.hasEventListener = null;
  a._listeners = null;
  createjs.EventDispatcher.initialize(a);
  a._addEventListener = a.addEventListener;
  a.addEventListener = function() {
    !a._inited && a.init();
    return a._addEventListener.apply(a, arguments)
  };
  a._inited = !1;
  a._startTime = 0;
  a._pausedTime =
    0;
  a._ticks = 0;
  a._pausedTicks = 0;
  a._interval = 50;
  a._lastTime = 0;
  a._times = null;
  a._tickTimes = null;
  a._timerId = null;
  a._raf = !0;
  a._setInterval = function(b) {
    a._interval = b;
    a._inited && a._setupTick()
  };
  a.setInterval = createjs.deprecate(a._setInterval, "Ticker.setInterval");
  a._getInterval = function() {
    return a._interval
  };
  a.getInterval = createjs.deprecate(a._getInterval, "Ticker.getInterval");
  a._setFPS = function(b) {
    a._setInterval(1E3 / b)
  };
  a.setFPS = createjs.deprecate(a._setFPS, "Ticker.setFPS");
  a._getFPS = function() {
    return 1E3 /
      a._interval
  };
  a.getFPS = createjs.deprecate(a._getFPS, "Ticker.getFPS");
  try {
    Object.defineProperties(a, {
      interval: {
        get: a._getInterval,
        set: a._setInterval
      },
      framerate: {
        get: a._getFPS,
        set: a._setFPS
      }
    })
  } catch (e) {
    console.log(e)
  }
  a.init = function() {
    a._inited || (a._inited = !0, a._times = [], a._tickTimes = [], a._startTime = a._getTime(), a._times.push(a._lastTime = 0), a.interval = a._interval)
  };
  a.reset = function() {
    if (a._raf) {
      var b = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame;
      b && b(a._timerId)
    } else clearTimeout(a._timerId);
    a.removeAllEventListeners("tick");
    a._timerId = a._times = a._tickTimes = null;
    a._startTime = a._lastTime = a._ticks = a._pausedTime = 0;
    a._inited = !1
  };
  a.getMeasuredTickTime = function(b) {
    var d = 0,
      c = a._tickTimes;
    if (!c || 1 > c.length) return -1;
    b = Math.min(c.length, b || a._getFPS() | 0);
    for (var g = 0; g < b; g++) d += c[g];
    return d / b
  };
  a.getMeasuredFPS = function(b) {
    var d = a._times;
    if (!d || 2 > d.length) return -1;
    b = Math.min(d.length - 1, b || a._getFPS() | 0);
    return 1E3 / ((d[0] -
      d[b]) / b)
  };
  a.getTime = function(b) {
    return a._startTime ? a._getTime() - (b ? a._pausedTime : 0) : -1
  };
  a.getEventTime = function(b) {
    return a._startTime ? (a._lastTime || a._startTime) - (b ? a._pausedTime : 0) : -1
  };
  a.getTicks = function(b) {
    return a._ticks - (b ? a._pausedTicks : 0)
  };
  a._handleSynch = function() {
    a._timerId = null;
    a._setupTick();
    a._getTime() - a._lastTime >= .97 * (a._interval - 1) && a._tick()
  };
  a._handleRAF = function() {
    a._timerId = null;
    a._setupTick();
    a._tick()
  };
  a._handleTimeout = function() {
    a._timerId = null;
    a._setupTick();
    a._tick()
  };
  a._setupTick =
    function() {
      if (null == a._timerId) {
        var b = a.timingMode;
        if (b == a.RAF_SYNCHED || b == a.RAF) {
          var d = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
          if (d) {
            a._timerId = d(b == a.RAF ? a._handleRAF : a._handleSynch);
            a._raf = !0;
            return
          }
        }
        a._raf = !1;
        a._timerId = setTimeout(a._handleTimeout, a._interval)
      }
    };
  a._tick = function() {
    var b = a.paused,
      d = a._getTime(),
      c = d - a._lastTime;
    a._lastTime = d;
    a._ticks++;
    b && (a._pausedTicks++, a._pausedTime +=
      c);
    if (a.hasEventListener("tick")) {
      var g = new createjs.Event("tick"),
        h = a.maxDelta;
      g.delta = h && c > h ? h : c;
      g.paused = b;
      g.time = d;
      g.runTime = d - a._pausedTime;
      a.dispatchEvent(g)
    }
    for (a._tickTimes.unshift(a._getTime() - d); 100 < a._tickTimes.length;) a._tickTimes.pop();
    for (a._times.unshift(d); 100 < a._times.length;) a._times.pop()
  };
  var c = window,
    b = c.performance.now || c.performance.mozNow || c.performance.msNow || c.performance.oNow || c.performance.webkitNow;
  a._getTime = function() {
    return (b && b.call(c.performance) || (new Date).getTime()) -
      a._startTime
  };
  createjs.Ticker = a
})();
this.createjs = this.createjs || {};
(function() {
  function a(a) {
    this.EventDispatcher_constructor();
    this.ignoreGlobalPause = !1;
    this.loop = 0;
    this.bounce = this.reversed = this.useTicks = !1;
    this.timeScale = 1;
    this.position = this.duration = 0;
    this.rawPosition = -1;
    this._paused = !0;
    this._labelList = this._labels = this._parent = this._prev = this._next = null;
    a && (this.useTicks = !!a.useTicks, this.ignoreGlobalPause = !!a.ignoreGlobalPause, this.loop = !0 === a.loop ? -1 : a.loop || 0, this.reversed = !!a.reversed, this.bounce = !!a.bounce, this.timeScale = a.timeScale || 1, a.onChange && this.addEventListener("change",
      a.onChange), a.onComplete && this.addEventListener("complete", a.onComplete))
  }
  var c = createjs.extend(a, createjs.EventDispatcher);
  c._setPaused = function(a) {
    createjs.Tween._register(this, a);
    return this
  };
  c.setPaused = createjs.deprecate(c._setPaused, "AbstractTween.setPaused");
  c._getPaused = function() {
    return this._paused
  };
  c.getPaused = createjs.deprecate(c._getPaused, "AbstactTween.getPaused");
  c._getCurrentLabel = function(a) {
    var b = this.getLabels();
    null == a && (a = this.position);
    for (var c = 0, f = b.length; c < f && !(a < b[c].position); c++);
    return 0 === c ? null : b[c - 1].label
  };
  c.getCurrentLabel = createjs.deprecate(c._getCurrentLabel, "AbstractTween.getCurrentLabel");
  try {
    Object.defineProperties(c, {
      paused: {
        set: c._setPaused,
        get: c._getPaused
      },
      currentLabel: {
        get: c._getCurrentLabel
      }
    })
  } catch (b) {}
  c.advance = function(a, c) {
    this.setPosition(this.rawPosition + a * this.timeScale, c)
  };
  c.setPosition = function(a, c, d, f) {
    var b = this.duration,
      e = this.loop,
      l = this.rawPosition,
      k = 0;
    0 > a && (a = 0);
    if (0 === b) {
      var n = !0;
      if (-1 !== l) return n
    } else {
      var q = a / b | 0;
      k = a - q * b;
      (n = -1 !== e && a >= e *
        b + b) && (a = (k = b) * (q = e) + b);
      if (a === l) return n;
      !this.reversed !== !(this.bounce && q % 2) && (k = b - k)
    }
    this.position = k;
    this.rawPosition = a;
    this._updatePosition(d, n);
    n && (this.paused = !0);
    f && f(this);
    c || this._runActions(l, a, d, !d && -1 === l);
    this.dispatchEvent("change");
    n && this.dispatchEvent("complete")
  };
  c.calculatePosition = function(a) {
    var b = this.duration,
      c = this.loop,
      f = 0;
    if (0 === b) return 0; - 1 !== c && a >= c * b + b ? (a = b, f = c) : 0 > a ? a = 0 : (f = a / b | 0, a -= f * b);
    return !this.reversed !== !(this.bounce && f % 2) ? b - a : a
  };
  c.getLabels = function() {
    var a = this._labelList;
    if (!a) {
      a = this._labelList = [];
      var c = this._labels,
        d;
      for (d in c) a.push({
        label: d,
        position: c[d]
      });
      a.sort(function(a, b) {
        return a.position - b.position
      })
    }
    return a
  };
  c.setLabels = function(a) {
    this._labels = a;
    this._labelList = null
  };
  c.addLabel = function(a, c) {
    this._labels || (this._labels = {});
    this._labels[a] = c;
    var b = this._labelList;
    if (b) {
      for (var f = 0, g = b.length; f < g && !(c < b[f].position); f++);
      b.splice(f, 0, {
        label: a,
        position: c
      })
    }
  };
  c.gotoAndPlay = function(a) {
    this.paused = !1;
    this._goto(a)
  };
  c.gotoAndStop = function(a) {
    this.paused = !0;
    this._goto(a)
  };
  c.resolve = function(a) {
    var b = Number(a);
    isNaN(b) && (b = this._labels && this._labels[a]);
    return b
  };
  c.toString = function() {
    return "[AbstractTween]"
  };
  c.clone = function() {
    throw "AbstractTween can not be cloned.";
  };
  c._init = function(a) {
    a && a.paused || (this.paused = !1);
    a && null != a.position && this.setPosition(a.position)
  };
  c._updatePosition = function(a, c) {};
  c._goto = function(a) {
    a = this.resolve(a);
    null != a && this.setPosition(a, !1, !0)
  };
  c._runActions = function(a, c, d, f) {
    if (this._actionHead || this.tweens) {
      var b = this.duration,
        e = this.reversed,
        l = this.bounce,
        k = this.loop,
        n, q, r;
      if (0 === b) {
        var m = n = q = r = 0;
        e = l = !1
      } else m = a / b | 0, n = c / b | 0, q = a - m * b, r = c - n * b; - 1 !== k && (n > k && (r = b, n = k), m > k && (q = b, m = k));
      if (d) return this._runActionsRange(r, r, d, f);
      if (m !== n || q !== r || d || f) {
        -1 === m && (m = q = 0);
        a = a <= c;
        c = m;
        do {
          k = c === m ? q : a ? 0 : b;
          var w = c === n ? r : a ? b : 0;
          !e !== !(l && c % 2) && (k = b - k, w = b - w);
          if ((!l || c === m || k !== w) && this._runActionsRange(k, w, d, f || c !== m && !l)) return !0;
          f = !1
        } while (a && ++c <= n || !a && --c >= n)
      }
    }
  };
  c._runActionsRange = function(a, c, d, f) {};
  createjs.AbstractTween = createjs.promote(a,
    "EventDispatcher")
})();
this.createjs = this.createjs || {};
(function() {
  function a(b, f) {
    this.AbstractTween_constructor(f);
    this.pluginData = null;
    this.target = b;
    this.passive = !1;
    this._stepTail = this._stepHead = new c(null, 0, 0, {}, null, !0);
    this._stepPosition = 0;
    this._injected = this._pluginIds = this._plugins = this._actionTail = this._actionHead = null;
    f && (this.pluginData = f.pluginData, f.override && a.removeTweens(b));
    this.pluginData || (this.pluginData = {});
    this._init(f)
  }

  function c(a, b, c, e, l, k) {
    this.next = null;
    this.prev = a;
    this.t = b;
    this.d = c;
    this.props = e;
    this.ease = l;
    this.passive = k;
    this.index =
      a ? a.index + 1 : 0
  }

  function b(a, b, c, e, l) {
    this.next = null;
    this.prev = a;
    this.t = b;
    this.d = 0;
    this.scope = c;
    this.funct = e;
    this.params = l
  }
  var e = createjs.extend(a, createjs.AbstractTween);
  a.IGNORE = {};
  a._tweens = [];
  a._plugins = null;
  a._tweenHead = null;
  a._tweenTail = null;
  a.get = function(b, c) {
    return new a(b, c)
  };
  a.tick = function(b, c) {
    for (var d = a._tweenHead; d;) {
      var f = d._next;
      c && !d.ignoreGlobalPause || d._paused || d.advance(d.useTicks ? 1 : b);
      d = f
    }
  };
  a.handleEvent = function(a) {
    "tick" === a.type && this.tick(a.delta, a.paused)
  };
  a.removeTweens =
    function(b) {
      if (b.tweenjs_count) {
        for (var c = a._tweenHead; c;) {
          var d = c._next;
          c.target === b && a._register(c, !0);
          c = d
        }
        b.tweenjs_count = 0
      }
    };
  a.removeAllTweens = function() {
    for (var b = a._tweenHead; b;) {
      var c = b._next;
      b._paused = !0;
      b.target && (b.target.tweenjs_count = 0);
      b._next = b._prev = null;
      b = c
    }
    a._tweenHead = a._tweenTail = null
  };
  a.hasActiveTweens = function(b) {
    return b ? !!b.tweenjs_count : !!a._tweenHead
  };
  a._installPlugin = function(b) {
    for (var c = b.priority = b.priority || 0, d = a._plugins = a._plugins || [], e = 0, l = d.length; e < l && !(c < d[e].priority); e++);
    d.splice(e, 0, b)
  };
  a._register = function(b, c) {
    var d = b.target;
    if (!c && b._paused) d && (d.tweenjs_count = d.tweenjs_count ? d.tweenjs_count + 1 : 1), (d = a._tweenTail) ? (a._tweenTail = d._next = b, b._prev = d) : a._tweenHead = a._tweenTail = b, !a._inited && createjs.Ticker && (createjs.Ticker.addEventListener("tick", a), a._inited = !0);
    else if (c && !b._paused) {
      d && d.tweenjs_count--;
      d = b._next;
      var e = b._prev;
      d ? d._prev = e : a._tweenTail = e;
      e ? e._next = d : a._tweenHead = d;
      b._next = b._prev = null
    }
    b._paused = c
  };
  e.wait = function(a, b) {
    0 < a && this._addStep(+a, this._stepTail.props,
      null, b);
    return this
  };
  e.to = function(a, b, c) {
    if (null == b || 0 > b) b = 0;
    b = this._addStep(+b, null, c);
    this._appendProps(a, b);
    return this
  };
  e.label = function(a) {
    this.addLabel(a, this.duration);
    return this
  };
  e.call = function(a, b, c) {
    return this._addAction(c || this.target, a, b || [this])
  };
  e.set = function(a, b) {
    return this._addAction(b || this.target, this._set, [a])
  };
  e.play = function(a) {
    return this._addAction(a || this, this._set, [{
      paused: !1
    }])
  };
  e.pause = function(a) {
    return this._addAction(a || this, this._set, [{
      paused: !0
    }])
  };
  e.w = e.wait;
  e.t = e.to;
  e.c = e.call;
  e.s = e.set;
  e.toString = function() {
    return "[Tween]"
  };
  e.clone = function() {
    throw "Tween can not be cloned.";
  };
  e._addPlugin = function(a) {
    var b = this._pluginIds || (this._pluginIds = {}),
      c = a.ID;
    if (c && !b[c]) {
      b[c] = !0;
      b = this._plugins || (this._plugins = []);
      c = a.priority || 0;
      for (var d = 0, e = b.length; d < e; d++)
        if (c < b[d].priority) {
          b.splice(d, 0, a);
          return
        } b.push(a)
    }
  };
  e._updatePosition = function(a, b) {
    var c = this._stepHead.next,
      d = this.position,
      e = this.duration;
    if (this.target && c) {
      for (var f = c.next; f && f.t <= d;) c = c.next,
        f = c.next;
      this._updateTargetProps(c, b ? 0 === e ? 1 : d / e : (d - c.t) / c.d, b)
    }
    this._stepPosition = c ? d - c.t : 0
  };
  e._updateTargetProps = function(b, c, e) {
    if (!(this.passive = !!b.passive)) {
      var d, f = b.prev.props,
        g = b.props;
      if (d = b.ease) c = d(c, 0, 1, 1);
      d = this._plugins;
      var n;
      a: for (n in f) {
        var q = f[n];
        var r = g[n];
        q = q !== r && "number" === typeof q ? q + (r - q) * c : 1 <= c ? r : q;
        if (d) {
          r = 0;
          for (var m = d.length; r < m; r++) {
            var w = d[r].change(this, b, n, q, c, e);
            if (w === a.IGNORE) continue a;
            void 0 !== w && (q = w)
          }
        }
        this.target[n] = q
      }
    }
  };
  e._runActionsRange = function(a, b, c, e) {
    var d =
      (c = a > b) ? this._actionTail : this._actionHead,
      f = b,
      g = a;
    c && (f = a, g = b);
    for (var h = this.position; d;) {
      var r = d.t;
      if (r === b || r > g && r < f || e && r === a)
        if (d.funct.apply(d.scope, d.params), h !== this.position) return !0;
      d = c ? d.prev : d.next
    }
  };
  e._appendProps = function(b, c, e) {
    var d = this._stepHead.props,
      f = this.target,
      g = a._plugins,
      n, q, r = c.prev,
      m = r.props,
      w = c.props || (c.props = this._cloneProps(m)),
      z = {};
    for (n in b)
      if (b.hasOwnProperty(n) && (z[n] = w[n] = b[n], void 0 === d[n])) {
        var y = void 0;
        if (g)
          for (q = g.length - 1; 0 <= q; q--) {
            var p = g[q].init(this, n,
              y);
            void 0 !== p && (y = p);
            if (y === a.IGNORE) {
              delete w[n];
              delete z[n];
              break
            }
          }
        y !== a.IGNORE && (void 0 === y && (y = f[n]), m[n] = void 0 === y ? null : y)
      } for (n in z) {
      var t;
      for (b = r;
        (t = b) && (b = t.prev);)
        if (b.props !== t.props) {
          if (void 0 !== b.props[n]) break;
          b.props[n] = m[n]
        }
    }
    if (!1 !== e && (g = this._plugins))
      for (q = g.length - 1; 0 <= q; q--) g[q].step(this, c, z);
    if (e = this._injected) this._injected = null, this._appendProps(e, c, !1)
  };
  e._injectProp = function(a, b) {
    (this._injected || (this._injected = {}))[a] = b
  };
  e._addStep = function(a, b, e, h) {
    b = new c(this._stepTail,
      this.duration, a, b, e, h || !1);
    this.duration += a;
    return this._stepTail = this._stepTail.next = b
  };
  e._addAction = function(a, c, e) {
    a = new b(this._actionTail, this.duration, a, c, e);
    this._actionTail ? this._actionTail.next = a : this._actionHead = a;
    this._actionTail = a;
    return this
  };
  e._set = function(a) {
    for (var b in a) this[b] = a[b]
  };
  e._cloneProps = function(a) {
    var b = {},
      c;
    for (c in a) b[c] = a[c];
    return b
  };
  createjs.Tween = createjs.promote(a, "AbstractTween")
})();
this.createjs = this.createjs || {};
(function() {
  function a(a) {
    if (a instanceof Array || null == a && 1 < arguments.length) {
      var b = a;
      var c = arguments[1];
      a = arguments[2]
    } else a && (b = a.tweens, c = a.labels);
    this.AbstractTween_constructor(a);
    this.tweens = [];
    b && this.addTween.apply(this, b);
    this.setLabels(c);
    this._init(a)
  }
  var c = createjs.extend(a, createjs.AbstractTween);
  c.addTween = function(a) {
    a._parent && a._parent.removeTween(a);
    var b = arguments.length;
    if (1 < b) {
      for (var c = 0; c < b; c++) this.addTween(arguments[c]);
      return arguments[b - 1]
    }
    if (0 === b) return null;
    this.tweens.push(a);
    a._parent = this;
    a.paused = !0;
    b = a.duration;
    0 < a.loop && (b *= a.loop + 1);
    b > this.duration && (this.duration = b);
    0 <= this.rawPosition && a.setPosition(this.rawPosition);
    return a
  };
  c.removeTween = function(a) {
    var b = arguments.length;
    if (1 < b) {
      for (var c = !0, f = 0; f < b; f++) c = c && this.removeTween(arguments[f]);
      return c
    }
    if (0 === b) return !0;
    b = this.tweens;
    for (f = b.length; f--;)
      if (b[f] === a) return b.splice(f, 1), a._parent = null, a.duration >= this.duration && this.updateDuration(), !0;
    return !1
  };
  c.updateDuration = function() {
    for (var a = this.duration =
        0, c = this.tweens.length; a < c; a++) {
      var d = this.tweens[a],
        f = d.duration;
      0 < d.loop && (f *= d.loop + 1);
      f > this.duration && (this.duration = f)
    }
  };
  c.toString = function() {
    return "[Timeline]"
  };
  c.clone = function() {
    throw "Timeline can not be cloned.";
  };
  c._updatePosition = function(a, c) {
    for (var b = this.position, e = 0, g = this.tweens.length; e < g; e++) this.tweens[e].setPosition(b, !0, a)
  };
  c._runActionsRange = function(a, c, d, f) {
    for (var b = this.position, e = 0, l = this.tweens.length; e < l; e++)
      if (this.tweens[e]._runActions(a, c, d, f), b !== this.position) return !0
  };
  createjs.Timeline = createjs.promote(a, "AbstractTween")
})();
this.createjs = this.createjs || {};
(function() {
  function a() {
    throw "Ease cannot be instantiated.";
  }
  a.linear = function(a) {
    return a
  };
  a.none = a.linear;
  a.get = function(a) {
    -1 > a ? a = -1 : 1 < a && (a = 1);
    return function(b) {
      return 0 == a ? b : 0 > a ? b * (b * -a + 1 + a) : b * ((2 - b) * a + (1 - a))
    }
  };
  a.getPowIn = function(a) {
    return function(b) {
      return Math.pow(b, a)
    }
  };
  a.getPowOut = function(a) {
    return function(b) {
      return 1 - Math.pow(1 - b, a)
    }
  };
  a.getPowInOut = function(a) {
    return function(b) {
      return 1 > (b *= 2) ? .5 * Math.pow(b, a) : 1 - .5 * Math.abs(Math.pow(2 - b, a))
    }
  };
  a.quadIn = a.getPowIn(2);
  a.quadOut = a.getPowOut(2);
  a.quadInOut = a.getPowInOut(2);
  a.cubicIn = a.getPowIn(3);
  a.cubicOut = a.getPowOut(3);
  a.cubicInOut = a.getPowInOut(3);
  a.quartIn = a.getPowIn(4);
  a.quartOut = a.getPowOut(4);
  a.quartInOut = a.getPowInOut(4);
  a.quintIn = a.getPowIn(5);
  a.quintOut = a.getPowOut(5);
  a.quintInOut = a.getPowInOut(5);
  a.sineIn = function(a) {
    return 1 - Math.cos(a * Math.PI / 2)
  };
  a.sineOut = function(a) {
    return Math.sin(a * Math.PI / 2)
  };
  a.sineInOut = function(a) {
    return -.5 * (Math.cos(Math.PI * a) - 1)
  };
  a.getBackIn = function(a) {
    return function(b) {
      return b * b * ((a + 1) * b - a)
    }
  };
  a.backIn = a.getBackIn(1.7);
  a.getBackOut = function(a) {
    return function(b) {
      return --b * b * ((a + 1) * b + a) + 1
    }
  };
  a.backOut = a.getBackOut(1.7);
  a.getBackInOut = function(a) {
    a *= 1.525;
    return function(b) {
      return 1 > (b *= 2) ? .5 * b * b * ((a + 1) * b - a) : .5 * ((b -= 2) * b * ((a + 1) * b + a) + 2)
    }
  };
  a.backInOut = a.getBackInOut(1.7);
  a.circIn = function(a) {
    return -(Math.sqrt(1 - a * a) - 1)
  };
  a.circOut = function(a) {
    return Math.sqrt(1 - --a * a)
  };
  a.circInOut = function(a) {
    return 1 > (a *= 2) ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
  };
  a.bounceIn = function(c) {
    return 1 -
      a.bounceOut(1 - c)
  };
  a.bounceOut = function(a) {
    return a < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
  };
  a.bounceInOut = function(c) {
    return .5 > c ? .5 * a.bounceIn(2 * c) : .5 * a.bounceOut(2 * c - 1) + .5
  };
  a.getElasticIn = function(a, b) {
    var c = 2 * Math.PI;
    return function(d) {
      if (0 == d || 1 == d) return d;
      var e = b / c * Math.asin(1 / a);
      return -(a * Math.pow(2, 10 * --d) * Math.sin((d - e) * c / b))
    }
  };
  a.elasticIn = a.getElasticIn(1, .3);
  a.getElasticOut = function(a, b) {
    var c = 2 * Math.PI;
    return function(d) {
      return 0 == d || 1 == d ? d : a * Math.pow(2, -10 * d) * Math.sin((d - b / c * Math.asin(1 / a)) * c / b) + 1
    }
  };
  a.elasticOut = a.getElasticOut(1, .3);
  a.getElasticInOut = function(a, b) {
    var c = 2 * Math.PI;
    return function(d) {
      var e = b / c * Math.asin(1 / a);
      return 1 > (d *= 2) ? -.5 * a * Math.pow(2, 10 * --d) * Math.sin((d - e) * c / b) : a * Math.pow(2, -10 * --d) * Math.sin((d - e) * c / b) * .5 + 1
    }
  };
  a.elasticInOut = a.getElasticInOut(1, .3 * 1.5);
  createjs.Ease = a
})();
this.createjs = this.createjs || {};
(function() {
  function a() {
    throw "MotionGuidePlugin cannot be instantiated.";
  }
  a.priority = 0;
  a.ID = "MotionGuide";
  a.install = function() {
    createjs.Tween._installPlugin(a);
    return createjs.Tween.IGNORE
  };
  a.init = function(c, b, e) {
    "guide" == b && c._addPlugin(a)
  };
  a.step = function(c, b, e) {
    for (var d in e)
      if ("guide" === d) {
        var f = b.props.guide,
          g = a._solveGuideData(e.guide, f);
        f.valid = !g;
        var h = f.endData;
        c._injectProp("x", h.x);
        c._injectProp("y", h.y);
        if (g || !f.orient) break;
        f.startOffsetRot = (void 0 === b.prev.props.rotation ? c.target.rotation ||
          0 : b.prev.props.rotation) - f.startData.rotation;
        if ("fixed" == f.orient) f.endAbsRot = h.rotation + f.startOffsetRot, f.deltaRotation = 0;
        else {
          g = void 0 === e.rotation ? c.target.rotation || 0 : e.rotation;
          h = g - f.endData.rotation - f.startOffsetRot;
          var l = h % 360;
          f.endAbsRot = g;
          switch (f.orient) {
            case "auto":
              f.deltaRotation = h;
              break;
            case "cw":
              f.deltaRotation = (l + 360) % 360 + 360 * Math.abs(h / 360 | 0);
              break;
            case "ccw":
              f.deltaRotation = (l - 360) % 360 + -360 * Math.abs(h / 360 | 0)
          }
        }
        c._injectProp("rotation", f.endAbsRot)
      }
  };
  a.change = function(c, b, e, d, f, g) {
    if ((d =
        b.props.guide) && b.props !== b.prev.props && d !== b.prev.props.guide) {
      if ("guide" === e && !d.valid || "x" == e || "y" == e || "rotation" === e && d.orient) return createjs.Tween.IGNORE;
      a._ratioToPositionData(f, d, c.target)
    }
  };
  a.debug = function(c, b, e) {
    c = c.guide || c;
    var d = a._findPathProblems(c);
    d && console.error("MotionGuidePlugin Error found: \n" + d);
    if (!b) return d;
    var f, g = c.path,
      h = g.length;
    b.save();
    b.lineCap = "round";
    b.lineJoin = "miter";
    b.beginPath();
    b.moveTo(g[0], g[1]);
    for (f = 2; f < h; f += 4) b.quadraticCurveTo(g[f], g[f + 1], g[f + 2], g[f +
      3]);
    b.strokeStyle = "black";
    b.lineWidth = 4.5;
    b.stroke();
    b.strokeStyle = "white";
    b.lineWidth = 3;
    b.stroke();
    b.closePath();
    g = e.length;
    if (e && g) {
      h = {};
      var l = {};
      a._solveGuideData(c, h);
      for (f = 0; f < g; f++) h.orient = "fixed", a._ratioToPositionData(e[f], h, l), b.beginPath(), b.moveTo(l.x, l.y), b.lineTo(l.x + 9 * Math.cos(.0174533 * l.rotation), l.y + 9 * Math.sin(.0174533 * l.rotation)), b.strokeStyle = "black", b.lineWidth = 4.5, b.stroke(), b.strokeStyle = "red", b.lineWidth = 3, b.stroke(), b.closePath()
    }
    b.restore();
    return d
  };
  a._solveGuideData = function(c,
    b) {
    var e;
    if (e = a.debug(c)) return e;
    var d = b.path = c.path;
    b.orient = c.orient;
    b.subLines = [];
    b.totalLength = 0;
    b.startOffsetRot = 0;
    b.deltaRotation = 0;
    b.startData = {
      ratio: 0
    };
    b.endData = {
      ratio: 1
    };
    b.animSpan = 1;
    var f = d.length,
      g, h = {};
    var l = d[0];
    var k = d[1];
    for (e = 2; e < f; e += 4) {
      var n = d[e];
      var q = d[e + 1];
      var r = d[e + 2];
      var m = d[e + 3];
      var w = {
          weightings: [],
          estLength: 0,
          portion: 0
        },
        z = l;
      var y = k;
      for (g = 1; 10 >= g; g++) a._getParamsForCurve(l, k, n, q, r, m, g / 10, !1, h), z = h.x - z, y = h.y - y, y = Math.sqrt(z * z + y * y), w.weightings.push(y), w.estLength += y, z = h.x,
        y = h.y;
      b.totalLength += w.estLength;
      for (g = 0; 10 > g; g++) y = w.estLength, w.weightings[g] /= y;
      b.subLines.push(w);
      l = r;
      k = m
    }
    y = b.totalLength;
    d = b.subLines.length;
    for (e = 0; e < d; e++) b.subLines[e].portion = b.subLines[e].estLength / y;
    e = isNaN(c.start) ? 0 : c.start;
    d = isNaN(c.end) ? 1 : c.end;
    a._ratioToPositionData(e, b, b.startData);
    a._ratioToPositionData(d, b, b.endData);
    b.startData.ratio = e;
    b.endData.ratio = d;
    b.animSpan = b.endData.ratio - b.startData.ratio
  };
  a._ratioToPositionData = function(c, b, e) {
    var d = b.subLines,
      f, g = 0,
      h = c * b.animSpan + b.startData.ratio;
    var l = d.length;
    for (f = 0; f < l; f++) {
      var k = d[f].portion;
      if (g + k >= h) {
        var n = f;
        break
      }
      g += k
    }
    void 0 === n && (n = l - 1, g -= k);
    d = d[n].weightings;
    var q = k;
    l = d.length;
    for (f = 0; f < l; f++) {
      k = d[f] * q;
      if (g + k >= h) break;
      g += k
    }
    n = 4 * n + 2;
    l = b.path;
    a._getParamsForCurve(l[n - 2], l[n - 1], l[n], l[n + 1], l[n + 2], l[n + 3], f / 10 + (h - g) / k * .1, b.orient, e);
    b.orient && (e.rotation = .99999 <= c && 1.00001 >= c && void 0 !== b.endAbsRot ? b.endAbsRot : e.rotation + (b.startOffsetRot + c * b.deltaRotation));
    return e
  };
  a._getParamsForCurve = function(a, b, e, d, f, g, h, l, k) {
    var c = 1 - h;
    k.x = c * c * a +
      2 * c * h * e + h * h * f;
    k.y = c * c * b + 2 * c * h * d + h * h * g;
    l && (k.rotation = 57.2957795 * Math.atan2((d - b) * c + (g - d) * h, (e - a) * c + (f - e) * h))
  };
  a._findPathProblems = function(a) {
    var b = a.path,
      c = b && b.length || 0;
    if (6 > c || (c - 2) % 4) return "\tCannot parse 'path' array due to invalid number of entries in path. There should be an odd number of points, at least 3 points, and 2 entries per point (x & y). See 'CanvasRenderingContext2D.quadraticCurveTo' for details as 'path' models a quadratic bezier.\n\n" + ("Only [ " + c + " ] values found. Expected: " +
      Math.max(4 * Math.ceil((c - 2) / 4) + 2, 6));
    for (var d = 0; d < c; d++)
      if (isNaN(b[d])) return "All data in path array must be numeric";
    b = a.start;
    if (isNaN(b) && void 0 !== b) return "'start' out of bounds. Expected 0 to 1, got: " + b;
    b = a.end;
    if (isNaN(b) && void 0 !== b) return "'end' out of bounds. Expected 0 to 1, got: " + b;
    if ((a = a.orient) && "fixed" != a && "auto" != a && "cw" != a && "ccw" != a) return 'Invalid orientation value. Expected ["fixed", "auto", "cw", "ccw", undefined], got: ' + a
  };
  createjs.MotionGuidePlugin = a
})();
this.createjs = this.createjs || {};
(function() {
  var a = createjs.TweenJS = createjs.TweenJS || {};
  a.version = "1.0.0";
  a.buildDate = "Thu, 14 Sep 2017 19:47:47 GMT"
})();
(function() {
  var a = "undefined" !== typeof window && "undefined" !== typeof window.document ? window.document : {},
    c = "undefined" !== typeof module && module.exports,
    b = "undefined" !== typeof Element && "ALLOW_KEYBOARD_INPUT" in Element,
    e = function() {
      for (var b, c = ["requestFullscreen exitFullscreen fullscreenElement fullscreenEnabled fullscreenchange fullscreenerror".split(" "), "webkitRequestFullscreen webkitExitFullscreen webkitFullscreenElement webkitFullscreenEnabled webkitfullscreenchange webkitfullscreenerror".split(" "),
          "webkitRequestFullScreen webkitCancelFullScreen webkitCurrentFullScreenElement webkitCancelFullScreen webkitfullscreenchange webkitfullscreenerror".split(" "), "mozRequestFullScreen mozCancelFullScreen mozFullScreenElement mozFullScreenEnabled mozfullscreenchange mozfullscreenerror".split(" "), "msRequestFullscreen msExitFullscreen msFullscreenElement msFullscreenEnabled MSFullscreenChange MSFullscreenError".split(" ")
        ], d = 0, e = c.length, f = {}; d < e; d++)
        if ((b = c[d]) && b[1] in a) {
          for (d = 0; d < b.length; d++) f[c[0][d]] =
            b[d];
          return f
        } return !1
    }(),
    d = {
      change: e.fullscreenchange,
      error: e.fullscreenerror
    },
    f = {
      request: function(c) {
        var d = e.requestFullscreen;
        c = c || a.documentElement;
        if (/5\.1[.\d]* Safari/.test(navigator.userAgent)) c[d]();
        else c[d](b && Element.ALLOW_KEYBOARD_INPUT)
      },
      exit: function() {
        a[e.exitFullscreen]()
      },
      toggle: function(a) {
        this.isFullscreen ? this.exit() : this.request(a)
      },
      onchange: function(a) {
        this.on("change", a)
      },
      onerror: function(a) {
        this.on("error", a)
      },
      on: function(b, c) {
        var e = d[b];
        e && a.addEventListener(e, c, !1)
      },
      off: function(b,
        c) {
        var e = d[b];
        e && a.removeEventListener(e, c, !1)
      },
      raw: e
    };
  e ? (Object.defineProperties(f, {
    isFullscreen: {
      get: function() {
        return !!a[e.fullscreenElement]
      }
    },
    element: {
      enumerable: !0,
      get: function() {
        return a[e.fullscreenElement]
      }
    },
    enabled: {
      enumerable: !0,
      get: function() {
        return !!a[e.fullscreenEnabled]
      }
    }
  }), c ? module.exports = f : window.screenfull = f) : c ? module.exports = !1 : window.screenfull = !1
})();
var s_iScaleFactor = 1,
  s_iOffsetX, s_iOffsetY, s_bIsIphone = !1;
(function(a) {
  (jQuery.browser = jQuery.browser || {}).mobile = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,
    4))
})(navigator.userAgent || navigator.vendor || window.opera);
$(window).resize(function() {
  sizeHandler()
});

function trace(a) {
  console.log(a)
}

function hexToRgb(a) {
  return (a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a)) ? {
    r: parseInt(a[1], 16),
    g: parseInt(a[2], 16),
    b: parseInt(a[3], 16)
  } : null
}

function checkIfiOS() {
  return navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? !0 : !1
}

function getSize(a) {
  var c = a.toLowerCase(),
    b = window.document,
    e = b.documentElement;
  if (void 0 === window["inner" + a]) a = e["client" + a];
  else if (window["inner" + a] != e["client" + a]) {
    var d = b.createElement("body");
    d.id = "vpw-test-b";
    d.style.cssText = "overflow:scroll";
    var f = b.createElement("div");
    f.id = "vpw-test-d";
    f.style.cssText = "position:absolute;top:-1000px";
    f.innerHTML = "<style>@media(" + c + ":" + e["client" + a] + "px){body#vpw-test-b div#vpw-test-d{" + c + ":7px!important}}</style>";
    d.appendChild(f);
    e.insertBefore(d, b.head);
    a = 7 == f["offset" + a] ? e["client" + a] : window["inner" + a];
    e.removeChild(d)
  } else a = window["inner" + a];
  return a
}
window.addEventListener("orientationchange", onOrientationChange);

function onOrientationChange() {
  window.matchMedia("(orientation: portrait)").matches && sizeHandler();
  window.matchMedia("(orientation: landscape)").matches && sizeHandler()
}

function isIOS() {
  var a = "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";");
  for (-1 !== navigator.userAgent.toLowerCase().indexOf("iphone") && (s_bIsIphone = !0); a.length;)
    if (navigator.platform === a.pop()) return !0;
  return s_bIsIphone = !1
}

function getIOSWindowHeight() {
  return document.documentElement.clientWidth / window.innerWidth * window.innerHeight
}

function getHeightOfIOSToolbars() {
  var a = (0 === window.orientation ? screen.height : screen.width) - getIOSWindowHeight();
  return 1 < a ? a : 0
}

function sizeHandler() {
  window.scrollTo(0, 1);
  if ($("#canvas")) {
    var a = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? getIOSWindowHeight() : getSize("Height");
    var c = getSize("Width");
    _checkOrientation(c, a);
    var b = Math.min(a / CANVAS_HEIGHT, c / CANVAS_WIDTH),
      e = CANVAS_WIDTH * b;
    b *= CANVAS_HEIGHT;
    if (b < a) {
      var d = a - b;
      b += d;
      e += CANVAS_WIDTH / CANVAS_HEIGHT * d
    } else e < c && (d = c - e, e += d, b += CANVAS_HEIGHT / CANVAS_WIDTH * d);
    d = a / 2 - b / 2;
    var f = c / 2 - e / 2,
      g = CANVAS_WIDTH / e;
    if (f * g < -EDGEBOARD_X || d * g < -EDGEBOARD_Y) b = Math.min(a / (CANVAS_HEIGHT - 2 *
      EDGEBOARD_Y), c / (CANVAS_WIDTH - 2 * EDGEBOARD_X)), e = CANVAS_WIDTH * b, b *= CANVAS_HEIGHT, d = (a - b) / 2, f = (c - e) / 2, g = CANVAS_WIDTH / e;
    s_iOffsetX = -1 * f * g;
    s_iOffsetY = -1 * d * g;
    0 <= d && (s_iOffsetY = 0);
    0 <= f && (s_iOffsetX = 0);
    null !== s_oInterface && s_oInterface.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    null !== s_oMenu && s_oMenu.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    null !== s_oModeMenu && s_oModeMenu.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    $("#canvas").css("width", e + "px");
    $("#canvas").css("height", b + "px");
    0 > d || (d = (a - b) / 2);
    $("#canvas").css("top",
      d + "px");
    $("#canvas").css("left", f + "px");
    $("#draw_canvas").css("width", e + "px");
    $("#draw_canvas").css("height", b + "px");
    0 > d || (d = (a - b) / 2);
    $("#draw_canvas").css("top", d + "px");
    $("#draw_canvas").css("left", f + "px");
    $("#interactivecanvas").css("width", e + "px");
    $("#interactivecanvas").css("height", b + "px");
    0 > d || (d = (a - b) / 2);
    $("#interactivecanvas").css("top", d + "px");
    $("#interactivecanvas").css("left", f + "px");
    s_oCanvasLeft = $("#canvas").offset().left;
    s_oCanvasTop = $("#canvas").offset().top
  }
}

function _checkOrientation(a, c) {
  s_bMobile && ENABLE_CHECK_ORIENTATION && (a > c ? "landscape" === $(".orientation-msg-container").attr("data-orientation") ? ($(".orientation-msg-container").css("display", "none"), s_oMain.startUpdate()) : ($(".orientation-msg-container").css("display", "block"), s_oMain.stopUpdate()) : "portrait" === $(".orientation-msg-container").attr("data-orientation") ? ($(".orientation-msg-container").css("display", "none"), s_oMain.startUpdate()) : ($(".orientation-msg-container").css("display", "block"),
    s_oMain.stopUpdate()))
}

function playSound(a, c, b) {
  return !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? (s_aSounds[a].play(), s_aSounds[a].volume(c), s_aSounds[a].loop(b), s_aSounds[a]) : null
}

function stopSound(a) {
  !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || a.stop()
}

function setVolume(a, c) {
  !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || a.volume(c)
}

function setMute(a, c) {
  !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || a.mute(c)
}

function fadeSound(a, c, b, e) {
  !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || a.fade(c, b, e)
}

function soundPlaying(a) {
  if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) return a.playing()
}

function createBitmap(a, c, b) {
  var e = new createjs.Bitmap(a),
    d = new createjs.Graphics;
  c && b ? d.beginFill("#fff").drawRect(0, 0, c, b) : d.beginFill("#ff0").drawRect(0, 0, a.width, a.height);
  a = new createjs.Shape(d);
  e.hitArea = a;
  return e
}

function createSprite(a, c, b, e, d, f) {
  a = null !== c ? new createjs.Sprite(a, c) : new createjs.Sprite(a);
  c = new createjs.Graphics;
  c.beginFill("#000000").drawRect(-b, -e, d, f);
  b = new createjs.Shape(c);
  a.hitArea = b;
  return a
}

function pad(a, c, b) {
  a += "";
  return a.length >= c ? a : Array(c - a.length + 1).join(b || "0") + a
}

function randomFloatBetween(a, c, b) {
  "undefined" === typeof b && (b = 2);
  return parseFloat(Math.min(a + Math.random() * (c - a), c).toFixed(b))
}

function rotateVector2D(a, c) {
  var b = c.getX() * Math.cos(a) + c.getY() * Math.sin(a),
    e = c.getX() * -Math.sin(a) + c.getY() * Math.cos(a);
  c.set(b, e)
}

function tweenVectorsOnX(a, c, b) {
  return a + b * (c - a)
}

function shuffle(a) {
  for (var c = a.length, b, e; 0 !== c;) e = Math.floor(Math.random() * c), --c, b = a[c], a[c] = a[e], a[e] = b;
  return a
}

function bubbleSort(a) {
  do {
    var c = !1;
    for (var b = 0; b < a.length - 1; b++) a[b] > a[b + 1] && (c = a[b], a[b] = a[b + 1], a[b + 1] = c, c = !0)
  } while (c)
}

function compare(a, c) {
  return a.index > c.index ? -1 : a.index < c.index ? 1 : 0
}

function easeLinear(a, c, b, e) {
  return b * a / e + c
}

function easeInQuad(a, c, b, e) {
  return b * (a /= e) * a + c
}

function easeInSine(a, c, b, e) {
  return -b * Math.cos(a / e * (Math.PI / 2)) + b + c
}

function easeInCubic(a, c, b, e) {
  return b * (a /= e) * a * a + c
}

function getTrajectoryPoint(a, c) {
  var b = new createjs.Point,
    e = (1 - a) * (1 - a),
    d = a * a;
  b.x = e * c.start.x + 2 * (1 - a) * a * c.traj.x + d * c.end.x;
  b.y = e * c.start.y + 2 * (1 - a) * a * c.traj.y + d * c.end.y;
  return b
}

function formatTime(a) {
  a /= 1E3;
  var c = Math.floor(a / 60);
  a = parseFloat(a - 60 * c).toFixed(1);
  var b = "";
  b = 10 > c ? b + ("0" + c + ":") : b + (c + ":");
  return 10 > a ? b + ("0" + a) : b + a
}

function degreesToRadians(a) {
  return a * Math.PI / 180
}

function checkRectCollision(a, c) {
  var b = getBounds(a, .9);
  var e = getBounds(c, .98);
  return calculateIntersection(b, e)
}

function calculateIntersection(a, c) {
  var b, e, d, f;
  var g = a.x + (b = a.width / 2);
  var h = a.y + (e = a.height / 2);
  var l = c.x + (d = c.width / 2);
  var k = c.y + (f = c.height / 2);
  g = Math.abs(g - l) - (b + d);
  h = Math.abs(h - k) - (e + f);
  return 0 > g && 0 > h ? (g = Math.min(Math.min(a.width, c.width), -g), h = Math.min(Math.min(a.height, c.height), -h), {
    x: Math.max(a.x, c.x),
    y: Math.max(a.y, c.y),
    width: g,
    height: h,
    rect1: a,
    rect2: c
  }) : null
}

function getBounds(a, c) {
  var b = {
    x: Infinity,
    y: Infinity,
    width: 0,
    height: 0
  };
  if (a instanceof createjs.Container) {
    b.x2 = -Infinity;
    b.y2 = -Infinity;
    var e = a.children,
      d = e.length,
      f;
    for (f = 0; f < d; f++) {
      var g = getBounds(e[f], 1);
      g.x < b.x && (b.x = g.x);
      g.y < b.y && (b.y = g.y);
      g.x + g.width > b.x2 && (b.x2 = g.x + g.width);
      g.y + g.height > b.y2 && (b.y2 = g.y + g.height)
    }
    Infinity == b.x && (b.x = 0);
    Infinity == b.y && (b.y = 0);
    Infinity == b.x2 && (b.x2 = 0);
    Infinity == b.y2 && (b.y2 = 0);
    b.width = b.x2 - b.x;
    b.height = b.y2 - b.y;
    delete b.x2;
    delete b.y2
  } else {
    if (a instanceof createjs.Bitmap) {
      d =
        a.sourceRect || a.image;
      f = d.width * c;
      var h = d.height * c
    } else if (a instanceof createjs.Sprite)
      if (a.spriteSheet._frames && a.spriteSheet._frames[a.currentFrame] && a.spriteSheet._frames[a.currentFrame].image) {
        d = a.spriteSheet.getFrame(a.currentFrame);
        f = d.rect.width;
        h = d.rect.height;
        e = d.regX;
        var l = d.regY
      } else b.x = a.x || 0, b.y = a.y || 0;
    else b.x = a.x || 0, b.y = a.y || 0;
    e = e || 0;
    f = f || 0;
    l = l || 0;
    h = h || 0;
    b.regX = e;
    b.regY = l;
    d = a.localToGlobal(0 - e, 0 - l);
    g = a.localToGlobal(f - e, h - l);
    f = a.localToGlobal(f - e, 0 - l);
    e = a.localToGlobal(0 - e, h - l);
    b.x =
      Math.min(Math.min(Math.min(d.x, g.x), f.x), e.x);
    b.y = Math.min(Math.min(Math.min(d.y, g.y), f.y), e.y);
    b.width = Math.max(Math.max(Math.max(d.x, g.x), f.x), e.x) - b.x;
    b.height = Math.max(Math.max(Math.max(d.y, g.y), f.y), e.y) - b.y
  }
  return b
}

function NoClickDelay(a) {
  this.element = a;
  window.Touch && this.element.addEventListener("touchstart", this, !1)
}
NoClickDelay.prototype = {
  handleEvent: function(a) {
    switch (a.type) {
      case "touchstart":
        this.onTouchStart(a);
        break;
      case "touchmove":
        this.onTouchMove(a);
        break;
      case "touchend":
        this.onTouchEnd(a)
    }
  },
  onTouchStart: function(a) {
    a.preventDefault();
    this.moved = !1;
    this.element.addEventListener("touchmove", this, !1);
    this.element.addEventListener("touchend", this, !1)
  },
  onTouchMove: function(a) {
    this.moved = !0
  },
  onTouchEnd: function(a) {
    this.element.removeEventListener("touchmove", this, !1);
    this.element.removeEventListener("touchend",
      this, !1);
    if (!this.moved) {
      a = document.elementFromPoint(a.changedTouches[0].clientX, a.changedTouches[0].clientY);
      3 == a.nodeType && (a = a.parentNode);
      var c = document.createEvent("MouseEvents");
      c.initEvent("click", !0, !0);
      a.dispatchEvent(c)
    }
  }
};
(function() {
  function a(a) {
    var b = {
      focus: "visible",
      focusin: "visible",
      pageshow: "visible",
      blur: "hidden",
      focusout: "hidden",
      pagehide: "hidden"
    };
    a = a || window.event;
    a.type in b ? document.body.className = b[a.type] : (document.body.className = this[c] ? "hidden" : "visible", "hidden" === document.body.className ? s_oMain.stopUpdate() : s_oMain.startUpdate())
  }
  var c = "hidden";
  c in document ? document.addEventListener("visibilitychange", a) : (c = "mozHidden") in document ? document.addEventListener("mozvisibilitychange", a) : (c = "webkitHidden") in
    document ? document.addEventListener("webkitvisibilitychange", a) : (c = "msHidden") in document ? document.addEventListener("msvisibilitychange", a) : "onfocusin" in document ? document.onfocusin = document.onfocusout = a : window.onpageshow = window.onpagehide = window.onfocus = window.onblur = a
})();

function ctlArcadeResume() {
  null !== s_oMain && s_oMain.startUpdate()
}

function ctlArcadePause() {
  null !== s_oMain && s_oMain.stopUpdate()
}

function getParamValue(a) {
  for (var c = window.location.search.substring(1).split("&"), b = 0; b < c.length; b++) {
    var e = c[b].split("=");
    if (e[0] == a) return e[1]
  }
}

function fullscreenHandler() {
  ENABLE_FULLSCREEN && screenfull.enabled && (s_bFullscreen = screen.height < window.innerHeight + 3 && screen.height > window.innerHeight - 3 ? !0 : !1, null !== s_oInterface && s_oInterface.resetFullscreenBut(), null !== s_oModeMenu && s_oModeMenu.resetFullscreenBut(), null !== s_oMenu && s_oMenu.resetFullscreenBut())
}
if (screenfull.enabled) screenfull.on("change", function() {
  s_bFullscreen = screenfull.isFullscreen;
  null !== s_oInterface && s_oInterface.resetFullscreenBut();
  null !== s_oModeMenu && s_oModeMenu.resetFullscreenBut();
  null !== s_oMenu && s_oMenu.resetFullscreenBut()
});

function CSpriteLibrary() {
  var a, c, b, e, d, f;
  this.init = function(g, h, l) {
    b = c = 0;
    e = g;
    d = h;
    f = l;
    a = {}
  };
  this.addSprite = function(b, d) {
    a.hasOwnProperty(b) || (a[b] = {
      szPath: d,
      oSprite: new Image
    }, c++)
  };
  this.getSprite = function(b) {
    return a.hasOwnProperty(b) ? a[b].oSprite : null
  };
  this._onSpritesLoaded = function() {
    d.call(f)
  };
  this._onSpriteLoaded = function() {
    e.call(f);
    ++b == c && this._onSpritesLoaded()
  };
  this.loadSprites = function() {
    for (var b in a) a[b].oSprite.oSpriteLibrary = this, a[b].oSprite.onload = function() {
        this.oSpriteLibrary._onSpriteLoaded()
      },
      a[b].oSprite.onerror = function(b) {
        var c = b.currentTarget;
        setTimeout(function() {
          a[c.szKey].oSprite.src = a[c.szKey].szPath
        }, 500)
      }, a[b].oSprite.src = a[b].szPath
  };
  this.getNumSprites = function() {
    return c
  };
  this.loadSpriteGroup = function(b, d, e, f) {
    for (var g = 0; g < b.length; g++) a[b[g].key] = {
      szPath: b[g].path,
      oSprite: new Image
    }, c++;
    this._loadInStreamingSprite(b, d, e, f)
  };
  this._loadInStreamingSprite = function(b, c, d, e) {
    var f = b.splice(0, 1)[0].key;
    a[f].oSprite.oSpriteLibrary = this;
    a[f].oSprite.onload = function() {
      this.oSpriteLibrary._onElementOfSpriteGroupLoaded(b,
        c, d, e)
    };
    a[f].oSprite.onerror = function(b) {
      setTimeout(function() {
        a[f].oSprite.src = a[f].szPath
      }, 500)
    };
    a[f].oSprite.src = a[f].szPath
  };
  this._onElementOfSpriteGroupLoaded = function(a, b, c, d) {
    0 === a.length ? c && c.call(b, d) : s_oSpriteLibrary._loadInStreamingSprite(a, b, c, d)
  }
}
var CANVAS_WIDTH = 1920,
  CANVAS_HEIGHT = 1080,
  EDGEBOARD_X = 200,
  EDGEBOARD_Y = 35,
  FPS = 30,
  FPS_TIME = 1E3 / FPS,
  DISABLE_SOUND_MOBILE = 1,
  PRIMARY_FONT = "Gotham",
  SECONDARY_FONT = "Arial",
  STATE_LOADING = 0,
  STATE_MENU = 1,
  STATE_HELP = 1,
  STATE_GAME = 3,
  ON_MOUSE_DOWN = 0,
  ON_MOUSE_UP = 1,
  ON_MOUSE_OVER = 2,
  ON_MOUSE_OUT = 3,
  ON_DRAG_START = 4,
  ON_DRAG_END = 5,
  COLORS = [],
  MIN_STROKE, MAX_STROKE, AD_SHOW_COUNTER;
TEXT_PLAY = "Start";
TEXT_HELP1 = "Please pick a colour";
TEXT_CHOOSE = "Select the picture you want to colour";

function CPreloader() {
  var a, c, b, e, d, f, g;
  this._init = function() {
    s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
    s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
    s_oSpriteLibrary.addSprite("progress_bar", "./sprites/progress_bar.png");
    s_oSpriteLibrary.loadSprites();
    g = new createjs.Container;
    s_oStage.addChild(g)
  };
  this.unload = function() {
    g.removeAllChildren()
  };
  this.hide = function() {
    var a = this;
    setTimeout(function() {
      createjs.Tween.get(f).to({
        alpha: 1
      }, 500).call(function() {
        a.unload();
        s_oMain.gotoMenu()
      })
    }, 1E3)
  };
  this._onImagesLoaded = function() {};
  this._onAllImagesLoaded = function() {
    this.attachSprites();
    s_oMain.preloaderReady()
  };
  this.attachSprites = function() {
    var h = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
    g.addChild(h);
    h = s_oSpriteLibrary.getSprite("progress_bar");
    e = createBitmap(h);
    e.x = CANVAS_WIDTH / 2 - h.width / 2;
    e.y = CANVAS_HEIGHT - 170;
    g.addChild(e);
    a = h.width;
    c = h.height;
    d = new createjs.Shape;
    d.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(e.x, e.y, 1, c);
    g.addChild(d);
    e.mask =
      d;
    b = new createjs.Text("", "30px " + SECONDARY_FONT, "#fff");
    b.x = CANVAS_WIDTH / 2;
    b.y = CANVAS_HEIGHT - 125;
    b.shadow = new createjs.Shadow("#000", 2, 2, 2);
    b.textBaseline = "alphabetic";
    b.textAlign = "center";
    g.addChild(b);
    f = new createjs.Shape;
    f.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    f.alpha = 0;
    g.addChild(f)
  };
  this.refreshLoader = function(f) {
    b.text = f + "%";
    d.graphics.clear();
    f = Math.floor(f * a / 100);
    d.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(e.x, e.y, f, c)
  };
  this._init()
}

function CMain(a) {
  var c, b = 0,
    e = 0,
    d;
  this.initContainer = function() {
    s_oDrawCanvas = document.getElementById("draw_canvas");
    s_oDrawStage = new createjs.Stage(s_oDrawCanvas);
    s_oCanvas = document.getElementById("canvas");
    s_oStage = new createjs.Stage(s_oCanvas);
    s_oInteractiveCanvas = document.getElementById("interactivecanvas");
    s_oInteractiveStage = new createjs.Stage(s_oInteractiveCanvas);
    createjs.Touch.enable(s_oInteractiveStage);
    s_bMobile = jQuery.browser.mobile;
    !1 === s_bMobile && (s_oStage.enableMouseOver(FPS), s_oInteractiveStage.enableMouseOver(FPS),
      $("body").on("contextmenu", "#canvas", function(a) {
        return !1
      }));
    s_iPrevTime = (new Date).getTime();
    createjs.Ticker.addEventListener("tick", this._update);
    createjs.Ticker.framerate = FPS;
    navigator.userAgent.match(/Windows Phone/i) && (DISABLE_SOUND_MOBILE = !0);
    s_oSpriteLibrary = new CSpriteLibrary;
    d = new CPreloader
  };
  this.preloaderReady = function() {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || this._initSounds();
    this._loadImages();
    c = !0
  };
  this.soundLoaded = function() {
    b++;
    d.refreshLoader(Math.floor(b / e * 100));
    b === e && s_oMain._onAllResourcesLoaded()
  };
  this._initSounds = function() {
    var a = [];
    a.push({
      path: "./sounds/",
      filename: "soundtrack",
      loop: !0,
      volume: 1,
      ingamename: "soundtrack"
    });
    a.push({
      path: "./sounds/",
      filename: "press_button",
      loop: !1,
      volume: 1,
      ingamename: "click"
    });
    e += a.length;
    s_aSounds = [];
    for (var b = 0; b < a.length; b++) s_aSounds[a[b].ingamename] = new Howl({
      src: [a[b].path + a[b].filename + ".mp3", a[b].path + a[b].filename + ".ogg"],
      autoplay: !0,
      preload: !0,
      loop: a[b].loop,
      volume: a[b].volume,
      onload: s_oMain.soundLoaded
    })
  };
  this._loadImages = function() {
    s_oSpriteLibrary.init(this._onImagesLoaded,
      this._onAllImagesLoaded, this);
    s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
    s_oSpriteLibrary.addSprite("ctl_logo", "./sprites/ctl_logo.png");
    s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");
    s_oSpriteLibrary.addSprite("but_credits", "./sprites/but_credits.png");
    s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
    s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
    s_oSpriteLibrary.addSprite("bg_modemenu", "./sprites/bg_modemenu.jpg");
    s_oSpriteLibrary.addSprite("bg_game",
      "./sprites/bg_game.jpg");
    s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
    s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
    s_oSpriteLibrary.addSprite("but_save", "./sprites/but_save.png");
    s_oSpriteLibrary.addSprite("but_print", "./sprites/but_print.png");
    s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
    s_oSpriteLibrary.addSprite("eraser", "./sprites/eraser.png");
    s_oSpriteLibrary.addSprite("sliderbox", "./sprites/sliderbox.png");
    s_oSpriteLibrary.addSprite("slider",
      "./sprites/slider.png");
    s_oSpriteLibrary.addSprite("pen", "./sprites/pen.png");
    s_oSpriteLibrary.addSprite("canvas_drawing", "./sprites/drawcanvas.jpg");
    s_oSpriteLibrary.addSprite("drawcanvas_frame", "./sprites/drawcanvas_frame.png");
    s_oSpriteLibrary.addSprite("image1", "./sprites/image1.png");
    s_oSpriteLibrary.addSprite("image2", "./sprites/image2.png");
    s_oSpriteLibrary.addSprite("image3", "./sprites/image3.png");
    s_oSpriteLibrary.addSprite("image4", "./sprites/image4.png");
    s_oSpriteLibrary.addSprite("image5",
      "./sprites/image5.png");
    s_oSpriteLibrary.addSprite("image6", "./sprites/image6.png");
    e += s_oSpriteLibrary.getNumSprites();
    s_oSpriteLibrary.loadSprites()
  };
  this._onImagesLoaded = function() {
    b++;
    d.refreshLoader(Math.floor(b / e * 100));
    b === e && s_oMain._onAllResourcesLoaded()
  };
  this._onAllImagesLoaded = function() {};
  this.onAllPreloaderImagesLoaded = function() {
    this._loadImages()
  };
  this._onAllResourcesLoaded = function() {
    d.unload();
    isIOS() || playSound("soundtrack", 1, !0);
    this.gotoMenu()
  };
  this.gotoMenu = function() {
    new CMenu
  };
  this.gotoModeMenu = function() {
    new CModeMenu
  };
  this.gotoGame = function(a) {
    s_szCurDraw = a;
    new CGame(f)
  };
  this.gotoHelp = function() {
    new CHelp
  };
  this.stopUpdate = function() {
    c = !1;
    createjs.Ticker.paused = !0;
    $("#block_game").css("display", "block");
    Howler.mute(!0)
  };
  this.startUpdate = function() {
    s_iPrevTime = (new Date).getTime();
    c = !0;
    createjs.Ticker.paused = !1;
    $("#block_game").css("display", "none");
    s_bAudioActive && Howler.mute(!1)
  };
  this._update = function() {
    if (!1 !== c) {
      var a = (new Date).getTime();
      s_iTimeElaps = a - s_iPrevTime;
      s_iCntTime += s_iTimeElaps;
      s_iCntFps++;
      s_iPrevTime = a;
      1E3 <= s_iCntTime && (s_iCurFps = s_iCntFps, s_iCntTime -= 1E3, s_iCntFps = 0)
    }
  };
  ENABLE_FULLSCREEN = a.fullscreen;
  ENABLE_CHECK_ORIENTATION = a.check_orientation;
  s_oMain = this;
  var f = a;
  this.initContainer()
}
var s_bMobile, s_bAudioActive = !0,
  s_iCntTime = 0,
  s_iTimeElaps = 0,
  s_iPrevTime = 0,
  s_iCntFps = 0,
  s_iCurFps = 0,
  s_szCurDraw, s_bFullscreen = !1,
  s_oStage, s_oMain, s_oSpriteLibrary, s_oSoundTrack, s_oCanvas, s_oDrawCanvas, s_oDrawStage, s_oInteractiveCanvas, s_oInteractiveStage, s_aSounds = [];

function CTextButton(a, c, b, e, d, f, g) {
  var h, l, k, n, q;
  this._init = function(a, b, c, d, e, f, g) {
    h = [];
    l = [];
    var p = createBitmap(c),
      m = Math.ceil(g / 20);
    n = new createjs.Text(d, " " + g + "px " + e, f);
    n.textAlign = "center";
    n.textBaseline = "alphabetic";
    r = n.getBounds();
    n.x = c.width / 2;
    n.y = Math.floor(c.height / 2) + r.height / 3;
    k = new createjs.Container;
    k.x = a;
    k.y = b;
    k.regX =
      c.width / 2;
    k.regY = c.height / 2;
    k.cursor = "pointer";
    k.addChild(p, q, n);
    s_oInteractiveStage.addChild(k);
    s_oInteractiveStage.update();
    this._initListener()
  };
  this.unload = function() {
    k.off("mousedown");
    k.off("pressup");
    s_oInteractiveStage.removeChild(k)
  };
  this.setVisible = function(a) {
    k.visible = a
  };
  this._initListener = function() {
    k.on("mousedown", this.buttonDown);
    k.on("pressup", this.buttonRelease)
  };
  this.addEventListener = function(a, b, c) {
    h[a] = b;
    l[a] = c
  };
  this.buttonRelease = function() {
    k.scaleX = 1;
    k.scaleY = 1;
    h[ON_MOUSE_UP] &&
      h[ON_MOUSE_UP].call(l[ON_MOUSE_UP]);
    s_oInteractiveStage.update()
  };
  this.buttonDown = function() {
    k.scaleX = .9;
    k.scaleY = .9;
    playSound("click", 1, !1);
    h[ON_MOUSE_DOWN] && h[ON_MOUSE_DOWN].call(l[ON_MOUSE_DOWN]);
    s_oInteractiveStage.update()
  };
  this.setTextPosition = function(a) {
    n.y = a;
    q.y = a + 2
  };
  this.setPosition = function(a, b) {
    k.x = a;
    k.y = b
  };
  this.setX = function(a) {
    k.x = a
  };
  this.setY = function(a) {
    k.y = a
  };
  this.getButtonImage = function() {
    return k
  };
  this.getX = function() {
    return k.x
  };
  this.getY = function() {
    return k.y
  };
  this._init(a, c,
    b, e, d, f, g);
  return this
}

function CToggle(a, c, b, e) {
  var d, f, g, h;
  this._init = function(a, b, c, e) {
    f = [];
    g = [];
    var k = new createjs.SpriteSheet({
      images: [c],
      frames: {
        width: c.width / 2,
        height: c.height,
        regX: c.width / 2 / 2,
        regY: c.height / 2
      },
      animations: {
        state_true: [0],
        state_false: [1]
      }
    });
    d = e;
    h = createSprite(k, "state_" + d, c.width / 2 / 2, c.height / 2, c.width / 2, c.height);
    h.x = a;
    h.y = b;
    h.cursor = "pointer";
    h.stop();
    s_oInteractiveStage.addChild(h);
    this._initListener()
  };
  this.unload = function() {
    h.off("mousedown", this.buttonDown);
    h.off("pressup", this.buttonRelease);
    s_oInteractiveStage.removeChild(h)
  };
  this._initListener = function() {
    h.on("mousedown", this.buttonDown);
    h.on("pressup", this.buttonRelease)
  };
  this.addEventListener = function(a, b, c) {
    f[a] = b;
    g[a] = c
  };
  this.setActive = function(a) {
    d = a;
    h.gotoAndStop("state_" + d)
  };
  this.buttonRelease = function() {
    h.scaleX = 1;
    h.scaleY = 1;
    d = !d;
    h.gotoAndStop("state_" + d);
    f[ON_MOUSE_UP] && f[ON_MOUSE_UP].call(g[ON_MOUSE_UP], d);
    s_oInteractiveStage.update()
  };
  this.buttonDown = function() {
    h.scaleX = .9;
    h.scaleY = .9;
    playSound("click", 1, !1);
    f[ON_MOUSE_DOWN] &&
      f[ON_MOUSE_DOWN].call(g[ON_MOUSE_DOWN]);
    s_oInteractiveStage.update()
  };
  this.setPosition = function(a, b) {
    h.x = a;
    h.y = b
  };
  this._init(a, c, b, e)
}

function CSliderBox(a, c, b, e) {
  var d, f = !1,
    g, h, l;
  this._init = function(a, b, c, e) {
    d = !1;
    g = new createjs.Container;
    g.x = a;
    g.y = b;
    g.cursor = "pointer";
    e.addChild(g);
    a = new createjs.SpriteSheet({
      images: [c],
      frames: {
        width: c.width / 2,
        height: c.height,
        regX: c.width / 2 / 2,
        regY: c.height / 2
      },
      animations: {
        state_true: [0],
        state_false: [1]
      }
    });
    h = createSprite(a, "state_" + f, c.width / 2 / 2, c.height / 2, c.width / 2, c.height);
    l = new createjs.Shape;
    l.graphics.beginFill("white").drawCircle(0, 0, .5 * s_oInterface.getStroke());
    g.addChild(h, l);
    this._initListener()
  };
  this.unload = function() {
    g.off("mousedown", this.buttonDown);
    g.off("pressup", this.buttonRelease);
    e.removeChild(g)
  };
  this.setVisible = function(a) {
    g.visible = a
  };
  this.setSliderVisible = function(a) {
    d = a
  };
  this.setCircle = function(a, b) {
    l.graphics.clear();
    null === b && (b = "#FFFFFF");
    l.graphics.beginFill(b).drawCircle(0, 0, .5 * a)
  };
  this._initListener = function() {
    g.on("mousedown", this.buttonDown);
    g.on("pressup", this.buttonRelease)
  };
  this.buttonRelease = function() {
    g.scaleX = 1;
    g.scaleY = 1;
    d = !d;
    s_oInterface.setSliderVisible(d);
    d ||
      s_oGame.setTempColor();
    f = !f;
    h.gotoAndStop("state_" + f);
    s_oInteractiveStage.update()
  };
  this.buttonDown = function() {
    g.scaleX = .9;
    g.scaleY = .9;
    d || s_oGame.saveTempColor();
    playSound("click", 1, !1);
    s_oInterface.disableStroke();
    s_oInteractiveStage.update()
  };
  this.setPosition = function(a, b) {
    g.x = a;
    g.y = b
  };
  this.setX = function(a) {
    g.x = a
  };
  this.setY = function(a) {
    g.y = a
  };
  this.getButtonImage = function() {
    return g
  };
  this.getX = function() {
    return g.x
  };
  this.getY = function() {
    return g.y
  };
  this.setActive = function(a) {
    (f = a) || h.gotoAndStop("state_" +
      f)
  };
  this._init(a, c, b, e);
  return this
}

function CSlider(a, c, b, e, d, f) {
  var g, h, l, k, n, q, r, m;
  this._init = function(a, b, c, d, e, f) {
    g = Math.round((e - d) / 2);
    m = new createjs.Container;
    m.x = a;
    m.y = b;
    f.addChild(m);
    a = new createjs.SpriteSheet({
      images: [c],
      frames: {
        width: c.width / 3,
        height: c.height,
        regX: c.width / 3 / 2,
        regY: c.height / 2
      },
      animations: {
        pointer: [0],
        bar: [1],
        label: [2]
      }
    });
    n = createSprite(a, "bar", c.width / 3 / 2, c.height / 2, c.width / 3, c.height);
    n.stop();
    m.addChild(n);
    q = createSprite(a, "label", c.width / 3 / 2, c.height / 2, c.width / 3, c.height);
    q.stop();
    q.y = -c.height / 2 - c.width /
      3 / 2;
    m.addChild(q);
    r = new createjs.Text(g, " 24px " + PRIMARY_FONT, "#ffffff");
    r.y = -c.height / 2 - c.width / 3 / 2;
    r.textAlign = "center";
    r.textBaseline = "middle";
    r.lineWidth = 280;
    m.addChild(r);
    k = createSprite(a, "pointer", c.width / 3 / 2, c.height / 2, c.width / 3, c.height);
    k.stop();
    m.addChild(k);
    l = c.height / 2 - c.width / 3 / 2;
    h = -c.height / 2 + c.width / 3 / 2;
    m.visible = !1;
    this._initListener()
  };
  this.unload = function() {
    k.off("pressmove", this.buttonDown);
    k.off("pressup", this.buttonRelease);
    f.removeChild(m)
  };
  this._initListener = function() {
    k.on("pressmove",
      this.buttonDown);
    k.on("pressup", this.buttonRelease)
  };
  this.buttonRelease = function() {
    s_oGame.sliderMoving(!1);
    s_oInterface.setSliderVisible(!1);
    s_oInterface.setStroke(g);
    s_oInterface.restartStroke();
    s_oInteractiveStage.update()
  };
  this.buttonDown = function(a) {
    s_oGame.sliderMoving(!0);
    a = m.globalToLocal(a.stageX, a.stageY);
    k.y = a.y;
    a.y > l ? k.y = l : a.y < h && (k.y = h);
    w.setValue();
    r.text = g;
    s_oInterface.setCircleImage(g, s_oGame.getTempColor());
    s_oInteractiveStage.update()
  };
  this.setValue = function() {
    g = (k.y - l) / (h - l) * (d -
      e) + e;
    g = Math.round(g)
  };
  this.getValue = function() {
    return g
  };
  this.setLabel = function() {};
  this.setPosition = function(a, b) {
    k.x = a;
    k.y = b
  };
  this.setVisible = function(a) {
    m.visible = a;
    s_oInteractiveStage.update()
  };
  this.getVisible = function() {
    return m.visible
  };
  var w = this;
  this._init(a, c, b, e, d, f)
}

function CGfxButton(a, c, b) {
  var e, d, f;
  this._init = function(a, b, c) {
    e = [];
    d = [];
    f = createBitmap(c);
    f.x = a;
    f.y = b;
    f.regX = c.width / 2;
    f.regY = c.height / 2;
    f.cursor = "pointer";
    s_oInteractiveStage.addChild(f);
    s_oInteractiveStage.update();
    this._initListener()
  };
  this.unload = function() {
    f.off("mousedown", this.buttonDown);
    f.off("pressup", this.buttonRelease);
    s_oInteractiveStage.removeChild(f)
  };
  this.setVisible = function(a) {
    f.visible = a
  };
  this._initListener = function() {
    f.on("mousedown", this.buttonDown);
    f.on("pressup", this.buttonRelease)
  };
  this.addEventListener = function(a, b, c) {
    e[a] = b;
    d[a] = c
  };
  this.buttonRelease = function() {
    f.scaleX = 1;
    f.scaleY = 1;
    e[ON_MOUSE_UP] && e[ON_MOUSE_UP].call(d[ON_MOUSE_UP]);
    s_oInteractiveStage.update()
  };
  this.buttonDown = function() {
    f.scaleX = .9;
    f.scaleY = .9;
    playSound("click", 1, !1);
    e[ON_MOUSE_DOWN] && e[ON_MOUSE_DOWN].call(d[ON_MOUSE_DOWN]);
    s_oInteractiveStage.update()
  };
  this.setPosition = function(a, b) {
    f.x = a;
    f.y = b
  };
  this.setX = function(a) {
    f.x = a
  };
  this.setY = function(a) {
    f.y = a
  };
  this.getButtonImage = function() {
    return f
  };
  this.getX =
    function() {
      return f.x
    };
  this.getY = function() {
    return f.y
  };
  this._init(a, c, b);
  return this
}

function CMenu() {
  var a, c, b, e, d, f, g, h, l, k, n, q = null,
    r = null;
  this._init = function() {
    g = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
    s_oInteractiveStage.addChild(g);
    var m = s_oSpriteLibrary.getSprite("but_play");
    h = new CTextButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 200, m, TEXT_PLAY, "gotham", "#ffffff", 80);
    h.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
    if (1 === DISABLE_SOUND_MOBILE || 1 === s_bMobile) m = s_oSpriteLibrary.getSprite("audio_icon"), d = CANVAS_WIDTH - m.height / 2 - 10, f = m.height / 2 + 10, l = new CToggle(d,f, m, s_bAudioActive), l.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
    m = s_oSpriteLibrary.getSprite("but_credits");
    b = m.width / 2 + 12;
    e = m.height / 2 + 16;
    k = new CGfxButton(b, e, m, s_oInteractiveStage);
    k.addEventListener(ON_MOUSE_UP, this._onCreditsBut, this);
    m = window.document;
    var w = m.documentElement;
    q = w.requestFullscreen || w.mozRequestFullScreen || w.webkitRequestFullScreen || w.msRequestFullscreen;
    r = m.exitFullscreen || m.mozCancelFullScreen || m.webkitExitFullscreen || m.msExitFullscreen;
    !1 === ENABLE_FULLSCREEN && (q = !1);
    q && screenfull.enabled && (m = s_oSpriteLibrary.getSprite("but_fullscreen"), a = b + m.width / 2 + 12, c = m.height / 2 + 16, n = new CToggle(a, c, m, s_bFullscreen, s_oInteractiveStage), n.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this));
    this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
  };
  this.unload = function() {
    h.unload();
    h = null;
    k.unload();
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) l.unload(), l = null;
    q && screenfull.enabled && n.unload();
    s_oInteractiveStage.removeChild(g);
    s_oMenu = g = null
  };
  this.refreshButtonPos = function(g,
    h) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || l.setPosition(d - g, h + f);
    k.setPosition(b + g, h + e);
    q && screenfull.enabled && n.setPosition(a + g, c + h);
    setTimeout(function() {
      s_oInteractiveStage.update()
    }, 300)
  };
  this.resetFullscreenBut = function() {
    q && screenfull.enabled && n.setActive(s_bFullscreen)
  };
  this._onFullscreenRelease = function() {
    s_bFullscreen ? r.call(window.document) : q.call(window.document.documentElement);
    sizeHandler()
  };
  this._onCreditsBut = function() {
    new CCreditsPanel
  };
  this._onAudioToggle = function() {
    Howler.mute(s_bAudioActive);
    s_bAudioActive = !s_bAudioActive
  };
  this._onButPlayRelease = function() {
    this.unload();
    isIOS() && !soundPlaying(s_aSounds.soundtrack) && playSound("soundtrack", 1, !0);
    $(s_oMain).trigger("start_session");
    s_oMain.gotoModeMenu()
  };
  s_oMenu = this;
  this._init()
}
var s_oMenu = null;

function CModeMenu() {
  var a, c, b, e, d, f, g, h, l, k, n, q, r, m, w, z = null,
    y = null;
  this._init = function() {
    d = createBitmap(s_oSpriteLibrary.getSprite("bg_modemenu"));
    f = new createjs.Text(TEXT_CHOOSE, " 60px " + PRIMARY_FONT, "#304149");
    f.x = CANVAS_WIDTH / 2;
    f.y = CANVAS_HEIGHT / 2 + 30;
    f.textAlign = "center";
    f.textBaseline = "middle";
    f.lineWidth = 1700;
    k =
      new createjs.Container;
    k.x = CANVAS_WIDTH / 2 - 500;
    k.y = CANVAS_HEIGHT / 2 - 190;
    k.scaleX = .3;
    k.scaleY = .3;
    k.cursor = "pointer";
    k.on("click", this._onImageClicked, this, !1, "image1");
    var p = s_oSpriteLibrary.getSprite("image1"),
      t = p.width,
      u = p.height,
      v = new createjs.Shape;
    v.graphics.beginFill("#ffffff").drawRect(-t / 2, -u / 2, t, u);
    k.addChild(v);
    p = createBitmap(p);
    p.regX = t / 2;
    p.regY = u / 2;
    k.addChild(p);
    v = new createjs.Shape;
    v.graphics.beginStroke("#000000").setStrokeStyle(10).drawRect(-t / 2, -u / 2, t, u);
    k.addChild(v);
    n = new createjs.Container;
    n.x = CANVAS_WIDTH / 2;
    n.y = CANVAS_HEIGHT / 2 - 190;
    n.scaleX = .3;
    n.scaleY = .3;
    n.cursor = "pointer";
    n.on("click", this._onImageClicked, this, !1, "image2");
    p = s_oSpriteLibrary.getSprite("image2");
    t = p.width;
    u = p.height;
    v = new createjs.Shape;
    v.graphics.beginFill("#ffffff").drawRect(-t / 2, -u / 2, t, u);
    n.addChild(v);
    p = createBitmap(p);
    p.regX = t / 2;
    p.regY = u / 2;
    n.addChild(p);
    v = new createjs.Shape;
    v.graphics.beginStroke("#000000").setStrokeStyle(10).drawRect(-t / 2, -u / 2, t, u);
    n.addChild(v);
    q = new createjs.Container;
    q.x = CANVAS_WIDTH / 2 + 500;
    q.y = CANVAS_HEIGHT / 2 - 190;
    q.scaleX = .3;
    q.scaleY = .3;
    q.cursor = "pointer";
    q.on("click", this._onImageClicked, this, !1, "image3");
    p = s_oSpriteLibrary.getSprite("image3");
    t = p.width;
    u = p.height;
    v = new createjs.Shape;
    v.graphics.beginFill("#ffffff").drawRect(-t / 2, -u / 2, t, u);
    q.addChild(v);
    p = createBitmap(p);
    p.regX = t / 2;
    p.regY = u / 2;
    q.addChild(p);
    v = new createjs.Shape;
    v.graphics.beginStroke("#000000").setStrokeStyle(10).drawRect(-t / 2, -u / 2, t, u);
    q.addChild(v);
    r = new createjs.Container;
    r.x = CANVAS_WIDTH / 2 - 500;
    r.y = CANVAS_HEIGHT /
      2 + 230;
    r.scaleX = .3;
    r.scaleY = .3;
    r.cursor = "pointer";
    r.on("click", this._onImageClicked, this, !1, "image4");
    p = s_oSpriteLibrary.getSprite("image4");
    t = p.width;
    u = p.height;
    v = new createjs.Shape;
    v.graphics.beginFill("#ffffff").drawRect(-t / 2, -u / 2, t, u);
    r.addChild(v);
    p = createBitmap(p);
    p.regX = t / 2;
    p.regY = u / 2;
    r.addChild(p);
    v = new createjs.Shape;
    v.graphics.beginStroke("#000000").setStrokeStyle(10).drawRect(-t / 2, -u / 2, t, u);
    r.addChild(v);
    m = new createjs.Container;
    m.x = CANVAS_WIDTH / 2;
    m.y = CANVAS_HEIGHT / 2 + 230;
    m.scaleX = .3;
    m.scaleY =
      .3;
    m.cursor = "pointer";
    m.on("click", this._onImageClicked, this, !1, "image5");
    p = s_oSpriteLibrary.getSprite("image5");
    t = p.width;
    u = p.height;
    v = new createjs.Shape;
    v.graphics.beginFill("#ffffff").drawRect(-t / 2, -u / 2, t, u);
    m.addChild(v);
    p = createBitmap(p);
    p.regX = t / 2;
    p.regY = u / 2;
    m.addChild(p);
    v = new createjs.Shape;
    v.graphics.beginStroke("#000000").setStrokeStyle(10).drawRect(-t / 2, -u / 2, t, u);
    m.addChild(v);
    w = new createjs.Container;
    w.x = CANVAS_WIDTH / 2 + 500;
    w.y = CANVAS_HEIGHT / 2 + 230;
    w.scaleX = .3;
    w.scaleY = .3;
    w.cursor = "pointer";
    w.on("click", this._onImageClicked, this, !1, "image6");
    p = s_oSpriteLibrary.getSprite("image6");
    t = p.width;
    u = p.height;
    v = new createjs.Shape;
    v.graphics.beginFill("#ffffff").drawRect(-t / 2, -u / 2, t, u);
    w.addChild(v);
    p = createBitmap(p);
    p.regX = t / 2;
    p.regY = u / 2;
    w.addChild(p);
    v = new createjs.Shape;
    v.graphics.beginStroke("#000000").setStrokeStyle(10).drawRect(-t / 2, -u / 2, t, u);
    w.addChild(v);
    s_oInteractiveStage.addChild(d, g, f, k, n, q, r, m, w);
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) p = s_oSpriteLibrary.getSprite("audio_icon"),
      b = CANVAS_WIDTH - p.height / 2 - 10, e = p.height / 2 + 10, h = new CToggle(b, e, p, s_bAudioActive), h.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
    t = window.document;
    u = t.documentElement;
    z = u.requestFullscreen || u.mozRequestFullScreen || u.webkitRequestFullScreen || u.msRequestFullscreen;
    y = t.exitFullscreen || t.mozCancelFullScreen || t.webkitExitFullscreen || t.msExitFullscreen;
    !1 === ENABLE_FULLSCREEN && (z = !1);
    p = s_oSpriteLibrary.getSprite("but_fullscreen");
    !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? (a = b - p.width / 2 - 10, c = p.height /
      2 + 10) : (a = CANVAS_WIDTH - p.height / 2 - 10, c = p.height / 2 + 10);
    z && screenfull.enabled && (l = new CToggle(a, c, p, s_bFullscreen, s_oStage), l.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this));
    this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
  };
  this.unload = function() {
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) h.unload(), h = null;
    z && screenfull.enabled && l.unload();
    s_oInteractiveStage.removeAllChildren();
    k.off("click", this._onImageClicked, this, !1, "image1");
    n.off("click", this._onImageClicked, this, !1, "image2");
    q.off("click",
      this._onImageClicked, this, !1, "image3");
    r.off("click", this._onImageClicked, this, !1, "image4");
    m.off("click", this._onImageClicked, this, !1, "image5");
    m.off("click", this._onImageClicked, this, !1, "image6");
    s_oModeMenu = null;
    s_oInteractiveStage.update()
  };
  this.refreshButtonPos = function(d, f) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || h.setPosition(b - d, f + e);
    z && screenfull.enabled && l.setPosition(a - d, c + f);
    s_oInteractiveStage.update()
  };
  this.resetFullscreenBut = function() {
    z && screenfull.enabled && l.setActive(s_bFullscreen)
  };
  this._onFullscreenRelease = function() {
    s_bFullscreen ? y.call(window.document) : z.call(window.document.documentElement);
    sizeHandler()
  };
  this._onAudioToggle = function() {
    Howler.mute(s_bAudioActive);
    s_bAudioActive = !s_bAudioActive
  };
  this._onImageClicked = function(a, b) {
    this.unload();
    $(s_oMain).trigger("start_level", 1);
    s_oMain.gotoGame(b);
    playSound("click", 1, !1)
  };
  s_oModeMenu = this;
  this._init()
}
var s_oModeMenu = null;

function CGame(a) {
  var c, b, e, d, f, g, h, l, k, n, q, r, m, w, z, y, p, t, u, v, A, C = s_oDrawStage.canvas.getContext("2d");
  this._init = function() {
    h = 10;
    f = null;
    n = 0;
    r = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
    s_oDrawStage.addChild(r);
    y = new createjs.Container;
    y.x = CANVAS_WIDTH / 2;
    y.y = CANVAS_HEIGHT / 2;
    s_oDrawStage.addChild(y);
    var a = s_oSpriteLibrary.getSprite("canvas_drawing");
    l = a.width;
    k = a.height;
    w = createBitmap(a);
    y.addChild(w);
    y.regX = l / 2;
    y.regY = k / 2;
    c = CANVAS_WIDTH / 2 - l / 2 + .5 * h;
    b = CANVAS_HEIGHT / 2 - k / 2 + .5 * h;
    e = l + CANVAS_WIDTH /
      2 - l / 2 - .5 * h;
    d = k + CANVAS_HEIGHT / 2 - k / 2 - .5 * h;
    m = new createjs.Shape;
    m.graphics.setStrokeStyle(h, "round", "round");
    t = new createjs.Container;
    s_oStage.addChild(t);
    a = s_oSpriteLibrary.getSprite(s_szCurDraw);
    p = createBitmap(a);
    p.x = CANVAS_WIDTH / 2;
    p.y = CANVAS_HEIGHT / 2;
    p.regX = a.width / 2;
    p.regY = a.height / 2;
    s_oInteractiveStage.addChild(p);
    t.addChild(m);
    a = s_oSpriteLibrary.getSprite("drawcanvas_frame");
    z = createBitmap(a);
    z.x = CANVAS_WIDTH / 2;
    z.y = CANVAS_HEIGHT / 2;
    z.regX = a.width / 2;
    z.regY = a.height / 2;
    s_oInteractiveStage.addChild(z);
    v = new createjs.Text(TEXT_HELP1, " 60px " + PRIMARY_FONT, "#ffffff");
    v.x = CANVAS_WIDTH / 2;
    v.y = CANVAS_HEIGHT / 2;
    v.textAlign = "center";
    v.textBaseline = "alphabetic";
    v.lineWidth = 800;
    v.visible = !1;
    A = new createjs.Text(TEXT_HELP1, " 60px " + PRIMARY_FONT, "#000000");
    A.x = CANVAS_WIDTH / 2;
    A.y = CANVAS_HEIGHT / 2;
    A.textAlign = "center";
    A.textBaseline = "alphabetic";
    A.lineWidth = 800;
    A.outline = 10;
    A.visible = !1;
    s_oInteractiveStage.addChild(A, v);
    u = new createjs.Shape;
    u.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(-580, -410, 1160,
      820);
    u.x = CANVAS_WIDTH / 2;
    u.y = CANVAS_HEIGHT / 2;
    u.on("mousedown", this._setAdvice);
    s_oInteractiveStage.addChild(u);
    s_bMobile ? (window.navigator.msPointerEnabled && (_iContTouchMS = 0), s_oInteractiveStage.addEventListener("stagemousedown", this.onMouseStart, !1), s_oInteractiveStage.addEventListener("stagemouseup", this.onMouseEnd, !1)) : (s_oInteractiveStage.addEventListener("stagemousedown", this.onMouseStart), s_oInteractiveStage.addEventListener("stagemouseup", this.onMouseEnd));
    q = new CInterface;
    s_oDrawStage.update();
    s_oInteractiveStage.update()
  };
  this.printImg = function() {
    var a = s_oSpriteLibrary.getSprite(s_szCurDraw);
    s_oSpriteLibrary.getSprite(s_szCurDraw);
    var b = createBitmap(a);
    b.x = CANVAS_WIDTH / 2;
    b.y = CANVAS_HEIGHT / 2;
    b.regX = a.width / 2;
    b.regY = a.height / 2;
    p.visible = !1;
    s_oDrawStage.addChild(b);
    r.visible = !1;
    s_oDrawStage.update();
    a = "<!DOCTYPE html><html>" + ('<img src="' + document.getElementById("draw_canvas").toDataURL() + '">') + "</html>";
    var c = window.open("", "", "width=1920,height=1080");
    c.document.open();
    c.document.write(a);
    c.document.close();
    c.focus();
    c.print();
    c.close();
    s_oDrawStage.removeChild(b);
    p.visible = !0;
    r.visible = !0;
    s_oDrawStage.update()
  };
  this.saveImg = function() {
    var a = s_oSpriteLibrary.getSprite(s_szCurDraw);
    s_oSpriteLibrary.getSprite(s_szCurDraw);
    var b = createBitmap(a);
    b.x = CANVAS_WIDTH / 2;
    b.y = CANVAS_HEIGHT / 2;
    b.regX = a.width / 2;
    b.regY = a.height / 2;
    p.visible = !1;
    s_oDrawStage.addChild(b);
    r.visible = !1;
    s_oDrawStage.update();
    a = document.createElement("a");
    document.body.appendChild(a);
    var c = s_szCurDraw + pad(Math.round(1E3 *
      Math.random()), 4) + ".png";
    a.download = c;
    a.href = s_oDrawCanvas.toDataURL("image/png");
    a.click();
    s_oDrawStage.removeChild(b);
    p.visible = !0;
    r.visible = !0;
    s_oDrawStage.update()
  };
  this.sliderMoving = function(a) {};
  this.tryShowAd = function() {
    n++;
    n === AD_SHOW_COUNTER && (n = 0, $(s_oMain).trigger("show_interlevel_ad"))
  };
  this.setColor = function(a) {
    f = a;
    this.tryShowAd()
  };
  this.getColor = function() {
    return f
  };
  this.saveTempColor = function() {
    g = f
  };
  this.setTempColor = function() {
    f = g
  };
  this.getTempColor = function() {
    return g
  };
  this.setStroke =
    function(a) {
      h = a;
      c = CANVAS_WIDTH / 2 - l / 2 + .5 * h;
      b = CANVAS_HEIGHT / 2 - k / 2 + .5 * h;
      e = l + CANVAS_WIDTH / 2 - l / 2 - .5 * h;
      d = k + CANVAS_HEIGHT / 2 - k / 2 - .5 * h
    };
  this.deleteStroke = function(a) {
    f = a ? "#ffffff" : null
  };
  this.initStroke = function() {
    m = new createjs.Shape;
    m.graphics.setStrokeStyle(h, "round", "round");
    m.graphics.beginStroke(f);
    t.addChild(m)
  };
  this.onMouseStart = function(a) {
    a = a || window.event;
    !a.primary || s_oInteractiveStage.mouseX < c || s_oInteractiveStage.mouseX > e || s_oInteractiveStage.mouseY < b || s_oInteractiveStage.mouseY > d || (s_oGame.initStroke(),
      m.graphics.moveTo(s_oInteractiveStage.mouseX, s_oInteractiveStage.mouseY), s_oInteractiveStage.addEventListener("stagemousemove", B.onMouseMove))
  };
  this.onMouseMove = function(a) {
    !a.primary || s_oInteractiveStage.mouseX < c || s_oInteractiveStage.mouseX > e || s_oInteractiveStage.mouseY < b || s_oInteractiveStage.mouseY > d || (m.graphics.lineTo(s_oInteractiveStage.mouseX, s_oInteractiveStage.mouseY), checkIfiOS() ? m.draw(C) : s_oStage.update())
  };
  this.onMouseEnd = function(a) {
    a.primary && (s_oDrawStage.addChild(m), m.graphics.endStroke(),
      t.removeChild(m), s_oDrawStage.update(), s_oStage.update(), s_oInteractiveStage.removeEventListener("stagemousemove", B.onMouseMove))
  };
  this.restartGame = function() {
    s_oDrawStage.removeAllChildren();
    m.graphics.clear();
    s_oDrawStage.addChild(r);
    s_oDrawStage.addChild(y);
    var a = s_oSpriteLibrary.getSprite("canvas_drawing");
    l = a.width;
    k = a.height;
    w = createBitmap(a);
    y.addChild(w);
    s_oDrawStage.update();
    s_oStage.update()
  };
  this.unload = function() {
    q.unload();
    u.off("mousedown", this._setAdvice);
    createjs.Tween.removeAllTweens();
    s_oStage.removeAllChildren();
    s_oStage.update()
  };
  this.onExit = function() {
    this.unload();
    s_oMain.gotoMenu()
  };
  this._setAdvice = function() {
    null !== f || q.getSliderVisible() || B.colorAdvice(!0)
  };
  this.colorAdvice = function(a) {
    v.visible = a;
    A.visible = a;
    s_oInteractiveStage.update()
  };
  this.update = function() {};
  s_oGame = this;
  COLORS = a.colors;
  MIN_STROKE = a.min_stroke_size;
  MAX_STROKE = a.max_stroke_size;
  AD_SHOW_COUNTER = a.ad_show_counter;
  var B = this;
  this._init()
}
var s_oGame;

function CInterface() {
  var a, c, b, e, d, f, g, h, l, k, n, q, r, m, w, z, y, p, t, u, v = null,
    A, C, B, E, F, D = null,
    G = null;
  this._init = function() {
    m = r = null;
    var x = s_oSpriteLibrary.getSprite("but_exit");
    n = CANVAS_WIDTH - x.height / 2 - 20;
    q = x.height / 2 + 10;
    y = new CGfxButton(n, q, x, !0);
    y.addEventListener(ON_MOUSE_UP, this._onExit, this);
    l = CANVAS_WIDTH - x.width / 2 - 20;
    k = 250;
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) x = s_oSpriteLibrary.getSprite("audio_icon"), z = new CToggle(l, k, x, s_bAudioActive), z.addEventListener(ON_MOUSE_UP, this._onAudioToggle,
      this);
    x = window.document;
    var v = x.documentElement;
    D = v.requestFullscreen || v.mozRequestFullScreen || v.webkitRequestFullScreen || v.msRequestFullscreen;
    G = x.exitFullscreen || x.mozCancelFullScreen || x.webkitExitFullscreen || x.msExitFullscreen;
    !1 === ENABLE_FULLSCREEN && (D = !1);
    x = s_oSpriteLibrary.getSprite("but_fullscreen");
    !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? (a = l, c = k + x.width / 2 + 10) : (a = CANVAS_WIDTH - x.width / 4 - 20, c = 250);
    D && screenfull.enabled && (F = new CToggle(a, c, x, s_bFullscreen, s_oStage), F.addEventListener(ON_MOUSE_UP,
      this._onFullscreenRelease, this));
    x = s_oSpriteLibrary.getSprite("but_save");
    g = x.height / 2 + 20;
    h = x.height / 2 + 10;
    p = new CGfxButton(g, h, x, !0);
    p.addEventListener(ON_MOUSE_UP, this._onSaveAsImg, this);
    x = s_oSpriteLibrary.getSprite("but_print");
    d = x.height / 2 + 20;
    f = 250;
    t = new CGfxButton(d, f, x, !0);
    t.addEventListener(ON_MOUSE_UP, this._onPrinteAsImg, this);
    x = s_oSpriteLibrary.getSprite("but_restart");
    b = x.height / 2 + 20;
    e = 415;
    u = new CGfxButton(b, e, x, !0);
    u.addEventListener(ON_MOUSE_UP, this._onButRestartRelease, this);
    A = new createjs.Container;
    x = 1E3 - EDGEBOARD_Y;
    A.x = CANVAS_WIDTH / 2;
    A.y = x;
    w = [];
    for (x = 0; x < COLORS.length; x++) w[x] = new CPen(50 * x, 0, COLORS[x], x, A);
    s_oInteractiveStage.addChild(A);
    w[COLORS.length] = new CPen(-100, 0, "eraser", COLORS.length, A);
    C = new createjs.Container;
    C.x = 1600;
    C.y = 1E3;
    s_oInteractiveStage.addChild(C);
    x = s_oSpriteLibrary.getSprite("slider");
    B = new CSlider(0, -125, x, MIN_STROKE, MAX_STROKE, C);
    x = s_oSpriteLibrary.getSprite("sliderbox");
    E = new CSliderBox(0, 0, x, C);
    x = B.getValue();
    this.setStroke(x);
    x = A.getBounds();
    A.regX = (x.width - 100) /
      2;
    this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    s_oInteractiveStage.update()
  };
  this.unload = function() {
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) z.unload(), z = null;
    for (var a = 0; a < w.length; a++) w[a].unload();
    D && screenfull.enabled && F.unload();
    y.unload();
    p.unload();
    t.unload();
    u.unload();
    B.unload();
    E.unload();
    s_oInterface = null
  };
  this.disableStroke = function() {
    s_oGame.deleteStroke(!1)
  };
  this.restartStroke = function() {
    s_oGame.setColor(r)
  };
  this.setStroke = function(a) {
    s_oGame.setStroke(a)
  };
  this.getStroke = function() {
    return B.getValue()
  };
  this.setActivePen = function(a, b) {
    this.setSliderVisible(!1);
    s_oGame.setColor(a);
    s_oGame.colorAdvice(!1);
    r = a;
    E.setActive(!1);
    null !== m && w[m].setActive(!1);
    m = b
  };
  this.getCircleSize = function() {
    return B.getValue()
  };
  this.setCircleImage = function(a, b) {
    E.setCircle(a, b)
  };
  this.setSliderVisible = function(a) {
    B.setVisible(a);
    E.setSliderVisible(a);
    a || E.setActive(!1)
  };
  this.getSliderVisible = function() {
    return B.getVisible()
  };
  this._onSaveAsImg = function() {
    s_oGame.saveImg()
  };
  this._onPrinteAsImg = function() {
    s_oGame.printImg()
  };
  this.refreshButtonPos = function(m, r) {
    y.setPosition(n - m, r + q);
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || z.setPosition(l - m, r + k);
    p.setPosition(g + m, r + h);
    t.setPosition(d + m, r + f);
    u.setPosition(b + m, r + e);
    D && screenfull.enabled && F.setPosition(a - m, c + r);
    s_oInteractiveStage.update()
  };
  this._onButHelpRelease = function() {
    v = new CHelpPanel
  };
  this._onButRestartRelease = function() {
    $(s_oMain).trigger("restart_level", 1);
    $(s_oMain).trigger("show_interlevel_ad");
    s_oGame.restartGame()
  };
  this.onExitFromHelp = function() {
    v.unload()
  };
  this.resetFullscreenBut = function() {
    D && screenfull.enabled && F.setActive(s_bFullscreen)
  };
  this._onFullscreenRelease = function() {
    s_bFullscreen ? G.call(window.document) : D.call(window.document.documentElement);
    sizeHandler()
  };
  this._onAudioToggle = function() {
    Howler.mute(s_bAudioActive);
    s_bAudioActive = !s_bAudioActive
  };
  this._onExit = function() {
    $(s_oMain).trigger("end_level", 1);
    $(s_oMain).trigger("end_session");
    $(s_oMain).trigger("show_interlevel_ad");
    s_oGame.onExit()
  };
  s_oInterface = this;
  this._init();
  return this
}
var s_oInterface = null;

function CPen(a, c, b, e, d) {
  var f, g, h, l;
  this._init = function(a, b, c, d, e) {
    f = 50;
    g = d;
    l = e;
    "eraser" === c ? (d = s_oSpriteLibrary.getSprite("eraser"), h = createBitmap(d), h.x = a, h.y = b, h.cache(0, 0, 100, 200), h.on("mousedown", this._setEraser)) : (d = s_oSpriteLibrary.getSprite("pen"), h = createBitmap(d), h.x = a, h.y = b, a = hexToRgb(c).r, b = hexToRgb(c).g, c = hexToRgb(c).b, c = new createjs.ColorFilter(a / 255, b / 255, c / 255, 1), h.filters = [c], h.cache(0, 0, 50, 200), h.on("mousedown", this._setColor));
    h.cursor = "pointer";
    l.addChild(h)
  };
  this.unload = function() {
    h.off("mousedown",
      this._setColor);
    l.removeChild(h)
  };
  this._setColor = function() {
    playSound("click", 1, !1);
    s_oInterface.setActivePen(b, g);
    k.setActive(!0)
  };
  this._setEraser = function() {
    playSound("click", 1, !1);
    s_oInterface.setActivePen("#FFFFFF", g);
    k.setActive(!0)
  };
  this.setActive = function(a) {
    h.y = a ? c - f : c;
    h.updateCache();
    s_oInterface.setCircleImage(s_oInterface.getCircleSize(), s_oGame.getColor());
    s_oInteractiveStage.update()
  };
  var k = this;
  this._init(a, c, b, e, d)
}

function CCreditsPanel() {
  var a, c, b, e;
  this._init = function() {
    a = new createjs.Shape;
    a.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    a.alpha = .7;
    a.on("mousedown", function() {});
    s_oInteractiveStage.addChild(a);
    c = new createjs.Container;
    s_oInteractiveStage.addChild(c);
    var d = s_oSpriteLibrary.getSprite("msg_box"),
      f = createBitmap(d);
    f.regX = d.width / 2;
    f.regY = d.height / 2;
    c.addChild(f);
    c.x = CANVAS_WIDTH / 2;
    c.y = CANVAS_HEIGHT / 2;
    f = new createjs.Text("DEVELOPED BY", " 40px " + PRIMARY_FONT, "#008df0");
    f.y = -d.height / 2 + 180;
    f.textAlign = "center";
    f.textBaseline = "middle";
    f.lineWidth = 400;
    c.addChild(f);
    d = new createjs.Text("www.codethislab.com", " 40px " + PRIMARY_FONT, "#008df0");
    d.y = 90;
    d.textAlign = "center";
    d.textBaseline = "middle";
    d.lineWidth = 400;
    c.addChild(d);
    d = s_oSpriteLibrary.getSprite("ctl_logo");
    e = createBitmap(d);
    e.on("mousedown", this._onLogoButRelease);
    e.regX = d.width / 2;
    e.regY = d.height / 2;
    c.addChild(e);
    d = s_oSpriteLibrary.getSprite("but_exit");
    b = new CGfxButton(1320, 330, d, c);
    b.addEventListener(ON_MOUSE_UP, this.unload,
      this)
  };
  this.unload = function() {
    s_oInteractiveStage.removeChild(a);
    s_oInteractiveStage.removeChild(c);
    b.unload();
    a.off("mousedown", function() {});
    e.off("mousedown", this._onLogoButRelease)
  };
  this._onLogoButRelease = function() {
    window.open("http://www.codethislab.com/index.php?&l=en")
  };
  this._onMoreGamesReleased = function() {
    window.open("http://codecanyon.net/collections/5409142-games")
  };
  this._init()
};
