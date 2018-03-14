/*
 * SystemJS v0.19.46
 */
!(function() {
  function e() {
    !(function(e) {
      function t(e, r) {
        if ("string" != typeof e) throw new TypeError("URL must be a string");
        var n = String(e)
          .replace(/^\s+|\s+$/g, "")
          .replace(/\\/g, "/")
          .match(
            /^([^:\/?#]+:)?(?:\/\/(?:([^:@\/?#]*)(?::([^:@\/?#]*))?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/
          );
        if (!n) throw new RangeError("Invalid URL format");
        var a = n[1] || "",
          o = n[2] || "",
          i = n[3] || "",
          s = n[4] || "",
          l = n[5] || "",
          u = n[6] || "",
          d = n[7] || "",
          c = n[8] || "",
          f = n[9] || "";
        if (void 0 !== r) {
          var m = r instanceof t ? r : new t(r),
            p = !a && !s && !o;
          !p || d || c || (c = m.search),
            p &&
              "/" !== d[0] &&
              (d = d
                ? ((!m.host && !m.username) || m.pathname ? "" : "/") +
                  m.pathname.slice(0, m.pathname.lastIndexOf("/") + 1) +
                  d
                : m.pathname);
          var h = [];
          d
            .replace(/^(\.\.?(\/|$))+/, "")
            .replace(/\/(\.(\/|$))+/g, "/")
            .replace(/\/\.\.$/, "/../")
            .replace(/\/?[^\/]*/g, function(e) {
              "/.." === e ? h.pop() : h.push(e);
            }),
            (d = h.join("").replace(/^\//, "/" === d[0] ? "/" : "")),
            p &&
              ((u = m.port),
              (l = m.hostname),
              (s = m.host),
              (i = m.password),
              (o = m.username)),
            a || (a = m.protocol);
        }
        (d = d.replace(/\\/g, "/")),
          (this.origin = s ? a + ("" !== a || "" !== s ? "//" : "") + s : ""),
          (this.href =
            a +
            ((a && s) || "file:" == a ? "//" : "") +
            ("" !== o ? o + ("" !== i ? ":" + i : "") + "@" : "") +
            s +
            d +
            c +
            f),
          (this.protocol = a),
          (this.username = o),
          (this.password = i),
          (this.host = s),
          (this.hostname = l),
          (this.port = u),
          (this.pathname = d),
          (this.search = c),
          (this.hash = f);
      }
      e.URLPolyfill = t;
    })("undefined" != typeof self ? self : global),
      (function(e) {
        function t(e, t) {
          if (!e.originalErr)
            for (
              var r = ((e.message || e) + (e.stack ? "\n" + e.stack : ""))
                  .toString()
                  .split("\n"),
                n = [],
                a = 0;
              a < r.length;
              a++
            )
              ("undefined" == typeof $__curScript ||
                -1 == r[a].indexOf($__curScript.src)) &&
                n.push(r[a]);
          var o =
            "(SystemJS) " +
            (n ? n.join("\n	") : e.message.substr(11)) +
            "\n	" +
            t;
          D || (o = o.replace(q ? /file:\/\/\//g : /file:\/\//g, ""));
          var i = N ? new Error(o, e.fileName, e.lineNumber) : new Error(o);
          return (i.stack = o), (i.originalErr = e.originalErr || e), i;
        }
        function r() {}
        function n(t) {
          (this._loader = {
            loaderObj: this,
            loads: [],
            modules: {},
            importPromises: {},
            moduleRecords: {}
          }),
            U(this, "global", {
              get: function() {
                return e;
              }
            });
        }
        function a() {
          n.call(this),
            (this.paths = {}),
            (this._loader.paths = {}),
            K.call(this);
        }
        function o() {}
        function i(e, t) {
          a.prototype[e] = t(a.prototype[e] || function() {});
        }
        function s(e) {
          K = e(K || function() {});
        }
        function l(e) {
          return e.match(Q);
        }
        function u(e) {
          return (
            ("." == e[0] && (!e[1] || "/" == e[1] || "." == e[1])) ||
            "/" == e[0]
          );
        }
        function d(e) {
          return !u(e) && !l(e);
        }
        function c(e, t) {
          if ("." == e[0]) {
            if ("/" == e[1] && "." != e[2])
              return (
                ((t && t.substr(0, t.lastIndexOf("/") + 1)) || J) + e.substr(2)
              );
          } else if ("/" != e[0] && -1 == e.indexOf(":"))
            return ((t && t.substr(0, t.lastIndexOf("/") + 1)) || J) + e;
          return new G(e, (t && t.replace(/#/g, "%05")) || ee).href.replace(
            /%05/g,
            "#"
          );
        }
        function f(e, t) {
          var r,
            n = "",
            a = 0,
            o = e.paths,
            i = e._loader.paths;
          for (var s in o)
            if (!o.hasOwnProperty || o.hasOwnProperty(s)) {
              var l = o[s];
              if (
                (l !== i[s] &&
                  (l = o[s] = i[s] = c(o[s], u(o[s]) ? J : e.baseURL)),
                -1 === s.indexOf("*"))
              ) {
                if (t == s) return o[s];
                if (
                  t.substr(0, s.length - 1) == s.substr(0, s.length - 1) &&
                  (t.length < s.length || t[s.length - 1] == s[s.length - 1]) &&
                  ("/" == o[s][o[s].length - 1] || "" == o[s])
                )
                  return (
                    o[s].substr(0, o[s].length - 1) +
                    (t.length > s.length
                      ? ((o[s] && "/") || "") + t.substr(s.length)
                      : "")
                  );
              } else {
                var d = s.split("*");
                if (d.length > 2)
                  throw new TypeError(
                    "Only one wildcard in a path is permitted"
                  );
                var f = d[0].length;
                f >= a &&
                  t.substr(0, d[0].length) == d[0] &&
                  t.substr(t.length - d[1].length) == d[1] &&
                  ((a = f),
                  (n = s),
                  (r = t.substr(
                    d[0].length,
                    t.length - d[1].length - d[0].length
                  )));
              }
            }
          var m = o[n];
          return "string" == typeof r && (m = m.replace("*", r)), m;
        }
        function m(e) {
          for (var t = [], r = [], n = 0, a = e.length; a > n; n++) {
            var o = $.call(t, e[n]);
            -1 === o ? (t.push(e[n]), r.push([n])) : r[o].push(n);
          }
          return { names: t, indices: r };
        }
        function p(t) {
          var r = {};
          if (("object" == typeof t || "function" == typeof t) && t !== e)
            if (te) for (var n in t) "default" !== n && h(r, t, n);
            else g(r, t);
          return (r["default"] = t), U(r, "__useDefault", { value: !0 }), r;
        }
        function h(e, t, r) {
          try {
            var n;
            (n = Object.getOwnPropertyDescriptor(t, r)) && U(e, r, n);
          } catch (a) {
            return (e[r] = t[r]), !1;
          }
        }
        function g(e, t, r) {
          var n = t && t.hasOwnProperty;
          for (var a in t)
            (!n || t.hasOwnProperty(a)) && ((r && a in e) || (e[a] = t[a]));
          return e;
        }
        function v(e, t, r) {
          var n = t && t.hasOwnProperty;
          for (var a in t)
            if (!n || t.hasOwnProperty(a)) {
              var o = t[a];
              a in e
                ? o instanceof Array && e[a] instanceof Array
                  ? (e[a] = [].concat(r ? o : e[a]).concat(r ? e[a] : o))
                  : "object" == typeof o &&
                    null !== o &&
                    "object" == typeof e[a]
                    ? (e[a] = g(g({}, e[a]), o, r))
                    : r || (e[a] = o)
                : (e[a] = o);
            }
        }
        function y(e, t, r, n, a) {
          for (var o in t)
            if (
              -1 !=
              $.call(["main", "format", "defaultExtension", "basePath"], o)
            )
              e[o] = t[o];
            else if ("map" == o) g((e.map = e.map || {}), t.map);
            else if ("meta" == o) g((e.meta = e.meta || {}), t.meta);
            else if ("depCache" == o)
              for (var i in t.depCache) {
                var s;
                (s =
                  "./" == i.substr(0, 2)
                    ? r + "/" + i.substr(2)
                    : M.call(n, i)),
                  (n.depCache[s] = (n.depCache[s] || []).concat(t.depCache[i]));
              }
            else
              !a ||
                -1 !=
                  $.call(
                    [
                      "browserConfig",
                      "nodeConfig",
                      "devConfig",
                      "productionConfig"
                    ],
                    o
                  ) ||
                (t.hasOwnProperty && !t.hasOwnProperty(o)) ||
                w.call(
                  n,
                  '"' +
                    o +
                    '" is not a valid package configuration option in package ' +
                    r
                );
        }
        function b(e, t, r, n) {
          var a;
          if (e.packages[t]) {
            var o = e.packages[t];
            (a = e.packages[t] = {}),
              y(a, n ? r : o, t, e, n),
              y(a, n ? o : r, t, e, !n);
          } else a = e.packages[t] = r;
          return (
            "object" == typeof a.main &&
              ((a.map = a.map || {}),
              (a.map["./@main"] = a.main),
              (a.main["default"] = a.main["default"] || "./"),
              (a.main = "@main")),
            a
          );
        }
        function w(e) {
          this.warnings &&
            "undefined" != typeof console &&
            console.warn &&
            console.warn(e);
        }
        function x(e, t) {
          (e.metadata.entry = R()),
            (e.metadata.entry.execute = function() {
              return t;
            }),
            (e.metadata.entry.deps = []),
            (e.metadata.format = "defined");
        }
        function S(e, t) {
          for (var r = e.split("."); r.length; ) t = t[r.shift()];
          return t;
        }
        function _(e, t) {
          var r,
            n = 0;
          for (var a in e)
            if (
              t.substr(0, a.length) == a &&
              (t.length == a.length || "/" == t[a.length])
            ) {
              var o = a.split("/").length;
              if (n >= o) continue;
              (r = a), (n = o);
            }
          return r;
        }
        function E(e) {
          this._loader.baseURL !== this.baseURL &&
            ("/" != this.baseURL[this.baseURL.length - 1] &&
              (this.baseURL += "/"),
            (this._loader.baseURL = this.baseURL = new G(
              this.baseURL,
              ee
            ).href));
        }
        function j(e, t) {
          this.set(
            "@system-env",
            (ne = this.newModule({
              browser: D,
              node: !!this._nodeRequire,
              production: !t && e,
              dev: t || !e,
              build: t,
              default: !0
            }))
          );
        }
        function P(e, t) {
          if (!d(e))
            throw new Error(
              "Node module " +
                e +
                " can't be loaded as it is not a package require."
            );
          if (!ae) {
            var r = this._nodeRequire("module"),
              n = t.substr(q ? 8 : 7);
            (ae = new r(n)), (ae.paths = r._nodeModulePaths(n));
          }
          return ae.require(e);
        }
        function M(e, t) {
          if (u(e)) return c(e, t);
          if (l(e)) return e;
          var r = _(this.map, e);
          if (r) {
            if (((e = this.map[r] + e.substr(r.length)), u(e))) return c(e);
            if (l(e)) return e;
          }
          if (this.has(e)) return e;
          if ("@node/" == e.substr(0, 6)) {
            if (!this._nodeRequire)
              throw new TypeError(
                "Error loading " +
                  e +
                  ". Can only load node core modules in Node."
              );
            return (
              this.builder
                ? this.set(e, this.newModule({}))
                : this.set(
                    e,
                    this.newModule(p(P.call(this, e.substr(6), this.baseURL)))
                  ),
              e
            );
          }
          return E.call(this), f(this, e) || this.baseURL + e;
        }
        function O(e, t, r) {
          ne.browser && t.browserConfig && r(t.browserConfig),
            ne.node && t.nodeConfig && r(t.nodeConfig),
            ne.dev && t.devConfig && r(t.devConfig),
            ne.build && t.buildConfig && r(t.buildConfig),
            ne.production && t.productionConfig && r(t.productionConfig);
        }
        function k(e) {
          var t = e.match(se);
          return t && "System.register" == e.substr(t[0].length, 15);
        }
        function R() {
          return {
            name: null,
            deps: null,
            originalIndices: null,
            declare: null,
            execute: null,
            executingRequire: !1,
            declarative: !1,
            normalizedDeps: null,
            groupIndex: null,
            evaluated: !1,
            module: null,
            esModule: null,
            esmExports: !1
          };
        }
        function z(t) {
          if ("string" == typeof t) return S(t, e);
          if (!(t instanceof Array))
            throw new Error("Global exports must be a string or array.");
          for (var r = {}, n = !0, a = 0; a < t.length; a++) {
            var o = S(t[a], e);
            n && ((r["default"] = o), (n = !1)), (r[t[a].split(".").pop()] = o);
          }
          return r;
        }
        function I(e) {
          var t,
            r,
            n,
            n = "~" == e[0],
            a = e.lastIndexOf("|");
          return (
            -1 != a
              ? ((t = e.substr(a + 1)),
                (r = e.substr(n, a - n)),
                n &&
                  w.call(
                    this,
                    'Condition negation form "' +
                      e +
                      '" is deprecated for "' +
                      r +
                      "|~" +
                      t +
                      '"'
                  ),
                "~" == t[0] && ((n = !0), (t = t.substr(1))))
              : ((t = "default"),
                (r = e.substr(n)),
                -1 != ue.indexOf(r) && ((t = r), (r = null))),
            { module: r || "@system-env", prop: t, negate: n }
          );
        }
        function T(e) {
          return e.module + "|" + (e.negate ? "~" : "") + e.prop;
        }
        function L(e, t, r) {
          var n = this;
          return this.normalize(e.module, t).then(function(t) {
            return n.load(t).then(function(a) {
              var o = S(e.prop, n.get(t));
              if (r && "boolean" != typeof o)
                throw new TypeError(
                  "Condition " + T(e) + " did not resolve to a boolean."
                );
              return e.negate ? !o : o;
            });
          });
        }
        function C(e, t) {
          var r = e.match(de);
          if (!r) return Promise.resolve(e);
          var n = I.call(this, r[0].substr(2, r[0].length - 3));
          return this.builder
            ? this.normalize(n.module, t).then(function(t) {
                return (n.module = t), e.replace(de, "#{" + T(n) + "}");
              })
            : L.call(this, n, t, !1).then(function(r) {
                if ("string" != typeof r)
                  throw new TypeError(
                    "The condition value for " +
                      e +
                      " doesn't resolve to a string."
                  );
                if (-1 != r.indexOf("/"))
                  throw new TypeError(
                    "Unabled to interpolate conditional " +
                      e +
                      (t ? " in " + t : "") +
                      "\n	The condition value " +
                      r +
                      ' cannot contain a "/" separator.'
                  );
                return e.replace(de, r);
              });
        }
        function A(e, t) {
          var r = e.lastIndexOf("#?");
          if (-1 == r) return Promise.resolve(e);
          var n = I.call(this, e.substr(r + 2));
          return this.builder
            ? this.normalize(n.module, t).then(function(t) {
                return (n.module = t), e.substr(0, r) + "#?" + T(n);
              })
            : L.call(this, n, t, !0).then(function(t) {
                return t ? e.substr(0, r) : "@empty";
              });
        }
        var F =
            "undefined" == typeof window &&
            "undefined" != typeof self &&
            "undefined" != typeof importScripts,
          D = "undefined" != typeof window && "undefined" != typeof document,
          q =
            "undefined" != typeof process &&
            "undefined" != typeof process.platform &&
            !!process.platform.match(/^win/);
        e.console || (e.console = { assert: function() {} });
        var U,
          $ =
            Array.prototype.indexOf ||
            function(e) {
              for (var t = 0, r = this.length; r > t; t++)
                if (this[t] === e) return t;
              return -1;
            };
        !(function() {
          try {
            Object.defineProperty({}, "a", {}) && (U = Object.defineProperty);
          } catch (e) {
            U = function(e, t, r) {
              try {
                e[t] = r.value || r.get.call(e);
              } catch (n) {}
            };
          }
        })();
        var J,
          N = "_" == new Error(0, "_").fileName;
        if ("undefined" != typeof document && document.getElementsByTagName) {
          if (((J = document.baseURI), !J)) {
            var B = document.getElementsByTagName("base");
            J = (B[0] && B[0].href) || window.location.href;
          }
        } else "undefined" != typeof location && (J = e.location.href);
        if (J)
          (J = J.split("#")[0].split("?")[0]),
            (J = J.substr(0, J.lastIndexOf("/") + 1));
        else {
          if ("undefined" == typeof process || !process.cwd)
            throw new TypeError("No environment baseURI");
          (J = "file://" + (q ? "/" : "") + process.cwd() + "/"),
            q && (J = J.replace(/\\/g, "/"));
        }
        try {
          var H = "test:" == new e.URL("test:///").protocol;
        } catch (X) {}
        var G = H ? e.URL : e.URLPolyfill;
        U(r.prototype, "toString", {
          value: function() {
            return "Module";
          }
        }),
          (function() {
            function e(e) {
              return {
                status: "loading",
                name: e || "<Anonymous" + ++b + ">",
                linkSets: [],
                dependencies: [],
                metadata: {}
              };
            }
            function a(e, t, r) {
              return new Promise(
                u({
                  step: r.address ? "fetch" : "locate",
                  loader: e,
                  moduleName: t,
                  moduleMetadata: (r && r.metadata) || {},
                  moduleSource: r.source,
                  moduleAddress: r.address
                })
              );
            }
            function o(t, r, n, a) {
              return new Promise(function(e, o) {
                e(t.loaderObj.normalize(r, n, a));
              }).then(function(r) {
                var n;
                if (t.modules[r])
                  return (
                    (n = e(r)),
                    (n.status = "linked"),
                    (n.module = t.modules[r]),
                    n
                  );
                for (var a = 0, o = t.loads.length; o > a; a++)
                  if (((n = t.loads[a]), n.name == r)) return n;
                return (n = e(r)), t.loads.push(n), i(t, n), n;
              });
            }
            function i(e, t) {
              s(
                e,
                t,
                Promise.resolve().then(function() {
                  return e.loaderObj.locate({
                    name: t.name,
                    metadata: t.metadata
                  });
                })
              );
            }
            function s(e, t, r) {
              l(
                e,
                t,
                r.then(function(r) {
                  return "loading" == t.status
                    ? ((t.address = r),
                      e.loaderObj.fetch({
                        name: t.name,
                        metadata: t.metadata,
                        address: r
                      }))
                    : void 0;
                })
              );
            }
            function l(e, t, r) {
              r
                .then(function(r) {
                  return "loading" == t.status
                    ? ((t.address = t.address || t.name),
                      Promise.resolve(
                        e.loaderObj.translate({
                          name: t.name,
                          metadata: t.metadata,
                          address: t.address,
                          source: r
                        })
                      )
                        .then(function(r) {
                          return (
                            (t.source = r),
                            e.loaderObj.instantiate({
                              name: t.name,
                              metadata: t.metadata,
                              address: t.address,
                              source: r
                            })
                          );
                        })
                        .then(function(e) {
                          if (void 0 === e)
                            throw new TypeError(
                              "Declarative modules unsupported in the polyfill."
                            );
                          if ("object" != typeof e)
                            throw new TypeError(
                              "Invalid instantiate return value"
                            );
                          (t.depsList = e.deps || []), (t.execute = e.execute);
                        })
                        .then(function() {
                          t.dependencies = [];
                          for (
                            var r = t.depsList, n = [], a = 0, i = r.length;
                            i > a;
                            a++
                          )
                            (function(r, a) {
                              n.push(
                                o(e, r, t.name, t.address).then(function(e) {
                                  if (
                                    ((t.dependencies[a] = {
                                      key: r,
                                      value: e.name
                                    }),
                                    "linked" != e.status)
                                  )
                                    for (
                                      var n = t.linkSets.concat([]),
                                        o = 0,
                                        i = n.length;
                                      i > o;
                                      o++
                                    )
                                      c(n[o], e);
                                })
                              );
                            })(r[a], a);
                          return Promise.all(n);
                        })
                        .then(function() {
                          t.status = "loaded";
                          for (
                            var e = t.linkSets.concat([]), r = 0, n = e.length;
                            n > r;
                            r++
                          )
                            m(e[r], t);
                        }))
                    : void 0;
                })
                ["catch"](function(e) {
                  (t.status = "failed"), (t.exception = e);
                  for (
                    var r = t.linkSets.concat([]), n = 0, a = r.length;
                    a > n;
                    n++
                  )
                    p(r[n], t, e);
                });
            }
            function u(t) {
              return function(r, n) {
                var a = t.loader,
                  o = t.moduleName,
                  u = t.step;
                if (a.modules[o])
                  throw new TypeError(
                    '"' + o + '" already exists in the module table'
                  );
                for (var c, f = 0, m = a.loads.length; m > f; f++)
                  if (
                    a.loads[f].name == o &&
                    ((c = a.loads[f]),
                    "translate" != u ||
                      c.source ||
                      ((c.address = t.moduleAddress),
                      l(a, c, Promise.resolve(t.moduleSource))),
                    c.linkSets.length && c.linkSets[0].loads[0].name == c.name)
                  )
                    return c.linkSets[0].done.then(function() {
                      r(c);
                    });
                var p = c || e(o);
                p.metadata = t.moduleMetadata;
                var h = d(a, p);
                a.loads.push(p),
                  r(h.done),
                  "locate" == u
                    ? i(a, p)
                    : "fetch" == u
                      ? s(a, p, Promise.resolve(t.moduleAddress))
                      : ((p.address = t.moduleAddress),
                        l(a, p, Promise.resolve(t.moduleSource)));
              };
            }
            function d(e, t) {
              var r = {
                loader: e,
                loads: [],
                startingLoad: t,
                loadingCount: 0
              };
              return (
                (r.done = new Promise(function(e, t) {
                  (r.resolve = e), (r.reject = t);
                })),
                c(r, t),
                r
              );
            }
            function c(e, t) {
              if ("failed" != t.status) {
                for (var r = 0, n = e.loads.length; n > r; r++)
                  if (e.loads[r] == t) return;
                e.loads.push(t),
                  t.linkSets.push(e),
                  "loaded" != t.status && e.loadingCount++;
                for (
                  var a = e.loader, r = 0, n = t.dependencies.length;
                  n > r;
                  r++
                )
                  if (t.dependencies[r]) {
                    var o = t.dependencies[r].value;
                    if (!a.modules[o])
                      for (var i = 0, s = a.loads.length; s > i; i++)
                        if (a.loads[i].name == o) {
                          c(e, a.loads[i]);
                          break;
                        }
                  }
              }
            }
            function f(e) {
              var t = !1;
              try {
                y(e, function(r, n) {
                  p(e, r, n), (t = !0);
                });
              } catch (r) {
                p(e, null, r), (t = !0);
              }
              return t;
            }
            function m(e, t) {
              if ((e.loadingCount--, !(e.loadingCount > 0))) {
                var r = e.startingLoad;
                if (e.loader.loaderObj.execute === !1) {
                  for (
                    var n = [].concat(e.loads), a = 0, o = n.length;
                    o > a;
                    a++
                  ) {
                    var t = n[a];
                    (t.module = { name: t.name, module: w({}), evaluated: !0 }),
                      (t.status = "linked"),
                      h(e.loader, t);
                  }
                  return e.resolve(r);
                }
                var i = f(e);
                i || e.resolve(r);
              }
            }
            function p(e, r, n) {
              var a = e.loader;
              e: if (r)
                if (e.loads[0].name == r.name)
                  n = t(n, "Error loading " + r.name);
                else {
                  for (var o = 0; o < e.loads.length; o++)
                    for (
                      var i = e.loads[o], s = 0;
                      s < i.dependencies.length;
                      s++
                    ) {
                      var l = i.dependencies[s];
                      if (l.value == r.name) {
                        n = t(
                          n,
                          "Error loading " +
                            r.name +
                            ' as "' +
                            l.key +
                            '" from ' +
                            i.name
                        );
                        break e;
                      }
                    }
                  n = t(
                    n,
                    "Error loading " + r.name + " from " + e.loads[0].name
                  );
                }
              else n = t(n, "Error linking " + e.loads[0].name);
              for (
                var u = e.loads.concat([]), o = 0, d = u.length;
                d > o;
                o++
              ) {
                var r = u[o];
                (a.loaderObj.failed = a.loaderObj.failed || []),
                  -1 == $.call(a.loaderObj.failed, r) &&
                    a.loaderObj.failed.push(r);
                var c = $.call(r.linkSets, e);
                if ((r.linkSets.splice(c, 1), 0 == r.linkSets.length)) {
                  var f = $.call(e.loader.loads, r);
                  -1 != f && e.loader.loads.splice(f, 1);
                }
              }
              e.reject(n);
            }
            function h(e, t) {
              if (e.loaderObj.trace) {
                e.loaderObj.loads || (e.loaderObj.loads = {});
                var r = {};
                t.dependencies.forEach(function(e) {
                  r[e.key] = e.value;
                }),
                  (e.loaderObj.loads[t.name] = {
                    name: t.name,
                    deps: t.dependencies.map(function(e) {
                      return e.key;
                    }),
                    depMap: r,
                    address: t.address,
                    metadata: t.metadata,
                    source: t.source
                  });
              }
              t.name && (e.modules[t.name] = t.module);
              var n = $.call(e.loads, t);
              -1 != n && e.loads.splice(n, 1);
              for (var a = 0, o = t.linkSets.length; o > a; a++)
                (n = $.call(t.linkSets[a].loads, t)),
                  -1 != n && t.linkSets[a].loads.splice(n, 1);
              t.linkSets.splice(0, t.linkSets.length);
            }
            function g(e, t, n) {
              try {
                var a = t.execute();
              } catch (o) {
                return void n(t, o);
              }
              return a && a instanceof r
                ? a
                : void n(
                    t,
                    new TypeError("Execution must define a Module instance")
                  );
            }
            function v(e, t, r) {
              var n = e._loader.importPromises;
              return (n[t] = r.then(
                function(e) {
                  return (n[t] = void 0), e;
                },
                function(e) {
                  throw ((n[t] = void 0), e);
                }
              ));
            }
            function y(e, t) {
              var r = e.loader;
              if (e.loads.length)
                for (var n = e.loads.concat([]), a = 0; a < n.length; a++) {
                  var o = n[a],
                    i = g(e, o, t);
                  if (!i) return;
                  (o.module = { name: o.name, module: i }),
                    (o.status = "linked"),
                    h(r, o);
                }
            }
            var b = 0;
            n.prototype = {
              constructor: n,
              define: function(e, t, r) {
                if (this._loader.importPromises[e])
                  throw new TypeError("Module is already loading.");
                return v(
                  this,
                  e,
                  new Promise(
                    u({
                      step: "translate",
                      loader: this._loader,
                      moduleName: e,
                      moduleMetadata: (r && r.metadata) || {},
                      moduleSource: t,
                      moduleAddress: r && r.address
                    })
                  )
                );
              },
              delete: function(e) {
                var t = this._loader;
                return (
                  delete t.importPromises[e],
                  delete t.moduleRecords[e],
                  t.modules[e] ? delete t.modules[e] : !1
                );
              },
              get: function(e) {
                return this._loader.modules[e]
                  ? this._loader.modules[e].module
                  : void 0;
              },
              has: function(e) {
                return !!this._loader.modules[e];
              },
              import: function(e, t, r) {
                "object" == typeof t && (t = t.name);
                var n = this;
                return Promise.resolve(n.normalize(e, t)).then(function(e) {
                  var t = n._loader;
                  return t.modules[e]
                    ? t.modules[e].module
                    : t.importPromises[e] ||
                        v(
                          n,
                          e,
                          a(t, e, {}).then(function(r) {
                            return delete t.importPromises[e], r.module.module;
                          })
                        );
                });
              },
              load: function(e) {
                var t = this._loader;
                return t.modules[e]
                  ? Promise.resolve()
                  : t.importPromises[e] ||
                      v(
                        this,
                        e,
                        new Promise(
                          u({
                            step: "locate",
                            loader: t,
                            moduleName: e,
                            moduleMetadata: {},
                            moduleSource: void 0,
                            moduleAddress: void 0
                          })
                        ).then(function() {
                          delete t.importPromises[e];
                        })
                      );
              },
              module: function(t, r) {
                var n = e();
                n.address = r && r.address;
                var a = d(this._loader, n),
                  o = Promise.resolve(t),
                  i = this._loader,
                  s = a.done.then(function() {
                    return n.module.module;
                  });
                return l(i, n, o), s;
              },
              newModule: function(e) {
                if ("object" != typeof e)
                  throw new TypeError("Expected object");
                var t = new r(),
                  n = [];
                if (Object.getOwnPropertyNames && null != e)
                  n = Object.getOwnPropertyNames(e);
                else for (var a in e) n.push(a);
                for (var o = 0; o < n.length; o++)
                  (function(r) {
                    U(t, r, {
                      configurable: !1,
                      enumerable: !0,
                      get: function() {
                        return e[r];
                      },
                      set: function() {
                        throw new Error(
                          "Module exports cannot be changed externally."
                        );
                      }
                    });
                  })(n[o]);
                return Object.freeze && Object.freeze(t), t;
              },
              set: function(e, t) {
                if (!(t instanceof r))
                  throw new TypeError(
                    "Loader.set(" + e + ", module) must be a module"
                  );
                this._loader.modules[e] = { module: t };
              },
              normalize: function(e, t, r) {},
              locate: function(e) {
                return e.name;
              },
              fetch: function(e) {},
              translate: function(e) {
                return e.source;
              },
              instantiate: function(e) {}
            };
            var w = n.prototype.newModule;
          })();
        var Z, W;
        if ("undefined" != typeof XMLHttpRequest)
          W = function(e, t, r, n) {
            function a() {
              r(i.responseText);
            }
            function o() {
              n(
                new Error(
                  "XHR error" +
                    (i.status
                      ? " (" +
                        i.status +
                        (i.statusText ? " " + i.statusText : "") +
                        ")"
                      : "") +
                    " loading " +
                    e
                )
              );
            }
            var i = new XMLHttpRequest(),
              s = !0,
              l = !1;
            if (!("withCredentials" in i)) {
              var u = /^(\w+:)?\/\/([^\/]+)/.exec(e);
              u &&
                ((s = u[2] === window.location.host),
                u[1] && (s &= u[1] === window.location.protocol));
            }
            s ||
              "undefined" == typeof XDomainRequest ||
              ((i = new XDomainRequest()),
              (i.onload = a),
              (i.onerror = o),
              (i.ontimeout = o),
              (i.onprogress = function() {}),
              (i.timeout = 0),
              (l = !0)),
              (i.onreadystatechange = function() {
                4 === i.readyState &&
                  (0 == i.status
                    ? i.responseText
                      ? a()
                      : (i.addEventListener("error", o),
                        i.addEventListener("load", a))
                    : 200 === i.status ? a() : o());
              }),
              i.open("GET", e, !0),
              i.setRequestHeader &&
                (i.setRequestHeader("Accept", "application/x-es-module, */*"),
                t &&
                  ("string" == typeof t &&
                    i.setRequestHeader("Authorization", t),
                  (i.withCredentials = !0))),
              l
                ? setTimeout(function() {
                    i.send();
                  }, 0)
                : i.send(null);
          };
        else if (
          "undefined" != typeof require &&
          "undefined" != typeof process
        ) {
          var V;
          W = function(e, t, r, n) {
            if ("file:///" != e.substr(0, 8))
              throw new Error(
                'Unable to fetch "' +
                  e +
                  '". Only file URLs of the form file:/// allowed running in Node.'
              );
            return (
              (V = V || require("fs")),
              (e = q ? e.replace(/\//g, "\\").substr(8) : e.substr(7)),
              V.readFile(e, function(e, t) {
                if (e) return n(e);
                var a = t + "";
                "\ufeff" === a[0] && (a = a.substr(1)), r(a);
              })
            );
          };
        } else {
          if ("undefined" == typeof self || "undefined" == typeof self.fetch)
            throw new TypeError("No environment fetch API available.");
          W = function(e, t, r, n) {
            var a = { headers: { Accept: "application/x-es-module, */*" } };
            t &&
              ("string" == typeof t && (a.headers.Authorization = t),
              (a.credentials = "include")),
              fetch(e, a)
                .then(function(e) {
                  if (e.ok) return e.text();
                  throw new Error(
                    "Fetch error: " + e.status + " " + e.statusText
                  );
                })
                .then(r, n);
          };
        }
        var Y = (function() {
          function t(t) {
            var n = this;
            return Promise.resolve(
              e["typescript" == n.transpiler ? "ts" : n.transpiler] ||
                (n.pluginLoader || n)["import"](n.transpiler)
            ).then(function(e) {
              e.__useDefault && (e = e["default"]);
              var a;
              return (
                (a = e.Compiler ? r : e.createLanguageService ? i : o),
                "(function(__moduleName){" +
                  a.call(n, t, e) +
                  '\n})("' +
                  t.name +
                  '");\n//# sourceURL=' +
                  t.address +
                  "!transpiled"
              );
            });
          }
          function r(e, t) {
            var r = this.traceurOptions || {};
            (r.modules = "instantiate"),
              (r.script = !1),
              void 0 === r.sourceMaps && (r.sourceMaps = "inline"),
              (r.filename = e.address),
              (r.inputSourceMap = e.metadata.sourceMap),
              (r.moduleName = !1);
            var n = new t.Compiler(r);
            return a(e.source, n, r.filename);
          }
          function a(e, t, r) {
            try {
              return t.compile(e, r);
            } catch (n) {
              if (n.length) throw n[0];
              throw n;
            }
          }
          function o(e, t) {
            var r = this.babelOptions || {};
            return (
              (r.modules = "system"),
              void 0 === r.sourceMap && (r.sourceMap = "inline"),
              (r.inputSourceMap = e.metadata.sourceMap),
              (r.filename = e.address),
              (r.code = !0),
              (r.ast = !1),
              t.transform(e.source, r).code
            );
          }
          function i(e, t) {
            var r = this.typescriptOptions || {};
            return (
              (r.target = r.target || t.ScriptTarget.ES5),
              void 0 === r.sourceMap && (r.sourceMap = !0),
              r.sourceMap &&
                r.inlineSourceMap !== !1 &&
                (r.inlineSourceMap = !0),
              (r.module = t.ModuleKind.System),
              t.transpile(e.source, r, e.address)
            );
          }
          return (n.prototype.transpiler = "traceur"), t;
        })();
        (o.prototype = n.prototype),
          (a.prototype = new o()),
          (a.prototype.constructor = a);
        var K,
          Q = /^[^\/]+:\/\//,
          ee = new G(J),
          te = !0;
        try {
          Object.getOwnPropertyDescriptor({ a: 0 }, "a");
        } catch (X) {
          te = !1;
        }
        var re;
        !(function() {
          function r(e) {
            return l
              ? c + new Buffer(e).toString("base64")
              : "undefined" != typeof btoa
                ? c + btoa(unescape(encodeURIComponent(e)))
                : "";
          }
          function n(e, t) {
            var n = e.source.lastIndexOf("\n");
            "global" == e.metadata.format && (t = !1);
            var a = e.metadata.sourceMap;
            if (a) {
              if ("object" != typeof a)
                throw new TypeError(
                  "load.metadata.sourceMap must be set to an object."
                );
              a = JSON.stringify(a);
            }
            return (
              (t ? "(function(System, SystemJS) {" : "") +
              e.source +
              (t ? "\n})(System, System);" : "") +
              ("\n//# sourceURL=" != e.source.substr(n, 15)
                ? "\n//# sourceURL=" + e.address + (a ? "!transpiled" : "")
                : "") +
              ((a && r(a)) || "")
            );
          }
          function a(t, r) {
            (d = r), 0 == h++ && (f = e.System), (e.System = e.SystemJS = t);
          }
          function o() {
            0 == --h && (e.System = e.SystemJS = f), (d = void 0);
          }
          function s(e) {
            v ||
              (v = document.head || document.body || document.documentElement);
            var r = document.createElement("script");
            r.text = n(e, !1);
            var i,
              s = window.onerror;
            if (
              ((window.onerror = function(r) {
                (i = t(r, "Evaluating " + e.address)),
                  s && s.apply(this, arguments);
              }),
              a(this, e),
              e.metadata.integrity &&
                r.setAttribute("integrity", e.metadata.integrity),
              e.metadata.nonce && r.setAttribute("nonce", e.metadata.nonce),
              v.appendChild(r),
              v.removeChild(r),
              o(),
              (window.onerror = s),
              i)
            )
              throw i;
          }
          var l = "undefined" != typeof Buffer;
          try {
            l && "YQ==" != new Buffer("a").toString("base64") && (l = !1);
          } catch (u) {
            l = !1;
          }
          var d,
            c = "\n//# sourceMappingURL=data:application/json;base64,";
          i("pushRegister_", function() {
            return function(e) {
              return d ? (this.reduceRegister_(d, e), !0) : !1;
            };
          });
          var f,
            m,
            p,
            h = 0;
          re = function(e) {
            if (e.source) {
              if ((e.metadata.integrity || e.metadata.nonce) && g)
                return s.call(this, e);
              try {
                a(this, e),
                  (d = e),
                  !p &&
                    this._nodeRequire &&
                    ((p = this._nodeRequire("vm")),
                    (m =
                      p.runInThisContext(
                        "typeof System !== 'undefined' && System"
                      ) === this)),
                  m
                    ? p.runInThisContext(n(e, !0), {
                        filename:
                          e.address +
                          (e.metadata.sourceMap ? "!transpiled" : "")
                      })
                    : (0, eval)(n(e, !0)),
                  o();
              } catch (r) {
                throw (o(), t(r, "Evaluating " + e.address));
              }
            }
          };
          var g = !1;
          D &&
            "undefined" != typeof document &&
            document.getElementsByTagName &&
            ((window.chrome && window.chrome.extension) ||
              navigator.userAgent.match(/^Node\.js/) ||
              (g = !0));
          var v;
        })();
        var ne;
        s(function(e) {
          return function() {
            e.call(this),
              (this.baseURL = J),
              (this.map = {}),
              "undefined" != typeof $__curScript &&
                (this.scriptSrc = $__curScript.src),
              (this.warnings = !1),
              (this.defaultJSExtensions = !1),
              (this.pluginFirst = !1),
              (this.loaderErrorStack = !1),
              this.set("@empty", this.newModule({})),
              j.call(this, !1, !1);
          };
        }),
          "undefined" == typeof require ||
            "undefined" == typeof process ||
            process.browser ||
            (a.prototype._nodeRequire = require);
        var ae;
        i("normalize", function(e) {
          return function(e, t, r) {
            var n = M.call(this, e, t);
            return (
              !this.defaultJSExtensions ||
                r ||
                ".js" == n.substr(n.length - 3, 3) ||
                d(n) ||
                (n += ".js"),
              n
            );
          };
        });
        var oe = "undefined" != typeof XMLHttpRequest;
        i("locate", function(e) {
          return function(t) {
            return Promise.resolve(e.call(this, t)).then(function(e) {
              return oe ? e.replace(/#/g, "%23") : e;
            });
          };
        }),
          i("fetch", function() {
            return function(e) {
              return new Promise(function(t, r) {
                W(e.address, e.metadata.authorization, t, r);
              });
            };
          }),
          i("import", function(e) {
            return function(t, r, n) {
              return (
                r &&
                  r.name &&
                  w.call(
                    this,
                    "SystemJS.import(name, { name: parentName }) is deprecated for SystemJS.import(name, parentName), while importing " +
                      t +
                      " from " +
                      r.name
                  ),
                e.call(this, t, r, n).then(function(e) {
                  return e.__useDefault ? e["default"] : e;
                })
              );
            };
          }),
          i("translate", function(e) {
            return function(t) {
              return (
                "detect" == t.metadata.format && (t.metadata.format = void 0),
                e.apply(this, arguments)
              );
            };
          }),
          i("instantiate", function(e) {
            return function(e) {
              if ("json" == e.metadata.format && !this.builder) {
                var t = (e.metadata.entry = R());
                (t.deps = []),
                  (t.execute = function() {
                    try {
                      return JSON.parse(e.source);
                    } catch (t) {
                      throw new Error("Invalid JSON file " + e.name);
                    }
                  });
              }
            };
          }),
          (a.prototype.getConfig = function(e) {
            var t = {},
              r = this;
            for (var n in r)
              (r.hasOwnProperty && !r.hasOwnProperty(n)) ||
                (n in a.prototype && "transpiler" != n) ||
                (-1 ==
                  $.call(
                    [
                      "_loader",
                      "amdDefine",
                      "amdRequire",
                      "defined",
                      "failed",
                      "version",
                      "loads"
                    ],
                    n
                  ) &&
                  (t[n] = r[n]));
            return (t.production = ne.production), t;
          });
        var ie;
        (a.prototype.config = function(e, t) {
          function r(e) {
            for (var t in e) if (e.hasOwnProperty(t)) return !0;
          }
          var n = this;
          if (
            ("loaderErrorStack" in e &&
              ((ie = $__curScript),
              e.loaderErrorStack
                ? ($__curScript = void 0)
                : ($__curScript = ie)),
            "warnings" in e && (n.warnings = e.warnings),
            e.transpilerRuntime === !1 &&
              (n._loader.loadedTranspilerRuntime = !0),
            ("production" in e || "build" in e) &&
              j.call(n, !!e.production, !!(e.build || (ne && ne.build))),
            !t)
          ) {
            var a;
            if (
              (O(n, e, function(e) {
                a = a || e.baseURL;
              }),
              (a = a || e.baseURL))
            ) {
              if (
                r(n.packages) ||
                r(n.meta) ||
                r(n.depCache) ||
                r(n.bundles) ||
                r(n.packageConfigPaths)
              )
                throw new TypeError(
                  "Incorrect configuration order. The baseURL must be configured with the first SystemJS.config call."
                );
              (this.baseURL = a), E.call(this);
            }
            if (
              (e.paths && g(n.paths, e.paths),
              O(n, e, function(e) {
                e.paths && g(n.paths, e.paths);
              }),
              this.warnings)
            )
              for (var o in n.paths)
                -1 != o.indexOf("*") &&
                  w.call(
                    n,
                    'Paths configuration "' +
                      o +
                      '" -> "' +
                      n.paths[o] +
                      '" uses wildcards which are being deprecated for just leaving a trailing "/" to indicate folder paths.'
                  );
          }
          if (
            (e.defaultJSExtensions &&
              ((n.defaultJSExtensions = e.defaultJSExtensions),
              w.call(
                n,
                "The defaultJSExtensions configuration option is deprecated, use packages configuration instead."
              )),
            e.pluginFirst && (n.pluginFirst = e.pluginFirst),
            e.map)
          )
            for (var o in e.map) {
              var i = e.map[o];
              if ("string" != typeof i) {
                var s =
                    n.defaultJSExtensions && ".js" != o.substr(o.length - 3, 3),
                  l = n.decanonicalize(o);
                s &&
                  ".js" == l.substr(l.length - 3, 3) &&
                  (l = l.substr(0, l.length - 3));
                var u = "";
                for (var c in n.packages)
                  l.substr(0, c.length) == c &&
                    (!l[c.length] || "/" == l[c.length]) &&
                    u.split("/").length < c.split("/").length &&
                    (u = c);
                u &&
                  n.packages[u].main &&
                  (l = l.substr(0, l.length - n.packages[u].main.length - 1));
                var c = (n.packages[l] = n.packages[l] || {});
                c.map = i;
              } else n.map[o] = i;
            }
          if (e.packageConfigPaths) {
            for (var f = [], m = 0; m < e.packageConfigPaths.length; m++) {
              var p = e.packageConfigPaths[m],
                h = Math.max(p.lastIndexOf("*") + 1, p.lastIndexOf("/")),
                v = M.call(n, p.substr(0, h));
              f[m] = v + p.substr(h);
            }
            n.packageConfigPaths = f;
          }
          if (e.bundles)
            for (var o in e.bundles) {
              for (var y = [], m = 0; m < e.bundles[o].length; m++) {
                var s =
                    n.defaultJSExtensions &&
                    ".js" !=
                      e.bundles[o][m].substr(e.bundles[o][m].length - 3, 3),
                  x = n.decanonicalize(e.bundles[o][m]);
                s &&
                  ".js" == x.substr(x.length - 3, 3) &&
                  (x = x.substr(0, x.length - 3)),
                  y.push(x);
              }
              n.bundles[o] = y;
            }
          if (e.packages)
            for (var o in e.packages) {
              if (o.match(/^([^\/]+:)?\/\/$/))
                throw new TypeError('"' + o + '" is not a valid package name.');
              var l = M.call(n, o);
              "/" == l[l.length - 1] && (l = l.substr(0, l.length - 1)),
                b(n, l, e.packages[o], !1);
            }
          for (var S in e) {
            var i = e[S];
            if (
              -1 ==
              $.call(
                [
                  "baseURL",
                  "map",
                  "packages",
                  "bundles",
                  "paths",
                  "warnings",
                  "packageConfigPaths",
                  "loaderErrorStack",
                  "browserConfig",
                  "nodeConfig",
                  "devConfig",
                  "buildConfig",
                  "productionConfig"
                ],
                S
              )
            )
              if ("object" != typeof i || i instanceof Array) n[S] = i;
              else {
                n[S] = n[S] || {};
                for (var o in i)
                  if ("meta" == S && "*" == o[0])
                    g((n[S][o] = n[S][o] || {}), i[o]);
                  else if ("meta" == S) {
                    var _ = M.call(n, o);
                    n.defaultJSExtensions &&
                      ".js" != _.substr(_.length - 3, 3) &&
                      !d(_) &&
                      (_ += ".js"),
                      g((n[S][_] = n[S][_] || {}), i[o]);
                  } else if ("depCache" == S) {
                    var s =
                        n.defaultJSExtensions &&
                        ".js" != o.substr(o.length - 3, 3),
                      l = n.decanonicalize(o);
                    s &&
                      ".js" == l.substr(l.length - 3, 3) &&
                      (l = l.substr(0, l.length - 3)),
                      (n[S][l] = [].concat(i[o]));
                  } else n[S][o] = i[o];
              }
          }
          O(n, e, function(e) {
            n.config(e, !0);
          });
        }),
          (function() {
            function e(e, t) {
              var r,
                n,
                a = 0;
              for (var o in e.packages)
                t.substr(0, o.length) !== o ||
                  (t.length !== o.length && "/" !== t[o.length]) ||
                  ((n = o.split("/").length), n > a && ((r = o), (a = n)));
              return r;
            }
            function t(e, t, r, n, a) {
              if (
                !n ||
                "/" == n[n.length - 1] ||
                a ||
                t.defaultExtension === !1
              )
                return n;
              var o = !1;
              if (
                (t.meta &&
                  p(t.meta, n, function(e, t, r) {
                    return 0 == r || e.lastIndexOf("*") != e.length - 1
                      ? (o = !0)
                      : void 0;
                  }),
                !o &&
                  e.meta &&
                  p(e.meta, r + "/" + n, function(e, t, r) {
                    return 0 == r || e.lastIndexOf("*") != e.length - 1
                      ? (o = !0)
                      : void 0;
                  }),
                o)
              )
                return n;
              var i = "." + (t.defaultExtension || "js");
              return n.substr(n.length - i.length) != i ? n + i : n;
            }
            function r(e, r, n, a, i) {
              if (!a) {
                if (!r.main) return n + (e.defaultJSExtensions ? ".js" : "");
                a = "./" == r.main.substr(0, 2) ? r.main.substr(2) : r.main;
              }
              if (r.map) {
                var s = "./" + a,
                  l = _(r.map, s);
                if (
                  (l ||
                    ((s = "./" + t(e, r, n, a, i)),
                    s != "./" + a && (l = _(r.map, s))),
                  l)
                ) {
                  var u = o(e, r, n, l, s, i);
                  if (u) return u;
                }
              }
              return n + "/" + t(e, r, n, a, i);
            }
            function n(e, t, r, n) {
              if ("." == e)
                throw new Error(
                  "Package " +
                    r +
                    ' has a map entry for "." which is not permitted.'
                );
              return t.substr(0, e.length) == e && n.length > e.length
                ? !1
                : !0;
            }
            function o(e, r, a, o, i, s) {
              "/" == i[i.length - 1] && (i = i.substr(0, i.length - 1));
              var l = r.map[o];
              if ("object" == typeof l)
                throw new Error(
                  "Synchronous conditional normalization not supported sync normalizing " +
                    o +
                    " in " +
                    a
                );
              if (n(o, l, a, i) && "string" == typeof l) {
                if ("." == l) l = a;
                else if ("./" == l.substr(0, 2))
                  return (
                    a + "/" + t(e, r, a, l.substr(2) + i.substr(o.length), s)
                  );
                return e.normalizeSync(l + i.substr(o.length), a + "/");
              }
            }
            function l(e, r, n, a, o) {
              if (!a) {
                if (!r.main)
                  return Promise.resolve(
                    n + (e.defaultJSExtensions ? ".js" : "")
                  );
                a = "./" == r.main.substr(0, 2) ? r.main.substr(2) : r.main;
              }
              var i, s;
              return (
                r.map &&
                  ((i = "./" + a),
                  (s = _(r.map, i)),
                  s ||
                    ((i = "./" + t(e, r, n, a, o)),
                    i != "./" + a && (s = _(r.map, i)))),
                (s ? d(e, r, n, s, i, o) : Promise.resolve()).then(function(i) {
                  return i
                    ? Promise.resolve(i)
                    : Promise.resolve(n + "/" + t(e, r, n, a, o));
                })
              );
            }
            function u(e, r, n, a, o, i, s) {
              if ("." == o) o = n;
              else if ("./" == o.substr(0, 2))
                return Promise.resolve(
                  n + "/" + t(e, r, n, o.substr(2) + i.substr(a.length), s)
                ).then(function(t) {
                  return C.call(e, t, n + "/");
                });
              return e.normalize(o + i.substr(a.length), n + "/");
            }
            function d(e, t, r, a, o, i) {
              "/" == o[o.length - 1] && (o = o.substr(0, o.length - 1));
              var s = t.map[a];
              if ("string" == typeof s)
                return n(a, s, r, o)
                  ? u(e, t, r, a, s, o, i)
                  : Promise.resolve();
              if (e.builder) return Promise.resolve(r + "/#:" + o);
              var l = [],
                d = [];
              for (var c in s) {
                var f = I(c);
                d.push({ condition: f, map: s[c] }),
                  l.push(e["import"](f.module, r));
              }
              return Promise.all(l)
                .then(function(e) {
                  for (var t = 0; t < d.length; t++) {
                    var r = d[t].condition,
                      n = S(r.prop, e[t]);
                    if ((!r.negate && n) || (r.negate && !n)) return d[t].map;
                  }
                })
                .then(function(s) {
                  if (s) {
                    if (!n(a, s, r, o)) return;
                    return u(e, t, r, a, s, o, i);
                  }
                });
            }
            function c(e) {
              var t = e.lastIndexOf("*"),
                r = Math.max(t + 1, e.lastIndexOf("/"));
              return {
                length: r,
                regEx: new RegExp(
                  "^(" +
                    e
                      .substr(0, r)
                      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
                      .replace(/\*/g, "[^\\/]+") +
                    ")(\\/|$)"
                ),
                wildcard: -1 != t
              };
            }
            function f(e, t) {
              for (
                var r, n, a = !1, o = 0;
                o < e.packageConfigPaths.length;
                o++
              ) {
                var i = e.packageConfigPaths[o],
                  s = h[i] || (h[i] = c(i));
                if (!(t.length < s.length)) {
                  var l = t.match(s.regEx);
                  !l ||
                    (r && ((a && s.wildcard) || !(r.length < l[1].length))) ||
                    ((r = l[1]),
                    (a = !s.wildcard),
                    (n = r + i.substr(s.length)));
                }
              }
              return r ? { packageName: r, configPath: n } : void 0;
            }
            function m(e, t, r) {
              var n = e.pluginLoader || e;
              return (
                ((n.meta[r] = n.meta[r] || {}).format = "json"),
                (n.meta[r].loader = null),
                n.load(r).then(function() {
                  var a = n.get(r)["default"];
                  return (
                    a.systemjs && (a = a.systemjs),
                    a.modules &&
                      ((a.meta = a.modules),
                      w.call(
                        e,
                        "Package config file " +
                          r +
                          ' is configured with "modules", which is deprecated as it has been renamed to "meta".'
                      )),
                    b(e, t, a, !0)
                  );
                })
              );
            }
            function p(e, t, r) {
              var n;
              for (var a in e) {
                var o = "./" == a.substr(0, 2) ? "./" : "";
                if (
                  (o && (a = a.substr(2)),
                  (n = a.indexOf("*")),
                  -1 !== n &&
                    a.substr(0, n) == t.substr(0, n) &&
                    a.substr(n + 1) == t.substr(t.length - a.length + n + 1) &&
                    r(a, e[o + a], a.split("/").length))
                )
                  return;
              }
              var i =
                e[t] && e.hasOwnProperty && e.hasOwnProperty(t)
                  ? e[t]
                  : e["./" + t];
              i && r(i, i, 0);
            }
            s(function(e) {
              return function() {
                e.call(this),
                  (this.packages = {}),
                  (this.packageConfigPaths = []);
              };
            }),
              (a.prototype.normalizeSync = a.prototype.decanonicalize =
                a.prototype.normalize),
              i("decanonicalize", function(t) {
                return function(r, n) {
                  if (this.builder) return t.call(this, r, n, !0);
                  var a = t.call(this, r, n, !1);
                  if (!this.defaultJSExtensions) return a;
                  var o = e(this, a),
                    i = this.packages[o],
                    s = i && i.defaultExtension;
                  return (
                    void 0 == s &&
                      i &&
                      i.meta &&
                      p(i.meta, a.substr(o), function(e, t, r) {
                        return 0 == r || e.lastIndexOf("*") != e.length - 1
                          ? ((s = !1), !0)
                          : void 0;
                      }),
                    (s === !1 || (s && ".js" != s)) &&
                      ".js" != r.substr(r.length - 3, 3) &&
                      ".js" == a.substr(a.length - 3, 3) &&
                      (a = a.substr(0, a.length - 3)),
                    a
                  );
                };
              }),
              i("normalizeSync", function(t) {
                return function(n, a, i) {
                  var s = this;
                  if (((i = i === !0), a))
                    var l =
                      e(s, a) ||
                      (s.defaultJSExtensions &&
                        ".js" == a.substr(a.length - 3, 3) &&
                        e(s, a.substr(0, a.length - 3)));
                  var u = l && s.packages[l];
                  if (u && "." != n[0]) {
                    var d = u.map,
                      c = d && _(d, n);
                    if (c && "string" == typeof d[c]) {
                      var m = o(s, u, l, c, n, i);
                      if (m) return m;
                    }
                  }
                  var p =
                      s.defaultJSExtensions &&
                      ".js" != n.substr(n.length - 3, 3),
                    h = t.call(s, n, a, !1);
                  p && ".js" != h.substr(h.length - 3, 3) && (p = !1),
                    p && (h = h.substr(0, h.length - 3));
                  var g = f(s, h),
                    v = (g && g.packageName) || e(s, h);
                  if (!v) return h + (p ? ".js" : "");
                  var y = h.substr(v.length + 1);
                  return r(s, s.packages[v] || {}, v, y, i);
                };
              }),
              i("normalize", function(t) {
                return function(r, n, a) {
                  var o = this;
                  return (
                    (a = a === !0),
                    Promise.resolve()
                      .then(function() {
                        if (n)
                          var t =
                            e(o, n) ||
                            (o.defaultJSExtensions &&
                              ".js" == n.substr(n.length - 3, 3) &&
                              e(o, n.substr(0, n.length - 3)));
                        var i = t && o.packages[t];
                        if (i && "./" != r.substr(0, 2)) {
                          var s = i.map,
                            l = s && _(s, r);
                          if (l) return d(o, i, t, l, r, a);
                        }
                        return Promise.resolve();
                      })
                      .then(function(i) {
                        if (i) return i;
                        var s =
                            o.defaultJSExtensions &&
                            ".js" != r.substr(r.length - 3, 3),
                          u = t.call(o, r, n, !1);
                        s && ".js" != u.substr(u.length - 3, 3) && (s = !1),
                          s && (u = u.substr(0, u.length - 3));
                        var d = f(o, u),
                          c = (d && d.packageName) || e(o, u);
                        if (!c) return Promise.resolve(u + (s ? ".js" : ""));
                        var p = o.packages[c],
                          h = p && (p.configured || !d);
                        return (h
                          ? Promise.resolve(p)
                          : m(o, c, d.configPath)
                        ).then(function(e) {
                          var t = u.substr(c.length + 1);
                          return l(o, e, c, t, a);
                        });
                      })
                  );
                };
              });
            var h = {};
            i("locate", function(t) {
              return function(r) {
                var n = this;
                return Promise.resolve(t.call(this, r)).then(function(t) {
                  var a = e(n, r.name);
                  if (a) {
                    var o = n.packages[a],
                      i = r.name.substr(a.length + 1),
                      s = {};
                    if (o.meta) {
                      var l = 0;
                      p(o.meta, i, function(e, t, r) {
                        r > l && (l = r), v(s, t, r && l > r);
                      }),
                        v(r.metadata, s);
                    }
                    o.format &&
                      !r.metadata.loader &&
                      (r.metadata.format = r.metadata.format || o.format);
                  }
                  return t;
                });
              };
            });
          })(),
          (function() {
            function t() {
              if (s && "interactive" === s.script.readyState) return s.load;
              for (var e = 0; e < d.length; e++)
                if ("interactive" == d[e].script.readyState)
                  return (s = d[e]), s.load;
            }
            function r(e, t) {
              return new Promise(function(e, r) {
                t.metadata.integrity &&
                  r(
                    new Error(
                      "Subresource integrity checking is not supported in web workers."
                    )
                  ),
                  (l = t);
                try {
                  importScripts(t.address);
                } catch (n) {
                  (l = null), r(n);
                }
                (l = null),
                  t.metadata.entry ||
                    r(
                      new Error(
                        t.address +
                          " did not call System.register or AMD define. If loading a global, ensure the meta format is set to global."
                      )
                    ),
                  e("");
              });
            }
            if ("undefined" != typeof document)
              var n = document.getElementsByTagName("head")[0];
            var a,
              o,
              s,
              l = null,
              u =
                n &&
                (function() {
                  var e = document.createElement("script"),
                    t =
                      "undefined" != typeof opera &&
                      "[object Opera]" === opera.toString();
                  return (
                    e.attachEvent &&
                    !(
                      e.attachEvent.toString &&
                      e.attachEvent.toString().indexOf("[native code") < 0
                    ) &&
                    !t
                  );
                })(),
              d = [],
              c = 0,
              f = [];
            i("pushRegister_", function(e) {
              return function(r) {
                return e.call(this, r)
                  ? !1
                  : (l
                      ? this.reduceRegister_(l, r)
                      : u
                        ? this.reduceRegister_(t(), r)
                        : c ? f.push(r) : this.reduceRegister_(null, r),
                    !0);
              };
            }),
              i("fetch", function(t) {
                return function(i) {
                  var l = this;
                  return "json" != i.metadata.format &&
                    i.metadata.scriptLoad &&
                    (D || F)
                    ? F
                      ? r(l, i)
                      : new Promise(function(t, r) {
                          function m(e) {
                            if (
                              !g.readyState ||
                              "loaded" == g.readyState ||
                              "complete" == g.readyState
                            ) {
                              if ((c--, i.metadata.entry || f.length)) {
                                if (!u) {
                                  for (var n = 0; n < f.length; n++)
                                    l.reduceRegister_(i, f[n]);
                                  f = [];
                                }
                              } else l.reduceRegister_(i);
                              h(),
                                i.metadata.entry ||
                                  i.metadata.bundle ||
                                  r(
                                    new Error(
                                      i.name +
                                        " did not call System.register or AMD define. If loading a global module configure the global name via the meta exports property for script injection support."
                                    )
                                  ),
                                t("");
                            }
                          }
                          function p(e) {
                            h(),
                              r(
                                new Error("Unable to load script " + i.address)
                              );
                          }
                          function h() {
                            if (
                              ((e.System = a), (e.require = o), g.detachEvent)
                            ) {
                              g.detachEvent("onreadystatechange", m);
                              for (var t = 0; t < d.length; t++)
                                d[t].script == g &&
                                  (s && s.script == g && (s = null),
                                  d.splice(t, 1));
                            } else g.removeEventListener("load", m, !1), g.removeEventListener("error", p, !1);
                            n.removeChild(g);
                          }
                          var g = document.createElement("script");
                          (g.async = !0),
                            i.metadata.crossOrigin &&
                              (g.crossOrigin = i.metadata.crossOrigin),
                            i.metadata.integrity &&
                              g.setAttribute("integrity", i.metadata.integrity),
                            u
                              ? (g.attachEvent("onreadystatechange", m),
                                d.push({ script: g, load: i }))
                              : (g.addEventListener("load", m, !1),
                                g.addEventListener("error", p, !1)),
                            c++,
                            (a = e.System),
                            (o = e.require),
                            (g.src = i.address),
                            n.appendChild(g);
                        })
                    : t.call(this, i);
                };
              });
          })();
        var se = /^(\s*\/\*[^\*]*(\*(?!\/)[^\*]*)*\*\/|\s*\/\/[^\n]*|\s*"[^"]+"\s*;?|\s*'[^']+'\s*;?)*\s*/;
        !(function() {
          function t(e, r, n) {
            if (
              ((n[e.groupIndex] = n[e.groupIndex] || []),
              -1 == $.call(n[e.groupIndex], e))
            ) {
              n[e.groupIndex].push(e);
              for (var a = 0, o = e.normalizedDeps.length; o > a; a++) {
                var i = e.normalizedDeps[a],
                  s = r.defined[i];
                if (s && !s.evaluated) {
                  var l = e.groupIndex + (s.declarative != e.declarative);
                  if (null === s.groupIndex || s.groupIndex < l) {
                    if (
                      null !== s.groupIndex &&
                      (n[s.groupIndex].splice($.call(n[s.groupIndex], s), 1),
                      0 == n[s.groupIndex].length)
                    )
                      throw new Error("Mixed dependency cycle detected");
                    s.groupIndex = l;
                  }
                  t(s, r, n);
                }
              }
            }
          }
          function n(e, r, n) {
            if (!r.module) {
              r.groupIndex = 0;
              var a = [];
              t(r, n, a);
              for (
                var o = !!r.declarative == a.length % 2, i = a.length - 1;
                i >= 0;
                i--
              ) {
                for (var s = a[i], l = 0; l < s.length; l++) {
                  var d = s[l];
                  o ? u(d, n) : c(d, n);
                }
                o = !o;
              }
            }
          }
          function o() {}
          function l(e, t) {
            return (
              t[e] ||
              (t[e] = {
                name: e,
                dependencies: [],
                exports: new o(),
                importers: []
              })
            );
          }
          function u(t, r) {
            if (!t.module) {
              var n = r._loader.moduleRecords,
                a = (t.module = l(t.name, n)),
                o = t.module.exports,
                i = t.declare.call(
                  e,
                  function(e, t) {
                    if (((a.locked = !0), "object" == typeof e))
                      for (var r in e) o[r] = e[r];
                    else o[e] = t;
                    for (var n = 0, i = a.importers.length; i > n; n++) {
                      var s = a.importers[n];
                      if (!s.locked) {
                        var l = $.call(s.dependencies, a),
                          u = s.setters[l];
                        u && u(o);
                      }
                    }
                    return (a.locked = !1), t;
                  },
                  { id: t.name }
                );
              if (
                ("function" == typeof i && (i = { setters: [], execute: i }),
                (i = i || { setters: [], execute: function() {} }),
                (a.setters = i.setters),
                (a.execute = i.execute),
                !a.setters || !a.execute)
              )
                throw new TypeError(
                  "Invalid System.register form for " + t.name
                );
              for (var s = 0, d = t.normalizedDeps.length; d > s; s++) {
                var c,
                  f = t.normalizedDeps[s],
                  m = r.defined[f],
                  p = n[f];
                p
                  ? (c = p.exports)
                  : m && !m.declarative
                    ? (c = m.esModule)
                    : m
                      ? (u(m, r), (p = m.module), (c = p.exports))
                      : (c = r.get(f)),
                  p && p.importers
                    ? (p.importers.push(a), a.dependencies.push(p))
                    : a.dependencies.push(null);
                for (
                  var h = t.originalIndices[s], g = 0, v = h.length;
                  v > g;
                  ++g
                ) {
                  var y = h[g];
                  a.setters[y] && a.setters[y](c);
                }
              }
            }
          }
          function d(e, t) {
            var r,
              n = t.defined[e];
            if (n)
              n.declarative ? f(e, n, [], t) : n.evaluated || c(n, t),
                (r = n.module.exports);
            else if (((r = t.get(e)), !r))
              throw new Error("Unable to load dependency " + e + ".");
            return (!n || n.declarative) && r && r.__useDefault
              ? r["default"]
              : r;
          }
          function c(t, n) {
            if (!t.module) {
              var a = {},
                o = (t.module = { exports: a, id: t.name });
              if (!t.executingRequire)
                for (var i = 0, s = t.normalizedDeps.length; s > i; i++) {
                  var l = t.normalizedDeps[i],
                    u = n.defined[l];
                  u && c(u, n);
                }
              t.evaluated = !0;
              var f = t.execute.call(
                e,
                function(e) {
                  for (var r = 0, a = t.deps.length; a > r; r++)
                    if (t.deps[r] == e) return d(t.normalizedDeps[r], n);
                  var o = n.normalizeSync(e, t.name);
                  if (-1 != $.call(t.normalizedDeps, o)) return d(o, n);
                  throw new Error(
                    "Module " + e + " not declared as a dependency of " + t.name
                  );
                },
                a,
                o
              );
              void 0 !== f && (o.exports = f),
                (a = o.exports),
                a && (a.__esModule || a instanceof r)
                  ? (t.esModule = n.newModule(a))
                  : t.esmExports && a !== e
                    ? (t.esModule = n.newModule(p(a)))
                    : (t.esModule = n.newModule({
                        default: a,
                        __useDefault: !0
                      }));
            }
          }
          function f(t, r, n, a) {
            if (r && !r.evaluated && r.declarative) {
              n.push(t);
              for (var o = 0, i = r.normalizedDeps.length; i > o; o++) {
                var s = r.normalizedDeps[o];
                -1 == $.call(n, s) &&
                  (a.defined[s] ? f(s, a.defined[s], n, a) : a.get(s));
              }
              r.evaluated || ((r.evaluated = !0), r.module.execute.call(e));
            }
          }
          (a.prototype.register = function(e, t, r) {
            if (
              ("string" != typeof e && ((r = t), (t = e), (e = null)),
              "boolean" == typeof r)
            )
              return this.registerDynamic.apply(this, arguments);
            var n = R();
            (n.name =
              e && (this.decanonicalize || this.normalize).call(this, e)),
              (n.declarative = !0),
              (n.deps = t),
              (n.declare = r),
              this.pushRegister_({ amd: !1, entry: n });
          }),
            (a.prototype.registerDynamic = function(e, t, r, n) {
              "string" != typeof e && ((n = r), (r = t), (t = e), (e = null));
              var a = R();
              (a.name =
                e && (this.decanonicalize || this.normalize).call(this, e)),
                (a.deps = t),
                (a.execute = n),
                (a.executingRequire = r),
                this.pushRegister_({ amd: !1, entry: a });
            }),
            i("reduceRegister_", function() {
              return function(e, t) {
                if (t) {
                  var r = t.entry,
                    n = e && e.metadata;
                  if (
                    (r.name &&
                      (r.name in this.defined || (this.defined[r.name] = r),
                      n && (n.bundle = !0)),
                    !r.name || (e && !n.entry && r.name == e.name))
                  ) {
                    if (!n)
                      throw new TypeError(
                        "Invalid System.register call. Anonymous System.register calls can only be made by modules loaded by SystemJS.import and not via script tags."
                      );
                    if (n.entry)
                      throw "register" == n.format
                        ? new Error(
                            "Multiple anonymous System.register calls in module " +
                              e.name +
                              ". If loading a bundle, ensure all the System.register calls are named."
                          )
                        : new Error(
                            "Module " +
                              e.name +
                              " interpreted as " +
                              n.format +
                              " module format, but called System.register."
                          );
                    n.format || (n.format = "register"), (n.entry = r);
                  }
                }
              };
            }),
            s(function(e) {
              return function() {
                e.call(this),
                  (this.defined = {}),
                  (this._loader.moduleRecords = {});
              };
            }),
            U(o, "toString", {
              value: function() {
                return "Module";
              }
            }),
            i("delete", function(e) {
              return function(t) {
                return (
                  delete this._loader.moduleRecords[t],
                  delete this.defined[t],
                  e.call(this, t)
                );
              };
            }),
            i("fetch", function(e) {
              return function(t) {
                return this.defined[t.name]
                  ? ((t.metadata.format = "defined"), "")
                  : ((t.metadata.deps = t.metadata.deps || []),
                    e.call(this, t));
              };
            }),
            i("translate", function(e) {
              return function(t) {
                return (
                  (t.metadata.deps = t.metadata.deps || []),
                  Promise.resolve(e.apply(this, arguments)).then(function(e) {
                    return (
                      ("register" == t.metadata.format ||
                        "system" == t.metadata.format ||
                        (!t.metadata.format && k(t.source))) &&
                        (t.metadata.format = "register"),
                      e
                    );
                  })
                );
              };
            }),
            i("load", function(e) {
              return function(t) {
                var r = this,
                  a = r.defined[t];
                return !a || a.deps.length
                  ? e.apply(this, arguments)
                  : ((a.originalIndices = a.normalizedDeps = []),
                    n(t, a, r),
                    f(t, a, [], r),
                    a.esModule || (a.esModule = r.newModule(a.module.exports)),
                    r.trace || (r.defined[t] = void 0),
                    r.set(t, a.esModule),
                    Promise.resolve());
              };
            }),
            i("instantiate", function(e) {
              return function(t) {
                "detect" == t.metadata.format && (t.metadata.format = void 0),
                  e.call(this, t);
                var r,
                  a = this;
                if (a.defined[t.name])
                  (r = a.defined[t.name]),
                    r.declarative || (r.deps = r.deps.concat(t.metadata.deps)),
                    (r.deps = r.deps.concat(t.metadata.deps));
                else if (t.metadata.entry)
                  (r = t.metadata.entry),
                    (r.deps = r.deps.concat(t.metadata.deps));
                else if (
                  !(
                    (a.builder && t.metadata.bundle) ||
                    ("register" != t.metadata.format &&
                      "esm" != t.metadata.format &&
                      "es6" != t.metadata.format)
                  )
                ) {
                  if (
                    ("undefined" != typeof re && re.call(a, t),
                    !t.metadata.entry && !t.metadata.bundle)
                  )
                    throw new Error(
                      t.name +
                        " detected as " +
                        t.metadata.format +
                        " but didn't execute."
                    );
                  (r = t.metadata.entry),
                    r &&
                      t.metadata.deps &&
                      (r.deps = r.deps.concat(t.metadata.deps));
                }
                r ||
                  ((r = R()),
                  (r.deps = t.metadata.deps),
                  (r.execute = function() {})),
                  (a.defined[t.name] = r);
                var o = m(r.deps);
                (r.deps = o.names),
                  (r.originalIndices = o.indices),
                  (r.name = t.name),
                  (r.esmExports = t.metadata.esmExports !== !1);
                for (var i = [], s = 0, l = r.deps.length; l > s; s++)
                  i.push(Promise.resolve(a.normalize(r.deps[s], t.name)));
                return Promise.all(i).then(function(e) {
                  return (
                    (r.normalizedDeps = e),
                    {
                      deps: r.deps,
                      execute: function() {
                        return (
                          n(t.name, r, a),
                          f(t.name, r, [], a),
                          r.esModule ||
                            (r.esModule = a.newModule(r.module.exports)),
                          a.trace || (a.defined[t.name] = void 0),
                          r.esModule
                        );
                      }
                    }
                  );
                });
              };
            });
        })(),
          (function() {
            var r = /(^\s*|[}\);\n]\s*)(import\s*(['"]|(\*\s+as\s+)?[^"'\(\)\n;]+\s*from\s*['"]|\{)|export\s+\*\s+from\s+["']|export\s*(\{|default|function|class|var|const|let|async\s+function))/,
              n = /\$traceurRuntime\s*\./,
              a = /babelHelpers\s*\./;
            i("translate", function(o) {
              return function(i) {
                var s = this,
                  l = arguments;
                return o.apply(s, l).then(function(o) {
                  if (
                    "esm" == i.metadata.format ||
                    "es6" == i.metadata.format ||
                    (!i.metadata.format && o.match(r))
                  ) {
                    if (
                      ("es6" == i.metadata.format &&
                        w.call(
                          s,
                          "Module " +
                            i.name +
                            ' has metadata setting its format to "es6", which is deprecated.\nThis should be updated to "esm".'
                        ),
                      (i.metadata.format = "esm"),
                      i.metadata.deps)
                    ) {
                      for (var u = "", d = 0; d < i.metadata.deps.length; d++)
                        u += 'import "' + i.metadata.deps[d] + '"; ';
                      i.source = u + o;
                    }
                    if (s.transpiler === !1) {
                      if (s.builder) return o;
                      throw new TypeError(
                        "Unable to dynamically transpile ES module as SystemJS.transpiler set to false."
                      );
                    }
                    return (
                      (s._loader.loadedTranspiler =
                        s._loader.loadedTranspiler || !1),
                      s.pluginLoader &&
                        (s.pluginLoader._loader.loadedTranspiler =
                          s._loader.loadedTranspiler || !1),
                      (
                        s._loader.transpilerPromise ||
                        (s._loader.transpilerPromise = Promise.resolve(
                          e[
                            "typescript" == s.transpiler ? "ts" : s.transpiler
                          ] ||
                            (s.pluginLoader || s)
                              .normalize(s.transpiler)
                              .then(function(e) {
                                return (
                                  (s._loader.transpilerNormalized = e),
                                  (s.pluginLoader || s)
                                    .load(e)
                                    .then(function() {
                                      return (s.pluginLoader || s).get(e);
                                    })
                                );
                              })
                        ))
                      ).then(
                        function(t) {
                          return (
                            (s._loader.loadedTranspilerRuntime = !0),
                            "function" != typeof t["default"] ||
                            e[
                              "typescript" == s.transpiler ? "ts" : s.transpiler
                            ]
                              ? t.translate
                                ? t == i.metadata.loaderModule
                                  ? i.source
                                  : ("string" == typeof i.metadata.sourceMap &&
                                      (i.metadata.sourceMap = JSON.parse(
                                        i.metadata.sourceMap
                                      )),
                                    Promise.resolve(
                                      t.translate.apply(s, l)
                                    ).then(function(e) {
                                      var t = i.metadata.sourceMap;
                                      if (t && "object" == typeof t) {
                                        var r = i.address.split("!")[0];
                                        (t.file && t.file != i.address) ||
                                          (t.file = r + "!transpiled"),
                                          (!t.sources ||
                                            (t.sources.length <= 1 &&
                                              (!t.sources[0] ||
                                                t.sources[0] == i.address))) &&
                                            (t.sources = [r]);
                                      }
                                      return (
                                        "esm" == i.metadata.format &&
                                          !s.builder &&
                                          k(e) &&
                                          (i.metadata.format = "register"),
                                        e
                                      );
                                    }))
                                : (s.builder &&
                                    (i.metadata.originalSource = i.source),
                                  Y.call(s, i).then(function(e) {
                                    return (i.metadata.sourceMap = void 0), e;
                                  }))
                              : s.builder
                                ? o
                                : Promise.resolve(
                                    t["default"].call(s, i.address, i.name)
                                  ).then(function(e) {
                                    return x(i, e), "";
                                  })
                          );
                        },
                        function(e) {
                          throw t(
                            e,
                            "Unable to load transpiler to transpile " + i.name
                          );
                        }
                      )
                    );
                  }
                  if (s.transpiler === !1) return o;
                  if (
                    (s._loader.loadedTranspiler !== !1 ||
                      ("traceur" != s.transpiler &&
                        "typescript" != s.transpiler &&
                        "babel" != s.transpiler) ||
                      i.name != s.normalizeSync(s.transpiler) ||
                      (o.length > 100 &&
                        !i.metadata.format &&
                        ((i.metadata.format = "global"),
                        "traceur" === s.transpiler &&
                          (i.metadata.exports = "traceur"),
                        "typescript" === s.transpiler &&
                          (i.metadata.exports = "ts")),
                      (s._loader.loadedTranspiler = !0)),
                    s._loader.loadedTranspilerRuntime === !1 &&
                      (i.name == s.normalizeSync("traceur-runtime") ||
                        i.name == s.normalizeSync("babel/external-helpers*")) &&
                      (o.length > 100 &&
                        (i.metadata.format = i.metadata.format || "global"),
                      (s._loader.loadedTranspilerRuntime = !0)),
                    ("register" == i.metadata.format || i.metadata.bundle) &&
                      s._loader.loadedTranspilerRuntime !== !0)
                  ) {
                    if (
                      "traceur" == s.transpiler &&
                      !e.$traceurRuntime &&
                      i.source.match(n)
                    )
                      return (
                        (s._loader.loadedTranspilerRuntime =
                          s._loader.loadedTranspilerRuntime || !1),
                        s["import"]("traceur-runtime").then(function() {
                          return o;
                        })
                      );
                    if (
                      "babel" == s.transpiler &&
                      !e.babelHelpers &&
                      i.source.match(a)
                    )
                      return (
                        (s._loader.loadedTranspilerRuntime =
                          s._loader.loadedTranspilerRuntime || !1),
                        s["import"]("babel/external-helpers").then(function() {
                          return o;
                        })
                      );
                  }
                  return o;
                });
              };
            });
          })();
        var le = "undefined" != typeof self ? "self" : "global";
        i("fetch", function(e) {
          return function(t) {
            return (
              t.metadata.exports &&
                !t.metadata.format &&
                (t.metadata.format = "global"),
              e.call(this, t)
            );
          };
        }),
          i("instantiate", function(e) {
            return function(t) {
              var r = this;
              if (
                (t.metadata.format || (t.metadata.format = "global"),
                "global" == t.metadata.format && !t.metadata.entry)
              ) {
                var n = R();
                (t.metadata.entry = n), (n.deps = []);
                for (var a in t.metadata.globals) {
                  var o = t.metadata.globals[a];
                  o && n.deps.push(o);
                }
                n.execute = function(e, n, a) {
                  var o;
                  if (t.metadata.globals) {
                    o = {};
                    for (var i in t.metadata.globals)
                      t.metadata.globals[i] &&
                        (o[i] = e(t.metadata.globals[i]));
                  }
                  var s = t.metadata.exports;
                  s && (t.source += "\n" + le + '["' + s + '"] = ' + s + ";");
                  var l = r
                    .get("@@global-helpers")
                    .prepareGlobal(a.id, s, o, !!t.metadata.encapsulateGlobal);
                  return re.call(r, t), l();
                };
              }
              return e.call(this, t);
            };
          }),
          i("reduceRegister_", function(e) {
            return function(t, r) {
              if (
                r ||
                (!t.metadata.exports && (!F || "global" != t.metadata.format))
              )
                return e.call(this, t, r);
              t.metadata.format = "global";
              var n = (t.metadata.entry = R());
              n.deps = t.metadata.deps;
              var a = z(t.metadata.exports);
              n.execute = function() {
                return a;
              };
            };
          }),
          s(function(t) {
            return function() {
              function r(t) {
                if (Object.keys) Object.keys(e).forEach(t);
                else for (var r in e) i.call(e, r) && t(r);
              }
              function n(t) {
                r(function(r) {
                  if (-1 == $.call(s, r)) {
                    try {
                      var n = e[r];
                    } catch (a) {
                      s.push(r);
                    }
                    t(r, n);
                  }
                });
              }
              var a = this;
              t.call(a);
              var o,
                i = Object.prototype.hasOwnProperty,
                s = [
                  "_g",
                  "sessionStorage",
                  "localStorage",
                  "clipboardData",
                  "frames",
                  "frameElement",
                  "external",
                  "mozAnimationStartTime",
                  "webkitStorageInfo",
                  "webkitIndexedDB",
                  "mozInnerScreenY",
                  "mozInnerScreenX"
                ];
              a.set(
                "@@global-helpers",
                a.newModule({
                  prepareGlobal: function(t, r, a, i) {
                    var s = e.define;
                    e.define = void 0;
                    var l;
                    if (a) {
                      l = {};
                      for (var u in a) (l[u] = e[u]), (e[u] = a[u]);
                    }
                    return (
                      r ||
                        ((o = {}),
                        n(function(e, t) {
                          o[e] = t;
                        })),
                      function() {
                        var t,
                          a = r ? z(r) : {},
                          u = !!r;
                        if (
                          ((!r || i) &&
                            n(function(n, s) {
                              o[n] !== s &&
                                "undefined" != typeof s &&
                                (i && (e[n] = void 0),
                                r ||
                                  ((a[n] = s),
                                  "undefined" != typeof t
                                    ? u || t === s || (u = !0)
                                    : (t = s)));
                            }),
                          (a = u ? a : t),
                          l)
                        )
                          for (var d in l) e[d] = l[d];
                        return (e.define = s), a;
                      }
                    );
                  }
                })
              );
            };
          }),
          (function() {
            function t(e) {
              function t(e, t) {
                for (var r = 0; r < e.length; r++)
                  if (e[r][0] < t.index && e[r][1] > t.index) return !0;
                return !1;
              }
              n.lastIndex = a.lastIndex = o.lastIndex = 0;
              var r,
                i = [],
                s = [],
                l = [];
              if (e.length / e.split("\n").length < 200) {
                for (; (r = o.exec(e)); )
                  s.push([r.index, r.index + r[0].length]);
                for (; (r = a.exec(e)); )
                  t(s, r) ||
                    l.push([r.index + r[1].length, r.index + r[0].length - 1]);
              }
              for (; (r = n.exec(e)); )
                if (!t(s, r) && !t(l, r)) {
                  var u = r[1].substr(1, r[1].length - 2);
                  if (u.match(/"|'/)) continue;
                  "/" == u[u.length - 1] && (u = u.substr(0, u.length - 1)),
                    i.push(u);
                }
              return i;
            }
            var r = /(?:^\uFEFF?|[^$_a-zA-Z\xA0-\uFFFF.])(exports\s*(\[['"]|\.)|module(\.exports|\['exports'\]|\["exports"\])\s*(\[['"]|[=,\.]))/,
              n = /(?:^\uFEFF?|[^$_a-zA-Z\xA0-\uFFFF."'])require\s*\(\s*("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')\s*\)/g,
              a = /(^|[^\\])(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,
              o = /("[^"\\\n\r]*(\\.[^"\\\n\r]*)*"|'[^'\\\n\r]*(\\.[^'\\\n\r]*)*')/g,
              s = /^\#\!.*/;
            i("instantiate", function(a) {
              return function(o) {
                var i = this;
                if (
                  (o.metadata.format ||
                    ((r.lastIndex = 0),
                    (n.lastIndex = 0),
                    (n.exec(o.source) || r.exec(o.source)) &&
                      (o.metadata.format = "cjs")),
                  "cjs" == o.metadata.format)
                ) {
                  var l = o.metadata.deps,
                    u =
                      o.metadata.cjsRequireDetection === !1 ? [] : t(o.source);
                  for (var d in o.metadata.globals)
                    o.metadata.globals[d] && u.push(o.metadata.globals[d]);
                  var c = R();
                  (o.metadata.entry = c),
                    (c.deps = u),
                    (c.executingRequire = !0),
                    (c.execute = function(t, r, n) {
                      function a(e) {
                        return (
                          "/" == e[e.length - 1] &&
                            (e = e.substr(0, e.length - 1)),
                          t.apply(this, arguments)
                        );
                      }
                      if (
                        ((a.resolve = function(e) {
                          return i.get("@@cjs-helpers").requireResolve(e, n.id);
                        }),
                        (n.paths = []),
                        (n.require = t),
                        !o.metadata.cjsDeferDepsExecute)
                      )
                        for (var u = 0; u < l.length; u++) a(l[u]);
                      var d = i.get("@@cjs-helpers").getPathVars(n.id),
                        c = {
                          exports: r,
                          args: [a, r, n, d.filename, d.dirname, e, e]
                        },
                        f =
                          "(function(require, exports, module, __filename, __dirname, global, GLOBAL";
                      if (o.metadata.globals)
                        for (var m in o.metadata.globals)
                          c.args.push(a(o.metadata.globals[m])),
                            (f += ", " + m);
                      var p = e.define;
                      (e.define = void 0),
                        (e.__cjsWrapper = c),
                        (o.source =
                          f +
                          ") {" +
                          o.source.replace(s, "") +
                          "\n}).apply(__cjsWrapper.exports, __cjsWrapper.args);"),
                        re.call(i, o),
                        (e.__cjsWrapper = void 0),
                        (e.define = p);
                    });
                }
                return a.call(i, o);
              };
            });
          })(),
          s(function(e) {
            return function() {
              function t(e) {
                return "file:///" == e.substr(0, 8)
                  ? e.substr(7 + !!q)
                  : n && e.substr(0, n.length) == n ? e.substr(n.length) : e;
              }
              var r = this;
              if (
                (e.call(r),
                "undefined" != typeof window &&
                  "undefined" != typeof document &&
                  window.location)
              )
                var n =
                  location.protocol +
                  "//" +
                  location.hostname +
                  (location.port ? ":" + location.port : "");
              r.set(
                "@@cjs-helpers",
                r.newModule({
                  requireResolve: function(e, n) {
                    return t(r.normalizeSync(e, n));
                  },
                  getPathVars: function(e) {
                    var r,
                      n = e.lastIndexOf("!");
                    r = -1 != n ? e.substr(0, n) : e;
                    var a = r.split("/");
                    return (
                      a.pop(),
                      (a = a.join("/")),
                      { filename: t(r), dirname: t(a) }
                    );
                  }
                })
              );
            };
          }),
          i("fetch", function(t) {
            return function(r) {
              return (
                r.metadata.scriptLoad && D && (e.define = this.amdDefine),
                t.call(this, r)
              );
            };
          }),
          s(function(t) {
            return function() {
              function r(e, t) {
                e = e.replace(s, "");
                var r = e.match(d),
                  n = (r[1].split(",")[t] || "require").replace(c, ""),
                  a = f[n] || (f[n] = new RegExp(l + n + u, "g"));
                a.lastIndex = 0;
                for (var o, i = []; (o = a.exec(e)); ) i.push(o[2] || o[3]);
                return i;
              }
              function n(e, t, r, a) {
                if ("object" == typeof e && !(e instanceof Array))
                  return n.apply(
                    null,
                    Array.prototype.splice.call(
                      arguments,
                      1,
                      arguments.length - 1
                    )
                  );
                if (
                  ("string" == typeof e && "function" == typeof t && (e = [e]),
                  !(e instanceof Array))
                ) {
                  if ("string" == typeof e) {
                    var i =
                        o.defaultJSExtensions &&
                        ".js" != e.substr(e.length - 3, 3),
                      s = o.decanonicalize(e, a);
                    i &&
                      ".js" == s.substr(s.length - 3, 3) &&
                      (s = s.substr(0, s.length - 3));
                    var l = o.get(s);
                    if (!l)
                      throw new Error(
                        'Module not already loaded loading "' +
                          e +
                          '" as ' +
                          s +
                          (a ? ' from "' + a + '".' : ".")
                      );
                    return l.__useDefault ? l["default"] : l;
                  }
                  throw new TypeError("Invalid require");
                }
                for (var u = [], d = 0; d < e.length; d++)
                  u.push(o["import"](e[d], a));
                Promise.all(u).then(function(e) {
                  t && t.apply(null, e);
                }, r);
              }
              function a(t, a, i) {
                function s(t, r, s) {
                  function c(e, r, a) {
                    return "string" == typeof e && "function" != typeof r
                      ? t(e)
                      : n.call(o, e, r, a, s.id);
                  }
                  for (var f = [], m = 0; m < a.length; m++) f.push(t(a[m]));
                  (s.uri = s.id),
                    (s.config = function() {}),
                    -1 != d && f.splice(d, 0, s),
                    -1 != u && f.splice(u, 0, r),
                    -1 != l &&
                      ((c.toUrl = function(e) {
                        var t =
                            o.defaultJSExtensions &&
                            ".js" != e.substr(e.length - 3, 3),
                          r = o.decanonicalize(e, s.id);
                        return (
                          t &&
                            ".js" == r.substr(r.length - 3, 3) &&
                            (r = r.substr(0, r.length - 3)),
                          r
                        );
                      }),
                      f.splice(l, 0, c));
                  var p = e.require;
                  e.require = n;
                  var h = i.apply(-1 == u ? e : r, f);
                  return (
                    (e.require = p),
                    "undefined" == typeof h && s && (h = s.exports),
                    "undefined" != typeof h ? h : void 0
                  );
                }
                "string" != typeof t && ((i = a), (a = t), (t = null)),
                  a instanceof Array ||
                    ((i = a),
                    (a = ["require", "exports", "module"].splice(0, i.length))),
                  "function" != typeof i &&
                    (i = (function(e) {
                      return function() {
                        return e;
                      };
                    })(i)),
                  void 0 === a[a.length - 1] && a.pop();
                var l, u, d;
                -1 != (l = $.call(a, "require")) &&
                  (a.splice(l, 1), t || (a = a.concat(r(i.toString(), l)))),
                  -1 != (u = $.call(a, "exports")) && a.splice(u, 1),
                  -1 != (d = $.call(a, "module")) && a.splice(d, 1);
                var c = R();
                (c.name = t && (o.decanonicalize || o.normalize).call(o, t)),
                  (c.deps = a),
                  (c.execute = s),
                  o.pushRegister_({ amd: !0, entry: c });
              }
              var o = this;
              t.call(this);
              var s = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,
                l = "(?:^|[^$_a-zA-Z\\xA0-\\uFFFF.])",
                u = "\\s*\\(\\s*(\"([^\"]+)\"|'([^']+)')\\s*\\)",
                d = /\(([^\)]*)\)/,
                c = /^\s+|\s+$/g,
                f = {};
              (a.amd = {}),
                i("reduceRegister_", function(e) {
                  return function(t, r) {
                    if (!r || !r.amd) return e.call(this, t, r);
                    var n = t && t.metadata,
                      a = r.entry;
                    if (n)
                      if (n.format && "detect" != n.format) {
                        if (!a.name && "amd" != n.format)
                          throw new Error(
                            "AMD define called while executing " +
                              n.format +
                              " module " +
                              t.name
                          );
                      } else n.format = "amd";
                    if (a.name)
                      n &&
                        (n.entry || n.bundle
                          ? n.entry &&
                            n.entry.name &&
                            n.entry.name != t.name &&
                            (n.entry = void 0)
                          : (n.entry = a),
                        (n.bundle = !0)),
                        a.name in this.defined || (this.defined[a.name] = a);
                    else {
                      if (!n)
                        throw new TypeError("Unexpected anonymous AMD define.");
                      if (n.entry && !n.entry.name)
                        throw new Error(
                          "Multiple anonymous defines in module " + t.name
                        );
                      n.entry = a;
                    }
                  };
                }),
                (o.amdDefine = a),
                (o.amdRequire = n);
            };
          }),
          (function() {
            var t = /(?:^\uFEFF?|[^$_a-zA-Z\xA0-\uFFFF.])define\s*\(\s*("[^"]+"\s*,\s*|'[^']+'\s*,\s*)?\s*(\[(\s*(("[^"]+"|'[^']+')\s*,|\/\/.*\r?\n|\/\*(.|\s)*?\*\/))*(\s*("[^"]+"|'[^']+')\s*,?)?(\s*(\/\/.*\r?\n|\/\*(.|\s)*?\*\/))*\s*\]|function\s*|{|[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*\))/;
            i("instantiate", function(r) {
              return function(n) {
                var a = this;
                if (
                  "amd" == n.metadata.format ||
                  (!n.metadata.format && n.source.match(t))
                )
                  if (
                    ((n.metadata.format = "amd"), a.builder || a.execute === !1)
                  )
                    n.metadata.execute = function() {
                      return n.metadata.builderExecute.apply(this, arguments);
                    };
                  else {
                    var o = e.define;
                    e.define = this.amdDefine;
                    try {
                      re.call(a, n);
                    } finally {
                      e.define = o;
                    }
                    if (!n.metadata.entry && !n.metadata.bundle)
                      throw new TypeError(
                        "AMD module " + n.name + " did not define"
                      );
                  }
                return r.call(a, n);
              };
            });
          })(),
          (function() {
            function e(e, t) {
              if (t) {
                var r;
                if (e.pluginFirst) {
                  if (-1 != (r = t.lastIndexOf("!"))) return t.substr(r + 1);
                } else if (-1 != (r = t.indexOf("!"))) return t.substr(0, r);
                return t;
              }
            }
            function t(e, t) {
              var r,
                n,
                a = t.lastIndexOf("!");
              return -1 != a
                ? (e.pluginFirst
                    ? ((r = t.substr(a + 1)), (n = t.substr(0, a)))
                    : ((r = t.substr(0, a)),
                      (n =
                        t.substr(a + 1) || r.substr(r.lastIndexOf(".") + 1))),
                  { argument: r, plugin: n })
                : void 0;
            }
            function n(e, t, r, n) {
              return (
                n &&
                  ".js" == t.substr(t.length - 3, 3) &&
                  (t = t.substr(0, t.length - 3)),
                e.pluginFirst ? r + "!" + t : t + "!" + r
              );
            }
            function a(e, t) {
              return (
                e.defaultJSExtensions && ".js" != t.substr(t.length - 3, 3)
              );
            }
            function o(r) {
              return function(o, i, s) {
                var l = this,
                  u = t(l, o);
                if (((i = e(this, i)), !u)) return r.call(this, o, i, s);
                var d = l.normalizeSync(u.argument, i, !0),
                  c = l.normalizeSync(u.plugin, i, !0);
                return n(l, d, c, a(l, u.argument));
              };
            }
            i("decanonicalize", o),
              i("normalizeSync", o),
              i("normalize", function(r) {
                return function(o, i, s) {
                  var l = this;
                  i = e(this, i);
                  var u = t(l, o);
                  return u
                    ? Promise.all([
                        l.normalize(u.argument, i, !0),
                        l.normalize(u.plugin, i, !1)
                      ]).then(function(e) {
                        return n(l, e[0], e[1], a(l, u.argument));
                      })
                    : r.call(l, o, i, s);
                };
              }),
              i("locate", function(e) {
                return function(t) {
                  var r,
                    n = this,
                    a = t.name;
                  return (
                    n.pluginFirst
                      ? -1 != (r = a.indexOf("!")) &&
                        ((t.metadata.loader = a.substr(0, r)),
                        (t.name = a.substr(r + 1)))
                      : -1 != (r = a.lastIndexOf("!")) &&
                        ((t.metadata.loader = a.substr(r + 1)),
                        (t.name = a.substr(0, r))),
                    e
                      .call(n, t)
                      .then(function(e) {
                        return -1 == r && t.metadata.loader
                          ? (n.pluginLoader || n)
                              .normalize(t.metadata.loader, t.name)
                              .then(function(r) {
                                return (t.metadata.loader = r), e;
                              })
                          : e;
                      })
                      .then(function(e) {
                        var r = t.metadata.loader;
                        if (!r) return e;
                        if (t.name == r)
                          throw new Error(
                            "Plugin " +
                              r +
                              " cannot load itself, make sure it is excluded from any wildcard meta configuration via a custom loader: false rule."
                          );
                        if (n.defined && n.defined[a]) return e;
                        var o = n.pluginLoader || n;
                        return o["import"](r).then(function(r) {
                          return (
                            (t.metadata.loaderModule = r),
                            (t.address = e),
                            r.locate ? r.locate.call(n, t) : e
                          );
                        });
                      })
                  );
                };
              }),
              i("fetch", function(e) {
                return function(t) {
                  var n = this;
                  if (
                    t.metadata.loaderModule &&
                    "defined" != t.metadata.format
                  ) {
                    if (
                      "function" == typeof t.metadata.loaderModule ||
                      (t.metadata.loaderModule instanceof r &&
                        "function" == typeof t.metadata.loaderModule["default"])
                    )
                      return "";
                    if (
                      ((t.metadata.scriptLoad = !1),
                      t.metadata.loaderModule.fetch)
                    )
                      return t.metadata.loaderModule.fetch.call(n, t, function(
                        t
                      ) {
                        return e.call(n, t);
                      });
                  }
                  return e.call(n, t);
                };
              }),
              i("translate", function(e) {
                return function(t) {
                  var r = this,
                    n = arguments;
                  return t.metadata.loaderModule &&
                    t.metadata.loaderModule.translate &&
                    "defined" != t.metadata.format
                    ? Promise.resolve(
                        t.metadata.loaderModule.translate.apply(r, n)
                      ).then(function(a) {
                        var o = t.metadata.sourceMap;
                        if (o) {
                          if ("object" != typeof o)
                            throw new Error(
                              "load.metadata.sourceMap must be set to an object."
                            );
                          var i = t.address.split("!")[0];
                          (o.file && o.file != t.address) ||
                            (o.file = i + "!transpiled"),
                            (!o.sources ||
                              (o.sources.length <= 1 &&
                                (!o.sources[0] ||
                                  o.sources[0] == t.address))) &&
                              (o.sources = [i]);
                        }
                        return (
                          "string" == typeof a && (t.source = a), e.apply(r, n)
                        );
                      })
                    : e.apply(r, n);
                };
              }),
              i("instantiate", function(e) {
                return function(t) {
                  var n = this,
                    a = !1;
                  if (
                    t.metadata.loaderModule &&
                    !n.builder &&
                    "defined" != t.metadata.format
                  ) {
                    if (t.metadata.loaderModule.instantiate)
                      return Promise.resolve(
                        t.metadata.loaderModule.instantiate.call(n, t, function(
                          t
                        ) {
                          if (a)
                            throw new Error(
                              "Instantiate must only be called once."
                            );
                          return (a = !0), e.call(n, t);
                        })
                      ).then(function(r) {
                        return a ? r : (void 0 !== r && x(t, r), e.call(n, t));
                      });
                    if (
                      "function" == typeof t.metadata.loaderModule ||
                      (t.metadata.loaderModule instanceof r &&
                        "function" == typeof t.metadata.loaderModule["default"])
                    )
                      return Promise.resolve(
                        (
                          t.metadata.loaderModule["default"] ||
                          t.metadata.loaderModule
                        ).call(n, t.address, t.name)
                      ).then(function(r) {
                        return void 0 !== r && x(t, r), e.call(n, t);
                      });
                  }
                  return e.call(n, t);
                };
              });
          })();
        var ue = ["browser", "node", "dev", "build", "production", "default"],
          de = /#\{[^\}]+\}/;
        i("normalize", function(e) {
          return function(t, r, n) {
            var a = this;
            return A.call(a, t, r)
              .then(function(t) {
                return e.call(a, t, r, n);
              })
              .then(function(e) {
                return C.call(a, e, r);
              });
          };
        }),
          (function() {
            i("fetch", function(e) {
              return function(t) {
                var r = t.metadata.alias,
                  n = t.metadata.deps || [];
                if (r) {
                  t.metadata.format = "defined";
                  var a = R();
                  return (
                    (this.defined[t.name] = a),
                    (a.declarative = !0),
                    (a.deps = n.concat([r])),
                    (a.declare = function(e) {
                      return {
                        setters: [
                          function(t) {
                            for (var r in t) e(r, t[r]);
                            t.__useDefault &&
                              (a.module.exports.__useDefault = !0);
                          }
                        ],
                        execute: function() {}
                      };
                    }),
                    ""
                  );
                }
                return e.call(this, t);
              };
            });
          })(),
          (function() {
            function e(e, t, r) {
              for (var n, a = t.split("."); a.length > 1; )
                (n = a.shift()), (e = e[n] = e[n] || {});
              (n = a.shift()), n in e || (e[n] = r);
            }
            s(function(e) {
              return function() {
                (this.meta = {}), e.call(this);
              };
            }),
              i("locate", function(e) {
                return function(t) {
                  var r,
                    n = this.meta,
                    a = t.name,
                    o = 0;
                  for (var i in n)
                    if (
                      ((r = i.indexOf("*")),
                      -1 !== r &&
                        i.substr(0, r) === a.substr(0, r) &&
                        i.substr(r + 1) ===
                          a.substr(a.length - i.length + r + 1))
                    ) {
                      var s = i.split("/").length;
                      s > o && (o = s), v(t.metadata, n[i], o != s);
                    }
                  return n[a] && v(t.metadata, n[a]), e.call(this, t);
                };
              });
            var t = /^(\s*\/\*[^\*]*(\*(?!\/)[^\*]*)*\*\/|\s*\/\/[^\n]*|\s*"[^"]+"\s*;?|\s*'[^']+'\s*;?)+/,
              r = /\/\*[^\*]*(\*(?!\/)[^\*]*)*\*\/|\/\/[^\n]*|"[^"]+"\s*;?|'[^']+'\s*;?/g;
            i("translate", function(n) {
              return function(a) {
                if ("defined" == a.metadata.format)
                  return (
                    (a.metadata.deps = a.metadata.deps || []),
                    Promise.resolve(a.source)
                  );
                var o = a.source.match(t);
                if (o)
                  for (var i = o[0].match(r), s = 0; s < i.length; s++) {
                    var l = i[s],
                      u = l.length,
                      d = l.substr(0, 1);
                    if (
                      (";" == l.substr(u - 1, 1) && u--, '"' == d || "'" == d)
                    ) {
                      var c = l.substr(1, l.length - 3),
                        f = c.substr(0, c.indexOf(" "));
                      if (f) {
                        var m = c.substr(f.length + 1, c.length - f.length - 1);
                        "[]" == f.substr(f.length - 2, 2)
                          ? ((f = f.substr(0, f.length - 2)),
                            (a.metadata[f] = a.metadata[f] || []),
                            a.metadata[f].push(m))
                          : a.metadata[f] instanceof Array
                            ? (w.call(
                                this,
                                "Module " +
                                  a.name +
                                  ' contains deprecated "deps ' +
                                  m +
                                  '" meta syntax.\nThis should be updated to "deps[] ' +
                                  m +
                                  '" for pushing to array meta.'
                              ),
                              a.metadata[f].push(m))
                            : e(a.metadata, f, m);
                      } else a.metadata[c] = !0;
                    }
                  }
                return n.apply(this, arguments);
              };
            });
          })(),
          (function() {
            s(function(e) {
              return function() {
                e.call(this),
                  (this.bundles = {}),
                  (this._loader.loadedBundles = {});
              };
            }),
              i("locate", function(e) {
                return function(t) {
                  var r = this,
                    n = !1;
                  if (!(t.name in r.defined))
                    for (var a in r.bundles) {
                      for (var o = 0; o < r.bundles[a].length; o++) {
                        var i = r.bundles[a][o];
                        if (i == t.name) {
                          n = !0;
                          break;
                        }
                        if (-1 != i.indexOf("*")) {
                          var s = i.split("*");
                          if (2 != s.length) {
                            r.bundles[a].splice(o--, 1);
                            continue;
                          }
                          if (
                            t.name.substring(0, s[0].length) == s[0] &&
                            t.name.substr(
                              t.name.length - s[1].length,
                              s[1].length
                            ) == s[1] &&
                            -1 ==
                              t.name
                                .substr(
                                  s[0].length,
                                  t.name.length - s[1].length - s[0].length
                                )
                                .indexOf("/")
                          ) {
                            n = !0;
                            break;
                          }
                        }
                      }
                      if (n)
                        return r["import"](a).then(function() {
                          return e.call(r, t);
                        });
                    }
                  return e.call(r, t);
                };
              });
          })(),
          (function() {
            s(function(e) {
              return function() {
                e.call(this), (this.depCache = {});
              };
            }),
              i("locate", function(e) {
                return function(t) {
                  var r = this,
                    n = r.depCache[t.name];
                  if (n)
                    for (var a = 0; a < n.length; a++)
                      r["import"](n[a], t.name);
                  return e.call(r, t);
                };
              });
          })(),
          (Z = new a()),
          (e.SystemJS = Z),
          (Z.version = "0.19.46 Standard"),
          "object" == typeof module &&
            module.exports &&
            "object" == typeof exports &&
            (module.exports = Z),
          (e.System = Z);
      })("undefined" != typeof self ? self : global);
  }
  var t = "undefined" == typeof Promise;
  if ("undefined" != typeof document) {
    var r = document.getElementsByTagName("script");
    if (
      (($__curScript = r[r.length - 1]),
      document.currentScript &&
        ($__curScript.defer || $__curScript.async) &&
        ($__curScript = document.currentScript),
      $__curScript.src || ($__curScript = void 0),
      t)
    ) {
      var n = $__curScript.src,
        a = n.substr(0, n.lastIndexOf("/") + 1);
      (window.systemJSBootstrap = e),
        document.write(
          '<script type="text/javascript" src="' +
            a +
            'system-polyfills.js"></script>'
        );
    } else e();
  } else if ("undefined" != typeof importScripts) {
    var a = "";
    try {
      throw new Error("_");
    } catch (o) {
      o.stack.replace(/(?:at|@).*(http.+):[\d]+:[\d]+/, function(e, t) {
        ($__curScript = { src: t }), (a = t.replace(/\/[^\/]*$/, "/"));
      });
    }
    t && importScripts(a + "system-polyfills.js"), e();
  } else
    ($__curScript =
      "undefined" != typeof __filename ? { src: __filename } : null),
      e();
})();
