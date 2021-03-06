import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { QcAtlasUiRepositoryConfigurationService } from '../directives/qc-atlas-ui-repository-configuration.service';

@Directive({
  exportAs: 'qcAtlasUiShowOnFeature',
  selector: 'qcAtlasUiShowOnFeature, [qcAtlasUiShowOnFeature]',
})
export class ShowOnFeatureDirective implements OnInit {
  @Input('qcAtlasUiShowOnFeature') public featuresToShow: string | string[];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private configurationService: QcAtlasUiRepositoryConfigurationService
  ) {}

  ngOnInit(): void {
    if (Array.isArray(this.featuresToShow)) {
      let found = false;
      for (const feature of this.featuresToShow) {
        if (this.configurationService.configuration.features[feature]) {
          found = true;
        }
      }
      if (!found) {
        this.viewContainerRef.clear();
      } else {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    } else if (typeof this.featuresToShow === 'string') {
      if (
        this.configurationService.configuration.features[this.featuresToShow]
      ) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    }
  }
}
