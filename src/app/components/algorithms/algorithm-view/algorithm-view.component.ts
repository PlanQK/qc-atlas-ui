import { Component, OnDestroy, OnInit } from '@angular/core';
import { EntityModelAlgorithmDto } from 'api/models/entity-model-algorithm-dto';
import { AlgorithmService } from 'api/services/algorithm.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EntityModelApplicationAreaDto } from 'api/models/entity-model-application-area-dto';
import { ApplicationAreasService } from 'api/services/application-areas.service';
import { EntityModelProblemTypeDto } from 'api/models/entity-model-problem-type-dto';
import { ProblemTypeService } from 'api/services/problem-type.service';
import { ProblemTypeDto } from 'api/models/problem-type-dto';
import { BreadcrumbLink } from '../../generics/navigation-breadcrumb/navigation-breadcrumb.component';
import { UtilService } from '../../../util/util.service';

@Component({
  selector: 'app-algorithm-view',
  templateUrl: './algorithm-view.component.html',
  styleUrls: ['./algorithm-view.component.scss'],
})
export class AlgorithmViewComponent implements OnInit, OnDestroy {
  tabOptions: string[] = [
    'General',
    'Implementations',
    'Related algorithms',
    'Publications',
    'NISQ Analyser',
    'Discussion',
  ];

  testTags: string[] = ['test tag', 'quantum', 'algorithm'];

  algorithm: EntityModelAlgorithmDto;
  applicationAreas: EntityModelApplicationAreaDto[];
  problemTypes: EntityModelProblemTypeDto[];

  links: BreadcrumbLink[] = [{ heading: '', subHeading: '' }];

  private routeSub: Subscription;

  constructor(
    private algorithmService: AlgorithmService,
    private applicationAreasService: ApplicationAreasService,
    private problemTypeService: ProblemTypeService,
    private utilService: UtilService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(({ algoId }) => {
      this.algorithmService.getAlgorithm({ algoId }).subscribe(
        (algo: EntityModelAlgorithmDto) => {
          this.algorithm = algo;
          this.links[0] = {
            heading: this.algorithm.name,
            subHeading: this.algorithm.computationModel + ' Algorithm',
          };
          this.getApplicationAreasForAlgorithm(algoId);
          this.getProblemTypesForAlgorithm(algoId);
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  getApplicationAreasForAlgorithm(algoId: string): void {
    this.algorithmService.getApplicationAreas({ algoId }).subscribe(
      (areas) => {
        if (areas._embedded) {
          this.applicationAreas = areas._embedded.applicationAreas;
        } else {
          this.applicationAreas = [];
        }
      },
      (error) => {
        console.log(error);
        this.applicationAreas = [];
      }
    );
  }

  getProblemTypesForAlgorithm(algoId: string): void {
    this.algorithmService.getProblemTypes({ algoId }).subscribe(
      (problems) => {
        if (problems._embedded) {
          this.problemTypes = problems._embedded.problemTypes;
        } else {
          this.problemTypes = [];
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addTag(): void {
    console.log('add tag');
    // TODO: create tag dialog
  }

  removeTag(tag: string): void {
    const index = this.testTags.indexOf(tag);
    if (index !== -1) {
      this.testTags.splice(index, 1);
    }
  }

  updateAlgorithmField(event: { field; value }): void {
    this.algorithm[event.field] = event.value;
    this.algorithmService
      .updateAlgorithm({ algoId: this.algorithm.id, body: this.algorithm })
      .subscribe(
        (algo) => {
          this.algorithm = algo;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  addApplicationArea(applicationArea: string): void {
    this.applicationAreasService
      .createApplicationArea({ body: { name: applicationArea } })
      .subscribe((area) => {
        this.algorithmService
          .addApplicationArea({
            algoId: this.algorithm.id,
            body: {
              id: area.id,
              name: area.name,
            },
          })
          .subscribe((areas) => {
            if (areas._embedded) {
              this.applicationAreas = areas._embedded.applicationAreas;
            }
          });
      });
  }

  removeApplicationArea(applicationArea: EntityModelApplicationAreaDto): void {
    this.algorithmService
      .deleteReferenceToApplicationArea({
        algoId: this.algorithm.id,
        applicationAreaId: applicationArea.id,
      })
      .subscribe(
        (res) => {
          this.applicationAreasService
            .deleteApplicationArea({ id: applicationArea.id })
            .subscribe(
              (area) => {},
              (error) => {
                console.log(error);
              }
            );
          this.getApplicationAreasForAlgorithm(this.algorithm.id);
          this.utilService.callSnackBar(
            'Successfully removed application area "' +
              applicationArea.name +
              '"'
          );
        },
        (error) => {
          console.log(error);
        }
      );
  }

  addProblemType(problemType: ProblemTypeDto): void {
    this.problemTypeService.createProblemType({ body: problemType }).subscribe(
      (type) => {
        this.algorithmService
          .addProblemType({ algoId: this.algorithm.id, body: type })
          .subscribe(
            (types) => {
              if (types._embedded) {
                this.problemTypes = types._embedded.problemTypes;
              }
              console.log(types);
            },
            (error) => {
              console.log(error);
            }
          );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  removeProblemType(problemTypes: EntityModelProblemTypeDto[]): void {
    problemTypes.forEach((problemType) => {
      this.algorithmService
        .deleteReferenceToProblemTypes({
          algoId: this.algorithm.id,
          problemTypeId: problemType.id,
        })
        .subscribe(
          (type) => {
            this.getProblemTypesForAlgorithm(this.algorithm.id);
          },
          (error) => {
            console.log(error);
          }
        );
    });
  }
}
