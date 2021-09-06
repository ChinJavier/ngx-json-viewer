import { Component, Input } from '@angular/core';
export class NgxJsonViewerComponent {
    constructor() {
        this.expanded = true;
        this.depth = -1;
        this._currentDepth = -1;
        this.segments = [];
    }
    ngOnChanges() {
        this.segments = [];
        // remove cycles
        this.json = this.decycle(this.json);
        this._currentDepth++;
        if (typeof this.json === 'object') {
            Object.keys(this.json).forEach(key => {
                this.segments.push(this.parseKeyValue(key, this.json[key]));
            });
        }
        else {
            this.segments.push(this.parseKeyValue(`(${typeof this.json})`, this.json));
        }
    }
    isExpandable(segment) {
        return segment.type === 'object' || segment.type === 'array';
    }
    toggle(segment) {
        if (this.isExpandable(segment)) {
            segment.expanded = !segment.expanded;
        }
    }
    parseKeyValue(key, value) {
        const segment = {
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
    }
    isExpanded() {
        return (this.expanded &&
            !(this.depth > -1 && this._currentDepth >= this.depth));
    }
    // https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
    decycle(object) {
        const objects = new WeakMap();
        return (function derez(value, path) {
            let old_path;
            let nu;
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
    }
}
NgxJsonViewerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-json-viewer',
                template: "<section class=\"ngx-json-viewer\">\n  <section\n    *ngFor=\"let segment of segments\"\n    [ngClass]=\"['segment', 'segment-type-' + segment.type]\">\n    <section\n      (click)=\"toggle(segment)\"\n      [ngClass]=\"{\n        'segment-main': true,\n        'expandable': isExpandable(segment),\n        'expanded': segment.expanded\n      }\">\n      <div *ngIf=\"isExpandable(segment)\" class=\"toggler\">\n        <img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png\" width=\"15\" height=\"15\">\n      </div>\n      <span class=\"segment-key\">{{ segment.key }}</span>\n      <span class=\"segment-separator\">: </span>\n      <span *ngIf=\"!segment.expanded || !isExpandable(segment)\" class=\"segment-value\">{{ segment.description }}</span>\n    </section>\n    <section *ngIf=\"segment.expanded && isExpandable(segment)\" class=\"children\">\n      <ngx-json-viewer [json]=\"segment.value\" [expanded]=\"expanded\" [depth]=\"depth\" [_currentDepth]=\"_currentDepth\"></ngx-json-viewer>\n    </section>\n  </section>\n</section>\n",
                styles: ["@charset \"UTF-8\";.ngx-json-viewer{font-family:monospace;font-size:1em;width:100%;height:100%;overflow:hidden;position:relative}.ngx-json-viewer .segment{padding:2px;margin:1px 1px 1px 12px}.ngx-json-viewer .segment .segment-main{word-wrap:break-word}.ngx-json-viewer .segment .segment-main .toggler{position:absolute;margin-left:-14px;margin-top:3px;font-size:.8em;line-height:1.2em;vertical-align:middle;color:#22e208}.ngx-json-viewer .segment .segment-main .toggler:after{display:inline-block;content:\"\u25BA\";transition:transform .1s ease-in}.ngx-json-viewer .segment .segment-main .segment-key{color:#4e187c}.ngx-json-viewer .segment .segment-main .segment-separator{color:#999}.ngx-json-viewer .segment .segment-main .segment-value{color:#000}.ngx-json-viewer .segment .children{margin-left:12px}.ngx-json-viewer .segment-type-string>.segment-main>.segment-value{color:#ff6b6b}.ngx-json-viewer .segment-type-number>.segment-main>.segment-value{color:#009688}.ngx-json-viewer .segment-type-boolean>.segment-main>.segment-value{color:#b938a4}.ngx-json-viewer .segment-type-date>.segment-main>.segment-value{color:#05668d}.ngx-json-viewer .segment-type-array>.segment-main>.segment-value,.ngx-json-viewer .segment-type-function>.segment-main>.segment-value,.ngx-json-viewer .segment-type-object>.segment-main>.segment-value{color:#999}.ngx-json-viewer .segment-type-null>.segment-main>.segment-value,.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-value{color:#fff}.ngx-json-viewer .segment-type-null>.segment-main>.segment-value{background-color:red}.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-key{color:#999}.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-value{background-color:#999}.ngx-json-viewer .segment-type-array>.segment-main,.ngx-json-viewer .segment-type-object>.segment-main{white-space:nowrap}.ngx-json-viewer .expanded>.toggler:after{transform:rotate(90deg)}.ngx-json-viewer .expandable,.ngx-json-viewer .expandable>.toggler{cursor:pointer}"]
            },] }
];
NgxJsonViewerComponent.propDecorators = {
    json: [{ type: Input }],
    expanded: [{ type: Input }],
    depth: [{ type: Input }],
    _currentDepth: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWpzb24tdmlld2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9uZ3gtanNvbi12aWV3ZXIvbmd4LWpzb24tdmlld2VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFhLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQWU1RCxNQUFNLE9BQU8sc0JBQXNCO0lBTG5DO1FBUVcsYUFBUSxHQUFHLElBQUksQ0FBQztRQUNoQixVQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFWCxrQkFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRTVCLGFBQVEsR0FBYyxFQUFFLENBQUM7SUFrSTNCLENBQUM7SUFoSUMsV0FBVztRQUNULElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBRW5CLGdCQUFnQjtRQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUVyQixJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNuQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RCxDQUFDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUks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Q0FBQyxVQUFVLElBQUk7d0JBQ3ZDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQ2QsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUNYLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQ3hDLENBQUM7b0JBQ0osQ0FBQyxDQUFDLENBQUM7aUJBQ0o7Z0JBQ0QsT0FBTyxFQUFFLENBQUM7YUFDWDtZQUNELE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7OztZQTlJRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IseWtDQUErQzs7YUFFaEQ7OzttQkFHRSxLQUFLO3VCQUNMLEtBQUs7b0JBQ0wsS0FBSzs0QkFFTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkNoYW5nZXMsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VnbWVudCB7XG4gIGtleTogc3RyaW5nO1xuICB2YWx1ZTogYW55O1xuICB0eXBlOiB1bmRlZmluZWQgfCBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIGV4cGFuZGVkOiBib29sZWFuO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtanNvbi12aWV3ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWpzb24tdmlld2VyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWpzb24tdmlld2VyLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTmd4SnNvblZpZXdlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG5cbiAgQElucHV0KCkganNvbjogYW55O1xuICBASW5wdXQoKSBleHBhbmRlZCA9IHRydWU7XG4gIEBJbnB1dCgpIGRlcHRoID0gLTE7XG5cbiAgQElucHV0KCkgX2N1cnJlbnREZXB0aCA9IC0xO1xuXG4gIHNlZ21lbnRzOiBTZWdtZW50W10gPSBbXTtcblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLnNlZ21lbnRzID0gW107XG5cbiAgICAvLyByZW1vdmUgY3ljbGVzXG4gICAgdGhpcy5qc29uID0gdGhpcy5kZWN5Y2xlKHRoaXMuanNvbik7XG5cbiAgICB0aGlzLl9jdXJyZW50RGVwdGgrKztcblxuICAgIGlmICh0eXBlb2YgdGhpcy5qc29uID09PSAnb2JqZWN0Jykge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5qc29uKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIHRoaXMuc2VnbWVudHMucHVzaCh0aGlzLnBhcnNlS2V5VmFsdWUoa2V5LCB0aGlzLmpzb25ba2V5XSkpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VnbWVudHMucHVzaCh0aGlzLnBhcnNlS2V5VmFsdWUoYCgke3R5cGVvZiB0aGlzLmpzb259KWAsIHRoaXMuanNvbikpO1xuICAgIH1cbiAgfVxuXG4gIGlzRXhwYW5kYWJsZShzZWdtZW50OiBTZWdtZW50KSB7XG4gICAgcmV0dXJuIHNlZ21lbnQudHlwZSA9PT0gJ29iamVjdCcgfHwgc2VnbWVudC50eXBlID09PSAnYXJyYXknO1xuICB9XG5cbiAgdG9nZ2xlKHNlZ21lbnQ6IFNlZ21lbnQpIHtcbiAgICBpZiAodGhpcy5pc0V4cGFuZGFibGUoc2VnbWVudCkpIHtcbiAgICAgIHNlZ21lbnQuZXhwYW5kZWQgPSAhc2VnbWVudC5leHBhbmRlZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlS2V5VmFsdWUoa2V5OiBhbnksIHZhbHVlOiBhbnkpOiBTZWdtZW50IHtcbiAgICBjb25zdCBzZWdtZW50OiBTZWdtZW50ID0ge1xuICAgICAga2V5OiBrZXksXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICB0eXBlOiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJycgKyB2YWx1ZSxcbiAgICAgIGV4cGFuZGVkOiB0aGlzLmlzRXhwYW5kZWQoKVxuICAgIH07XG5cbiAgICBzd2l0Y2ggKHR5cGVvZiBzZWdtZW50LnZhbHVlKSB7XG4gICAgICBjYXNlICdudW1iZXInOiB7XG4gICAgICAgIHNlZ21lbnQudHlwZSA9ICdudW1iZXInO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOiB7XG4gICAgICAgIHNlZ21lbnQudHlwZSA9ICdib29sZWFuJztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdmdW5jdGlvbic6IHtcbiAgICAgICAgc2VnbWVudC50eXBlID0gJ2Z1bmN0aW9uJztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdzdHJpbmcnOiB7XG4gICAgICAgIHNlZ21lbnQudHlwZSA9ICdzdHJpbmcnO1xuICAgICAgICBzZWdtZW50LmRlc2NyaXB0aW9uID0gJ1wiJyArIHNlZ21lbnQudmFsdWUgKyAnXCInO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6IHtcbiAgICAgICAgc2VnbWVudC50eXBlID0gJ3VuZGVmaW5lZCc7XG4gICAgICAgIHNlZ21lbnQuZGVzY3JpcHRpb24gPSAndW5kZWZpbmVkJztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdvYmplY3QnOiB7XG4gICAgICAgIC8vIHllYSwgbnVsbCBpcyBvYmplY3RcbiAgICAgICAgaWYgKHNlZ21lbnQudmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICBzZWdtZW50LnR5cGUgPSAnbnVsbCc7XG4gICAgICAgICAgc2VnbWVudC5kZXNjcmlwdGlvbiA9ICdudWxsJztcbiAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNlZ21lbnQudmFsdWUpKSB7XG4gICAgICAgICAgc2VnbWVudC50eXBlID0gJ2FycmF5JztcbiAgICAgICAgICBzZWdtZW50LmRlc2NyaXB0aW9uID0gJ0FycmF5WycgKyBzZWdtZW50LnZhbHVlLmxlbmd0aCArICddICcgKyBKU09OLnN0cmluZ2lmeShzZWdtZW50LnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWdtZW50LnZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgIHNlZ21lbnQudHlwZSA9ICdkYXRlJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWdtZW50LnR5cGUgPSAnb2JqZWN0JztcbiAgICAgICAgICBzZWdtZW50LmRlc2NyaXB0aW9uID0gJ09iamVjdCAnICsgSlNPTi5zdHJpbmdpZnkoc2VnbWVudC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZ21lbnQ7XG4gIH1cblxuICBwcml2YXRlIGlzRXhwYW5kZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuZXhwYW5kZWQgJiZcbiAgICAgICEodGhpcy5kZXB0aCA+IC0xICYmIHRoaXMuX2N1cnJlbnREZXB0aCA+PSB0aGlzLmRlcHRoKVxuICAgICk7XG4gIH1cblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZG91Z2xhc2Nyb2NrZm9yZC9KU09OLWpzL2Jsb2IvbWFzdGVyL2N5Y2xlLmpzXG4gIHByaXZhdGUgZGVjeWNsZShvYmplY3Q6IGFueSkge1xuICAgIGNvbnN0IG9iamVjdHMgPSBuZXcgV2Vha01hcCgpO1xuICAgIHJldHVybiAoZnVuY3Rpb24gZGVyZXoodmFsdWUsIHBhdGgpIHtcbiAgICAgIGxldCBvbGRfcGF0aDtcbiAgICAgIGxldCBudTogYW55O1xuXG4gICAgICBpZiAoXG4gICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbiAgICAgICAgJiYgdmFsdWUgIT09IG51bGxcbiAgICAgICAgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIEJvb2xlYW4pXG4gICAgICAgICYmICEodmFsdWUgaW5zdGFuY2VvZiBEYXRlKVxuICAgICAgICAmJiAhKHZhbHVlIGluc3RhbmNlb2YgTnVtYmVyKVxuICAgICAgICAmJiAhKHZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKVxuICAgICAgICAmJiAhKHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKVxuICAgICAgKSB7XG4gICAgICAgIG9sZF9wYXRoID0gb2JqZWN0cy5nZXQodmFsdWUpO1xuICAgICAgICBpZiAob2xkX3BhdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiB7JHJlZjogb2xkX3BhdGh9O1xuICAgICAgICB9XG4gICAgICAgIG9iamVjdHMuc2V0KHZhbHVlLCBwYXRoKTtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICBudSA9IFtdO1xuICAgICAgICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQsIGkpIHtcbiAgICAgICAgICAgIG51W2ldID0gZGVyZXooZWxlbWVudCwgcGF0aCArICdbJyArIGkgKyAnXScpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG51ID0ge307XG4gICAgICAgICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIG51W25hbWVdID0gZGVyZXooXG4gICAgICAgICAgICAgIHZhbHVlW25hbWVdLFxuICAgICAgICAgICAgICBwYXRoICsgJ1snICsgSlNPTi5zdHJpbmdpZnkobmFtZSkgKyAnXSdcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0ob2JqZWN0LCAnJCcpKTtcbiAgfVxufVxuIl19