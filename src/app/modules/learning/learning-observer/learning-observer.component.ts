import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { createResponse } from './chatbot-message-creator';
import { ChatbotModalService } from './chatbot-modal.service';

@Component({
  selector: 'cc-learning-observer',
  templateUrl: './learning-observer.component.html',
  styleUrls: ['./learning-observer.component.scss'],
})
export class LearningObserverComponent implements OnInit {
  messages: string[] = [];
  newMessage: string = '';
  messageCounter: any = 0;
  isDisabled = false;

  constructor(
    private http: HttpClient,
    private modalService: ChatbotModalService
  ) {}

  ngOnInit(): void {
    this.messages.push(createResponse(this.messageCounter));
    this.messageCounter++;
  }

  submitAndCloseModal(emotion: string): void {
    this.submit(emotion);
    this.modalService.closeDialog();
  }

  submit(emotion: string) {
    this.http
      .post(environment.apiHost + 'learning/emotions', `"${emotion}"`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe();
  }
}
