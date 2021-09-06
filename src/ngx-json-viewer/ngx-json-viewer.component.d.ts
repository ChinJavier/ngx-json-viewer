import { OnChanges } from '@angular/core';
export interface Segment {
    key: string;
    value: any;
    type: undefined | string;
    description: string;
    expanded: boolean;
}
export declare class NgxJsonViewerComponent implements OnChanges {
    json: any;
    expanded: boolean;
    depth: number;
    _currentDepth: number;
    segments: Segment[];
    ngOnChanges(): void;
    isExpandable(segment: Segment): boolean;
    toggle(segment: Segment): void;
    private parseKeyValue;
    private isExpanded;
    private decycle;
}
