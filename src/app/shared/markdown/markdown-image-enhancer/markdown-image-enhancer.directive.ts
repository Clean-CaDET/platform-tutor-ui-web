import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MarkdownImageEnhancerComponent } from './markdown-image-enhancer.component';
  
@Directive({
  selector: 'markdown[modal-images]'
})
export class MarkdownImageEnhancerDirective implements AfterViewInit, OnDestroy {
  private observer!: MutationObserver;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.observer = new MutationObserver(() => {
      this.addListenersToImages();
    });

    this.observer.observe(this.elRef.nativeElement, {
      childList: true,
      subtree: true
    });

    // Initial call in case images are already rendered
    this.addListenersToImages();
  }

  private addListenersToImages() {
    const images: HTMLImageElement[] = this.elRef.nativeElement.querySelectorAll('img');

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

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}