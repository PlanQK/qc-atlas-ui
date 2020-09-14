import { Component, Input, OnInit } from '@angular/core';
import { EntityModelSoftwarePlatformDto } from 'api-atlas/models/entity-model-software-platform-dto';
import { ExecutionEnvironmentsService } from 'api-atlas/services/execution-environments.service';
import { Router } from '@angular/router';
import { SoftwarePlatformDto } from 'api-atlas/models/software-platform-dto';
import { EntityModelComputeResourceDto } from 'api-atlas/models/entity-model-compute-resource-dto';
import {
  SelectParams,
  LinkObject,
} from '../../../generics/data-list/data-list.component';
import { UtilService } from '../../../../util/util.service';

@Component({
  selector: 'app-compute-resource-software-platform-list',
  templateUrl: './compute-resource-software-platform-list.component.html',
  styleUrls: ['./compute-resource-software-platform-list.component.scss'],
})
export class ComputeResourceSoftwarePlatformListComponent implements OnInit {
  @Input() computeResource: EntityModelComputeResourceDto;
  softwarePlatforms: EntityModelSoftwarePlatformDto[];
  linkedSoftwarePlatforms: EntityModelSoftwarePlatformDto[] = [];

  tableColumns = ['Name', 'Version', 'Licence', 'Link'];
  variableNames = ['name', 'version', 'licence', 'link'];
  linkObject: LinkObject = {
    title: 'Link software platform with ',
    subtitle: 'Search software platform by name',
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
    this.linkObject.title += this.computeResource.name;
    this.getSoftwarePlatforms();
    this.getLinkedSoftwarePlatforms({
      computeResourceId: this.computeResource.id,
    });
  }

  getSoftwarePlatforms(): void {
    this.executionEnvironmentsService
      .getSoftwarePlatforms({ page: -1 })
      .subscribe((softwarePlatforms) => {
        if (softwarePlatforms._embedded) {
          this.softwarePlatforms =
            softwarePlatforms._embedded.softwarePlatforms;
        } else {
          this.softwarePlatforms = [];
        }
      });
  }

  getLinkedSoftwarePlatforms(params: {
    computeResourceId: string;
    search?: string;
    page?: number;
    size?: number;
    sort?: string[];
  }): void {
    this.executionEnvironmentsService
      .getSoftwarePlatformsOfComputeResource(params)
      .subscribe((softwarePlatforms) => {
        if (softwarePlatforms._embedded) {
          this.linkedSoftwarePlatforms =
            softwarePlatforms._embedded.softwarePlatforms;
        } else {
          this.linkedSoftwarePlatforms = [];
        }
      });
  }

  searchUnlinkedSoftwarePlatforms(search: string): void {
    if (search) {
      search = search.toLocaleLowerCase();
      this.linkObject.data = this.softwarePlatforms.filter(
        (softwarePlatform: EntityModelSoftwarePlatformDto) =>
          softwarePlatform.name.toLocaleLowerCase().startsWith(search) &&
          !this.linkedSoftwarePlatforms.includes(softwarePlatform)
      );
    } else {
      this.linkObject.data = [];
    }
  }

  linkSoftwarePlatform(softwarePlatform: SoftwarePlatformDto): void {
    this.linkObject.data = [];
    this.executionEnvironmentsService
      .linkSoftwarePlatformAndComputeResource({
        softwarePlatformId: softwarePlatform.id,
        body: this.computeResource,
      })
      .subscribe(() => {
        this.getLinkedSoftwarePlatforms({
          computeResourceId: this.computeResource.id,
        });
        this.utilService.callSnackBar('Successfully linked software platform');
      });
  }

  unlinkSoftwarePlatforms(event: SelectParams): void {
    const promises: Array<Promise<void>> = [];
    for (const softwarePlatform of event.elements) {
      promises.push(
        this.executionEnvironmentsService
          .unlinkSoftwarePlatformAndComputeResource({
            softwarePlatformId: softwarePlatform.id,
            computeResourceId: this.computeResource.id,
          })
          .toPromise()
      );
    }
    Promise.all(promises).then(() => {
      this.getLinkedSoftwarePlatforms({
        computeResourceId: this.computeResource.id,
      });
      this.utilService.callSnackBar('Successfully unlinked software platforms');
    });
  }

  onAddElement(): void {}

  onDatalistConfigChanged(): void {
    this.getLinkedSoftwarePlatforms({
      computeResourceId: this.computeResource.id,
    });
  }

  onElementClicked(softwarePlatform: SoftwarePlatformDto): void {
    this.router.navigate([
      'execution-environments',
      'software-platforms',
      softwarePlatform.id,
    ]);
  }

  onToggleLink(): void {
    this.isLinkingEnabled = !this.isLinkingEnabled;
    this.tableAddAllowed = !this.tableAddAllowed;
  }
}
