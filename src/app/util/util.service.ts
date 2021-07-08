import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as deepEqual from 'fast-deep-equal';
import { LatexContent } from 'api-latex/models/latex-content';
import { RenderLatexControllerService } from 'api-latex/services/render-latex-controller.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MissingEntityDialogComponent } from '../components/dialogs/missing-entity-dialog.component';
import { LatexRendererServiceConstants } from './latex-renderer-service-constants';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  isSelectedColor = 'primary';
  timeOut = 3000;

  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private latexRendererService: RenderLatexControllerService,
    private latexRendererServiceConstants: LatexRendererServiceConstants
  ) {}

  public callSnackBar(text: string): void {
    this.snackBar.open(text, 'OK', {
      duration: this.timeOut,
    });
  }

  public callSnackBarSequence(messages: string[]): void {
    messages.forEach((message, index) => {
      setTimeout(() => {
        this.snackBar.open(message, 'OK', {
          duration: this.timeOut,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        });
      }, index * (this.timeOut + 500)); // 500 => timeout between two messages
    });
  }

  public createDialog(
    dialogComponent: any,
    data: any,
    width?: any,
    height?: any
  ): MatDialogRef<any> {
    return this.dialog.open(dialogComponent, {
      width: width || '400px',
      height: height || undefined,
      data,
    });
  }

  public createMissingEntityDialog(
    missingEntity: string,
    currentEntity: string
  ): void {
    this.dialog.open(MissingEntityDialogComponent, {
      width: '600px',
      data: { missingEntity, currentEntity },
    });
  }

  public getColorOfSelectedButton(selectedEntity: any, id: string): string {
    if (!selectedEntity) {
      return null;
    }
    if (id === selectedEntity.id) {
      return this.isSelectedColor;
    }
  }

  public objectsEqual(source: any, target: any): boolean {
    return deepEqual(source, target);
  }

  /**
   * This method returns the last page of a table after the creation of the new object.
   *
   * @param pagingInfo
   * @param createdElements
   * @return correctPage
   */
  public getLastPageAfterCreation(
    pagingInfo: any,
    createdElements: number
  ): number {
    const totalElementsAfterCreation =
      pagingInfo.totalElements + createdElements;
    const lastPageAfterCreation = Math.ceil(
      totalElementsAfterCreation / pagingInfo.size
    );
    const correctPage = lastPageAfterCreation - 1;
    return correctPage;
  }

  /**
   * This method checks if the current page is the last one and if it will become empty after the deletion of elements.
   *
   * @param elementsDeleted
   * @param currentAmountOfElements
   * @param pagingInfo
   * @return isEmpty
   */
  public isLastPageEmptyAfterDeletion(
    elementsDeleted: number,
    currentAmountOfElements: number,
    pagingInfo: any
  ): boolean {
    return (
      currentAmountOfElements === elementsDeleted &&
      pagingInfo.number !== 0 &&
      pagingInfo.number === pagingInfo.totalPages - 1
    );
  }

  /**
   * This method returns the final snackbar message after the deletion of elements.
   *
   * @param successfulDeletions
   * @param expectedDeletions
   * @param objectType
   * @param performedOperation
   * @return deletionMessage
   */
  public generateFinishingSnackbarMessage(
    successfulDeletions: number,
    expectedDeletions: number,
    objectType: string,
    performedOperation?: string
  ): string {
    performedOperation = performedOperation ? performedOperation : 'deleted';
    return (
      'Successfully ' +
      performedOperation +
      ' ' +
      successfulDeletions +
      '/' +
      expectedDeletions +
      ' ' +
      objectType +
      '.'
    );
  }

  public isLatexText(packedData: string): boolean {
    return packedData
      ? packedData.includes(
          this.latexRendererServiceConstants.latexFormatIndicator
        )
      : false;
  }

  public getUnpackedLatexText(packedData: string): string {
    const data = this.latexRendererServiceConstants.unpackTextAndPackages(
      packedData
    );
    return data.latexContent;
  }

  public renderPackedDataAndReturnUrlToPdfBlob(
    packedData: string
  ): Observable<string> {
    const data = this.latexRendererServiceConstants.unpackTextAndPackages(
      packedData
    );
    return this.renderLatexContentAndReturnUrlToPdfBlob(
      data.latexContent,
      data.latexPackages,
      data.varwidth
    );
  }

  public renderLatexContentAndReturnUrlToPdfBlob(
    latexContent: string,
    additionalPackages: string,
    varwidth: number
  ): Observable<string> {
    const packages = this.latexRendererServiceConstants.getDefaultLatexPackages();
    if (additionalPackages) {
      for (const additionalPackage of this.latexRendererServiceConstants.formatLatexPackagesToArray(
        additionalPackages
      )) {
        if (!packages.includes(additionalPackage)) {
          packages.push(additionalPackage);
        }
      }
    }
    const latexBody: LatexContent = {
      content: this.latexRendererServiceConstants.formatLatexContent(
        latexContent
      ),
      latexPackages: packages,
      varwidth,
      output: this.latexRendererServiceConstants.getDefaultRenderOutput(),
    };
    return this.latexRendererService.renderLatex({ body: latexBody }).pipe(
      map((response) => {
        if (response) {
          const latexBlob = this.latexRendererServiceConstants.createBlobFromRenderedResult(
            response
          );
          return URL.createObjectURL(latexBlob);
        }
      })
    );
  }
}
