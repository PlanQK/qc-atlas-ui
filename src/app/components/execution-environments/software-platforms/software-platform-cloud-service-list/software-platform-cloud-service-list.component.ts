import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExecutionEnvironmentsService } from 'api/services/execution-environments.service';
import { EntityModelSoftwarePlatformDto } from 'api/models/entity-model-software-platform-dto';
import { EntityModelCloudServiceDto } from 'api/models/entity-model-cloud-service-dto';
import { CloudServiceDto } from 'api/models/cloud-service-dto';
import {
  DeleteParams,
  LinkObject,
} from '../../../generics/data-list/data-list.component';

@Component({
  selector: 'app-software-platform-cloud-service-list',
  templateUrl: './software-platform-cloud-service-list.component.html',
  styleUrls: ['./software-platform-cloud-service-list.component.scss'],
})
export class SoftwarePlatformCloudServiceListComponent implements OnInit {
  @Input() softwarePlatform: EntityModelSoftwarePlatformDto;
  linkedCloudServices: EntityModelCloudServiceDto[] = [];

  tableColumns = ['Name', 'Provider', 'Description', 'CostModel', 'URL'];
  variableNames = ['name', 'provider', 'description', 'costModel', 'URL'];
  linkObject: LinkObject = {
    title: 'Link software platform with ',
    subtitle: 'Search cloud services by name',
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
    this.linkObject.title += this.softwarePlatform.name;
    this.getLinkedCloudServices({ id: this.softwarePlatform.id });
  }

  getLinkedCloudServices(params: any): void {
    this.executionEnvironmentsService
      .getCloudServicesForSoftwarePlatform(params)
      .subscribe((cloudServices) => {
        if (cloudServices._embedded) {
          this.linkedCloudServices = cloudServices._embedded.cloudServices;
        } else {
          this.linkedCloudServices = [];
        }
      });
  }

  searchUnlinkedCloudServices(search: string): void {
    if (search) {
      this.executionEnvironmentsService
        .getCloudServices({ search })
        .subscribe((data) => {
          this.updateLinkableCloudServices(data._embedded);
        });
    } else {
      this.linkObject.data = [];
    }
  }

  linkCloudService(cloudService: CloudServiceDto): void {
    this.linkObject.data = [];
    this.executionEnvironmentsService
      .addCloudServiceReferenceToSoftwarePlatform({
        id: this.softwarePlatform.id,
        csId: cloudService.id,
      })
      .subscribe((data) => {
        this.getLinkedCloudServices({ id: this.softwarePlatform.id });
      });
  }

  async unlinkCloudServices(event: DeleteParams): Promise<void> {
    for (const cloudService of event.elements) {
      await this.executionEnvironmentsService
        .deleteCloudServiceReferenceFromSoftwarePlatform({
          id: this.softwarePlatform.id,
          csId: cloudService.id,
        })
        .toPromise();
      this.getLinkedCloudServices({ id: this.softwarePlatform.id });
    }
  }

  onAddElement(): void {}

  onDatalistConfigChanged(): void {
    this.getLinkedCloudServices({ id: this.softwarePlatform.id });
  }

  onElementClicked(cloudService: CloudServiceDto): void {
    this.router.navigate([
      'execution-environments',
      'cloud-services',
      cloudService.id,
    ]);
  }

  updateLinkableCloudServices(cloudServiceData: {
    cloudServices?: EntityModelCloudServiceDto[];
  }): void {
    console.log(cloudServiceData);
    this.linkObject.data = [];
    if (cloudServiceData) {
      for (const publication of cloudServiceData.cloudServices) {
        if (
          !this.linkedCloudServices.some((publ) => publ.id === publication.id)
        ) {
          this.linkObject.data.push(publication);
        }
      }
    }
  }

  onToggleLink(): void {
    this.isLinkingEnabled = !this.isLinkingEnabled;
    this.tableAddAllowed = !this.tableAddAllowed;
  }
}
