import {AfterViewInit, Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[scroll-to-bottom]'
})
export class ScrollToBottomDirective{
  constructor(private _el: ElementRef) {  }

/*  public ngAfterViewInit() {
    const el: HTMLDivElement = this._el.nativeElement;
    // Does not work as scrollHeight === offsetHeight
    el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
    // This work but we see scroll moving
    setTimeout(() => el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight));
  }

  public ngOnInit() {
    const el: HTMLDivElement = this._el.nativeElement;
    // Does not work as scrollHeight === offsetHeight
    el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
    // This work but we see scroll moving
    setTimeout(() => el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight));
  }*/

  public scrollToBottom() {
    const el: HTMLDivElement = this._el.nativeElement;
    el.scrollTo(0, Math.max(0, el.scrollHeight - el.offsetHeight));
    console.log("scrolling to bottom", el);

  }
}
