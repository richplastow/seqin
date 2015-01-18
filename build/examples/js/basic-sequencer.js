
/**
 * A simple Seqin use case
 * @module  basic-sequencer
 * @version 0.0.1
 * @author  Rich Plastow <info@oopish.com> (http://oopish.com/)
 * @license GNU
 */


/**
 * src/examples/basic-sequencer/01-basic-sequencer-toolkit.coffee
 */

(function() {
  var $, $$, appName, empty, error, escapeHTML, indentLines, log, make, _app;

  appName = 'basic-sequencer';

  log = function(html) {
    var $pre;
    console.log(html);
    $pre = $('#log');
    if ($pre) {
      if (null === html) {
        html = '[null]';
      }
      if (html == null) {
        html = '[undefined]';
      }
      $pre.innerHTML += ("\n" + appName + ": ") + indentLines(escapeHTML(html.toString()));
      return $pre.scrollTop = $pre.scrollHeight;
    }
  };

  error = function(src, e) {
    var $pre;
    console.log("Error in " + src + ":");
    console.log(e);
    $pre = $('#log');
    if ($pre) {
      $pre.innerHTML += "\n<em>Error in <b>" + src + "</b>: \n  " + (indentLines(escapeHTML(e.toString()))) + "</em>";
      return $pre.scrollTop = $pre.scrollHeight;
    }
  };

  escapeHTML = function(html) {
    return html.replace(/</g, '&lt;');
  };

  indentLines = function(html) {
    return html.replace(/\n/g, '\n  ');
  };

  $ = document.querySelector.bind(document);

  $$ = document.querySelectorAll.bind(document);

  make = function(tag, attr, inner) {
    var el, k, v;
    el = document.createElement(tag);
    for (k in attr) {
      v = attr[k];
      el.setAttribute(k, v);
    }
    if (inner) {
      el.innerHTML = inner;
    }
    return el;
  };

  empty = function(node) {
    var _results;
    _results = [];
    while (node.hasChildNodes()) {
      _results.push(node.removeChild(node.lastChild));
    }
    return _results;
  };


  /**
   * src/examples/basic-sequencer/02-basic-sequencer-app-scope.coffee
   */

  _app = {};


  /**
   * src/examples/basic-sequencer/03-basic-sequencer-config.coffee
   */

  window.addEventListener('load', function() {
    var e;
    try {

    } catch (_error) {
      e = _error;
      return error('03-basic-sequencer-config.coffee', e);
    }
  });


  /**
   * src/examples/basic-sequencer/04-basic-sequencer-init.coffee
   */

  window.addEventListener('load', function() {
    var Seqin, ctx, e, master0;
    try {
      _app.$container = $('.basic-sequencer');
      if (!_app.$container) {
        throw new Error("Cannot find the `.basic-sequencer` container element on the page. \nPlease add an HTML element like `<div class=\"basic-sequencer\"></div>`");
      }
      Seqin = window.Seqin;
      if (!Seqin) {
        throw new Error("Cannot find the `Seqin` sequencer library. \nLoad it before this script, eg `<script src=\"js/seqin.js\"></script>`");
      }
      ctx = new window.AudioContext;
      master0 = new Seqin.Master({
        id: 'm0',
        ctx: new window.AudioContext,
        trackCount: 2
      });
      log(Seqin.list());
      return master0.visualise(_app.$container);
    } catch (_error) {
      e = _error;
      return error('04-basic-sequencer-init.coffee', e);
    }
  });

}).call(this);
