import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appAppHost]',
  standalone: true,
})
export class AppHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
