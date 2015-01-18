
/**
 * A JavaScript sequencer library
 * @module  seqin
 * @version 0.0.1
 * @author  Rich Plastow <info@oopish.com> (http://oopish.com/)
 * @license GNU
 */


/**
 * src/api/01-seqin-toolkit.coffee
 */

(function() {
  var $, $$, Seqin, appName, empty, error, escapeHTML, indentLines, log, make, _app,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  appName = 'seqin';

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
   * src/api/02-seqin-app-scope.coffee
   */

  _app = {};

  window.Seqin = Seqin = {};


  /**
   * src/api/03-seqin-config.coffee
   */

  window.addEventListener('load', function() {
    var e;
    try {

    } catch (_error) {
      e = _error;
      return error('03-seqin-config.coffee', e);
    }
  });


  /**
   * src/api/04-seqin-list.coffee
   */

  Seqin.list = function(opt) {
    var snapshot;
    if (opt == null) {
      opt = {
        format: 'plain'
      };
    }
    snapshot = new Seqin.Snapshot(opt);
    return snapshot.render();
  };


  /**
   * src/class/01-seqin-error.coffee
   */


  /**
   * @class Custom error class to inform where an error is from
   */

  Seqin.Error = (function(_super) {
    __extends(Error, _super);

    function Error(instance, message) {
      message = message.replace(/\n\s+/g, '\n');
      this.message = "" + instance.I + " " + instance.phase + ": " + message;
    }

    return Error;

  })(Error);


  /**
   * src/class/02-seqin-base.coffee
   */

  Seqin.Base = (function() {
    Base.prototype.I = 'Seqin.Base';

    Base.prototype.toString = function() {
      return "[object " + this.I + "]";
    };

    Base.prototype.phase = 'init';

    function Base(opt) {
      this.phase = 'construct';
    }

    return Base;

  })();


  /**
   * src/class/02-seqin-grid.coffee
   */

  Seqin.Grid = (function(_super) {
    __extends(Grid, _super);

    Grid.prototype.I = 'Seqin.Grid';

    Grid.prototype.toString = function() {
      return "[object " + this.I + "]";
    };

    Grid.prototype.phase = 'init';

    function Grid(opt) {
      this.phase = 'construct';
      this.initObject();
      this.parseOptions(opt);
      this.recordInstance();
      this.validUA();
      this.buildElement();
    }

    Grid.prototype.initObject = function() {
      if (_app.grids == null) {
        _app.grids = [];
      }
      return _app.gridLut != null ? _app.gridLut : _app.gridLut = {};
    };

    Grid.prototype.parseOptions = function(opt) {
      if ('undefined' === typeof opt) {
        throw new Seqin.Error(this, "The `opt` object was not passed to " + this.I + ", eg:\n `foo = new " + this.I + "({ id:'bar', ctx:MyCtx, trackCount:2 })`");
      }
      if ('object' !== typeof opt) {
        throw new Seqin.Error(this, "The `opt` argument passed to " + this.I + " has type '" + (typeof opt) + "' not 'object'");
      }
      this.id = this.validId(opt.id);
      this.ctx = this.validCtx(opt.ctx);
      return this.trackCount = this.validTrackCount(opt.trackCount);
    };

    Grid.prototype.recordInstance = function() {
      _app.grids.push(this);
      return _app.gridLut[this.id] = this;
    };

    Grid.prototype.validId = function(id) {
      var idrx;
      idrx = /^[a-z][-a-z0-9]+$/;
      if ('undefined' === typeof id) {
        throw new Seqin.Error(this, "" + this.I + " `id` is missing");
      }
      if ('string' !== typeof id) {
        throw new Seqin.Error(this, "" + this.I + " `id` is type '" + (typeof id) + "', not 'string'");
      }
      if (!idrx.test(id)) {
        throw new Seqin.Error(this, "" + this.I + " `id` '" + id + "' fails " + idrx);
      }
      if (_app.gridLut[id]) {
        throw new Seqin.Error(this, "Duplicate " + this.I + " `id` '" + id + "'");
      }
      return id;
    };

    Grid.prototype.validCtx = function(ctx) {
      var ctxrx;
      ctxrx = /^\[object (Offline)?AudioContext\]$/;
      if ('undefined' === typeof ctx) {
        throw new Seqin.Error(this, "`ctx` of " + this.I + " `" + this.id + "` is missing.");
      }
      if ('object' !== typeof ctx) {
        throw new Seqin.Error(this, "`ctx` of " + this.I + " `" + this.id + "` has type '" + (typeof ctx) + "' not 'object'");
      }
      if (!ctxrx.test(ctx)) {
        throw new Seqin.Error(this, "`ctx` of " + this.I + " `" + this.id + "` is invalid. It fails " + ctxrx);
      }
      return ctx;
    };

    Grid.prototype.validTrackCount = function(trackCount) {
      if ('undefined' === typeof trackCount) {
        throw new Seqin.Error(this, "`trackCount` of " + this.I + " `" + this.id + "` is missing");
      }
      if ('number' !== typeof trackCount) {
        throw new Seqin.Error(this, "`trackCount` of " + this.I + " `" + this.id + "` has type '" + (typeof ctx) + "' not 'number'");
      }
      if (!((1 <= trackCount && trackCount <= 24))) {
        throw new Seqin.Error(this, "`trackCount` of " + this.I + " `" + this.id + "` is `" + trackCount + "`. Must be from 1 to 24");
      }
      if (trackCount % 1) {
        throw new Seqin.Error(this, "`trackCount` of " + this.I + " `" + this.id + "` is `" + trackCount + "`. Must be an integer");
      }
      return trackCount;
    };

    Grid.prototype.validUA = function() {
      if ('complete' !== document.readyState) {
        throw new Seqin.Error(this, "`document.readyState` is currently '" + document.readyState + "'. \n Please wait for 'complete', eg `window.addEventListener('load', ...)`");
      }
    };

    Grid.prototype.buildElement = function() {
      var i, _i, _ref;
      this.tracks = [];
      for (i = _i = 0, _ref = this.trackCount; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.tracks.push(new Seqin.Track({
          id: "" + this.id + "-track-" + i,
          parent: this
        }));
      }
      return log("buildElement " + this.id);
    };

    Grid.prototype.takeSnapshot = function() {
      return {
        id: this.id,
        trackCount: this.trackCount
      };
    };

    Grid.prototype.visualise = function($container) {
      var track, _i, _len, _ref;
      this.$container = $container;
      this.$visual = make('div', {
        "class": 'seqin-grid',
        id: "seqin-" + this.id
      }, "Seqin Grid " + this.id);
      _ref = this.tracks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        track = _ref[_i];
        track.visualise(this.$visual);
      }
      return $container.appendChild(this.$visual);
    };

    Grid.prototype.unvisualise = function() {
      var track, _i, _len, _ref;
      _ref = this.tracks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        track = _ref[_i];
        track.unvisualise;
      }
      empty(this.$visual);
      this.$container.removeChild(this.$visual);
      delete this.$visual;
      return log(this.$visual);
    };

    return Grid;

  })(Seqin.Base);


  /**
   * src/class/04-seqin-track.coffee
   */

  Seqin.Track = (function(_super) {
    __extends(Track, _super);

    Track.prototype.I = 'Seqin.Track';

    Track.prototype.toString = function() {
      return "[object " + this.I + "]";
    };

    Track.prototype.phase = 'init';

    function Track(opt) {
      this.phase = 'construct';
      this.initObject();
      this.parseOptions(opt);
      this.recordInstance();
      this.validUA();
      this.buildElement();
    }

    Track.prototype.initObject = function() {
      if (_app.tracks == null) {
        _app.tracks = [];
      }
      return _app.trackLut != null ? _app.trackLut : _app.trackLut = {};
    };

    Track.prototype.parseOptions = function(opt) {
      if ('undefined' === typeof opt) {
        throw new Seqin.Error(this, "The `opt` object was not passed to " + this.I + ", eg: \n `foo = new " + this.I + "({ id:'bar', ctx:MyCtx, trackCount:2 })`");
      }
      if ('object' !== typeof opt) {
        throw new Seqin.Error(this, "The `opt` argument passed to " + this.I + " has type '" + (typeof opt) + "' not 'object'");
      }
      this.id = this.validId(opt.id);
      return this.parent = this.validParent(opt.parent);
    };

    Track.prototype.recordInstance = function() {
      _app.tracks.push(this);
      return _app.trackLut[this.id] = this;
    };

    Track.prototype.validId = function(id) {
      var idrx;
      idrx = /^[a-z][-a-z0-9]+$/;
      if ('undefined' === typeof id) {
        throw new Seqin.Error(this, "" + this.I + " `id` is missing");
      }
      if ('string' !== typeof id) {
        throw new Seqin.Error(this, "" + this.I + " `id` is type '" + (typeof id) + "', not 'string'");
      }
      if (!idrx.test(id)) {
        throw new Seqin.Error(this, "" + this.I + " `id` '" + id + "' fails " + idrx);
      }
      if (_app.trackLut[id]) {
        throw new Seqin.Error(this, "Duplicate " + this.I + " `id` '" + id + "'");
      }
      return id;
    };

    Track.prototype.validParent = function(parent) {
      var parentrx;
      parentrx = /^\[object Seqin.Grid\]$/;
      if ('undefined' === typeof parent) {
        throw new Seqin.Error(this, "`parent` of " + this.I + " `" + this.id + "` is missing. \nMust be a Seqin.Grid instance");
      }
      if ('object' !== typeof parent) {
        throw new Seqin.Error(this, "`parent` of " + this.I + " `" + this.id + "` has type '" + (typeof parent) + "' not 'object'");
      }
      if (!parentrx.test(parent)) {
        throw new Seqin.Error(this, "`parent` of " + this.I + " `" + this.id + "` is invalid. \nIt fails " + parentrx);
      }
      return parent;
    };

    Track.prototype.validUA = function() {
      if ('complete' !== document.readyState) {
        throw new Seqin.Error(this, "`document.readyState` is currently '" + document.readyState + "'. \n Please wait for 'complete', eg `window.addEventListener('load', ...)`");
      }
    };

    Track.prototype.buildElement = function() {
      return log("buildElement " + this.id);
    };

    Track.prototype.takeSnapshot = function() {
      return {
        id: this.id
      };
    };

    Track.prototype.visualise = function($container) {
      this.$container = $container;
      this.$visual = make('div', {
        "class": 'seqin track',
        id: "seqin-" + this.id
      }, "Seqin Track " + this.id);
      return $container.appendChild(this.$visual);
    };

    Track.prototype.unvisualise = function() {
      empty(this.$visual);
      this.$container.removeChild(this.$visual);
      delete this.$visual;
      return log(this.$visual);
    };

    return Track;

  })(Seqin.Base);


  /**
   * src/class/05-seqin-snapshot.coffee
   */

  Seqin.Snapshot = (function(_super) {
    var renderers;

    __extends(Snapshot, _super);

    Snapshot.prototype.I = 'Seqin.Snapshot';

    Snapshot.prototype.toString = function() {
      return "[object " + this.I + "]";
    };

    Snapshot.prototype.phase = 'init';

    function Snapshot(opt) {
      this.phase = 'construct';
      this.initObject();
      this.parseOptions(opt);
      this.takeSnapshot();
    }

    Snapshot.prototype.initObject = function() {
      if (_app.masters == null) {
        _app.masters = [];
      }
      return _app.masterLut != null ? _app.masterLut : _app.masterLut = {};
    };

    Snapshot.prototype.parseOptions = function(opt) {
      if ('undefined' === typeof opt) {
        throw new Seqin.Error(this, "The `opt` object was not passed to " + this.I + ", eg: \n`foo = new " + this.I + "({...})`");
      }
      if ('object' !== typeof opt) {
        throw new Seqin.Error(this, "The `opt` argument passed to " + this.I + " has type '" + (typeof opt) + "' not 'object'");
      }
      return this.format = this.validFormat(opt.format);
    };

    Snapshot.prototype.takeSnapshot = function() {
      var master, _i, _len, _ref, _results;
      this.model = {
        masters: [],
        masterLut: {}
      };
      _ref = _app.masters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        master = _ref[_i];
        _results.push(this.model.masters.push(this.model.masterLut[master.id] = master.takeSnapshot()));
      }
      return _results;
    };

    Snapshot.prototype.validFormat = function(format) {
      if ('undefined' === typeof format) {
        throw new Seqin.Error(this, "`format` is missing");
      }
      if ('string' !== typeof format) {
        throw new Seqin.Error(this, "`format` is type '" + (typeof format) + "', not 'string'");
      }
      if (!renderers[format]) {
        throw new Seqin.Error(this, "`format` '" + format + "' is invalid. \nPlease use " + (Object.keys(renderers)));
      }
      return format;
    };

    renderers = {
      raw: function(model) {
        return model;
      },
      arrays: function(model) {
        return {
          master: model.masters
        };
      },
      luts: function(model) {
        return {
          master: model.masterLut
        };
      },
      plain: function(model) {
        var i, master, out, _i, _len, _ref;
        out = '\nSeqin.Master:';
        _ref = model.masters;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          master = _ref[i];
          out += "\n  #" + i + " " + master.trackCount + "-track '" + master.id + "'";
        }
        return out;
      }
    };

    Snapshot.prototype.render = function() {
      return renderers[this.format](this.model);
    };

    return Snapshot;

  })(Seqin.Base);

}).call(this);
