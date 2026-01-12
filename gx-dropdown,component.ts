import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  OnDestroy, Renderer2, ElementRef
} from '@angular/core';
import {AbstractGxControlComponent} from '../core/abstract-gx-control.component';
import {TranslateService} from '@ngx-translate/core';
import {override} from '../../common/core/override';
import {boundapi} from '../../common/core/boundapi';
import {Subscription} from 'rxjs';
import {SubscriptionUtil} from '../../common/util/subscription-util';
import {OverlayContainer} from '@angular/cdk/overlay';
import {ScreenService} from '../../service/screen.service';

@Component({
  selector: 'gx-dropdown',
  templateUrl: './gx-dropdown.component.html',
  styleUrls: [
    './gx-dropdown.component.scss',
    './_gx-dropdown.theme.scss'
  ]
})
export class GxDropdownComponent extends AbstractGxControlComponent implements OnInit, OnDestroy, OnChanges
{

  @ViewChild('gxDropdownSelect') gxDropdownSelect!: any;

  @Input()
  id!: string;

  @Input()
  disabled = false;

  @Input()
  selections!: Array<any>;

  @Input()
  defaultSelection: any;

  @Output()
  selectionChange = new EventEmitter<any>();

  @Input()
  placeholder: any = 'placeholder';

  @Input()
  disableOptionCentering = true;

  @Input()
  selectionPanelClass = '';

  @Input()
  multiple?: boolean;

  @Input()
  prefix!: string;

  @Input()
  nxClass: any;

  @Input()
  appearance: any;

  @Input()
  showLabel = false;

  @Input()
  optionStyleObject = {};

  @Input()
  adjustLocation = false;

  @ViewChild('component')
  private componentContainer!: ElementRef;

  private subscription: Subscription = new Subscription();
  private screenRotated: boolean = false;
  private screenHeight: number = 0;
  private screenLeftShift: number = 0;
  private screenWidth: number = 0;
  private scaleFactor: number = 0;

  // Selected item key
  itemKey = '';

  stylePrimary   = 'nx-dd-primary';
  styleSecondary = 'nx-dd-secondary';
  styleNone      = 'nx-dd-none';

  constructor (
    protected override translate: TranslateService,
    private overlayContainer: OverlayContainer,
    private renderer: Renderer2,
    private screenService: ScreenService
  )
  {
    super();
    const self: GxDropdownComponent = this;
    self.screenService.registerForResizeEvent().subscribe((payload: any) => {
      self.screenRotated = payload.rotated;
      self.screenHeight = payload.height;
      self.screenLeftShift = payload.left;
      self.screenWidth = payload.width;
      self.scaleFactor = payload.scaleFactor;
      if (self.gxDropdownSelect) {
        self.gxDropdownSelect.close();
      }
    });
  }

  @override()
  public ngOnInit (): void
  {
    const self: GxDropdownComponent = this;
    if (self.placeholder != null && self.placeholder.length > 0) {
      self.placeholder = self.translate.instant(self.placeholder);
    }

    // Set Default selected, find item by value
    const toSelect = self.selections?.find(c => c.val === self.defaultSelection);
    if ((toSelect !== undefined) && (toSelect.key !== undefined)) {
      self.itemKey = toSelect.key;
    }
  }

  @override()
  public ngOnChanges (changes: SimpleChanges)
  {
    if (changes['defaultSelection'] === undefined) {
      return;
    }
    this.defaultSelection = changes['defaultSelection'].currentValue;
    if (this.defaultSelection && this.defaultSelection.length === 0) {
      this.itemKey = '';
      return;
    }
    // Set Default selected, find item by value
    const toSelect = this.selections?.find(c => c.val === this.defaultSelection);
    if ((toSelect !== undefined) && (toSelect.key !== undefined)) {
      this.itemKey = toSelect.key;
    }
    else {
      const toSelectKey = this.selections?.find(c => c.key === this.defaultSelection);
      if ((toSelectKey !== undefined) && (toSelectKey.key !== undefined)) {
        this.itemKey = toSelectKey.key;
      }
    }
  }

  @override()
  public ngOnDestroy (): void
  {
    SubscriptionUtil.unsubscribe(this.subscription);
  }

  
  @boundapi()
  public afterClose (): void
  {
    if (this.selectionPanelClass !== '') {
      this.overlayContainer.getContainerElement().classList.remove(this.selectionPanelClass);
    }
  }

  @boundapi()
  public onSelectionChange (event: any): void
  {
    this.defaultSelection = event.source.value;
    this.selectionChange.emit(this.defaultSelection);
  }

  @boundapi()
  public getDefaultStyle(): string
  {
    if (this.nxClass?.includes(this.stylePrimary) ||
      this.nxClass?.includes(this.styleSecondary) ||
      this.nxClass?.includes(this.styleNone)) {
      return '';
    }
    return (this.itemKey) ? this.stylePrimary : this.styleSecondary;
  }

  private findOverlayPane (container: HTMLElement, element: HTMLElement): HTMLElement | null
  {
    const panes: HTMLCollection = container.getElementsByClassName('cdk-overlay-pane');
    for (let i: number = 0; i < panes.length; i++) {
      if (panes[i].contains(element)) {
        return panes[i] as HTMLElement;
      }
    }
    return null;
  }

  private decodeStyleString (style: string | null): Map<string, string>
  {
    const map: Map<string, string> = new Map<string, string>();
    if (style == null) {
      return map;
    }

    style.split(';').forEach((pair: string) => {
      const values: string[] = pair.split(':');
      if (values && values.length > 1) {
        map.set(values[0].trim(), values[1].trim());
      }
    });

    return map;
  }
}
