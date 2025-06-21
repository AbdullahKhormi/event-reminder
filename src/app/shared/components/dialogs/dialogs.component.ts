import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { interval, take } from 'rxjs';

@Component({
  selector: 'app-dialogs',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './dialogs.component.html',
  styleUrl: './dialogs.component.scss',
})
export class DialogsComponent implements OnInit {
  view = '';
  message: string = '';
  text: string = '';
  confirmButtonText = 'Yes';
  cancelButtonText = 'Cancel';

  countdownValue: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogsComponent>
  ) {
    if (data) {
      this.view = data.view;
      this.text = data.text || this.text;
      this.message = data.message || this.message;

      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }

      if (data.countdown) {
        this.countdownValue = data.countdown;
      }
    }
  }

  ngOnInit(): void {
    if (this.view === 'timeout' && this.countdownValue > 0) {
      this.updateMessage();
      interval(1000)
        .pipe(take(this.countdownValue))
        .subscribe(() => {
          this.countdownValue--;
          this.updateMessage();
        });
    }
  }

  updateMessage() {
    this.message = `Your session will expire in ${this.countdownValue} second${this.countdownValue !== 1 ? 's' : ''}.`;
  }
}
