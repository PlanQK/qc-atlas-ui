import { Component, Input, OnInit } from '@angular/core';
import { EntityModelSoftwarePlatformDto } from 'api-atlas/models/entity-model-software-platform-dto';
import { ExecutionEnvironmentsService } from 'api-atlas/services/execution-environments.service';
import { Router } from '@angular/router';
import { EntityModelComputeResourceDto } from 'api-atlas/models/entity-model-compute-resource-dto';
import { ComputeResourceDto } from 'api-atlas/models/compute-resource-dto';
import {
  DeleteParams,
  LinkObject,
} from '../../../generics/data-list/data-list.component';
import { UtilService } from '../../../../util/util.service';

@Component({
  selector: 'app-software-platform-compute-resource-list',
  templateUrl: './software-platform-compute-resource-list.component.html',
  styleUrls: ['./software-platform-compute-resource-list.component.scss'],
})
export class SoftwarePlatformComputeResourceListComponent implements OnInit {
  @Input() softwarePlatform: EntityModelSoftwarePlatformDto;
  computeResources: EntityModelComputeResourceDto[];
  linkedComputeResources: EntityModelComputeResourceDto[] = [];

  tableColumns = ['Name', 'Vendor', 'Technology', 'Quantum Computation Model'];
  variableNames = ['name', 'vendor', 'technology', 'quantumComputationModel'];
  linkObject: LinkObject = {
    title: 'Link compute resource with ',
    subtitle: 'Search compute resources by name',
    displayVariable: 'name',
    data: [],
  };
  tableAddAllowed = true;
  isLinkingEnabled = false;

  constructor(
    private executionEnvironmentsService: ExecutionEnvironmentsService,
    private utilService: UtilService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.linkObject.title += this.softwarePlatform.name;
    this.getComputeResources();
    this.getLinkedComputeResources({
      softwarePlatformId: this.softwarePlatform.id,
    });
  }

  getComputeResources(): void {
    this.executionEnvironmentsService
      .getComputeResources({ page: -1 })
      .subscribe((computeResources) => {
        if (computeResources._embedded) {
          this.computeResources = computeResources._embedded.computeResources;
        } else {
          this.computeResources = [];
        }
      });
  }

  getLinkedComputeResources(params: {
    softwarePlatformId: string;
    search?: string;
    page?: number;
    size?: number;
    sort?: string[];
  }): void {
    this.executionEnvironmentsService
      .getComputeResourcesOfSoftwarePlatform(params)
      .subscribe((computeResource) => {
        if (computeResource._embedded) {
          this.linkedComputeResources =
            computeResource._embedded.computeResources;
        } else {
          this.linkedComputeResources = [];
        }
      });
  }

  searchUnlinkedComputeResources(search: string): void {
    if (search) {
      search = search.toLocaleLowerCase();
      this.linkObject.data = this.computeResources.filter(
        (computeResource: EntityModelComputeResourceDto) =>
          computeResource.name.toLocaleLowerCase().startsWith(search) &&
          !this.linkedComputeResources.includes(computeResource)
      );
    } else {
      this.linkObject.data = [];
    }
  }

  linkComputeResource(computeResource: ComputeResourceDto): void {
    this.linkObject.data = [];
    this.executionEnvironmentsService
      .linkSoftwarePlatformAndComputeResource({
        softwarePlatformId: this.softwarePlatform.id,
        body: computeResource,
      })
      .subscribe(() => {
        this.getLinkedComputeResources({
          softwarePlatformId: this.softwarePlatform.id,
        });
        this.utilService.callSnackBar('Successfully linked compute resource');
      });
  }

  unlinkComputeResources(event: DeleteParams): void {
    const promises: Array<Promise<void>> = [];
    for (const computeResource of event.elements) {
      promises.push(
        this.executionEnvironmentsService
          .unlinkSoftwarePlatformAndComputeResource({
            softwarePlatformId: this.softwarePlatform.id,
            computeResourceId: computeResource.id,
          })
          .toPromise()
      );
    }
    Promise.all(promises).then(() => {
      this.getLinkedComputeResources({
        softwarePlatformId: this.softwarePlatform.id,
      });
      this.utilService.callSnackBar('Successfully unlinked compute resource');
    });
  }

  onAddElement(): void {}

  onDatalistConfigChanged(): void {
    this.getLinkedComputeResources({
      softwarePlatformId: this.softwarePlatform.id,
    });
  }

  onElementClicked(computeResource: ComputeResourceDto): void {
    this.router.navigate([
      'execution-environments',
      'compute-resources',
      computeResource.id,
    ]);
  }

  onToggleLink(): void {
    this.isLinkingEnabled = !this.isLinkingEnabled;
    this.tableAddAllowed = !this.tableAddAllowed;
  }
}
