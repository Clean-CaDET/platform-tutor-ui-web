import { Component, ChangeDetectionStrategy, ElementRef, AfterViewInit, OnDestroy, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MarkdownComponent } from 'ngx-markdown';
import { MarkdownImageEnhancerComponent } from './markdown-image-enhancer/markdown-image-enhancer.component';

@Component({
  selector: 'cc-markdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownComponent],
  template: `
    @if (data(); as d) {
      <markdown [data]="d" [clipboard]="clipboard()" [lineNumbers]="lineNumbers()"></markdown>
    } @else {
      <markdown [clipboard]="clipboard()" [lineNumbers]="lineNumbers()"><ng-content /></markdown>
    }
  `,
  styles: `
    :host ::ng-deep img {
      max-width: 100%;
    }
    :host.modal-images ::ng-deep img {
      cursor: zoom-in;
    }
    :host ::ng-deep li {
      text-align: left;
      padding-bottom: 5px;
    }
  `,
  host: {
    '[class.modal-images]': 'modalImages()',
  },
})
export class CcMarkdownComponent implements AfterViewInit, OnDestroy {
  private readonly elRef = inject(ElementRef);
  private readonly dialog = inject(MatDialog);

  readonly data = input<string>();
  readonly clipboard = input(false);
  readonly lineNumbers = input(false);
  readonly modalImages = input(true);

  private observer?: MutationObserver;

  ngAfterViewInit(): void {
    if (!this.modalImages()) return;

    this.observer = new MutationObserver(() => this.enhanceImages());
    this.observer.observe(this.elRef.nativeElement, { childList: true, subtree: true });
    this.enhanceImages();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private enhanceImages(): void {
    const images: NodeListOf<HTMLImageElement> = this.elRef.nativeElement.querySelectorAll('img');
    images.forEach(img => {
      if (img.classList.contains('cc-enhanced')) return;
      img.classList.add('cc-enhanced');
      img.addEventListener('click', () => {
        this.dialog.open(MarkdownImageEnhancerComponent, {
          data: { src: img.src, alt: img.alt },
          maxWidth: '90vw',
          maxHeight: '90vh',
        });
      });
    });
  }
}
