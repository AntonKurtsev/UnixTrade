!function (h, i, n, o) {
    function l(t, e) {
        this.settings = null, this.options = h.extend({}, l.Defaults, e), this.$element = h(t), this._handlers = {}, this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._widths = [], this._invalidated = {}, this._pipe = [], this._drag = {
            time: null,
            target: null,
            pointer: null,
            stage: {start: null, current: null},
            direction: null
        }, this._states = {
            current: {},
            tags: {initializing: ["busy"], animating: ["busy"], dragging: ["interacting"]}
        }, h.each(["onResize", "onThrottledResize"], h.proxy(function (t, e) {
            this._handlers[e] = h.proxy(this[e], this)
        }, this)), h.each(l.Plugins, h.proxy(function (t, e) {
            this._plugins[t.charAt(0).toLowerCase() + t.slice(1)] = new e(this)
        }, this)), h.each(l.Workers, h.proxy(function (t, e) {
            this._pipe.push({filter: e.filter, run: h.proxy(e.run, this)})
        }, this)), this.setup(), this.initialize()
    }

    l.Defaults = {
        items: 3,
        loop: !1,
        center: !1,
        rewind: !1,
        mouseDrag: !0,
        touchDrag: !0,
        pullDrag: !0,
        freeDrag: !1,
        margin: 0,
        stagePadding: 0,
        merge: !1,
        mergeFit: !0,
        autoWidth: !1,
        startPosition: 0,
        rtl: !1,
        smartSpeed: 250,
        fluidSpeed: !1,
        dragEndSpeed: !1,
        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: i,
        fallbackEasing: "swing",
        info: !1,
        nestedItemSelector: !1,
        itemElement: "div",
        stageElement: "div",
        refreshClass: "owl-refresh",
        loadedClass: "owl-loaded",
        loadingClass: "owl-loading",
        rtlClass: "owl-rtl",
        responsiveClass: "owl-responsive",
        dragClass: "owl-drag",
        itemClass: "owl-item",
        stageClass: "owl-stage",
        stageOuterClass: "owl-stage-outer",
        grabClass: "owl-grab"
    }, l.Width = {Default: "default", Inner: "inner", Outer: "outer"}, l.Type = {
        Event: "event",
        State: "state"
    }, l.Plugins = {}, l.Workers = [{
        filter: ["width", "settings"], run: function () {
            this._width = this.$element.width()
        }
    }, {
        filter: ["width", "items", "settings"], run: function (t) {
            t.current = this._items && this._items[this.relative(this._current)]
        }
    }, {
        filter: ["items", "settings"], run: function () {
            this.$stage.children(".cloned").remove()
        }
    }, {
        filter: ["width", "items", "settings"], run: function (t) {
            var e = this.settings.margin || "", i = !this.settings.autoWidth, s = this.settings.rtl,
                n = {width: "auto", "margin-left": s ? e : "", "margin-right": s ? "" : e};
            !i && this.$stage.children().css(n), t.css = n
        }
    }, {
        filter: ["width", "items", "settings"], run: function (t) {
            var e = (this.width() / this.settings.items).toFixed(3) - this.settings.margin, i = null,
                s = this._items.length, n = !this.settings.autoWidth, o = [];
            for (t.items = {
                merge: !1,
                width: e
            }; s--;) i = this._mergers[s], i = this.settings.mergeFit && Math.min(i, this.settings.items) || i, t.items.merge = 1 < i || t.items.merge, o[s] = n ? e * i : this._items[s].width();
            this._widths = o
        }
    }, {
        filter: ["items", "settings"], run: function () {
            var t = [], e = this._items, i = this.settings, s = Math.max(2 * i.items, 4),
                n = 2 * Math.ceil(e.length / 2), o = i.loop && e.length ? i.rewind ? s : Math.max(s, n) : 0, r = "",
                a = "";
            for (o /= 2; o--;) t.push(this.normalize(t.length / 2, !0)), r += e[t[t.length - 1]][0].outerHTML, t.push(this.normalize(e.length - 1 - (t.length - 1) / 2, !0)), a = e[t[t.length - 1]][0].outerHTML + a;
            this._clones = t, h(r).addClass("cloned").appendTo(this.$stage), h(a).addClass("cloned").prependTo(this.$stage)
        }
    }, {
        filter: ["width", "items", "settings"], run: function () {
            for (var t = this.settings.rtl ? 1 : -1, e = this._clones.length + this._items.length, i = -1, s = 0, n = 0, o = []; ++i < e;) s = o[i - 1] || 0, n = this._widths[this.relative(i)] + this.settings.margin, o.push(s + n * t);
            this._coordinates = o
        }
    }, {
        filter: ["width", "items", "settings"], run: function () {
            var t = this.settings.stagePadding, e = this._coordinates, i = {
                width: Math.ceil(Math.abs(e[e.length - 1])) + 2 * t,
                "padding-left": t || "",
                "padding-right": t || ""
            };
            this.$stage.css(i)
        }
    }, {
        filter: ["width", "items", "settings"], run: function (t) {
            var e = this._coordinates.length, i = !this.settings.autoWidth, s = this.$stage.children();
            if (i && t.items.merge) for (; e--;) t.css.width = this._widths[this.relative(e)], s.eq(e).css(t.css); else i && (t.css.width = t.items.width, s.css(t.css))
        }
    }, {
        filter: ["items"], run: function () {
            this._coordinates.length < 1 && this.$stage.removeAttr("style")
        }
    }, {
        filter: ["width", "items", "settings"], run: function (t) {
            t.current = t.current ? this.$stage.children().index(t.current) : 0, t.current = Math.max(this.minimum(), Math.min(this.maximum(), t.current)), this.reset(t.current)
        }
    }, {
        filter: ["position"], run: function () {
            this.animate(this.coordinates(this._current))
        }
    }, {
        filter: ["width", "position", "items", "settings"], run: function () {
            var t, e, i, s, n = this.settings.rtl ? 1 : -1, o = 2 * this.settings.stagePadding,
                r = this.coordinates(this.current()) + o, a = r + this.width() * n, h = [];
            for (i = 0, s = this._coordinates.length; i < s; i++) t = this._coordinates[i - 1] || 0, e = Math.abs(this._coordinates[i]) + o * n, (this.op(t, "<=", r) && this.op(t, ">", a) || this.op(e, "<", r) && this.op(e, ">", a)) && h.push(i);
            this.$stage.children(".active").removeClass("active"), this.$stage.children(":eq(" + h.join("), :eq(") + ")").addClass("active"), this.settings.center && (this.$stage.children(".center").removeClass("center"), this.$stage.children().eq(this.current()).addClass("center"))
        }
    }], l.prototype.initialize = function () {
        var t, e, i;
        this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading") && (t = this.$element.find("img"), e = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : o, i = this.$element.children(e).width(), t.length && i <= 0 && this.preloadAutoWidthImages(t)), this.$element.addClass(this.options.loadingClass), this.$stage = h("<" + this.settings.stageElement + ' class="' + this.settings.stageClass + '"/>').wrap('<div class="' + this.settings.stageOuterClass + '"/>'), this.$element.append(this.$stage.parent()), this.replace(this.$element.children().not(this.$stage.parent())), this.$element.is(":visible") ? this.refresh() : this.invalidate("width"), this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass), this.registerEventHandlers(), this.leave("initializing"), this.trigger("initialized")
    }, l.prototype.setup = function () {
        var e = this.viewport(), t = this.options.responsive, i = -1, s = null;
        t ? (h.each(t, function (t) {
            t <= e && i < t && (i = Number(t))
        }), "function" == typeof(s = h.extend({}, this.options, t[i])).stagePadding && (s.stagePadding = s.stagePadding()), delete s.responsive, s.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + i))) : s = h.extend({}, this.options), this.trigger("change", {
            property: {
                name: "settings",
                value: s
            }
        }), this._breakpoint = i, this.settings = s, this.invalidate("settings"), this.trigger("changed", {
            property: {
                name: "settings",
                value: this.settings
            }
        })
    }, l.prototype.optionsLogic = function () {
        this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1)
    }, l.prototype.prepare = function (t) {
        var e = this.trigger("prepare", {content: t});
        return e.data || (e.data = h("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(t)), this.trigger("prepared", {content: e.data}), e.data
    }, l.prototype.update = function () {
        for (var t = 0, e = this._pipe.length, i = h.proxy(function (t) {
            return this[t]
        }, this._invalidated), s = {}; t < e;) (this._invalidated.all || 0 < h.grep(this._pipe[t].filter, i).length) && this._pipe[t].run(s), t++;
        this._invalidated = {}, !this.is("valid") && this.enter("valid")
    }, l.prototype.width = function (t) {
        switch (t = t || l.Width.Default) {
            case l.Width.Inner:
            case l.Width.Outer:
                return this._width;
            default:
                return this._width - 2 * this.settings.stagePadding + this.settings.margin
        }
    }, l.prototype.refresh = function () {
        this.enter("refreshing"), this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$element.addClass(this.options.refreshClass), this.update(), this.$element.removeClass(this.options.refreshClass), this.leave("refreshing"), this.trigger("refreshed")
    }, l.prototype.onThrottledResize = function () {
        i.clearTimeout(this.resizeTimer), this.resizeTimer = i.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate)
    }, l.prototype.onResize = function () {
        return !!this._items.length && this._width !== this.$element.width() && !!this.$element.is(":visible") && (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), !1) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized")))
    }, l.prototype.registerEventHandlers = function () {
        h.support.transition && this.$stage.on(h.support.transition.end + ".owl.core", h.proxy(this.onTransitionEnd, this)), !1 !== this.settings.responsive && this.on(i, "resize", this._handlers.onThrottledResize), this.settings.mouseDrag && (this.$element.addClass(this.options.dragClass), this.$stage.on("mousedown.owl.core", h.proxy(this.onDragStart, this)), this.$stage.on("dragstart.owl.core selectstart.owl.core", function () {
            return !1
        })), this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", h.proxy(this.onDragStart, this)), this.$stage.on("touchcancel.owl.core", h.proxy(this.onDragEnd, this)))
    }, l.prototype.onDragStart = function (t) {
        var e = null;
        3 !== t.which && (h.support.transform ? e = {
            x: (e = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(","))[16 === e.length ? 12 : 4],
            y: e[16 === e.length ? 13 : 5]
        } : (e = this.$stage.position(), e = {
            x: this.settings.rtl ? e.left + this.$stage.width() - this.width() + this.settings.margin : e.left,
            y: e.top
        }), this.is("animating") && (h.support.transform ? this.animate(e.x) : this.$stage.stop(), this.invalidate("position")), this.$element.toggleClass(this.options.grabClass, "mousedown" === t.type), this.speed(0), this._drag.time = (new Date).getTime(), this._drag.target = h(t.target), this._drag.stage.start = e, this._drag.stage.current = e, this._drag.pointer = this.pointer(t), h(n).on("mouseup.owl.core touchend.owl.core", h.proxy(this.onDragEnd, this)), h(n).one("mousemove.owl.core touchmove.owl.core", h.proxy(function (t) {
            var e = this.difference(this._drag.pointer, this.pointer(t));
            h(n).on("mousemove.owl.core touchmove.owl.core", h.proxy(this.onDragMove, this)), Math.abs(e.x) < Math.abs(e.y) && this.is("valid") || (t.preventDefault(), this.enter("dragging"), this.trigger("drag"))
        }, this)))
    }, l.prototype.onDragMove = function (t) {
        var e = null, i = null, s = null, n = this.difference(this._drag.pointer, this.pointer(t)),
            o = this.difference(this._drag.stage.start, n);
        this.is("dragging") && (t.preventDefault(), this.settings.loop ? (e = this.coordinates(this.minimum()), i = this.coordinates(this.maximum() + 1) - e, o.x = ((o.x - e) % i + i) % i + e) : (e = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum()), i = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum()), s = this.settings.pullDrag ? -1 * n.x / 5 : 0, o.x = Math.max(Math.min(o.x, e + s), i + s)), this._drag.stage.current = o, this.animate(o.x))
    }, l.prototype.onDragEnd = function (t) {
        var e = this.difference(this._drag.pointer, this.pointer(t)), i = this._drag.stage.current,
            s = 0 < e.x ^ this.settings.rtl ? "left" : "right";
        h(n).off(".owl.core"), this.$element.removeClass(this.options.grabClass), (0 !== e.x && this.is("dragging") || !this.is("valid")) && (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(this.closest(i.x, 0 !== e.x ? s : this._drag.direction)), this.invalidate("position"), this.update(), this._drag.direction = s, (3 < Math.abs(e.x) || 300 < (new Date).getTime() - this._drag.time) && this._drag.target.one("click.owl.core", function () {
            return !1
        })), this.is("dragging") && (this.leave("dragging"), this.trigger("dragged"))
    }, l.prototype.closest = function (i, s) {
        var n = -1, o = this.width(), r = this.coordinates();
        return this.settings.freeDrag || h.each(r, h.proxy(function (t, e) {
            return "left" === s && e - 30 < i && i < e + 30 ? n = t : "right" === s && e - o - 30 < i && i < e - o + 30 ? n = t + 1 : this.op(i, "<", e) && this.op(i, ">", r[t + 1] || e - o) && (n = "left" === s ? t + 1 : t), -1 === n
        }, this)), this.settings.loop || (this.op(i, ">", r[this.minimum()]) ? n = i = this.minimum() : this.op(i, "<", r[this.maximum()]) && (n = i = this.maximum())), n
    }, l.prototype.animate = function (t) {
        var e = 0 < this.speed();
        this.is("animating") && this.onTransitionEnd(), e && (this.enter("animating"), this.trigger("translate")), h.support.transform3d && h.support.transition ? this.$stage.css({
            transform: "translate3d(" + t + "px,0px,0px)",
            transition: this.speed() / 1e3 + "s"
        }) : e ? this.$stage.animate({left: t + "px"}, this.speed(), this.settings.fallbackEasing, h.proxy(this.onTransitionEnd, this)) : this.$stage.css({left: t + "px"})
    }, l.prototype.is = function (t) {
        return this._states.current[t] && 0 < this._states.current[t]
    }, l.prototype.current = function (t) {
        if (t === o) return this._current;
        if (0 === this._items.length) return o;
        if (t = this.normalize(t), this._current !== t) {
            var e = this.trigger("change", {property: {name: "position", value: t}});
            e.data !== o && (t = this.normalize(e.data)), this._current = t, this.invalidate("position"), this.trigger("changed", {
                property: {
                    name: "position",
                    value: this._current
                }
            })
        }
        return this._current
    }, l.prototype.invalidate = function (t) {
        return "string" === h.type(t) && (this._invalidated[t] = !0, this.is("valid") && this.leave("valid")), h.map(this._invalidated, function (t, e) {
            return e
        })
    }, l.prototype.reset = function (t) {
        (t = this.normalize(t)) !== o && (this._speed = 0, this._current = t, this.suppress(["translate", "translated"]), this.animate(this.coordinates(t)), this.release(["translate", "translated"]))
    }, l.prototype.normalize = function (t, e) {
        var i = this._items.length, s = e ? 0 : this._clones.length;
        return !this.isNumeric(t) || i < 1 ? t = o : (t < 0 || i + s <= t) && (t = ((t - s / 2) % i + i) % i + s / 2), t
    }, l.prototype.relative = function (t) {
        return t -= this._clones.length / 2, this.normalize(t, !0)
    }, l.prototype.maximum = function (t) {
        var e, i, s, n = this.settings, o = this._coordinates.length;
        if (n.loop) o = this._clones.length / 2 + this._items.length - 1; else if (n.autoWidth || n.merge) {
            for (e = this._items.length, i = this._items[--e].width(), s = this.$element.width(); e-- && !((i += this._items[e].width() + this.settings.margin) > s);) ;
            o = e + 1
        } else o = n.center ? this._items.length - 1 : this._items.length - n.items;
        return t && (o -= this._clones.length / 2), Math.max(o, 0)
    }, l.prototype.minimum = function (t) {
        return t ? 0 : this._clones.length / 2
    }, l.prototype.items = function (t) {
        return t === o ? this._items.slice() : (t = this.normalize(t, !0), this._items[t])
    }, l.prototype.mergers = function (t) {
        return t === o ? this._mergers.slice() : (t = this.normalize(t, !0), this._mergers[t])
    }, l.prototype.clones = function (i) {
        var e = this._clones.length / 2, s = e + this._items.length, n = function (t) {
            return t % 2 == 0 ? s + t / 2 : e - (t + 1) / 2
        };
        return i === o ? h.map(this._clones, function (t, e) {
            return n(e)
        }) : h.map(this._clones, function (t, e) {
            return t === i ? n(e) : null
        })
    }, l.prototype.speed = function (t) {
        return t !== o && (this._speed = t), this._speed
    }, l.prototype.coordinates = function (t) {
        var e, i = 1, s = t - 1;
        return t === o ? h.map(this._coordinates, h.proxy(function (t, e) {
            return this.coordinates(e)
        }, this)) : (this.settings.center ? (this.settings.rtl && (i = -1, s = t + 1), e = this._coordinates[t], e += (this.width() - e + (this._coordinates[s] || 0)) / 2 * i) : e = this._coordinates[s] || 0, e = Math.ceil(e))
    }, l.prototype.duration = function (t, e, i) {
        return 0 === i ? 0 : Math.min(Math.max(Math.abs(e - t), 1), 6) * Math.abs(i || this.settings.smartSpeed)
    }, l.prototype.to = function (t, e) {
        var i = this.current(), s = null, n = t - this.relative(i), o = (0 < n) - (n < 0), r = this._items.length,
            a = this.minimum(), h = this.maximum();
        this.settings.loop ? (!this.settings.rewind && Math.abs(n) > r / 2 && (n += -1 * o * r), (s = (((t = i + n) - a) % r + r) % r + a) !== t && s - n <= h && 0 < s - n && (i = s - n, t = s, this.reset(i))) : t = this.settings.rewind ? (t % (h += 1) + h) % h : Math.max(a, Math.min(h, t)), this.speed(this.duration(i, t, e)), this.current(t), this.$element.is(":visible") && this.update()
    }, l.prototype.next = function (t) {
        t = t || !1, this.to(this.relative(this.current()) + 1, t)
    }, l.prototype.prev = function (t) {
        t = t || !1, this.to(this.relative(this.current()) - 1, t)
    }, l.prototype.onTransitionEnd = function (t) {
        if (t !== o && (t.stopPropagation(), (t.target || t.srcElement || t.originalTarget) !== this.$stage.get(0))) return !1;
        this.leave("animating"), this.trigger("translated")
    }, l.prototype.viewport = function () {
        var t;
        return this.options.responsiveBaseElement !== i ? t = h(this.options.responsiveBaseElement).width() : i.innerWidth ? t = i.innerWidth : n.documentElement && n.documentElement.clientWidth ? t = n.documentElement.clientWidth : console.warn("Can not detect viewport width."), t
    }, l.prototype.replace = function (t) {
        this.$stage.empty(), this._items = [], t && (t = t instanceof jQuery ? t : h(t)), this.settings.nestedItemSelector && (t = t.find("." + this.settings.nestedItemSelector)), t.filter(function () {
            return 1 === this.nodeType
        }).each(h.proxy(function (t, e) {
            e = this.prepare(e), this.$stage.append(e), this._items.push(e), this._mergers.push(1 * e.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)
        }, this)), this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items")
    }, l.prototype.add = function (t, e) {
        var i = this.relative(this._current);
        e = e === o ? this._items.length : this.normalize(e, !0), t = t instanceof jQuery ? t : h(t), this.trigger("add", {
            content: t,
            position: e
        }), t = this.prepare(t), 0 === this._items.length || e === this._items.length ? (0 === this._items.length && this.$stage.append(t), 0 !== this._items.length && this._items[e - 1].after(t), this._items.push(t), this._mergers.push(1 * t.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)) : (this._items[e].before(t), this._items.splice(e, 0, t), this._mergers.splice(e, 0, 1 * t.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)), this._items[i] && this.reset(this._items[i].index()), this.invalidate("items"), this.trigger("added", {
            content: t,
            position: e
        })
    }, l.prototype.remove = function (t) {
        (t = this.normalize(t, !0)) !== o && (this.trigger("remove", {
            content: this._items[t],
            position: t
        }), this._items[t].remove(), this._items.splice(t, 1), this._mergers.splice(t, 1), this.invalidate("items"), this.trigger("removed", {
            content: null,
            position: t
        }))
    }, l.prototype.preloadAutoWidthImages = function (t) {
        t.each(h.proxy(function (t, e) {
            this.enter("pre-loading"), e = h(e), h(new Image).one("load", h.proxy(function (t) {
                e.attr("src", t.target.src), e.css("opacity", 1), this.leave("pre-loading"), !this.is("pre-loading") && !this.is("initializing") && this.refresh()
            }, this)).attr("src", e.attr("src") || e.attr("data-src") || e.attr("data-src-retina"))
        }, this))
    }, l.prototype.destroy = function () {
        for (var t in this.$element.off(".owl.core"), this.$stage.off(".owl.core"), h(n).off(".owl.core"), !1 !== this.settings.responsive && (i.clearTimeout(this.resizeTimer), this.off(i, "resize", this._handlers.onThrottledResize)), this._plugins) this._plugins[t].destroy();
        this.$stage.children(".cloned").remove(), this.$stage.unwrap(), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), "")).removeData("owl.carousel")
    }, l.prototype.op = function (t, e, i) {
        var s = this.settings.rtl;
        switch (e) {
            case"<":
                return s ? i < t : t < i;
            case">":
                return s ? t < i : i < t;
            case">=":
                return s ? t <= i : i <= t;
            case"<=":
                return s ? i <= t : t <= i
        }
    }, l.prototype.on = function (t, e, i, s) {
        t.addEventListener ? t.addEventListener(e, i, s) : t.attachEvent && t.attachEvent("on" + e, i)
    }, l.prototype.off = function (t, e, i, s) {
        t.removeEventListener ? t.removeEventListener(e, i, s) : t.detachEvent && t.detachEvent("on" + e, i)
    }, l.prototype.trigger = function (t, e, i, s, n) {
        var o = {item: {count: this._items.length, index: this.current()}},
            r = h.camelCase(h.grep(["on", t, i], function (t) {
                return t
            }).join("-").toLowerCase()),
            a = h.Event([t, "owl", i || "carousel"].join(".").toLowerCase(), h.extend({relatedTarget: this}, o, e));
        return this._supress[t] || (h.each(this._plugins, function (t, e) {
            e.onTrigger && e.onTrigger(a)
        }), this.register({
            type: l.Type.Event,
            name: t
        }), this.$element.trigger(a), this.settings && "function" == typeof this.settings[r] && this.settings[r].call(this, a)), a
    }, l.prototype.enter = function (t) {
        h.each([t].concat(this._states.tags[t] || []), h.proxy(function (t, e) {
            this._states.current[e] === o && (this._states.current[e] = 0), this._states.current[e]++
        }, this))
    }, l.prototype.leave = function (t) {
        h.each([t].concat(this._states.tags[t] || []), h.proxy(function (t, e) {
            this._states.current[e]--
        }, this))
    }, l.prototype.register = function (i) {
        if (i.type === l.Type.Event) {
            if (h.event.special[i.name] || (h.event.special[i.name] = {}), !h.event.special[i.name].owl) {
                var e = h.event.special[i.name]._default;
                h.event.special[i.name]._default = function (t) {
                    return !e || !e.apply || t.namespace && -1 !== t.namespace.indexOf("owl") ? t.namespace && -1 < t.namespace.indexOf("owl") : e.apply(this, arguments)
                }, h.event.special[i.name].owl = !0
            }
        } else i.type === l.Type.State && (this._states.tags[i.name] ? this._states.tags[i.name] = this._states.tags[i.name].concat(i.tags) : this._states.tags[i.name] = i.tags, this._states.tags[i.name] = h.grep(this._states.tags[i.name], h.proxy(function (t, e) {
            return h.inArray(t, this._states.tags[i.name]) === e
        }, this)))
    }, l.prototype.suppress = function (t) {
        h.each(t, h.proxy(function (t, e) {
            this._supress[e] = !0
        }, this))
    }, l.prototype.release = function (t) {
        h.each(t, h.proxy(function (t, e) {
            delete this._supress[e]
        }, this))
    }, l.prototype.pointer = function (t) {
        var e = {x: null, y: null};
        return (t = (t = t.originalEvent || t || i.event).touches && t.touches.length ? t.touches[0] : t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t).pageX ? (e.x = t.pageX, e.y = t.pageY) : (e.x = t.clientX, e.y = t.clientY), e
    }, l.prototype.isNumeric = function (t) {
        return !isNaN(parseFloat(t))
    }, l.prototype.difference = function (t, e) {
        return {x: t.x - e.x, y: t.y - e.y}
    }, h.fn.owlCarousel = function (e) {
        var s = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            var t = h(this), i = t.data("owl.carousel");
            i || (i = new l(this, "object" == typeof e && e), t.data("owl.carousel", i), h.each(["next", "prev", "to", "destroy", "refresh", "replace", "add", "remove"], function (t, e) {
                i.register({
                    type: l.Type.Event,
                    name: e
                }), i.$element.on(e + ".owl.carousel.core", h.proxy(function (t) {
                    t.namespace && t.relatedTarget !== this && (this.suppress([e]), i[e].apply(this, [].slice.call(arguments, 1)), this.release([e]))
                }, i))
            })), "string" == typeof e && "_" !== e.charAt(0) && i[e].apply(i, s)
        })
    }, h.fn.owlCarousel.Constructor = l
}(window.Zepto || window.jQuery, window, document), function (e, i, t, s) {
    var n = function (t) {
        this._core = t, this._interval = null, this._visible = null, this._handlers = {
            "initialized.owl.carousel": e.proxy(function (t) {
                t.namespace && this._core.settings.autoRefresh && this.watch()
            }, this)
        }, this._core.options = e.extend({}, n.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    n.Defaults = {autoRefresh: !0, autoRefreshInterval: 500}, n.prototype.watch = function () {
        this._interval || (this._visible = this._core.$element.is(":visible"), this._interval = i.setInterval(e.proxy(this.refresh, this), this._core.settings.autoRefreshInterval))
    }, n.prototype.refresh = function () {
        this._core.$element.is(":visible") !== this._visible && (this._visible = !this._visible, this._core.$element.toggleClass("owl-hidden", !this._visible), this._visible && this._core.invalidate("width") && this._core.refresh())
    }, n.prototype.destroy = function () {
        var t, e;
        for (t in i.clearInterval(this._interval), this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, e.fn.owlCarousel.Constructor.Plugins.AutoRefresh = n
}(window.Zepto || window.jQuery, window, document), function (a, o, t, e) {
    var i = function (t) {
        this._core = t, this._loaded = [], this._handlers = {
            "initialized.owl.carousel change.owl.carousel resized.owl.carousel": a.proxy(function (t) {
                if (t.namespace && this._core.settings && this._core.settings.lazyLoad && (t.property && "position" == t.property.name || "initialized" == t.type)) for (var e = this._core.settings, i = e.center && Math.ceil(e.items / 2) || e.items, s = e.center && -1 * i || 0, n = (t.property && void 0 !== t.property.value ? t.property.value : this._core.current()) + s, o = this._core.clones().length, r = a.proxy(function (t, e) {
                    this.load(e)
                }, this); s++ < i;) this.load(o / 2 + this._core.relative(n)), o && a.each(this._core.clones(this._core.relative(n)), r), n++
            }, this)
        }, this._core.options = a.extend({}, i.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    i.Defaults = {lazyLoad: !1}, i.prototype.load = function (t) {
        var e = this._core.$stage.children().eq(t), i = e && e.find(".owl-lazy");
        !i || -1 < a.inArray(e.get(0), this._loaded) || (i.each(a.proxy(function (t, e) {
            var i, s = a(e), n = 1 < o.devicePixelRatio && s.attr("data-src-retina") || s.attr("data-src");
            this._core.trigger("load", {
                element: s,
                url: n
            }, "lazy"), s.is("img") ? s.one("load.owl.lazy", a.proxy(function () {
                s.css("opacity", 1), this._core.trigger("loaded", {element: s, url: n}, "lazy")
            }, this)).attr("src", n) : ((i = new Image).onload = a.proxy(function () {
                s.css({"background-image": 'url("' + n + '")', opacity: "1"}), this._core.trigger("loaded", {
                    element: s,
                    url: n
                }, "lazy")
            }, this), i.src = n)
        }, this)), this._loaded.push(e.get(0)))
    }, i.prototype.destroy = function () {
        var t, e;
        for (t in this.handlers) this._core.$element.off(t, this.handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.Lazy = i
}(window.Zepto || window.jQuery, window, document), function (o, t, e, i) {
    var s = function (t) {
        this._core = t, this._handlers = {
            "initialized.owl.carousel refreshed.owl.carousel": o.proxy(function (t) {
                t.namespace && this._core.settings.autoHeight && this.update()
            }, this), "changed.owl.carousel": o.proxy(function (t) {
                t.namespace && this._core.settings.autoHeight && "position" == t.property.name && this.update()
            }, this), "loaded.owl.lazy": o.proxy(function (t) {
                t.namespace && this._core.settings.autoHeight && t.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update()
            }, this)
        }, this._core.options = o.extend({}, s.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    s.Defaults = {autoHeight: !1, autoHeightClass: "owl-height"}, s.prototype.update = function () {
        var t, e = this._core._current, i = e + this._core.settings.items,
            s = this._core.$stage.children().toArray().slice(e, i), n = [];
        o.each(s, function (t, e) {
            n.push(o(e).height())
        }), t = Math.max.apply(null, n), this._core.$stage.parent().height(t).addClass(this._core.settings.autoHeightClass)
    }, s.prototype.destroy = function () {
        var t, e;
        for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, o.fn.owlCarousel.Constructor.Plugins.AutoHeight = s
}(window.Zepto || window.jQuery, window, document), function (c, t, e, i) {
    var s = function (t) {
        this._core = t, this._videos = {}, this._playing = null, this._handlers = {
            "initialized.owl.carousel": c.proxy(function (t) {
                t.namespace && this._core.register({type: "state", name: "playing", tags: ["interacting"]})
            }, this), "resize.owl.carousel": c.proxy(function (t) {
                t.namespace && this._core.settings.video && this.isInFullScreen() && t.preventDefault()
            }, this), "refreshed.owl.carousel": c.proxy(function (t) {
                t.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove()
            }, this), "changed.owl.carousel": c.proxy(function (t) {
                t.namespace && "position" === t.property.name && this._playing && this.stop()
            }, this), "prepared.owl.carousel": c.proxy(function (t) {
                if (t.namespace) {
                    var e = c(t.content).find(".owl-video");
                    e.length && (e.css("display", "none"), this.fetch(e, c(t.content)))
                }
            }, this)
        }, this._core.options = c.extend({}, s.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", c.proxy(function (t) {
            this.play(t)
        }, this))
    };
    s.Defaults = {video: !1, videoHeight: !1, videoWidth: !1}, s.prototype.fetch = function (t, e) {
        var i = t.attr("data-vimeo-id") ? "vimeo" : t.attr("data-vzaar-id") ? "vzaar" : "youtube",
            s = t.attr("data-vimeo-id") || t.attr("data-youtube-id") || t.attr("data-vzaar-id"),
            n = t.attr("data-width") || this._core.settings.videoWidth,
            o = t.attr("data-height") || this._core.settings.videoHeight, r = t.attr("href");
        if (!r) throw new Error("Missing video URL.");
        if (-1 < (s = r.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/))[3].indexOf("youtu")) i = "youtube"; else if (-1 < s[3].indexOf("vimeo")) i = "vimeo"; else {
            if (!(-1 < s[3].indexOf("vzaar"))) throw new Error("Video URL not supported.");
            i = "vzaar"
        }
        s = s[6], this._videos[r] = {
            type: i,
            id: s,
            width: n,
            height: o
        }, e.attr("data-video", r), this.thumbnail(t, this._videos[r])
    }, s.prototype.thumbnail = function (e, t) {
        var i, s, n = t.width && t.height ? 'style="width:' + t.width + "px;height:" + t.height + 'px;"' : "",
            o = e.find("img"), r = "src", a = "", h = this._core.settings, l = function (t) {
                '<div class="owl-video-play-icon"></div>', i = h.lazyLoad ? '<div class="owl-video-tn ' + a + '" ' + r + '="' + t + '"></div>' : '<div class="owl-video-tn" style="opacity:1;background-image:url(' + t + ')"></div>', e.after(i), e.after('<div class="owl-video-play-icon"></div>')
            };
        if (e.wrap('<div class="owl-video-wrapper"' + n + "></div>"), this._core.settings.lazyLoad && (r = "data-src", a = "owl-lazy"), o.length) return l(o.attr(r)), o.remove(), !1;
        "youtube" === t.type ? (s = "//img.youtube.com/vi/" + t.id + "/hqdefault.jpg", l(s)) : "vimeo" === t.type ? c.ajax({
            type: "GET",
            url: "//vimeo.com/api/v2/video/" + t.id + ".json",
            jsonp: "callback",
            dataType: "jsonp",
            success: function (t) {
                s = t[0].thumbnail_large, l(s)
            }
        }) : "vzaar" === t.type && c.ajax({
            type: "GET",
            url: "//vzaar.com/api/videos/" + t.id + ".json",
            jsonp: "callback",
            dataType: "jsonp",
            success: function (t) {
                s = t.framegrab_url, l(s)
            }
        })
    }, s.prototype.stop = function () {
        this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null, this._core.leave("playing"), this._core.trigger("stopped", null, "video")
    }, s.prototype.play = function (t) {
        var e, i = c(t.target).closest("." + this._core.settings.itemClass), s = this._videos[i.attr("data-video")],
            n = s.width || "100%", o = s.height || this._core.$stage.height();
        this._playing || (this._core.enter("playing"), this._core.trigger("play", null, "video"), i = this._core.items(this._core.relative(i.index())), this._core.reset(i.index()), "youtube" === s.type ? e = '<iframe width="' + n + '" height="' + o + '" src="//www.youtube.com/embed/' + s.id + "?autoplay=1&rel=0&v=" + s.id + '" frameborder="0" allowfullscreen></iframe>' : "vimeo" === s.type ? e = '<iframe src="//player.vimeo.com/video/' + s.id + '?autoplay=1" width="' + n + '" height="' + o + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' : "vzaar" === s.type && (e = '<iframe frameborder="0"height="' + o + '"width="' + n + '" allowfullscreen mozallowfullscreen webkitAllowFullScreen src="//view.vzaar.com/' + s.id + '/player?autoplay=true"></iframe>'), c('<div class="owl-video-frame">' + e + "</div>").insertAfter(i.find(".owl-video")), this._playing = i.addClass("owl-video-playing"))
    }, s.prototype.isInFullScreen = function () {
        var t = e.fullscreenElement || e.mozFullScreenElement || e.webkitFullscreenElement;
        return t && c(t).parent().hasClass("owl-video-frame")
    }, s.prototype.destroy = function () {
        var t, e;
        for (t in this._core.$element.off("click.owl.video"), this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, c.fn.owlCarousel.Constructor.Plugins.Video = s
}(window.Zepto || window.jQuery, window, document), function (r, t, e, i) {
    var s = function (t) {
        this.core = t, this.core.options = r.extend({}, s.Defaults, this.core.options), this.swapping = !0, this.previous = void 0, this.next = void 0, this.handlers = {
            "change.owl.carousel": r.proxy(function (t) {
                t.namespace && "position" == t.property.name && (this.previous = this.core.current(), this.next = t.property.value)
            }, this), "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": r.proxy(function (t) {
                t.namespace && (this.swapping = "translated" == t.type)
            }, this), "translate.owl.carousel": r.proxy(function (t) {
                t.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
            }, this)
        }, this.core.$element.on(this.handlers)
    };
    s.Defaults = {animateOut: !1, animateIn: !1}, s.prototype.swap = function () {
        if (1 === this.core.settings.items && r.support.animation && r.support.transition) {
            this.core.speed(0);
            var t, e = r.proxy(this.clear, this), i = this.core.$stage.children().eq(this.previous),
                s = this.core.$stage.children().eq(this.next), n = this.core.settings.animateIn,
                o = this.core.settings.animateOut;
            this.core.current() !== this.previous && (o && (t = this.core.coordinates(this.previous) - this.core.coordinates(this.next), i.one(r.support.animation.end, e).css({left: t + "px"}).addClass("animated owl-animated-out").addClass(o)), n && s.one(r.support.animation.end, e).addClass("animated owl-animated-in").addClass(n))
        }
    }, s.prototype.clear = function (t) {
        r(t.target).css({left: ""}).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.onTransitionEnd()
    }, s.prototype.destroy = function () {
        var t, e;
        for (t in this.handlers) this.core.$element.off(t, this.handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, r.fn.owlCarousel.Constructor.Plugins.Animate = s
}(window.Zepto || window.jQuery, window, document), function (i, s, n, t) {
    var e = function (t) {
        this._core = t, this._timeout = null, this._paused = !1, this._handlers = {
            "changed.owl.carousel": i.proxy(function (t) {
                t.namespace && "settings" === t.property.name ? this._core.settings.autoplay ? this.play() : this.stop() : t.namespace && "position" === t.property.name && this._core.settings.autoplay && this._setAutoPlayInterval()
            }, this), "initialized.owl.carousel": i.proxy(function (t) {
                t.namespace && this._core.settings.autoplay && this.play()
            }, this), "play.owl.autoplay": i.proxy(function (t, e, i) {
                t.namespace && this.play(e, i)
            }, this), "stop.owl.autoplay": i.proxy(function (t) {
                t.namespace && this.stop()
            }, this), "mouseover.owl.autoplay": i.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
            }, this), "mouseleave.owl.autoplay": i.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play()
            }, this), "touchstart.owl.core": i.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
            }, this), "touchend.owl.core": i.proxy(function () {
                this._core.settings.autoplayHoverPause && this.play()
            }, this)
        }, this._core.$element.on(this._handlers), this._core.options = i.extend({}, e.Defaults, this._core.options)
    };
    e.Defaults = {
        autoplay: !1,
        autoplayTimeout: 5e3,
        autoplayHoverPause: !1,
        autoplaySpeed: !1
    }, e.prototype.play = function (t, e) {
        this._paused = !1, this._core.is("rotating") || (this._core.enter("rotating"), this._setAutoPlayInterval())
    }, e.prototype._getNextTimeout = function (t, e) {
        return this._timeout && s.clearTimeout(this._timeout), s.setTimeout(i.proxy(function () {
            this._paused || this._core.is("busy") || this._core.is("interacting") || n.hidden || this._core.next(e || this._core.settings.autoplaySpeed)
        }, this), t || this._core.settings.autoplayTimeout)
    }, e.prototype._setAutoPlayInterval = function () {
        this._timeout = this._getNextTimeout()
    }, e.prototype.stop = function () {
        this._core.is("rotating") && (s.clearTimeout(this._timeout), this._core.leave("rotating"))
    }, e.prototype.pause = function () {
        this._core.is("rotating") && (this._paused = !0)
    }, e.prototype.destroy = function () {
        var t, e;
        for (t in this.stop(), this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, i.fn.owlCarousel.Constructor.Plugins.autoplay = e
}(window.Zepto || window.jQuery, window, document), function (o, t, e, i) {
    "use strict";
    var s = function (t) {
        this._core = t, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = {
            next: this._core.next,
            prev: this._core.prev,
            to: this._core.to
        }, this._handlers = {
            "prepared.owl.carousel": o.proxy(function (t) {
                t.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + o(t.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>")
            }, this), "added.owl.carousel": o.proxy(function (t) {
                t.namespace && this._core.settings.dotsData && this._templates.splice(t.position, 0, this._templates.pop())
            }, this), "remove.owl.carousel": o.proxy(function (t) {
                t.namespace && this._core.settings.dotsData && this._templates.splice(t.position, 1)
            }, this), "changed.owl.carousel": o.proxy(function (t) {
                t.namespace && "position" == t.property.name && this.draw()
            }, this), "initialized.owl.carousel": o.proxy(function (t) {
                t.namespace && !this._initialized && (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), this._initialized = !0, this._core.trigger("initialized", null, "navigation"))
            }, this), "refreshed.owl.carousel": o.proxy(function (t) {
                t.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation"))
            }, this)
        }, this._core.options = o.extend({}, s.Defaults, this._core.options), this.$element.on(this._handlers)
    };
    s.Defaults = {
        nav: !1,
        navText: ["prev", "next"],
        navSpeed: !1,
        navElement: "div",
        navContainer: !1,
        navContainerClass: "owl-nav",
        navClass: ["owl-prev", "owl-next"],
        slideBy: 1,
        dotClass: "owl-dot",
        dotsClass: "owl-dots",
        dots: !0,
        dotsEach: !1,
        dotsData: !1,
        dotsSpeed: !1,
        dotsContainer: !1
    }, s.prototype.initialize = function () {
        var t, i = this._core.settings;
        for (t in this._controls.$relative = (i.navContainer ? o(i.navContainer) : o("<div>").addClass(i.navContainerClass).appendTo(this.$element)).addClass("disabled"), this._controls.$previous = o("<" + i.navElement + ">").addClass(i.navClass[0]).html(i.navText[0]).prependTo(this._controls.$relative).on("click", o.proxy(function (t) {
            this.prev(i.navSpeed)
        }, this)), this._controls.$next = o("<" + i.navElement + ">").addClass(i.navClass[1]).html(i.navText[1]).appendTo(this._controls.$relative).on("click", o.proxy(function (t) {
            this.next(i.navSpeed)
        }, this)), i.dotsData || (this._templates = [o("<div>").addClass(i.dotClass).append(o("<span>")).prop("outerHTML")]), this._controls.$absolute = (i.dotsContainer ? o(i.dotsContainer) : o("<div>").addClass(i.dotsClass).appendTo(this.$element)).addClass("disabled"), this._controls.$absolute.on("click", "div", o.proxy(function (t) {
            var e = o(t.target).parent().is(this._controls.$absolute) ? o(t.target).index() : o(t.target).parent().index();
            t.preventDefault(), this.to(e, i.dotsSpeed)
        }, this)), this._overrides) this._core[t] = o.proxy(this[t], this)
    }, s.prototype.destroy = function () {
        var t, e, i, s;
        for (t in this._handlers) this.$element.off(t, this._handlers[t]);
        for (e in this._controls) this._controls[e].remove();
        for (s in this.overides) this._core[s] = this._overrides[s];
        for (i in Object.getOwnPropertyNames(this)) "function" != typeof this[i] && (this[i] = null)
    }, s.prototype.update = function () {
        var t, e, i = this._core.clones().length / 2, s = i + this._core.items().length, n = this._core.maximum(!0),
            o = this._core.settings, r = o.center || o.autoWidth || o.dotsData ? 1 : o.dotsEach || o.items;
        if ("page" !== o.slideBy && (o.slideBy = Math.min(o.slideBy, o.items)), o.dots || "page" == o.slideBy) for (this._pages = [], t = i, e = 0; t < s; t++) {
            if (r <= e || 0 === e) {
                if (this._pages.push({start: Math.min(n, t - i), end: t - i + r - 1}), Math.min(n, t - i) === n) break;
                e = 0
            }
            e += this._core.mergers(this._core.relative(t))
        }
    }, s.prototype.draw = function () {
        var t, e = this._core.settings, i = this._core.items().length <= e.items,
            s = this._core.relative(this._core.current()), n = e.loop || e.rewind;
        this._controls.$relative.toggleClass("disabled", !e.nav || i), e.nav && (this._controls.$previous.toggleClass("disabled", !n && s <= this._core.minimum(!0)), this._controls.$next.toggleClass("disabled", !n && s >= this._core.maximum(!0))), this._controls.$absolute.toggleClass("disabled", !e.dots || i), e.dots && (t = this._pages.length - this._controls.$absolute.children().length, e.dotsData && 0 !== t ? this._controls.$absolute.html(this._templates.join("")) : 0 < t ? this._controls.$absolute.append(new Array(t + 1).join(this._templates[0])) : t < 0 && this._controls.$absolute.children().slice(t).remove(), this._controls.$absolute.find(".active").removeClass("active"), this._controls.$absolute.children().eq(o.inArray(this.current(), this._pages)).addClass("active"))
    }, s.prototype.onTrigger = function (t) {
        var e = this._core.settings;
        t.page = {
            index: o.inArray(this.current(), this._pages),
            count: this._pages.length,
            size: e && (e.center || e.autoWidth || e.dotsData ? 1 : e.dotsEach || e.items)
        }
    }, s.prototype.current = function () {
        var i = this._core.relative(this._core.current());
        return o.grep(this._pages, o.proxy(function (t, e) {
            return t.start <= i && t.end >= i
        }, this)).pop()
    }, s.prototype.getPosition = function (t) {
        var e, i, s = this._core.settings;
        return "page" == s.slideBy ? (e = o.inArray(this.current(), this._pages), i = this._pages.length, t ? ++e : --e, e = this._pages[(e % i + i) % i].start) : (e = this._core.relative(this._core.current()), i = this._core.items().length, t ? e += s.slideBy : e -= s.slideBy), e
    }, s.prototype.next = function (t) {
        o.proxy(this._overrides.to, this._core)(this.getPosition(!0), t)
    }, s.prototype.prev = function (t) {
        o.proxy(this._overrides.to, this._core)(this.getPosition(!1), t)
    }, s.prototype.to = function (t, e, i) {
        var s;
        !i && this._pages.length ? (s = this._pages.length, o.proxy(this._overrides.to, this._core)(this._pages[(t % s + s) % s].start, e)) : o.proxy(this._overrides.to, this._core)(t, e)
    }, o.fn.owlCarousel.Constructor.Plugins.Navigation = s
}(window.Zepto || window.jQuery, window, document), function (s, n, t, e) {
    "use strict";
    var i = function (t) {
        this._core = t, this._hashes = {}, this.$element = this._core.$element, this._handlers = {
            "initialized.owl.carousel": s.proxy(function (t) {
                t.namespace && "URLHash" === this._core.settings.startPosition && s(n).trigger("hashchange.owl.navigation")
            }, this), "prepared.owl.carousel": s.proxy(function (t) {
                if (t.namespace) {
                    var e = s(t.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
                    if (!e) return;
                    this._hashes[e] = t.content
                }
            }, this), "changed.owl.carousel": s.proxy(function (t) {
                if (t.namespace && "position" === t.property.name) {
                    var i = this._core.items(this._core.relative(this._core.current())),
                        e = s.map(this._hashes, function (t, e) {
                            return t === i ? e : null
                        }).join();
                    if (!e || n.location.hash.slice(1) === e) return;
                    n.location.hash = e
                }
            }, this)
        }, this._core.options = s.extend({}, i.Defaults, this._core.options), this.$element.on(this._handlers), s(n).on("hashchange.owl.navigation", s.proxy(function (t) {
            var e = n.location.hash.substring(1), i = this._core.$stage.children(),
                s = this._hashes[e] && i.index(this._hashes[e]);
            void 0 !== s && s !== this._core.current() && this._core.to(this._core.relative(s), !1, !0)
        }, this))
    };
    i.Defaults = {URLhashListener: !1}, i.prototype.destroy = function () {
        var t, e;
        for (t in s(n).off("hashchange.owl.navigation"), this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, s.fn.owlCarousel.Constructor.Plugins.Hash = i
}(window.Zepto || window.jQuery, window, document), function (n, t, e, o) {
    var r = n("<support>").get(0).style, a = "Webkit Moz O ms".split(" "), i = {
        transition: {
            end: {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd",
                transition: "transitionend"
            }
        },
        animation: {
            end: {
                WebkitAnimation: "webkitAnimationEnd",
                MozAnimation: "animationend",
                OAnimation: "oAnimationEnd",
                animation: "animationend"
            }
        }
    };

    function s(t, i) {
        var s = !1, e = t.charAt(0).toUpperCase() + t.slice(1);
        return n.each((t + " " + a.join(e + " ") + e).split(" "), function (t, e) {
            if (r[e] !== o) return s = !i || e, !1
        }), s
    }

    function h(t) {
        return s(t, !0)
    }

    !!s("transition") && (n.support.transition = new String(h("transition")), n.support.transition.end = i.transition.end[n.support.transition]), !!s("animation") && (n.support.animation = new String(h("animation")), n.support.animation.end = i.animation.end[n.support.animation]), s("transform") && (n.support.transform = new String(h("transform")), n.support.transform3d = !!s("perspective"))
}(window.Zepto || window.jQuery, window, document), function () {
    function e() {
        this.drawDataset = this.drawDataset.bind(this)
    }

    "undefined" == typeof Chart ? console.warn("Can not find Chart object.") : (e.prototype.beforeDatasetsUpdate = function (t) {
        if (this.parseOptions(t) && "outside" === this.position) {
            var e = 1.5 * this.fontSize + 2;
            t.chartArea.top += e, t.chartArea.bottom -= e
        }
    }, e.prototype.afterDatasetsDraw = function (t) {
        this.parseOptions(t) && (this.labelBounds = [], t.config.data.datasets.forEach(this.drawDataset))
    }, e.prototype.drawDataset = function (t) {
        for (var e = this.ctx, i = this.chartInstance, s = t._meta[Object.keys(t._meta)[0]], n = 0, o = 0; o < s.data.length; o++) {
            var r = s.data[o], a = r._view;
            if (0 !== a.circumference || this.showZero) {
                switch (this.render) {
                    case"value":
                        var h = t.data[o];
                        this.format && (h = this.format(h)), h = h.toString();
                        break;
                    case"label":
                        h = i.config.data.labels[o];
                        break;
                    case"image":
                        h = this.images[o] ? this.loadImage(this.images[o]) : "";
                        break;
                    default:
                        var l = a.circumference / this.options.circumference * 100;
                        l = parseFloat(l.toFixed(this.precision)), this.showActualPercentages || 100 < (n += l) && (l -= n - 100, l = parseFloat(l.toFixed(this.precision))), h = l + "%"
                }
                if ("function" == typeof this.render && ("object" == typeof(h = this.render({
                        label: i.config.data.labels[o],
                        value: t.data[o],
                        percentage: l,
                        dataset: t,
                        index: o
                    })) && (h = this.loadImage(h))), !h) break;
                if (e.save(), e.beginPath(), e.font = Chart.helpers.fontString(this.fontSize, this.fontStyle, this.fontFamily), "outside" === this.position || "border" === this.position && "pie" === i.config.type) {
                    var c, p = a.outerRadius / 2, u = this.fontSize + 2,
                        d = a.startAngle + (a.endAngle - a.startAngle) / 2;
                    if ("border" === this.position ? c = (a.outerRadius - p) / 2 + p : "outside" === this.position && (c = a.outerRadius - p + p + u), d = {
                            x: a.x + Math.cos(d) * c,
                            y: a.y + Math.sin(d) * c
                        }, "outside" === this.position) {
                        d.x = d.x < a.x ? d.x - u : d.x + u;
                        var g = a.outerRadius + u
                    }
                } else p = a.innerRadius, d = r.tooltipPosition();
                if ("function" == typeof(u = this.fontColor) ? u = u({
                        label: i.config.data.labels[o],
                        value: t.data[o],
                        percentage: l,
                        text: h,
                        backgroundColor: t.backgroundColor[o],
                        dataset: t,
                        index: o
                    }) : "string" != typeof u && (u = u[o] || this.options.defaultFontColor), this.arc) g || (g = (p + a.outerRadius) / 2), e.fillStyle = u, e.textBaseline = "middle", this.drawArcText(h, g, a, this.overlap); else {
                    p = this.measureText(h), a = d.x - p.width / 2, p = d.x + p.width / 2;
                    var f = d.y - this.fontSize / 2, m = d.y + this.fontSize / 2;
                    (this.overlap || ("outside" === this.position ? this.checkTextBound(a, p, f, m) : r.inRange(a, f) && r.inRange(a, m) && r.inRange(p, f) && r.inRange(p, m))) && this.fillText(h, d, u)
                }
                e.restore()
            }
        }
    }, e.prototype.parseOptions = function (t) {
        var e = t.options.pieceLabel;
        return !!e && (this.chartInstance = t, this.ctx = t.chart.ctx, this.options = t.config.options, this.render = e.render || e.mode, this.position = e.position || "default", this.arc = e.arc, this.format = e.format, this.precision = e.precision || 0, this.fontSize = e.fontSize || this.options.defaultFontSize, this.fontColor = e.fontColor || this.options.defaultFontColor, this.fontStyle = e.fontStyle || this.options.defaultFontStyle, this.fontFamily = e.fontFamily || this.options.defaultFontFamily, this.hasTooltip = t.tooltip._active && t.tooltip._active.length, this.showZero = e.showZero, this.overlap = e.overlap, this.images = e.images || [], this.showActualPercentages = e.showActualPercentages || !1, !0)
    }, e.prototype.checkTextBound = function (t, e, i, s) {
        for (var n = this.labelBounds, o = 0; o < n.length; ++o) {
            for (var r = n[o], a = [[t, i], [t, s], [e, i], [e, s]], h = 0; h < a.length; ++h) {
                var l = a[h][0], c = a[h][1];
                if (l >= r.left && l <= r.right && c >= r.top && c <= r.bottom) return !1
            }
            for (a = [[r.left, r.top], [r.left, r.bottom], [r.right, r.top], [r.right, r.bottom]], h = 0; h < a.length; ++h) if (l = a[h][0], c = a[h][1], t <= l && l <= e && i <= c && c <= s) return !1
        }
        return n.push({left: t, right: e, top: i, bottom: s}), !0
    }, e.prototype.measureText = function (t) {
        return "object" == typeof t ? {width: t.width, height: t.height} : this.ctx.measureText(t)
    }, e.prototype.fillText = function (t, e, i) {
        var s = this.ctx;
        "object" == typeof t ? s.drawImage(t, e.x - t.width / 2, e.y - t.height / 2, t.width, t.height) : (s.fillStyle = i, s.textBaseline = "top", s.textAlign = "center", s.fillText(t, e.x, e.y - this.fontSize / 2))
    }, e.prototype.loadImage = function (t) {
        var e = new Image;
        return e.src = t.src, e.width = t.width, e.height = t.height, e
    }, e.prototype.drawArcText = function (t, e, i, s) {
        var n = this.ctx, o = i.x, r = i.y, a = i.startAngle;
        i = i.endAngle, n.save(), n.translate(o, r), r = i - a;
        var h = a += Math.PI / 2;
        if (a += ((i += Math.PI / 2) - ((o = this.measureText(t)).width / e + a)) / 2, s || !(r < i - a)) if ("string" == typeof t) for (n.rotate(a), s = 0; s < t.length; s++) a = t.charAt(s), o = n.measureText(a), n.save(), n.translate(0, -1 * e), n.fillText(a, 0, 0), n.restore(), n.rotate(o.width / e); else n.rotate((h + i) / 2), n.translate(0, -1 * e), this.fillText(t, {
            x: 0,
            y: 0
        });
        n.restore()
    }, Chart.pluginService.register({
        beforeInit: function (t) {
            t.pieceLabel = new e
        }, beforeDatasetsUpdate: function (t) {
            t.pieceLabel.beforeDatasetsUpdate(t)
        }, afterDatasetsDraw: function (t) {
            t.pieceLabel.afterDatasetsDraw(t)
        }
    }))
}(), function (c, t, e, p, i) {
    for (var u, d, g, f, s = e.createElement("div").style, n = "Transform", o = ["O" + n, "ms" + n, "Webkit" + n, "Moz" + n], r = o.length, m = ("Float32Array" in t), h = /Matrix([^)]*)/, a = /^\s*matrix\(\s*1\s*,\s*0\s*,\s*0\s*,\s*1\s*(?:,\s*0(?:px)?\s*){2}\)\s*$/, l = "transform", v = "transformOrigin", y = "translate", _ = "rotate", w = "scale", x = "skew", b = "matrix"; r--;) o[r] in s && (c.support[l] = u = o[r], c.support[v] = u + "Origin");

    function C(t) {
        t = t.split(")");
        var e, i, s, n = c.trim, o = -1, r = t.length - 1, a = m ? new Float32Array(6) : [],
            h = m ? new Float32Array(6) : [], l = m ? new Float32Array(6) : [1, 0, 0, 1, 0, 0];
        for (a[0] = a[3] = l[0] = l[3] = 1, a[1] = a[2] = a[4] = a[5] = 0; ++o < r;) {
            switch (i = n((e = t[o].split("("))[0]), s = e[1], h[0] = h[3] = 1, h[1] = h[2] = h[4] = h[5] = 0, i) {
                case y + "X":
                    h[4] = parseInt(s, 10);
                    break;
                case y + "Y":
                    h[5] = parseInt(s, 10);
                    break;
                case y:
                    s = s.split(","), h[4] = parseInt(s[0], 10), h[5] = parseInt(s[1] || 0, 10);
                    break;
                case _:
                    s = E(s), h[0] = p.cos(s), h[1] = p.sin(s), h[2] = -p.sin(s), h[3] = p.cos(s);
                    break;
                case w + "X":
                    h[0] = +s;
                    break;
                case w + "Y":
                    h[3] = s;
                    break;
                case w:
                    s = s.split(","), h[0] = s[0], h[3] = 1 < s.length ? s[1] : s[0];
                    break;
                case x + "X":
                    h[2] = p.tan(E(s));
                    break;
                case x + "Y":
                    h[1] = p.tan(E(s));
                    break;
                case b:
                    s = s.split(","), h[0] = s[0], h[1] = s[1], h[2] = s[2], h[3] = s[3], h[4] = parseInt(s[4], 10), h[5] = parseInt(s[5], 10)
            }
            l[0] = a[0] * h[0] + a[2] * h[1], l[1] = a[1] * h[0] + a[3] * h[1], l[2] = a[0] * h[2] + a[2] * h[3], l[3] = a[1] * h[2] + a[3] * h[3], l[4] = a[0] * h[4] + a[2] * h[5] + a[4], l[5] = a[1] * h[4] + a[3] * h[5] + a[5], a = [l[0], l[1], l[2], l[3], l[4], l[5]]
        }
        return l
    }

    function $(t) {
        var e, i, s, n = t[0], o = t[1], r = t[2], a = t[3];
        return n * a - o * r ? (r -= (n /= e = p.sqrt(n * n + o * o)) * (s = n * r + (o /= e) * a), a -= o * s, s /= i = p.sqrt(r * r + a * a), n * (a /= i) < o * (r /= i) && (n = -n, o = -o, s = -s, e = -e)) : e = i = s = 0, [[y, [+t[4], +t[5]]], [_, p.atan2(o, n)], [x + "X", p.atan(s)], [w, [e, i]]]
    }

    function k(t, e) {
        var i, s = +!t.indexOf(w), n = t.replace(/e[XY]/, "e");
        switch (t) {
            case y + "Y":
            case w + "Y":
                e = [s, e ? parseFloat(e) : s];
                break;
            case y + "X":
            case y:
            case w + "X":
                i = 1;
            case w:
                e = e ? (e = e.split(",")) && [parseFloat(e[0]), parseFloat(1 < e.length ? e[1] : t == w ? i || e[0] : s + "")] : [s, s];
                break;
            case x + "X":
            case x + "Y":
            case _:
                e = e ? E(e) : 0;
                break;
            case b:
                return $(e ? P(e) : [1, 0, 0, 1, 0, 0])
        }
        return [[n, e]]
    }

    function S(t) {
        return a.test(t)
    }

    function z(t) {
        return t.replace(/(?:\([^)]*\))|\s/g, "")
    }

    function T(t, e, i) {
        for (; i = e.shift();) t.push(i)
    }

    function E(t) {
        return ~t.indexOf("deg") ? parseInt(t, 10) * (2 * p.PI / 360) : ~t.indexOf("grad") ? parseInt(t, 10) * (p.PI / 200) : parseFloat(t)
    }

    function P(t) {
        return [(t = /([^,]*),([^,]*),([^,]*),([^,]*),([^,p]*)(?:px)?,([^)p]*)(?:px)?/.exec(t))[1], t[2], t[3], t[4], t[5], t[6]]
    }

    u || (c.support.matrixFilter = d = "" === s.filter), c.cssNumber[l] = c.cssNumber[v] = !0, u && u != l ? (c.cssProps[l] = u, c.cssProps[v] = u + "Origin", u == "Moz" + n ? g = {
        get: function (t, e) {
            return e ? c.css(t, u).split("px").join("") : t.style[u]
        }, set: function (t, e) {
            t.style[u] = /matrix\([^)p]*\)/.test(e) ? e.replace(/matrix((?:[^,]*,){4})([^,]*),([^)]*)/, b + "$1$2px,$3px") : e
        }
    } : /^1\.[0-5](?:\.|$)/.test(c.fn.jquery) && (g = {
        get: function (t, e) {
            return e ? c.css(t, u.replace(/^ms/, "Ms")) : t.style[u]
        }
    })) : d && (g = {
        get: function (t, e, i) {
            var s, n, o = e && t.currentStyle ? t.currentStyle : t.style;
            return s = o && h.test(o.filter) ? [(s = RegExp.$1.split(","))[0].split("=")[1], s[2].split("=")[1], s[1].split("=")[1], s[3].split("=")[1]] : [1, 0, 0, 1], c.cssHooks[v] ? (n = c._data(t, "transformTranslate", void 0), s[4] = n ? n[0] : 0, s[5] = n ? n[1] : 0) : (s[4] = o && parseInt(o.left, 10) || 0, s[5] = o && parseInt(o.top, 10) || 0), i ? s : b + "(" + s + ")"
        }, set: function (t, e, i) {
            var s, n, o, r, a = t.style;
            i || (a.zoom = 1), n = ["Matrix(M11=" + (e = C(e))[0], "M12=" + e[2], "M21=" + e[1], "M22=" + e[3], "SizingMethod='auto expand'"].join(), o = (s = t.currentStyle) && s.filter || a.filter || "", a.filter = h.test(o) ? o.replace(h, n) : o + " progid:DXImageTransform.Microsoft." + n + ")", c.cssHooks[v] ? c.cssHooks[v].set(t, e) : ((r = c.transform.centerOrigin) && (a["margin" == r ? "marginLeft" : "left"] = -t.offsetWidth / 2 + t.clientWidth / 2 + "px", a["margin" == r ? "marginTop" : "top"] = -t.offsetHeight / 2 + t.clientHeight / 2 + "px"), a.left = e[4] + "px", a.top = e[5] + "px")
        }
    }), g && (c.cssHooks[l] = g), f = g && g.get || c.css, c.fx.step.transform = function (t) {
        var e, i, s, n, o = t.elem, r = t.start, a = t.end, h = t.pos, l = "";
        for (r && "string" != typeof r || (r || (r = f(o, u)), d && (o.style.zoom = 1), a = a.split("+=").join(r), c.extend(t, function (t, e) {
            var i, s, n, o, r = {start: [], end: []}, a = -1;
            if (("none" == t || S(t)) && (t = ""), ("none" == e || S(e)) && (e = ""), t && e && !e.indexOf("matrix") && P(t).join() == P(e.split(")")[0]).join() && (r.origin = t, t = "", e = e.slice(e.indexOf(")") + 1)), t || e) {
                if (t && e && z(t) != z(e)) r.start = $(C(t)), r.end = $(C(e)); else for (t && (t = t.split(")")) && (i = t.length), e && (e = e.split(")")) && (i = e.length); ++a < i - 1;) t[a] && (s = t[a].split("(")), e[a] && (n = e[a].split("(")), o = c.trim((s || n)[0]), T(r.start, k(o, s ? s[1] : 0)), T(r.end, k(o, n ? n[1] : 0));
                return r
            }
        }(r, a)), r = t.start, a = t.end), e = r.length; e--;) switch (i = r[e], s = a[e], n = 0, i[0]) {
            case y:
                n = "px";
            case w:
                n || (n = ""), l = i[0] + "(" + p.round(1e5 * (i[1][0] + (s[1][0] - i[1][0]) * h)) / 1e5 + n + "," + p.round(1e5 * (i[1][1] + (s[1][1] - i[1][1]) * h)) / 1e5 + n + ")" + l;
                break;
            case x + "X":
            case x + "Y":
            case _:
                l = i[0] + "(" + p.round(1e5 * (i[1] + (s[1] - i[1]) * h)) / 1e5 + "rad)" + l
        }
        t.origin && (l = t.origin + l), g && g.set ? g.set(o, l, 1) : o.style[u] = l
    }, c.transform = {centerOrigin: "margin"}
}(jQuery, window, document, Math), function (r) {
    r.extend(r.easing, {
        spincrementEasing: function (t, e, i, s, n) {
            return e == n ? i + s : s * (1 - Math.pow(2, -10 * e / n)) + i
        }
    }), r.fn.spincrement = function (t) {
        var n = r.extend({
            from: 0,
            to: !1,
            decimalPlaces: 0,
            decimalPoint: ".",
            thousandSeparator: ",",
            duration: 1e3,
            leeway: 50,
            easing: "spincrementEasing",
            fade: !0
        }, t), e = new RegExp(/^(-?[0-9]+)([0-9]{3})/);

        function o(t) {
            if (t = t.toFixed(n.decimalPlaces), 0 < n.decimalPlaces && "." != n.decimalPoint && (t = t.replace(".", n.decimalPoint)), n.thousandSeparator) for (; e.test(t);) t = t.replace(e, "$1" + n.thousandSeparator + "$2");
            return t
        }

        return this.each(function () {
            var e = r(this), t = n.from, i = 0 != n.to ? n.to : parseFloat(e.html()), s = n.duration;
            n.leeway && (s += Math.round(n.duration * ((2 * Math.random() - 1) * n.leeway / 100))), e.css("counter", t), n.fade && e.css("opacity", 0), e.animate({
                counter: i,
                opacity: 1
            }, {
                easing: n.easing, duration: s, step: function (t) {
                    e.css("visibility", "visible"), e.html(o(t * i))
                }, complete: function () {
                    e.css("counter", null), e.html(o(i))
                }
            })
        })
    }
}(jQuery), function (a) {
    a.fn.extend({
        customSelect: function (t) {
            if (void 0 === document.body.style.maxHeight) return this;
            var e = (t = a.extend({customClass: "customSelect", mapClass: !0, mapStyle: !0}, t)).customClass,
                o = function (t, e) {
                    var i = t.find(":selected"), s = e.children(":first"), n = i.html() || "&nbsp;";
                    s.html(n), i.attr("disabled") ? e.addClass(r("DisabledOption")) : e.removeClass(r("DisabledOption")), setTimeout(function () {
                        e.removeClass(r("Open")), a(document).off("mouseup.customSelect")
                    }, 60)
                }, r = function (t) {
                    return e + t
                };
            return this.each(function () {
                var i = a(this), s = a("<span />").addClass(r("Inner")), n = a("<span />");
                i.after(n.append(s)), n.addClass(e), t.mapClass && n.addClass(i.attr("class")), t.mapStyle && n.attr("style", i.attr("style")), i.addClass("hasCustomSelect").on("render.customSelect", function () {
                    o(i, n), i.css("width", "");
                    var t = parseInt(i.outerWidth(), 10) - (parseInt(n.outerWidth(), 10) - parseInt(n.width(), 10));
                    n.css({display: "inline-block"});
                    var e = n.outerHeight();
                    i.attr("disabled") ? n.addClass(r("Disabled")) : n.removeClass(r("Disabled")), s.css({
                        width: t,
                        display: "inline-block"
                    }), i.css({
                        "-webkit-appearance": "menulist-button",
                        width: n.outerWidth(),
                        position: "absolute",
                        opacity: 0,
                        height: e,
                        fontSize: n.css("font-size")
                    })
                }).on("change.customSelect", function () {
                    n.addClass(r("Changed")), o(i, n)
                }).on("keyup.customSelect", function (t) {
                    n.hasClass(r("Open")) ? 13 != t.which && 27 != t.which || o(i, n) : (i.trigger("blur.customSelect"), i.trigger("focus.customSelect"))
                }).on("mousedown.customSelect", function () {
                    n.removeClass(r("Changed"))
                }).on("mouseup.customSelect", function (t) {
                    n.hasClass(r("Open")) || (0 < a("." + r("Open")).not(n).length && "undefined" != typeof InstallTrigger ? i.trigger("focus.customSelect") : (n.addClass(r("Open")), t.stopPropagation(), a(document).one("mouseup.customSelect", function (t) {
                        t.target != i.get(0) && a.inArray(t.target, i.find("*").get()) < 0 ? i.trigger("blur.customSelect") : o(i, n)
                    })))
                }).on("focus.customSelect", function () {
                    n.removeClass(r("Changed")).addClass(r("Focus"))
                }).on("blur.customSelect", function () {
                    n.removeClass(r("Focus") + " " + r("Open"))
                }).on("mouseenter.customSelect", function () {
                    n.addClass(r("Hover"))
                }).on("mouseleave.customSelect", function () {
                    n.removeClass(r("Hover"))
                }).trigger("render.customSelect")
            })
        }
    })
}(jQuery), function (e) {
    var i = Function("return this")() || (0, eval)("this");
    "function" == typeof define && define.amd ? define(["jquery"], function (t) {
        return i.radialIndicator = e(t, i)
    }) : "object" == typeof module && module.exports ? module.exports = i.document ? e(require("jquery"), i) : function (t) {
        if (!t.document) throw new Error("radialIndiactor requires a window with a document");
        return e(require("jquery")(t), t)
    } : i.radialIndicator = e(i.jQuery, i)
}(function (i, t, M) {
    function O(t) {
        t = t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (t, e, i, s) {
            return e + e + i + i + s + s
        });
        var e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
        return e ? [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)] : null
    }

    function I(t, e, i, s) {
        return Math.round(i + (s - i) * t / e)
    }

    function s(t, p) {
        function e(t) {
            if (p.interaction) {
                t.preventDefault();
                var e = -Math.max(-1, Math.min(1, t.wheelDelta || -t.detail)),
                    i = null != p.precision ? p.precision : 0, s = Math.pow(10, i), n = p.maxValue - p.minValue,
                    o = u.current_value + Math.round(s * e * n / Math.min(n, 100)) / s;
                return u.value(o), !1
            }
        }

        var u = this;
        p = function () {
            for (var t = arguments, e = t[0], i = 1, s = t.length; i < s; i++) {
                var n = t[i];
                for (var o in n) n.hasOwnProperty(o) && (e[o] = n[o])
            }
            return e
        }({}, n.defaults, p = p || {}), this.indOption = p, "string" == typeof t && (t = a.querySelector(t)), t.length && (t = t[0]), this.container = t;
        var r = a.createElement("canvas");
        t.appendChild(r), this.canElm = r, this.ctx = r.getContext("2d"), this.current_value = p.initValue || p.minValue || 0;
        var i = function (t) {
            if (p.interaction) {
                var e = "touchstart" == t.type ? "touchmove" : "mousemove",
                    i = "touchstart" == t.type ? "touchend" : "mouseup", s = r.getBoundingClientRect(),
                    l = s.top + r.offsetHeight / 2, c = s.left + r.offsetWidth / 2, n = function (t) {
                        t.preventDefault();
                        var e = t.clientX || t.touches[0].clientX, i = t.clientY || t.touches[0].clientY,
                            s = (j + A + Math.atan2(i - l, e - c)) % (j + .0175), n = p.radius - 1 + p.barWidth / 2,
                            o = j * n, r = null != p.precision ? p.precision : 0, a = Math.pow(10, r),
                            h = Math.round(a * s * n * (p.maxValue - p.minValue) / o) / a;
                        u.value(h)
                    }, o = function () {
                        a.removeEventListener(e, n, !1), a.removeEventListener(i, o, !1)
                    };
                a.addEventListener(e, n, !1), a.addEventListener(i, o, !1)
            }
        };
        r.addEventListener("touchstart", i, !1), r.addEventListener("mousedown", i, !1), r.addEventListener("mousewheel", e, !1), r.addEventListener("DOMMouseScroll", e, !1)
    }

    function n(t, e) {
        var i = new s(t, e);
        return i._init(), i
    }

    var e, o, a = t.document, j = 2 * Math.PI, A = Math.PI / 2,
        h = (e = a.createElement("canvas").getContext("2d"), o = (t.devicePixelRatio || 1) / (e.webkitBackingStorePixelRatio || e.mozBackingStorePixelRatio || e.msBackingStorePixelRatio || e.oBackingStorePixelRatio || e.backingStorePixelRatio || 1), function (t, e, i) {
            var s = i || a.createElement("canvas");
            return s.width = t * o, s.height = e * o, s.style.width = t + "px", s.style.height = e + "px", s.getContext("2d").setTransform(o, 0, 0, o, 0, 0), s
        });
    return n.defaults = {
        radius: 50,
        barWidth: 5,
        barBgColor: "#eeeeee",
        barColor: "#99CC33",
        format: null,
        frameTime: 10,
        frameNum: null,
        fontColor: null,
        fontFamily: null,
        fontWeight: "bold",
        fontSize: null,
        textBaseline: "middle",
        interpolate: !0,
        percentage: !(s.prototype = {
            constructor: n, _init: function () {
                var r, t = this.indOption, e = this.canElm, i = (this.ctx, 2 * (t.radius + t.barWidth));
                return this.formatter = "function" == typeof t.format ? t.format : (r = t.format, function (t) {
                    if (!r) return t.toString();
                    for (var e = (t = t || 0).toString().split("").reverse(), i = r.split("").reverse(), s = 0, n = 0, o = i.length; s < o && e.length; s++) "#" == i[s] && (i[n = s] = e.shift());
                    return i.splice(n + 1, i.lastIndexOf("#") - n, e.reverse().join("")), i.reverse().join("")
                }), this.maxLength = t.percentage ? 4 : this.formatter(t.maxValue).length, h(i, i, e), this._drawBarBg(), this.value(this.current_value), this
            }, _drawBarBg: function () {
                var t = this.indOption, e = this.ctx, i = 2 * (t.radius + t.barWidth) / 2;
                e.strokeStyle = t.barBgColor, e.lineWidth = t.barWidth, "transparent" != t.barBgColor && (e.beginPath(), e.arc(i, i, t.radius - 1 + t.barWidth / 2, 0, 2 * Math.PI), e.stroke())
            }, value: function (t) {
                if (t === M || isNaN(t)) return this.current_value;
                t = parseFloat(t);
                var e = this.ctx, i = this.indOption, s = i.barColor, n = 2 * (i.radius + i.barWidth), o = i.minValue,
                    r = i.maxValue, a = n / 2;
                t = t < o ? o : r < t ? r : t;
                var h, l, c, p, u, d, g, f, m, v = null != i.precision ? i.precision : 0, y = Math.pow(10, v),
                    _ = Math.round((t - o) * y / (r - o) * 100) / y, w = i.percentage ? _ + "%" : this.formatter(t);
                if (this.current_value = t, e.clearRect(0, 0, n, n), this._drawBarBg(), "object" == typeof s) for (var x = Object.keys(s), b = 1, C = x.length; b < C; b++) {
                    var $ = x[b - 1], k = x[b], S = s[$], z = s[k],
                        T = t == $ ? S : t == k ? z : $ < t && t < k && (i.interpolate ? (h = t, l = $, c = k, p = S, void 0, d = -1 != (u = z).indexOf("#") ? O(u) : u.match(/\d+/g), g = -1 != p.indexOf("#") ? O(p) : p.match(/\d+/g), f = c - l, m = h - l, d && g ? "rgb(" + I(m, f, g[0], d[0]) + "," + I(m, f, g[1], d[1]) + "," + I(m, f, g[2], d[2]) + ")" : null) : z);
                    if (0 != T) {
                        s = T;
                        break
                    }
                }
                if (e.strokeStyle = s, i.roundCorner && (e.lineCap = "round"), e.beginPath(), e.arc(a, a, i.radius - 1 + i.barWidth / 2, -A, j * _ / 100 - A, !1), e.stroke(), i.displayNumber) {
                    var E = e.font.split(" "), P = i.fontWeight,
                        D = i.fontSize || n / (this.maxLength - (Math.floor(1.4 * this.maxLength / 4) - 1));
                    E = i.fontFamily || E[E.length - 1], e.fillStyle = i.fontColor || s, e.font = P + " " + D + "px " + E, e.textAlign = "center", e.textBaseline = i.textBaseline, e.fillText(w, a, a)
                }
                return i.onChange.call(this.container, t), this
            }, animate: function (t) {
                var e = this.indOption, i = this.current_value || e.minValue, s = this, n = e.minValue, o = e.maxValue,
                    r = e.frameNum || (e.percentage ? 100 : 500),
                    a = null != e.precision ? e.precision : Math.ceil(Math.log(o - n / r)), h = Math.pow(10, a),
                    l = Math.round((o - n) * h / r) / h, c = (t = t < n ? n : o < t ? o : t) < i;
                return this.intvFunc && clearInterval(this.intvFunc), this.intvFunc = setInterval(function () {
                    if (!c && t <= i || c && i <= t) {
                        if (s.current_value == i) return clearInterval(s.intvFunc), void(e.onAnimationComplete && e.onAnimationComplete(s.current_value));
                        i = t
                    }
                    s.value(i), i != t && (i += c ? -l : l)
                }, e.frameTime), this
            }, option: function (t, e) {
                return e === M ? this.option[t] : (-1 != ["radius", "barWidth", "barBgColor", "format", "maxValue", "percentage"].indexOf(t) && (this.indOption[t] = e, this._init().value(this.current_value)), void(this.indOption[t] = e))
            }
        }),
        precision: null,
        displayNumber: !0,
        roundCorner: !1,
        minValue: 0,
        maxValue: 100,
        initValue: 0,
        interaction: !1,
        onChange: function () {
        }
    }, t.radialIndicator = n, i && (i.fn.radialIndicator = function (e) {
        return this.each(function () {
            var t = n(this, e);
            i.data(this, "radialIndicator", t)
        })
    }), n
});
var windowHeight = document.documentElement.clientHeight, windowWidth = document.documentElement.clientWidth,
    incrementDigits = function () {
        var n = [];
        return {
            init: function (t, e) {
                if (-1 == n.indexOf(t)) {
                    var i = {thousandSeparator: "", duration: 2e3};
                    if (e = e || !1) for (var s in i) e[s] || (e[s] = i[s]); else e = i;
                    $(t).spincrement(e), n.push(t)
                }
            }
        }
    }();

function animatedBlocksParam(t) {
    var e = document.querySelector(t);
    return {section: e, sectionBg: !!e && document.querySelector(t + "-bg"), sectionOffset: e ? e.offsetTop : e}
}

function histogrammMenu(e) {
    var i = e.querySelector(".active-border");
    e.addEventListener("click", function (t) {
        "SPAN" == t.target.tagName && (i.style.marginLeft = t.target.offsetLeft + "px", i.style.width = t.target.offsetWidth + "px", e.querySelector(".current").classList.remove("current"), t.target.className = "current")
    })
}

function showVisible() {
    for (var t = document.querySelectorAll(".animate-visible"), e = 0; e < t.length; e++) {
        var i = t[e];
        isVisible(i) && i.classList.remove("animate-visible")
    }
}

function isVisible(t) {
    var e = t.getBoundingClientRect(), i = 0 < e.top && e.top < windowHeight,
        s = e.bottom < windowHeight && 0 < e.bottom;
    return i || s
}

function displayPopupMsg(t) {
    $(".popup-msg .popup-msg-info").html(t);
    var e = $(".popup-shadow");
    $(".popup").removeClass("visible"), e.fadeIn(300, function () {
        $(".popup.popup-msg").addClass("visible")
    })
}

$("input[type=text],input[type=password],input[type=tel],input[type=email],input[type=time],input[type=date],input[type=url], textarea").on({
    focus: function () {
        var t = $(this).closest("fieldset");
        t.removeClass("has_error"), t.find("label, .field-border").addClass("focused")
    }, blur: function () {
        var t = $(this).closest("fieldset");
        "" == this.value && t.find("label, .field-border").removeClass("focused")
    }
}), $("input[type=checkbox]").on({
    change: function () {
        $(this).closest("label").toggleClass("checked")
    }
}), $("input[type=radio]").on({
    change: function () {
        var t = this.name, e = $(this);
        $("input[name=" + t + "]").each(function () {
            $(this).prop("checked", !1), $(this).closest("label").removeClass("checked")
        }), e.prop("checked", !0), $(this).closest("label").addClass("checked")
    }
}), $(".inputfile").each(function () {
    var t = $(this), i = t.next("label"), s = i.html();
    t.on("change", function (t) {
        var e = "";
        this.files && 1 < this.files.length ? e = (this.getAttribute("data-multiple-caption") || "").replace("{count}", this.files.length) : t.target.value && (e = t.target.value.split("\\").pop()), e ? i.find("span").html(e) : i.html(s)
    }), t.on("focus", function () {
        t.addClass("has-focus")
    }).on("blur", function () {
        t.removeClass("has-focus")
    })
}), $("fieldset input").each(function (t) {
    var e = $(this).parent();
    "" == $(this).val() ? e.find("label, .field-border").removeClass("focused") : e.find("label, .field-border").addClass("focused")
}), $("fieldset input[type=checkbox], fieldset input[type=radio]").each(function (t) {
    var e = $(this).parent();
    $(this).prop("checked") ? e.addClass("checked") : e.removeClass("checked")
}), $("fieldset select").customSelect(), $(".popup-toggle").on("click", function (t) {
    t.preventDefault();
    var e = $(".popup-shadow"), i = $(this).attr("data-target");
    $(".popup").removeClass("visible"), e.fadeIn(300, function () {
        $(".popup." + i).addClass("visible")
    })
}), $(".close-wrap").on("click", function () {
    var t = $(".popup-shadow");
    $(this).attr("data-target");
    $(".popup").removeClass("visible"), t.fadeOut(600)
}), window.addEventListener("load", function () {
    $(".mobile-burger, .switch-sidebar-menu").on("click", function () {
        $("body").toggleClass("minified")
    }), showVisible(), $(".rates-informer.owl-carousel").owlCarousel({
        loop:true,
        autoplay:true,
        autoplayTimeout:2000,
        autoplayHoverPause:true,
        responsive: {
            0: {items: 1},
            480: {items: 2},
            768: {items: 3},
            1024: {items: 4},
            1170: {items: 5},
            1380: {items: 6},
            1600: {items: 8}
        }, dots: !1, nav: !0
    })
});
var pageHeaderBg = document.querySelector(".page-header-bg"), sticky = $(".sticky-header"),
    sticky_is_visible = "hidden";
sticky.removeClass("visible");
var lastScrollTop = 0;
window.addEventListener("scroll", function () {
    var t = window.pageYOffset || document.documentElement.scrollTop;
    pageHeaderBg && 767 < windowWidth && (pageHeaderBg.style.transform = "translateY(" + .25 * t + "px)"), showVisible();
    var e = !1;
    250 < t && t < lastScrollTop && (e = !0), e != sticky_is_visible && (e ? sticky.addClass("visible") : ($(".sticky-header .header-user-menu").slideUp(200), sticky.removeClass("visible"))), sticky_is_visible = e, lastScrollTop = t
}), $(document.forms.sign_in).on("submit", function (t) {
    t.stopPropagation();
    var e = new FormData(this), i = $("#sign_in_username").val(), s = $("#sign_in_password").val(),
        n = ($("#sign_in_keepsigned").prop("checked"), $(this).find(".btn"));
    return i.length < 3 ? ($(".popup-login-username .field-error").html("The username should be more than 3 symbols"), $(".popup-login-username .field-border").addClass("focused"), $(".popup-login-username").addClass("has_error")) : s.length < 8 ? ($(".popup-login-password .field-error").html("The length of the password should be more than 8 chars"), $(".popup-login-password").addClass("has_error")) : $.ajax({
        url: "/signin",
        type: "POST",
        data: e,
        cache: !1,
        dataType: "json",
        processData: !1,
        contentType: !1,
        success: function (t) {
            "success" == t.status ? location.href = "/dashboard" : $(".popup-login-errors").html(t.message).removeClass("dn")
        },
        complete: function () {
            n.prop("disabled", !1), i.val(""), s.val("")
        }
    }), !1
}), $(document.forms.reset_password).on("submit", function (t) {
    t.stopPropagation();
    var e = new FormData(this), i = $(".popup-forgot .btn");
    return i.prop("disabled", !0), $.ajax({
        url: "/password/reset",
        type: "POST",
        data: e,
        cache: !1,
        dataType: "json",
        processData: !1,
        contentType: !1,
        success: function (t) {
            "success" == t.status ? ($("div.popup-forgot").removeClass("visible"), $("div.popup-msg-info").html(t.message), $("div.popup-msg").addClass("visible")) : $(".popup-forgot-errors").html(t.message).removeClass("dn")
        },
        complete: function () {
            i.prop("disabled", !1), $("#reset_password_for_username").val("")
        }
    }), !1
}), $(document).on("click", function (t) {
    $(t.target).closest(".login").length || "none" != $(t.target).closest(".header-user-menu").css("display") && $(".header-user-menu").slideUp(300)
}), $(".show-user-menu").on("click", function () {
    $(this).parent().find(".header-user-menu").slideToggle(300)
}), $(".header-user-menu-switcher").on("click", function () {
    $(this).toggleClass("active")
});
var supportBlock = animatedBlocksParam(".support-block");
window.addEventListener("scroll", function () {
    var t = window.pageYOffset || document.documentElement.scrollTop;
    supportBlock.section && 767 < windowWidth && (supportBlock.sectionBg.style.transform = "translateY(" + .25 * (t - supportBlock.sectionOffset) + "px)")
});