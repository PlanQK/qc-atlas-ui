import { Component, OnInit } from '@angular/core';
import { AlgorithmService } from 'api-atlas/services/algorithm.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlgorithmDto } from 'api-atlas/models/algorithm-dto';
import { ImplementationDto } from 'api-atlas/models/implementation-dto';
import { ExecutionEnvironmentsService } from 'api-atlas/services/execution-environments.service';
import { PublicationService } from 'api-atlas/services/publication.service';
import { EntityModelComputeResourcePropertyDto } from 'api-atlas/models/entity-model-compute-resource-property-dto';
import { TagDto } from 'api-atlas/models';
import { BreadcrumbLink } from '../../generics/navigation-breadcrumb/navigation-breadcrumb.component';
import { Option } from '../../generics/property-input/select-input.component';
import {
  DeleteParams,
  QueryParams,
} from '../../generics/data-list/data-list.component';
import { InputParameter } from '../impl-selection-criteria/impl-selection-criteria.component';
import { UtilService } from '../../../util/util.service';
import { ConfirmDialogComponent } from '../../generics/dialogs/confirm-dialog.component';

@Component({
  templateUrl: './implementation-view.component.html',
  styleUrls: ['./implementation-view.component.scss'],
})
export class ImplementationViewComponent implements OnInit {
  impl: ImplementationDto;
  algo: AlgorithmDto;
  softwarePlatformOptions: Option[];
  tags: TagDto[] = [];

  tableColumns = ['Name', 'Datatype', 'Description', 'Value'];
  variableNames = ['name', 'datatype', 'description', 'value'];
  pagingInfo: any = {};
  paginatorConfig: any = {
    amountChoices: [1, 2, 3],
    selectedAmount: 1,
  };

  links: BreadcrumbLink[] = [
    { heading: '', subHeading: '' },
    { heading: '', subHeading: '' },
  ];
  computeResourceProperties: EntityModelComputeResourcePropertyDto[] = [];

  placeholderInputParams: InputParameter[] = [
    {
      name: 'N',
      datatype: 'Integer',
    },
    {
      name: 'M',
      datatype: 'String',
    },
  ];

  placeholderPrologRule = 'executable(N, shor-general-qiskit) :- N > 2.';

  constructor(
    private algorithmService: AlgorithmService,
    private softwarePlatformService: ExecutionEnvironmentsService,
    private executionEnvironmentsService: ExecutionEnvironmentsService,
    private publicationService: PublicationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.loadGeneral();
  }

  onChangeImpl(): void {
    this.algorithmService
      .updateImplementation({
        algoId: this.algo.id,
        implId: this.impl.id,
        body: this.impl,
      })
      .subscribe(() => {
        this.utilService.callSnackBar('Successfully updated implementation');
      });
    // live refresh name
    let subheading = this.algo.computationModel.toString().toLowerCase();
    subheading =
      subheading[0].toUpperCase() + subheading.slice(1) + ' Implementation';
    this.links[1] = {
      heading: this.impl.name,
      subHeading: subheading,
    };
  }

  changeTab(tabNumber: number): void {
    // replace with switch case once quantum resource etc works in the backend
    if (tabNumber === 0) {
      this.loadGeneral();
    }
  }
  onAddQuantumResource(): void {}

  onDeleteQuantumResource($event: DeleteParams): void {}

  onDatalistConfigChanged(params: QueryParams): void {
    this.publicationService.getPublications(params).subscribe((data) => {
      console.log(data._embedded?.publications);
    });
  }

  onElementClicked(implementation: any): void {
    this.router.navigate([
      'algorithms',
      this.algo.id,
      'implementations',
      implementation.id,
    ]);
  }

  onPageChanged($event: string): void {}

  addComputeResourceProperty(
    property: EntityModelComputeResourcePropertyDto
  ): void {
    this.algorithmService
      .addComputingResource({
        algoId: this.algo.id,
        body: property,
      })
      .subscribe((e) => {
        this.fetchComputeResourceProperties();
        this.utilService.callSnackBar('Successfully added property');
      });
  }

