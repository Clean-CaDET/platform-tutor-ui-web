import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { createResponse } from './chatbot-message-creator';
import { ChatbotModalService } from './chatbot-modal.service';

@Component({
  selector: 'cc-learning-observer',
  templateUrl: './learning-observer.component.html',
  styleUrls: ['./learning-observer.component.scss']
})
export class LearningObserverComponent implements OnInit {
  messages : string[] = [];
  newMessage: string = '';
  messageCounter : any = 0
  isDisabled = false

  constructor(private http: HttpClient, private modalService: ChatbotModalService) { }

  ngOnInit(): void {
    this.messages.push(createResponse(this.messageCounter));
    this.messageCounter++;
  }

  closeModal(): void {
    this.submit();
    this.modalService.closeDialog();
  }

  addItem() {
    if (this.newMessage.trim()) {
      this.messages.push(this.newMessage);
      this.generateNewMessage();
      this.newMessage = ''
    }
    if(this.messageCounter == 3){
      this.isDisabled = true;
    }
  }

  submit(){
    this.http.post(environment.apiHost + 'learning/chat', this.messages).subscribe();
  }

  generateNewMessage(){
    this.messages.push(createResponse(this.messageCounter));
    this.messageCounter++;
    return ''
  }
}
