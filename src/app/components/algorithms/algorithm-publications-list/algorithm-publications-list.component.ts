import { Component, Input, OnInit } from '@angular/core';
import { EntityModelAlgorithmDto } from 'api-atlas/models/entity-model-algorithm-dto';
import { AlgorithmService } from 'api-atlas/services/algorithm.service';
import { EntityModelPublicationDto } from 'api-atlas/models/entity-model-publication-dto';
import { PublicationService } from 'api-atlas/services/publication.service';
import { Router } from '@angular/router';
import { PublicationDto } from 'api-atlas/models/publication-dto';
import { MatDialog } from '@angular/material/dialog';
import {
  LinkObject,
  QueryParams,
} from '../../generics/data-list/data-list.component';
import { UtilService } from '../../../util/util.service';
import { ConfirmDialogComponent } from '../../generics/dialogs/confirm-dialog.component';
import { LinkItemListDialogComponent } from '../../generics/dialogs/link-item-list-dialog.component';
import { GenericDataService } from '../../../util/generic-data.service';

@Component({
  selector: 'app-algorithm-publications-list',
  templateUrl: './algorithm-publications-list.component.html',
  styleUrls: ['./algorithm-publications-list.component.scss'],
})
export class AlgorithmPublicationsListComponent implements OnInit {
  @Input() algorithm: EntityModelAlgorithmDto;

  variableNames: string[] = ['title', 'authors', 'doi'];
  tableColumns: string[] = ['Title', 'Authors', 'DOI'];
  linkObject: LinkObject = {
    title: 'Link publication with ',
    subtitle: 'Search publications by title',
    displayVariable: 'title',
    data: [],
    linkedData: [],
  };
  tableAddAllowed = true;
  isLinkingEnabled = false;
  pagingInfo: any = {};
  paginatorConfig: any = {
    amountChoices: [10, 25, 50],
    selectedAmount: 10,
  };

  constructor(
    private algorithmService: AlgorithmService,
    private publicationService: PublicationService,
    private genericDataService: GenericDataService,
    private router: Router,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.linkObject.title += this.algorithm.name;
    this.getLinkedPublications({ algorithmId: this.algorithm.id });
  }

  getLinkedPublications(params: {
    algorithmId: string;
    search?: string;
    page?: number;
    size?: number;
    sort?: string[];
  }): void {
    this.algorithmService
      .getPublicationsOfAlgorithm(params)
      .subscribe((publications) => {
        this.linkObject.linkedData = [];
        if (publications._embedded) {
          this.linkObject.linkedData = publications._embedded.publications;
        }
      });
  }

  preparePublicationData(data): void {
    // clear link object data
    this.linkObject.data = [];
    // If publications found
    if (data._embedded) {
      this.linkObject.data = data._embedded.publications;
    }
    this.pagingInfo.page = data.page;
    this.pagingInfo._links = data._links;
  }

  linkPublication(publication: PublicationDto): void {
    // Empty unlinked algorithms
    this.linkObject.data = [];
    // Link algorithm
    this.algorithmService
      .linkAlgorithmAndPublication({
        algorithmId: this.algorithm.id,
        body: publication,
      })
      .subscribe(() => {
        this.getLinkedPublications({ algorithmId: this.algorithm.id });
        this.utilService.callSnackBar('Successfully linked Publication');
      });
  }

  unlinkPublications(event): void {
    const promises: Array<Promise<void>> = [];
    for (const publication of event.elements) {
      promises.push(
        this.algorithmService
          .unlinkAlgorithmAndPublication({
            algorithmId: this.algorithm.id,
            publicationId: publication.id,
          })
          .toPromise()
      );
    }
    Promise.all(promises).then(() => {
      this.getLinkedPublications({ algorithmId: this.algorithm.id });
      this.utilService.callSnackBar('Successfully unlinked Publication');
    });
  }

  onDatalistConfigChanged(event): void {
    this.getLinkedPublications({ algorithmId: this.algorithm.id });
  }

  onElementClicked(publication: PublicationDto): void {
    this.routeTo(publication);
  }

  routeTo(publication: PublicationDto): void {
    this.router.navigate(['publications', publication.id]);
  }

  onToggleLink(): void {
    this.isLinkingEnabled = !this.isLinkingEnabled;
    this.tableAddAllowed = !this.tableAddAllowed;
  }

  openLinkPublicationDialog() {
    this.publicationService.getPublications().subscribe((data) => {
      this.preparePublicationData(JSON.parse(JSON.stringify(data)));
      const dialogRef = this.dialog.open(LinkItemListDialogComponent, {
        width: '800px',
        data: {
          title: 'Link existing publication',
          linkObject: this.linkObject,
          tableColumns: ['Name', 'Authors'],
          variableNames: ['title', 'authors'],
          pagingInfo: this.pagingInfo,
          paginatorConfig: this.paginatorConfig,
          noButtonText: 'Cancel',
        },
      });
      const searchTextSub = dialogRef.componentInstance.onDataListConfigChanged.subscribe(
        (search: QueryParams) => {
          this.publicationService
            .getPublications(search)
            .subscribe((updatedData) => {
              this.preparePublicationData(
                JSON.parse(JSON.stringify(updatedData))
              );
              dialogRef.componentInstance.data.linkObject = this.linkObject;
            });
        }
      );
      const pagingSub = dialogRef.componentInstance.onPageChanged.subscribe(
        (page: string) => {
          this.genericDataService.getData(page).subscribe((pageData) => {
            this.preparePublicationData(pageData);
            dialogRef.componentInstance.data.linkObject = this.linkObject;
          });
        }
      );
      const elementClickedSub = dialogRef.componentInstance.onElementClicked.subscribe(
        (element: PublicationDto) => {
          this.routeTo(element);
          dialogRef.close();
        }
      );

      dialogRef.afterClosed().subscribe((dialogResult) => {
        searchTextSub.unsubscribe();
        pagingSub.unsubscribe();
        elementClickedSub.unsubscribe();
        if (dialogResult) {
          for (const publication of dialogResult.selectedItems) {
            this.linkPublication(publication);
          }
        }
      });
    });
  }
}
