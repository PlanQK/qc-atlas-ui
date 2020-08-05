import { Component, Input, OnInit } from '@angular/core';
import { EntityModelSoftwarePlatformDto } from 'api/models/entity-model-software-platform-dto';
import { ExecutionEnvironmentsService } from 'api/services/execution-environments.service';
import { Router } from '@angular/router';
import { SoftwarePlatformDto } from 'api/models/software-platform-dto';
import { EntityModelComputeResourceDto } from 'api/models/entity-model-compute-resource-dto';
import {
  DeleteParams,
  LinkObject,
} from '../../../generics/data-list/data-list.component';

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
    title: 'Link compute resource with ',
    subtitle: 'Search software platform by name',
    displayVariable: 'name',
    data: [],
  };
  tableAddAllowed = true;
  isLinkingEnabled = false;

  constructor(
    private executionEnvironmentsService: ExecutionEnvironmentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.linkObject.title += this.computeResource.name;
    this.getSoftwarePlatforms();
    this.getLinkedSoftwarePlatforms({ id: this.computeResource.id });
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

  getLinkedSoftwarePlatforms(params: any): void {
    this.executionEnvironmentsService
      .getSoftwarePlatformsForComputeResource(params)
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
      .addComputeResourceReferenceToSoftwarePlatform({
        id: softwarePlatform.id,
        crId: this.computeResource.id,
      })
      .subscribe((data) => {
        this.getLinkedSoftwarePlatforms({ id: this.computeResource.id });
      });
  }

  async unlinkSoftwarePlatforms(event: DeleteParams): Promise<void> {
    for (const softwarePlatform of event.elements) {
      await this.executionEnvironmentsService
        .deleteComputeResourceReferenceFromSoftwarePlatform({
          id: softwarePlatform.id,
          crId: this.computeResource.id,
        })
        .toPromise();
      this.getLinkedSoftwarePlatforms({ id: this.computeResource.id });
    }
  }

  onAddElement(): void {}

  onDatalistConfigChanged(): void {
    this.getLinkedSoftwarePlatforms({ id: this.computeResource.id });
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
