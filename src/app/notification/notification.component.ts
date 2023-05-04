import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NotificationList } from './notification.model';
import { notificationListData } from './notification.data';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, AfterViewInit {
  @ViewChild('listEl') listEl!: ElementRef<HTMLElement>;
  main!: HTMLElement;
  list!: HTMLElement;
  item!: NodeListOf<HTMLElement>;

  notificationList: NotificationList[] = notificationListData;
  constructor(private renderer: Renderer2, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.main = document.getElementById('main_container')!;
    this.main.addEventListener('scroll', this.onscroll.bind(this));
  }

  ngAfterViewInit(): void {
    this.list = this.listEl.nativeElement;
    this.item = this.list.querySelectorAll('.notification_container');
    this.setListHeight();
    this.adjustStyle();
  }

  @HostListener('window:resize') resize() {
    this.setListHeight();
    this.adjustStyle();
  }

  onscroll() {
    this.adjustStyle();
  }

  setListHeight(): void {
    let height: number = 0;
    const gap: number = 8;

    this.item.forEach((element, idx) => {
      if (idx == this.item.length - 1) {
        height += this.getHeight(<HTMLElement>element.firstElementChild) * 2;
        return;
      }

      height += this.getHeight(<HTMLElement>element.firstElementChild) + gap;
    });

    this.renderer.setStyle(this.list, 'height', `${height + 36}px`);
  }

  adjustStyle(): void {
    let height: number = 0;
    let count: number = 0;
    const gap: number = 8;

    this.item.forEach((element) => {
      const personalHeight: number = this.getHeight(
        <HTMLElement>element.firstElementChild
      );

      const bottomDistance =
        this.main.clientHeight -
        (this.list.getBoundingClientRect().top + height + personalHeight);

      if (bottomDistance < personalHeight && bottomDistance >= 0) {
        const scale: number = (bottomDistance / personalHeight) * 0.1;
        const finalScale = scale > 0.1 ? 0.1 : scale < 0 ? 0 : scale;

        const opacity = 10 * finalScale;

        this.renderer.setStyle(
          element,
          'transform',
          `scale(${0.9 + finalScale})`
        );

        if (element.nextElementSibling) {
          this.renderer.setStyle(
            element.nextElementSibling,
            'opacity',
            `${opacity}`
          );
          this.renderer.setStyle(
            element.nextElementSibling,
            'transform',
            `scale(${0.8 + finalScale})`
          );
        }
      } else if (bottomDistance < 0) {
        this.renderer.setStyle(element, 'bottom', `${32}px`);

        if (count) {
          this.renderer.setStyle(element, 'transform', 'scale(0.8)');
          this.renderer.setStyle(element, 'opacity', 0);
        }

        count++;
      } else if (bottomDistance >= personalHeight) {
        this.renderer.setStyle(element, 'transform', 'scale(1)');
        this.renderer.setStyle(element, 'opacity', '1');
      }

      height += personalHeight + gap;
    });
  }

  getHeight(el: HTMLElement): number {
    const height: number = el.firstElementChild?.clientHeight!;
    const length: number = el.children.length;
    const secondHeight: number = 8;
    const thirdHeight: number = 16;

    if (length == 1) return height;
    else if (length == 2) return height + secondHeight;
    else return height + thirdHeight;
  }

  setNotificationListHeight(el: HTMLUListElement) {
    this.renderer.setStyle(el, 'height', `${this.getHeight(el)}px`);
  }
}
