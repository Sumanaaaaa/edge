
import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {OverlayContainer} from '@angular/cdk/overlay';
import {BehaviorSubject} from 'rxjs';
import {Observable} from 'rxjs/internal/Observable';
import {KeyboardStatusPayload} from '../base/keyboard-status-payload';
import {UserInteractionService} from './user-interaction.service';/*
 * Copyright (c) 2023 Cepheid. All Rights Reserved.
 */

import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {OverlayContainer} from '@angular/cdk/overlay';
import {BehaviorSubject} from 'rxjs';
import {Observable} from 'rxjs/internal/Observable';
import {KeyboardStatusPayload} from '../base/keyboard-status-payload';
import {UserInteractionService} from './user-interaction.service';

@Injectable({
  providedIn: 'root'
})
export class ScreenService
{
  private renderer: Renderer2;

  private _resizeEventPipeline: BehaviorSubject<any> = new BehaviorSubject<any>({width: 1280, height: 800, scaleFactor: 1.0, rotated: false, left: 0, top: 0});

  constructor (private overlayContainer: OverlayContainer, private rendererFactory: RendererFactory2, private userInteractionService: UserInteractionService)
  {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public registerForResizeEvent (): Observable<KeyboardStatusPayload>
  {
    const self: ScreenService = this;
    return self._resizeEventPipeline.asObservable();
  }

  public monitorAndMaintainOrientation (viewportWidth: number, viewportHeight: number): void
  {
    const self: ScreenService = this;
    self.applyScaleFactor(viewportWidth, viewportHeight, 0.0, true);
    window.onresize = () => {
      self.applyScaleFactor(viewportWidth, viewportHeight, 0.0, true);
    }
  }

  public monitorAndMaintainRelativeSizing (viewportWidth: number, viewportHeight: number): void
  {
    const self: ScreenService = this;
    self.applyScaleFactor(viewportWidth, viewportHeight, 0.0);
    window.onresize = () => {
      self.applyScaleFactor(viewportWidth, viewportHeight, 0.0);
    }
  }

  public monitorAndMaintainScale (scaleFactor: number): void
  {
    const self: ScreenService = this;
    self.applyScaleFactor(window.innerWidth, window.innerHeight, scaleFactor);
    window.onresize = () => {
      self.applyScaleFactor(window.innerWidth, window.innerHeight, scaleFactor);
    }
  }

  // maintain scale and rotate by 90 degrees if aspect ratio falls below a specific number
  private applyScaleFactor (viewportWidth: number, viewportHeight: number, constantScale: number = 0.0, allowRotation: boolean = false): void
  {
    const self: ScreenService = this;
    const rotated: boolean = allowRotation && 1.0 > (window.innerWidth / window.innerHeight);
    const windowWidth: number = rotated ? window.innerHeight : window.innerWidth;
    const windowHeight: number = rotated ? window.innerWidth : window.innerHeight;

    const prioritizeWidth: boolean = (viewportWidth / viewportHeight) > (windowWidth / windowHeight);
    const width: number = prioritizeWidth ? windowWidth : windowHeight * viewportWidth / viewportHeight;
    const height: number = prioritizeWidth ? windowWidth * viewportHeight / viewportWidth : windowHeight;
    const scaleFactor: number = constantScale > 0.0 ? constantScale : width / viewportWidth;
    const marginH: number = prioritizeWidth ? 0 : (windowWidth - width) / 2 / scaleFactor;
    const marginV: number = prioritizeWidth ? (windowHeight - height) / 2 : 0;
    const vWidth: number = prioritizeWidth ? viewportWidth : viewportHeight * width / height;
    const vHeight: number = prioritizeWidth ? viewportWidth * height / width : viewportHeight;

    let docStyle: string = '';

    // black out side bars if displaying on ultrawide
    if (!prioritizeWidth) {
      docStyle += 'background-color: #000; ';
    }

    if (rotated) {
      docStyle += `width: 100%; height: ${window.innerWidth}px; rotate: 90deg;`;
    }

    if (docStyle.length > 0) {
      self.renderer.setAttribute(document.documentElement, 'style', docStyle);
    }
    else {
      self.renderer.removeAttribute(document.documentElement, 'style');
    }

    const bodyStyle: string =
      `width: ${vWidth}px !important; ` +
      `height: ${vHeight}px !important; ` +
      `zoom: ${scaleFactor}; ` +
      `margin-top: ${marginV}px !important; ` +
      `margin-left: ${marginH}px !important; ` +
      `position: fixed; overflow: hidden; ` +
      `background-color: black`;
    self.renderer.setAttribute(document.body, 'style', bodyStyle);

    const containerStyle: string =
      `width: ${vWidth}px !important;` +
      `height: 100% !important;` +
      `top: 0 !important;`;
    self.renderer.setAttribute(self.overlayContainer.getContainerElement(), 'style', containerStyle);

    self.postResizeEvent(viewportWidth, prioritizeWidth ? windowHeight / scaleFactor : viewportHeight, scaleFactor, rotated, marginH, marginV);
  }

  private postResizeEvent (width: number, height: number, scaleFactor: number, rotated: boolean, left: number, top: number): void
  {
    const self: ScreenService = this;
    self._resizeEventPipeline.next({width: width, height: height, scaleFactor: scaleFactor, rotated: rotated, left: left, top: top});
    self.userInteractionService.hideKeyboard(true);
  }
}


@Injectable({
  providedIn: 'root'
})
export class ScreenService
{
  private renderer: Renderer2;

