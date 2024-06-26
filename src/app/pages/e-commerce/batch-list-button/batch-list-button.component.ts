import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ngx-batch-list-button',
  templateUrl: './batch-list-button.component.html',
  styleUrls: ['./batch-list-button.component.scss']
})
export class BatchListButtonComponent implements OnInit {

  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  onClick() {
    this.save.emit(this.rowData);
  }

}
