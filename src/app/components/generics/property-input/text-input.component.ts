import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AbstractValueAccessor, DoProvider } from './abstract-value-accessor';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [DoProvider(TextInputComponent)],
})
export class TextInputComponent implements OnInit {
  @Output() onSaveChanges: EventEmitter<string> = new EventEmitter<string>();
  @Output() onChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() name = '';
  @Input() value: string;
  @Input() multiline = false;
  @Input() maxLines = 1;
  @Input() isLink: boolean;

  inputValue: string;

  saveChanges(): void {
    this.onSaveChanges.emit(this.inputValue);
  }

  inputChanged(): void {
    if (!this.inputValue) {
      this.inputValue = null;
    }
    this.onChange.emit(this.inputValue);
  }

  openLink(): void {
    window.open(this.inputValue, '_blank');
  }

  ngOnInit() {
    this.inputValue = this.value;
  }
}
