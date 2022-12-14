/*!
 * monaco-themes
 * Version - 0.3.3
 * Author - Brijesh <brijesh@bitwiser.in>
 */
!(function (e, n) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = n())
    : 'function' == typeof define && define.amd
    ? define([], n)
    : 'object' == typeof exports
    ? (exports.MonacoThemes = n())
    : (e.MonacoThemes = n());
})(self, function () {
  return (function (e) {
    var n = {};
    function t(r) {
      if (n[r]) return n[r].exports;
      var i = (n[r] = { i: r, l: !1, exports: {} });
      return e[r].call(i.exports, i, i.exports, t), (i.l = !0), i.exports;
    }
    return (
      (t.m = e),
      (t.c = n),
      (t.d = function (e, n, r) {
        t.o(e, n) || Object.defineProperty(e, n, { enumerable: !0, get: r });
      }),
      (t.r = function (e) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(e, '__esModule', { value: !0 });
      }),
      (t.t = function (e, n) {
        if ((1 & n && (e = t(e)), 8 & n)) return e;
        if (4 & n && 'object' == typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (
          (t.r(r),
          Object.defineProperty(r, 'default', { enumerable: !0, value: e }),
          2 & n && 'string' != typeof e)
        )
          for (var i in e)
            t.d(
              r,
              i,
              function (n) {
                return e[n];
              }.bind(null, i)
            );
        return r;
      }),
      (t.n = function (e) {
        var n =
          e && e.__esModule
            ? function () {
                return e.default;
              }
            : function () {
                return e;
              };
        return t.d(n, 'a', n), n;
      }),
      (t.o = function (e, n) {
        return Object.prototype.hasOwnProperty.call(e, n);
      }),
      (t.p = ''),
      t((t.s = 0))
    );
  })([
    function (e, n, t) {
      var r = t(1);
      function i(e) {
        var n = (function (e) {
          return 'object' == typeof e
            ? e
            : '#' == e[0]
            ? e
                .match(/^#(..)(..)(..)/)
                .slice(1)
                .map(function (e) {
                  return parseInt(e, 16);
                })
            : e
                .match(/\(([^,]+),([^,]+),([^,]+)/)
                .slice(1)
                .map(function (e) {
                  return parseInt(e, 10);
                });
        })(e);
        return (0.21 * n[0] + 0.72 * n[1] + 0.07 * n[2]) / 255;
      }
      function o(e) {
        if (!e.length) return null;
        if ((4 == e.length && (e = e.replace(/[a-fA-F\d]/g, '$&$&')), 7 == e.length)) return e;
        if (9 == e.length) return e;
        e.match(/^#(..)(..)(..)(..)$/) || console.error("can't parse color", e);
        var n = e
          .match(/^#(..)(..)(..)(..)$/)
          .slice(1)
          .map(function (e) {
            return parseInt(e, 16);
          });
        return (n[3] = (n[3] / 255).toPrecision(2)), 'rgba(' + n.join(', ') + ')';
      }
      var a = [
        { tm: 'foreground', mn: 'editor.foreground' },
        { tm: 'background', mn: 'editor.background' },
        { tm: 'selection', mn: 'editor.selectionBackground' },
        { tm: 'inactiveSelection', mn: 'editor.inactiveSelectionBackground' },
        { tm: 'selectionHighlightColor', mn: 'editor.selectionHighlightBackground' },
        { tm: 'findMatchHighlight', mn: 'editor.findMatchHighlightBackground' },
        { tm: 'currentFindMatchHighlight', mn: 'editor.findMatchBackground' },
        { tm: 'hoverHighlight', mn: 'editor.hoverHighlightBackground' },
        { tm: 'wordHighlight', mn: 'editor.wordHighlightBackground' },
        { tm: 'wordHighlightStrong', mn: 'editor.wordHighlightStrongBackground' },
        { tm: 'findRangeHighlight', mn: 'editor.findRangeHighlightBackground' },
        { tm: 'findMatchHighlight', mn: 'peekViewResult.matchHighlightBackground' },
        { tm: 'referenceHighlight', mn: 'peekViewEditor.matchHighlightBackground' },
        { tm: 'lineHighlight', mn: 'editor.lineHighlightBackground' },
        { tm: 'rangeHighlight', mn: 'editor.rangeHighlightBackground' },
        { tm: 'caret', mn: 'editorCursor.foreground' },
        { tm: 'invisibles', mn: 'editorWhitespace.foreground' },
        { tm: 'guide', mn: 'editorIndentGuide.background' },
        { tm: 'activeGuide', mn: 'editorIndentGuide.activeBackground' },
        { tm: 'selectionBorder', mn: 'editor.selectionHighlightBorder' },
      ];
      [
        'ansiBlack',
        'ansiRed',
        'ansiGreen',
        'ansiYellow',
        'ansiBlue',
        'ansiMagenta',
        'ansiCyan',
        'ansiWhite',
        'ansiBrightBlack',
        'ansiBrightRed',
        'ansiBrightGreen',
        'ansiBrightYellow',
        'ansiBrightBlue',
        'ansiBrightMagenta',
        'ansiBrightCyan',
        'ansiBrightWhite',
      ].forEach((e) => {
        a.push({ tm: e, mn: 'terminal.' + e });
      });
      var u = [];
      n.parseTmTheme = function (e) {
        var n = r.parse(e),
          t = n.settings[0].settings,
          c = n.gutterSettings,
          l = [];
        n.settings.forEach((e) => {
          if (e.settings) {
            var n;
            n =
              'string' == typeof e.scope
                ? e.scope.replace(/^[,]+/, '').replace(/[,]+$/, '').split(',')
                : Array.isArray(e.scope)
                ? e.scope
                : [''];
            var t = {},
              r = e.settings;
            r.foreground && (t.foreground = o(r.foreground).toLowerCase().replace('#', '')),
              r.background && (t.background = o(r.background).toLowerCase().replace('#', '')),
              r.fontStyle && 'string' == typeof r.fontStyle && (t.fontStyle = r.fontStyle),
              n.forEach((e) => {
                if (e && Object.keys(t).length) {
                  var n = Object.assign({}, t, { token: e.trim() });
                  l.push(n);
                }
              });
          }
        });
        var s = {};
        return (
          a.forEach((e) => {
            t[e.tm] && (s[e.mn] = o(t[e.tm]));
          }),
          c &&
            u.forEach((e) => {
              c[e.tm] && (s[e.mn] = o(c[e.tm]));
            }),
          {
            base: i(s['editor.background']) < 0.5 ? 'vs-dark' : 'vs',
            inherit: !0,
            rules: l,
            colors: s,
          }
        );
      };
    },
    function (e, n, t) {
      'use strict';
      function r(e, n, t) {
        var r = e.length,
          i = 0,
          o = 1,
          a = 0;
        function u(n) {
          if (null === t) i += n;
          else
            for (; n > 0; ) {
              10 === e.charCodeAt(i) ? (i++, o++, (a = 0)) : (i++, a++), n--;
            }
        }
        function c(e) {
          null === t ? (i = e) : u(e - i);
        }
        function l() {
          for (; i < r; ) {
            var n = e.charCodeAt(i);
            if (32 !== n && 9 !== n && 13 !== n && 10 !== n) break;
            u(1);
          }
        }
        function s(n) {
          return e.substr(i, n.length) === n && (u(n.length), !0);
        }
        function g(n) {
          var t = e.indexOf(n, i);
          c(-1 !== t ? t + n.length : r);
        }
        function f(n) {
          var t = e.indexOf(n, i);
          if (-1 !== t) {
            var o = e.substring(i, t);
            return c(t + n.length), o;
          }
          o = e.substr(i);
          return c(r), o;
        }
        r > 0 && 65279 === e.charCodeAt(0) && (i = 1);
        var d = 0,
          h = null,
          m = [],
          p = [],
          y = null;
        function v(e, n) {
          m.push(d), p.push(h), (d = e), (h = n);
        }
        function k() {
          (d = m.pop()), (h = p.pop());
        }
        function b(n) {
          throw new Error('Near offset ' + i + ': ' + n + ' ~~~' + e.substr(i, 50) + '~~~');
        }
        var B,
          H,
          x,
          C = {
            enterDict: function () {
              null === y && b('missing <key>');
              var e = {};
              null !== t && (e[t] = { filename: n, line: o, char: a }),
                (h[y] = e),
                (y = null),
                v(1, e);
            },
            enterArray: function () {
              null === y && b('missing <key>');
              var e = [];
              (h[y] = e), (y = null), v(2, e);
            },
          },
          w = {
            enterDict: function () {
              var e = {};
              null !== t && (e[t] = { filename: n, line: o, char: a }), h.push(e), v(1, e);
            },
            enterArray: function () {
              var e = [];
              h.push(e), v(2, e);
            },
          };
        function S() {
          1 === d ? k() : b('unexpected </dict>');
        }
        function j() {
          1 === d ? b('unexpected </array>') : 2 === d ? k() : b('unexpected </array>');
        }
        function A(e) {
          1 === d
            ? (null === y && b('missing <key>'), (h[y] = e), (y = null))
            : 2 === d
            ? h.push(e)
            : (h = e);
        }
        function M(e) {
          isNaN(e) && b('cannot parse float'),
            1 === d
              ? (null === y && b('missing <key>'), (h[y] = e), (y = null))
              : 2 === d
              ? h.push(e)
              : (h = e);
        }
        function O(e) {
          isNaN(e) && b('cannot parse integer'),
            1 === d
              ? (null === y && b('missing <key>'), (h[y] = e), (y = null))
              : 2 === d
              ? h.push(e)
              : (h = e);
        }
        function I(e) {
          1 === d
            ? (null === y && b('missing <key>'), (h[y] = e), (y = null))
            : 2 === d
            ? h.push(e)
            : (h = e);
        }
        function P(e) {
          1 === d
            ? (null === y && b('missing <key>'), (h[y] = e), (y = null))
            : 2 === d
            ? h.push(e)
            : (h = e);
        }
        function E(e) {
          1 === d
            ? (null === y && b('missing <key>'), (h[y] = e), (y = null))
            : 2 === d
            ? h.push(e)
            : (h = e);
        }
        function T(e) {
          if (e.isClosed) return '';
          var n = f('</');
          return (
            g('>'),
            n
              .replace(/&#([0-9]+);/g, function (e, n) {
                return String.fromCodePoint(parseInt(n, 10));
              })
              .replace(/&#x([0-9a-f]+);/g, function (e, n) {
                return String.fromCodePoint(parseInt(n, 16));
              })
              .replace(/&amp;|&lt;|&gt;|&quot;|&apos;/g, function (e) {
                switch (e) {
                  case '&amp;':
                    return '&';
                  case '&lt;':
                    return '<';
                  case '&gt;':
                    return '>';
                  case '&quot;':
                    return '"';
                  case '&apos;':
                    return "'";
                }
                return e;
              })
          );
        }
        for (; i < r && (l(), !(i >= r)); ) {
          var _ = e.charCodeAt(i);
          u(1), 60 !== _ && b('expected <'), i >= r && b('unexpected end of input');
          var D = e.charCodeAt(i);
          if (63 !== D)
            if (33 !== D) {
              if (47 === D) {
                if ((u(1), l(), s('plist'))) {
                  g('>');
                  continue;
                }
                if (s('dict')) {
                  g('>'), S();
                  continue;
                }
                if (s('array')) {
                  g('>'), j();
                  continue;
                }
                b('unexpected closed tag');
              }
              var G =
                ((H = void 0),
                (x = void 0),
                (H = f('>')),
                (x = !1),
                47 === H.charCodeAt(H.length - 1) && ((x = !0), (H = H.substring(0, H.length - 1))),
                { name: H.trim(), isClosed: x });
              switch (G.name) {
                case 'dict':
                  1 === d
                    ? C.enterDict()
                    : 2 === d
                    ? w.enterDict()
                    : ((h = {}), null !== t && (h[t] = { filename: n, line: o, char: a }), v(1, h)),
                    G.isClosed && S();
                  continue;
                case 'array':
                  1 === d ? C.enterArray() : 2 === d ? w.enterArray() : v(2, (h = [])),
                    G.isClosed && j();
                  continue;
                case 'key':
                  (B = T(G)),
                    1 === d ? (null !== y && b('too many <key>'), (y = B)) : b('unexpected <key>');
                  continue;
                case 'string':
                  A(T(G));
                  continue;
                case 'real':
                  M(parseFloat(T(G)));
                  continue;
                case 'integer':
                  O(parseInt(T(G), 10));
                  continue;
                case 'date':
                  I(new Date(T(G)));
                  continue;
                case 'data':
                  P(T(G));
                  continue;
                case 'true':
                  T(G), E(!0);
                  continue;
                case 'false':
                  T(G), E(!1);
                  continue;
              }
              /^plist/.test(G.name) || b('unexpected opened tag ' + G.name);
            } else {
              if ((u(1), s('--'))) {
                g('--\x3e');
                continue;
              }
              g('>');
            }
          else u(1), g('?>');
        }
        return h;
      }
      (n.parseWithLocation = function (e, n, t) {
        return r(e, n, t);
      }),
        (n.parse = function (e) {
          return r(e, null, null);
        });
    },
  ]);
});
