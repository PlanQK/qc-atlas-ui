import { Component, OnInit } from '@angular/core';
import { EntityModelComputeResourceDto } from 'api/models/entity-model-compute-resource-dto';
import { ExecutionEnvironmentsService } from 'api/services/execution-environments.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbLink } from '../../../generics/navigation-breadcrumb/navigation-breadcrumb.component';

@Component({
  selector: 'app-compute-resource-view',
  templateUrl: './compute-resource-view.component.html',
  styleUrls: ['./compute-resource-view.component.scss'],
})
export class ComputeResourceViewComponent implements OnInit {
  computeResource: EntityModelComputeResourceDto;

  links: BreadcrumbLink[] = [{ heading: '', subHeading: '' }];

  private routeSub: Subscription;

  constructor(
    private executionEnvironmentsService: ExecutionEnvironmentsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(({ crId }) => {
      this.executionEnvironmentsService
        .getComputeResource({ id: crId })
        .subscribe(
          (computeResource: EntityModelComputeResourceDto) => {
            this.computeResource = computeResource;
            this.links[0] = {
              heading: this.computeResource.name,
              subHeading: '',
            };
          },
          (error) => {
            console.log(error);
          }
        );
    });
  }
}
