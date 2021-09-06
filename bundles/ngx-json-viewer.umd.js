(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('ngx-json-viewer', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ngx-json-viewer'] = {}, global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    var NgxJsonViewerComponent = /** @class */ (function () {
        function NgxJsonViewerComponent() {
            this.expanded = true;
            this.depth = -1;
            this._currentDepth = -1;
            this.segments = [];
        }
        NgxJsonViewerComponent.prototype.ngOnChanges = function () {
            var _this = this;
            this.segments = [];
            // remove cycles
            this.json = this.decycle(this.json);
            this._currentDepth++;
            if (typeof this.json === 'object') {
                Object.keys(this.json).forEach(function (key) {
                    _this.segments.push(_this.parseKeyValue(key, _this.json[key]));
                });
            }
            else {
                this.segments.push(this.parseKeyValue("(" + typeof this.json + ")", this.json));
            }
        };
        NgxJsonViewerComponent.prototype.isExpandable = function (segment) {
            return segment.type === 'object' || segment.type === 'array';
        };
        NgxJsonViewerComponent.prototype.toggle = function (segment) {
            if (this.isExpandable(segment)) {
                segment.expanded = !segment.expanded;
            }
        };
        NgxJsonViewerComponent.prototype.parseKeyValue = function (key, value) {
            var segment = {
                key: key,
                value: value,
                type: undefined,
                description: '' + value,
                expanded: this.isExpanded()
            };
            switch (typeof segment.value) {
                case 'number': {
                    segment.type = 'number';
                    break;
                }
                case 'boolean': {
                    segment.type = 'boolean';
                    break;
                }
                case 'function': {
                    segment.type = 'function';
                    break;
                }
                case 'string': {
                    segment.type = 'string';
                    segment.description = '"' + segment.value + '"';
                    break;
                }
                case 'undefined': {
                    segment.type = 'undefined';
                    segment.description = 'undefined';
                    break;
                }
                case 'object': {
                    // yea, null is object
                    if (segment.value === null) {
                        segment.type = 'null';
                        segment.description = 'null';
                    }
                    else if (Array.isArray(segment.value)) {
                        segment.type = 'array';
                        segment.description = 'Array[' + segment.value.length + '] ' + JSON.stringify(segment.value);
                    }
                    else if (segment.value instanceof Date) {
                        segment.type = 'date';
                    }
                    else {
                        segment.type = 'object';
                        segment.description = 'Object ' + JSON.stringify(segment.value);
                    }
                    break;
                }
            }
            return segment;
        };
        NgxJsonViewerComponent.prototype.isExpanded = function () {
            return (this.expanded &&
                !(this.depth > -1 && this._currentDepth >= this.depth));
        };
        // https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
        NgxJsonViewerComponent.prototype.decycle = function (object) {
            var objects = new WeakMap();
            return (function derez(value, path) {
                var old_path;
                var nu;
                if (typeof value === 'object'
                    && value !== null
                    && !(value instanceof Boolean)
                    && !(value instanceof Date)
                    && !(value instanceof Number)
                    && !(value instanceof RegExp)
                    && !(value instanceof String)) {
                    old_path = objects.get(value);
                    if (old_path !== undefined) {
                        return { $ref: old_path };
                    }
                    objects.set(value, path);
                    if (Array.isArray(value)) {
                        nu = [];
                        value.forEach(function (element, i) {
                            nu[i] = derez(element, path + '[' + i + ']');
                        });
                    }
                    else {
                        nu = {};
                        Object.keys(value).forEach(function (name) {
                            nu[name] = derez(value[name], path + '[' + JSON.stringify(name) + ']');
                        });
                    }
                    return nu;
                }
                return value;
            }(object, '$'));
        };
        return NgxJsonViewerComponent;
    }());
    NgxJsonViewerComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ngx-json-viewer',
                    template: "<section class=\"ngx-json-viewer\">\n  <section\n    *ngFor=\"let segment of segments\"\n    [ngClass]=\"['segment', 'segment-type-' + segment.type]\">\n    <section\n      (click)=\"toggle(segment)\"\n      [ngClass]=\"{\n        'segment-main': true,\n        'expandable': isExpandable(segment),\n        'expanded': segment.expanded\n      }\">\n      <div *ngIf=\"isExpandable(segment)\" class=\"toggler\">\n        <img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png\" width=\"15\" height=\"15\">\n      </div>\n      <span class=\"segment-key\">{{ segment.key }}</span>\n      <span class=\"segment-separator\">: </span>\n      <span *ngIf=\"!segment.expanded || !isExpandable(segment)\" class=\"segment-value\">{{ segment.description }}</span>\n    </section>\n    <section *ngIf=\"segment.expanded && isExpandable(segment)\" class=\"children\">\n      <ngx-json-viewer [json]=\"segment.value\" [expanded]=\"expanded\" [depth]=\"depth\" [_currentDepth]=\"_currentDepth\"></ngx-json-viewer>\n    </section>\n  </section>\n</section>\n",
                    styles: ["@charset \"UTF-8\";.ngx-json-viewer{font-family:monospace;font-size:1em;width:100%;height:100%;overflow:hidden;position:relative}.ngx-json-viewer .segment{padding:2px;margin:1px 1px 1px 12px}.ngx-json-viewer .segment .segment-main{word-wrap:break-word}.ngx-json-viewer .segment .segment-main .toggler{position:absolute;margin-left:-14px;margin-top:3px;font-size:.8em;line-height:1.2em;vertical-align:middle;color:#22e208}.ngx-json-viewer .segment .segment-main .toggler:after{display:inline-block;content:\"\u25BA\";transition:transform .1s ease-in}.ngx-json-viewer .segment .segment-main .segment-key{color:#4e187c}.ngx-json-viewer .segment .segment-main .segment-separator{color:#999}.ngx-json-viewer .segment .segment-main .segment-value{color:#000}.ngx-json-viewer .segment .children{margin-left:12px}.ngx-json-viewer .segment-type-string>.segment-main>.segment-value{color:#ff6b6b}.ngx-json-viewer .segment-type-number>.segment-main>.segment-value{color:#009688}.ngx-json-viewer .segment-type-boolean>.segment-main>.segment-value{color:#b938a4}.ngx-json-viewer .segment-type-date>.segment-main>.segment-value{color:#05668d}.ngx-json-viewer .segment-type-array>.segment-main>.segment-value,.ngx-json-viewer .segment-type-function>.segment-main>.segment-value,.ngx-json-viewer .segment-type-object>.segment-main>.segment-value{color:#999}.ngx-json-viewer .segment-type-null>.segment-main>.segment-value,.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-value{color:#fff}.ngx-json-viewer .segment-type-null>.segment-main>.segment-value{background-color:red}.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-key{color:#999}.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-value{background-color:#999}.ngx-json-viewer .segment-type-array>.segment-main,.ngx-json-viewer .segment-type-object>.segment-main{white-space:nowrap}.ngx-json-viewer .expanded>.toggler:after{transform:rotate(90deg)}.ngx-json-viewer .expandable,.ngx-json-viewer .expandable>.toggler{cursor:pointer}"]
                },] }
    ];
    NgxJsonViewerComponent.propDecorators = {
        json: [{ type: core.Input }],
        expanded: [{ type: core.Input }],
        depth: [{ type: core.Input }],
        _currentDepth: [{ type: core.Input }]
    };

    var NgxJsonViewerModule = /** @class */ (function () {
        function NgxJsonViewerModule() {
        }
        return NgxJsonViewerModule;
    }());
    NgxJsonViewerModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule
                    ],
                    declarations: [
                        NgxJsonViewerComponent
                    ],
                    exports: [
                        NgxJsonViewerComponent
                    ]
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.NgxJsonViewerComponent = NgxJsonViewerComponent;
    exports.NgxJsonViewerModule = NgxJsonViewerModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-json-viewer.umd.js.map