  private _resizeEventPipeline: BehaviorSubject<any> = new BehaviorSubject<any>({width: 1280, height: 800, scaleFactor: 1.0, rotated: false, left: 0, top: 0});

  constructor (private overlayContainer: OverlayContainer, private rendererFactory: RendererFactory2, private userInteractionService: UserInteractionService)
  {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public registerForResizeEvent (): Observable<KeyboardStatusPayload>
  {
    const self: ScreenService = this;
    return self._resizeEventPipeline.asObservable();
  }

  public monitorAndMaintainOrientation (viewportWidth: number, viewportHeight: number): void
  {
    const self: ScreenService = this;
    self.applyScaleFactor(viewportWidth, viewportHeight, 0.0, true);
    window.onresize = () => {
      self.applyScaleFactor(viewportWidth, viewportHeight, 0.0, true);
    }
  }

  public monitorAndMaintainRelativeSizing (viewportWidth: number, viewportHeight: number): void
  {
    const self: ScreenService = this;
    self.applyScaleFactor(viewportWidth, viewportHeight, 0.0);
    window.onresize = () => {
      self.applyScaleFactor(viewportWidth, viewportHeight, 0.0);
    }
  }

  public monitorAndMaintainScale (scaleFactor: number): void
  {
    const self: ScreenService = this;
    self.applyScaleFactor(window.innerWidth, window.innerHeight, scaleFactor);
    window.onresize = () => {
      self.applyScaleFactor(window.innerWidth, window.innerHeight, scaleFactor);
    }
  }

  // maintain scale and rotate by 90 degrees if aspect ratio falls below a specific number
  private applyScaleFactor (viewportWidth: number, viewportHeight: number, constantScale: number = 0.0, allowRotation: boolean = false): void
  {
    const self: ScreenService = this;
    const rotated: boolean = allowRotation && 1.0 > (window.innerWidth / window.innerHeight);
    const windowWidth: number = rotated ? window.innerHeight : window.innerWidth;
    const windowHeight: number = rotated ? window.innerWidth : window.innerHeight;

    const prioritizeWidth: boolean = (viewportWidth / viewportHeight) > (windowWidth / windowHeight);
    const width: number = prioritizeWidth ? windowWidth : windowHeight * viewportWidth / viewportHeight;
    const height: number = prioritizeWidth ? windowWidth * viewportHeight / viewportWidth : windowHeight;
    const scaleFactor: number = constantScale > 0.0 ? constantScale : width / viewportWidth;
    const marginH: number = prioritizeWidth ? 0 : (windowWidth - width) / 2 / scaleFactor;
    const marginV: number = prioritizeWidth ? (windowHeight - height) / 2 : 0;
    const vWidth: number = prioritizeWidth ? viewportWidth : viewportHeight * width / height;
    const vHeight: number = prioritizeWidth ? viewportWidth * height / width : viewportHeight;

    let docStyle: string = '';

    // black out side bars if displaying on ultrawide
    if (!prioritizeWidth) {
      docStyle += 'background-color: #000; ';
    }

    if (rotated) {
      docStyle += `width: 100%; height: ${window.innerWidth}px; rotate: 90deg;`;
    }

    if (docStyle.length > 0) {
      self.renderer.setAttribute(document.documentElement, 'style', docStyle);
    }
    else {
      self.renderer.removeAttribute(document.documentElement, 'style');
    }

    const bodyStyle: string =
      `width: ${vWidth}px !important; ` +
      `height: ${vHeight}px !important; ` +
      `zoom: ${scaleFactor}; ` +
      `margin-top: ${marginV}px !important; ` +
      `margin-left: ${marginH}px !important; ` +
      `position: fixed; overflow: hidden; ` +
      `background-color: black`;
    self.renderer.setAttribute(document.body, 'style', bodyStyle);

    const containerStyle: string =
      `width: ${vWidth}px !important;` +
      `height: 100% !important;` +
      `top: 0 !important;`;
    self.renderer.setAttribute(self.overlayContainer.getContainerElement(), 'style', containerStyle);

    self.postResizeEvent(viewportWidth, prioritizeWidth ? windowHeight / scaleFactor : viewportHeight, scaleFactor, rotated, marginH, marginV);
  }

  private postResizeEvent (width: number, height: number, scaleFactor: number, rotated: boolean, left: number, top: number): void
  {
    const self: ScreenService = this;
    self._resizeEventPipeline.next({width: width, height: height, scaleFactor: scaleFactor, rotated: rotated, left: left, top: top});
    self.userInteractionService.hideKeyboard(true);
  }
}