  updateComputeResourceProperty(
    property: EntityModelComputeResourcePropertyDto
  ): void {
    this.algorithmService
      .updateComputingResource({
        algoId: this.algo.id,
        resourceId: property.id,
        body: property,
      })
      .subscribe((e) => {
        this.fetchComputeResourceProperties();
        this.utilService.callSnackBar('Successfully updated property');
      });
  }

  deleteComputeResourceProperty(
    property: EntityModelComputeResourcePropertyDto
  ): void {
    this.utilService
      .createDialog(ConfirmDialogComponent, {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete the following property: ',
        data: [property.type],
        variableName: 'name',
        yesButtonText: 'yes',
        noButtonText: 'no',
      })
      .afterClosed()
      .subscribe((dialogResult) => {
        if (dialogResult) {
          this.algorithmService
            .deleteComputingResource({
              algoId: this.algo.id,
              resourceId: property.id,
            })
            .subscribe((e) => {
              this.computeResourceProperties = this.computeResourceProperties.filter(
                (elem: EntityModelComputeResourcePropertyDto) =>
                  elem.id !== property.id
              );
              this.fetchComputeResourceProperties();
              this.utilService.callSnackBar('Successfully deleted property');
            });
        }
      });
  }

  fetchComputeResourceProperties(): void {
    this.algorithmService
      .getComputingResources({
        algoId: this.algo.id,
        implId: this.impl.id,
        page: -1,
      })
      .subscribe((e) => {
        if (e._embedded != null) {
          this.computeResourceProperties =
            e._embedded.computeResourceProperties;
        }
      });
  }

  addTag(tag: TagDto): void {
    this.algorithmService
      .addTagToImplementation({
        implId: this.impl.id,
        body: tag,
      })
      .subscribe((next) => {
        this.tags = next._embedded.tags.map((t) => ({
          value: t.value,
          category: t.category,
        }));
      });
  }

  removeTag(tag: TagDto): void {
    this.algorithmService
      .removeTagFromImplementation({
        implId: this.impl.id,
        body: tag,
      })
      .subscribe((next) => {
        this.tags = next._embedded.tags.map((t) => ({
          value: t.value,
          category: t.category,
        }));
      });
  }

  private loadGeneral(): void {
    this.executionEnvironmentsService
      .getSoftwarePlatforms()
      .subscribe((list) => {
        const softwarePlatforms = list._embedded?.softwarePlatforms || [];
        this.softwarePlatformOptions = softwarePlatforms.map((sp) => ({
          label: sp.name,
          value: sp.id,
        }));
      });
    this.activatedRoute.params.subscribe(({ algoId, implId }) => {
      this.algorithmService.getAlgorithm({ algoId }).subscribe((algo) => {
        this.algo = algo;
        let subheading = this.algo.computationModel.toString().toLowerCase();
        subheading = subheading[0].toUpperCase() + subheading.slice(1);
        this.links[0] = {
          heading: this.algo.name,
          subHeading: subheading + ' Algorithm',
          link: '/algorithms/' + algoId,
        };
        this.links[1].subHeading = subheading + ' Implementation';
      });

      this.algorithmService
        .getImplementation({ algoId, implId })
        .subscribe((impl) => {
          this.impl = impl;
          this.links[1].heading = this.impl.name;
          this.fetchComputeResourceProperties();
          this.getTagsForImplementation(algoId, implId);
        });
    });
  }

  private getTagsForImplementation(algoId: string, implId: string): void {
    this.algorithmService
      .getTagsOfImplementation({ algoId, implId })
      .subscribe((next) => {
        if (next._embedded?.tags) {
          this.tags = next._embedded.tags.map((t) => ({
            value: t.value,
            category: t.category,
          }));
        }
      });
  }
}
