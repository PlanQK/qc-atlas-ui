import { Component, Input, OnInit } from '@angular/core';
import { EntityModelPublicationDto } from 'api/models/entity-model-publication-dto';

@Component({
  selector: 'app-publication-algorithms-list',
  templateUrl: './publication-algorithms-list.component.html',
  styleUrls: ['./publication-algorithms-list.component.scss'],
})
export class PublicationAlgorithmsListComponent implements OnInit {
  @Input() publication: EntityModelPublicationDto;
  showRelatedAlgoTable = true;
  addIcon = 'playlist_add';
  addSubmitSelectionIcon = '';
  algorithms: any[] = [];
  tableColumns = ['Name', 'Acronym', 'Type', 'Problem'];
  variableNames = ['name', 'acronym', 'computationModel', 'problem'];
  pagingInfo: any = {};
  paginatorConfig: any = {
    amountChoices: [10, 25, 50],
    selectedAmount: 10,
  };

  constructor() {}

  ngOnInit(): void {
    console.log(this.publication);
  }

  onElementClicked(algorithm: any): void {
    console.log('Algorithm clicked');
  }

  onAddNewAlgorithms(): void {
    this.showRelatedAlgoTable = false;
  }

  onAddSelectedAlgorithms(event): void {


    this.showRelatedAlgoTable = true;
  }

  onPageChanged(event): void {
    console.log('Page change clicked!');
  }

  onDatalistConfigChanged(event): void {
    console.log('Config change clicked!');
  }
}