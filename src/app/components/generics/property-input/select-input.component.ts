import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Option {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
})
export class SelectInputComponent {
  @Output() onSaveChanges: EventEmitter<string> = new EventEmitter<string>();

  @Input() name = '';
  @Input() value = '';
  @Input() choices: Option[] = [];
  @Input() includeEmpty = false;

  isBeingEdited = false;

  constructor() {}

  toggleEdit(): void {
    if (this.isBeingEdited) {
      this.onSaveChanges.emit(this.value);
    }
    this.isBeingEdited = !this.isBeingEdited;
  }

  get selectedValue() {
    return this.choices.find((opt) => opt.value === this.value)?.label || 'n/a';
  }
}
