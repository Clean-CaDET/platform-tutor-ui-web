import { Component, OnInit } from '@angular/core';
import { Lecture } from 'src/app/lecture/model/lecture.model';
import { LectureService } from 'src/app/lecture/services/lecture.service';

@Component({
  selector: 'cc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lectures: Lecture[];
  content: any;  
  constructor(private lectureService: LectureService) { }

  ngOnInit(): void {
    this.content = {
      "introduction": "*Clean CaDET Smart Tutor* je **interaktivan** i **adaptivan** sistem za elektronski podržano učenje, fokusiran na domen softverskog inženjerstva i specijalizovan za oblast dizajniranja čistog koda.",
      "challengeTutorialImage": "https://i.ibb.co/ng7D7Fd/RS-Tutor-Instruction.png",
      "challengeTutorialText": `Sa aspekta **interaktivnosti**, Smart Tutor kombinuje edukativan sadržaj za pasivno konzumiranje (tekst, slike, video) sa interaktivnim sadržajem poput jednostavnih pitanja i složenih izazova koji su podržani automatskom evaluacijom. Podsistem za izazove je ilustrovan na slici desno i podrazumeva:

1. Učitavanje predefinisanog koda (1a) u integrisano razvojno okruženje (1b),

2. Refaktorisanje koda sa fokusom na određeni aspekt čistog koda (2a, 2b),

3. Slanje predloženog rešenja na evaluaciju uz ID (3a, 3b) i

4. Razmatranje povratne informacije o kvalitetu rešenja.

`,
      "adaptive": "Smart Tutor anketira polaznike, prati njihov progres, i skuplja povratnu informaciju o edukativnom sadržaju kako bi odredio njihove preference. Spram preferenci, Tutor **adaptira** ponuđeni edukativan sadržaj polaznicima, kako bi pružio sadržaj koji najbolje pospešuje njihovo učenje.",
      "lectureCatalog": "Edukativni sadržaj Tutora je organizovan u lekcije, koje su potom segmentirane na module. Deo modula je fokusiran na prezentaciju novog gradiva, dok se praktični moduli fokusiraju na izazove. Neophodno je savladati sve module lekcije da bi se ona kompletirala."
    }
    this.lectureService.getLectures().subscribe(lectures => this.lectures = lectures);
  }

}
