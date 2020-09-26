import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProblemTypeService } from 'api-atlas/services/problem-type.service';
import { EntityModelProblemTypeDto } from 'api-atlas/models/entity-model-problem-type-dto';
import { AlgorithmDto } from 'api-atlas/models/algorithm-dto';
import { ProblemTypeDto } from 'api-atlas/models/problem-type-dto';
import { GenericDataService } from '../../../util/generic-data.service';
import { AddProblemTypeDialogComponent } from '../dialogs/add problem type/add-problem-type-dialog.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../generics/dialogs/confirm-dialog.component';
import { UtilService } from '../../../util/util.service';
import { AddAlgorithmDialogComponent } from '../../algorithms/dialogs/add-algorithm-dialog.component';

@Component({
  selector: 'app-problem-types-list',
  templateUrl: './problem-types-list.component.html',
  styleUrls: ['./problem-types-list.component.scss'],
})
export class ProblemTypesListComponent implements OnInit {
  problemTypes: any[] = [];
  tableColumns = ['Name', 'Parent'];
  variableNames = ['name', 'parentProblemType'];
  pagingInfo: any = {};
  paginatorConfig: any = {
    amountChoices: [10, 25, 50],
    selectedAmount: 10,
  };

  constructor(
    private problemTypeService: ProblemTypeService,
    private genericDataService: GenericDataService,
    private dialog: MatDialog,
    private router: Router,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {}

  getProblemTypes(params: any): void {
    this.problemTypeService.getProblemTypes(params).subscribe((data) => {
      this.prepareProblemTypeData(JSON.parse(JSON.stringify(data)));
    });
  }

  getProblemTypesHateoas(url: string): void {
    this.genericDataService.getData(url).subscribe((data) => {
      this.prepareProblemTypeData(data);
    });
  }

  prepareProblemTypeData(data): void {
    // Read all incoming data
    if (data._embedded) {
      this.problemTypes = data._embedded.problemTypes;
      this.assignParentProblemTypes();
    } else {
      this.problemTypes = [];
    }
    this.pagingInfo.page = data.page;
    this.pagingInfo._links = data._links;
  }

  assignParentProblemTypes(): void {
    for (const problemType of this.problemTypes) {
      if (problemType.parentProblemType != null) {
        for (const parentProblemType of this.problemTypes) {
          if (problemType.parentProblemType === parentProblemType.id) {
            problemType.parentProblemType = parentProblemType.name;
          }
        }
      }
    }
  }

  onElementClicked(problemType: any): void {
    console.log(problemType);
    this.router.navigate(['problem-types', problemType.id]);
  }

  onAddElement(): void {
    const params: any = {};
    const dialogRef = this.dialog.open(AddProblemTypeDialogComponent, {
      data: { title: 'Add new problem type' },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        const problemTypeDto: EntityModelProblemTypeDto = {
          id: dialogResult.id,
          name: dialogResult.name,
        };
        if (
          dialogResult.parentProblemType != null &&
          dialogResult.parentProblemType.id != null
        ) {
          problemTypeDto.parentProblemType = dialogResult.parentProblemType.id;
        }

        params.body = problemTypeDto;
        this.problemTypeService.createProblemType(params).subscribe((data) => {
          this.utilService.callSnackBar('Successfully added problem type');
          this.router.navigate(['problem-types', data.id]);
        });
      }
    });
  }

  onDeleteElements(event): void {
    const dialogData: ConfirmDialogData = {
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete the following problem type(s):',
      data: event.elements,
      variableName: 'name',
      yesButtonText: 'yes',
      noButtonText: 'no',
    };
    this.utilService
      .createDialog(ConfirmDialogComponent, dialogData)
      .afterClosed()
      .subscribe((dialogResult) => {
        if (dialogResult) {
          const promises: Array<Promise<void>> = [];
          for (const problemType of event.elements) {
            promises.push(
              this.problemTypeService
                .deleteProblemType({
                  problemTypeId: problemType.id,
                })
                .toPromise()
            );
          }
          Promise.all(promises).then(() => {
            this.getProblemTypes(event.queryParams);
            this.utilService.callSnackBar(
              'Successfully deleted problem type(s)'
            );
          });
        }
      });
  }

  generateDeleteParams(problemTypeId: string): any {
    const params: any = {};
    params.id = problemTypeId;
    return params;
  }

  onEditElement($event: any) {}
}
