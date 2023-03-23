import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ModalService } from '../modal.service';
import * as Papa from 'papaparse';
import { csv } from 'd3';

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

  constructor(private http: HttpClient, private modalService: ModalService) { }

  ngOnInit(): void {
    this.getMessageFromCsvFile("../../../assets/chatMessages/firstMessageData.csv")
  }

  closeModal(): void {
    this.submit();
    this.modalService.closeDialog();
  }

  getMessageFromCsvFile(csvFileParh : string) {
    this.loadCSVData(csvFileParh)
      .then((message: string[]) => {
        this.messages.push(message.join(" "))
        this.newMessage = ''
      })
      .catch((error) => {
        console.log(error);
      });
  }

  loadCSVData(csvFilePath : string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      Papa.parse(csvFilePath, {
        header: false,
        download: true,
        skipEmptyLines: true,
        complete: (results : any) => {
          let csvData = results.data;
          let message = this.getRandomData(csvData);
          resolve(message);
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  }

  getRandomData(csvData : any) {
    const randomIndex = Math.floor(Math.random() * csvData.length);
    let data = csvData[randomIndex]
    return data;
  }

  addItem() {
    if(this.newMessage.length < 10) {
      alert("Molim te unesi poruku koja ima bar 10 karaktera")
      return
    }
    if (this.newMessage.trim()) {
      this.messages.push(this.newMessage);
      this.generateNewMessage();
      this.newMessage = ''
    }
    if(this.messageCounter == 2){
      this.isDisabled = true
      setTimeout(() => 
      {
        this.closeModal()
      },
      5000);
    }
  }

  submit(){
    console.log(this.messages)
    this.http.post(environment.apiHost + 'learning/chat', this.messages).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error(error);
      }
    );
  }

  generateNewMessage(){
    if(this.messageCounter == 0){
      this.getMessageFromCsvFile("../../../assets/chatMessages/secondMessageData.csv")
      this.messageCounter++
      return
    }
    if(this.messageCounter == 1){
      this.messages.push('Hvala na unetim podacima! Na osnovu ovih podataka ću moći da naučim da pomažem studentima i da ih motivišem!')
      this.messageCounter++
      return
    }
    return ''
  }
}
