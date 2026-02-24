import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MarkdownImageEnhancerComponent } from './markdown-image-enhancer.component';

@Directive({ selector: 'markdown[modal-images]' })
export class MarkdownImageEnhancerDirective implements AfterViewInit, OnDestroy {
  private readonly elRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly dialog = inject(MatDialog);
  private observer!: MutationObserver;

  ngAfterViewInit(): void {
    this.observer = new MutationObserver(() => {
      this.addListenersToImages();
    });

    this.observer.observe(this.elRef.nativeElement, {
      childList: true,
      subtree: true,
    });

    this.addListenersToImages();
  }

  private addListenersToImages(): void {
    const images: NodeListOf<HTMLImageElement> = this.elRef.nativeElement.querySelectorAll('img');
    images.forEach(img => {
      if (!img.classList.contains('clickable-enhanced')) {
        this.renderer.setStyle(img, 'cursor', 'pointer');
        img.classList.add('clickable-enhanced');
        this.renderer.listen(img, 'click', () => {
          this.dialog.open(MarkdownImageEnhancerComponent, {
            data: { src: img.src, alt: img.alt },
            maxWidth: '90vw',
            maxHeight: '90vh',
          });
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
