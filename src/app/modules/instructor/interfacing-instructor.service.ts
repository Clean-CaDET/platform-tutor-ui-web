import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {filter, Subject} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InterfacingInstructor {
  observedAeEvaluations: Subject<number> = new Subject();
  openEmotionsFormEvent: Subject<void> = new Subject<void>();
  private tutorActionActivated = false;
  private tutorName = 'Kadet';
  kcId: number;

  constructor(private tutorToaster: MatSnackBar, private http: HttpClient,
              private router: Router, private activatedRoute: ActivatedRoute) {

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }
      route.params.subscribe(params => {
        this.kcId = +params.kcId;
      });
    });
  }

  submit(correctnessLevel: number): void {
    this.tutorActionActivated = false;
    this.tutorActionActivated = this.tryFeedbackPopup();
    if (!this.tutorActionActivated) {
      this.tutorActionActivated = this.tryAeEvaluationMessage(correctnessLevel);
    }
    this.observedAeEvaluations.next(correctnessLevel);
  }

  private tryFeedbackPopup(): boolean {
    let onSubmitClickedCounter = +localStorage.getItem('ON_SUBMIT_CLICKED_COUNTER');
    onSubmitClickedCounter++;
    if (onSubmitClickedCounter >= 12) {
      onSubmitClickedCounter = 0;
      this.openEmotionsFormEvent.next();
    }
    localStorage.setItem('ON_SUBMIT_CLICKED_COUNTER', onSubmitClickedCounter.toString());
    return onSubmitClickedCounter == 0;
  }

  // Consider moving this to a standalone service.
  private tryAeEvaluationMessage(correctness: number): boolean {
    const rnd = this.getRandomNumber(10);
    let message: string;
    switch (true) {
      case (correctness < 0.4):
        if (rnd < 9) {
          return false;
        }

        if (rnd == 9) {
          message = 'Hmm, ' + (correctness * 100).toFixed(0) + '% 🤔. Nešto ti nije legao zadatak. Da li ima smisla ponovo da pogledaš gradivo?';
        } else {
          message = 'Huh, ' + (correctness * 100).toFixed(0) + '% 🙀. Savetujem da se zamisliš nad tvojim i tačnim odgovorima.';
        }
        break;
      case (correctness < 0.9):
        if (rnd < 7) {
          return false;
        }

        if (rnd < 9) {
          message = (correctness * 100).toFixed(0) + '%, not great, not terrible 😐. Analiziraj deo pitanja koji je omašen i razmisli zašto je došlo do greške.';
        } else {
          message = (correctness * 100).toFixed(0) + '%, ima još posla 😯. Da li ima smisla da ponovo pogledaš gradivo?';
        }
        break;
      default:
        if (rnd < 8) {
          return false;
        }

        if (rnd == 8) {
          message = 'Opa, ' + (correctness * 100).toFixed(0) + '% 😄. Ovo je super rezultat, samo napred!';
        } else if (rnd == 9) {
          message = (correctness * 100).toFixed(0) + '%, strava 😎. Idemo dalje!';
        } else {
          message = 'Super, ' + (correctness * 100).toFixed(0) + '% 😸. Baš mi je drago što se snalaziš!';
        }
        break;
    }
    this.presentMessage(message, '👌', 7);
    return true;
  }

  private getRandomNumber(max: number) {
    return Math.floor(Math.random() * max) + 1;
  }

  inform(event: string): void {
    if (this.tutorActionActivated) {
      return;
    }

    switch (event) {
      case 'passed':
        this.passCongratulations();
        break;
    }
  }

  private passCongratulations(): void {
    const rnd = this.getRandomNumber(3);
    let message: string;
    if (rnd == 1) {
      message = 'Još jedna veština savladana 🥳. Svaka čast!';
    } else if (rnd == 2) {
      message = 'Postao si vičan u još jednoj veštini 🤗!';
    } else {
      message = 'Svakim satom sve više napredujemo 🤓.';
    }
    this.presentMessage(message, '🎉', 5);
  }

  greet(): void {
    const studentName = getName();
    const rnd = this.getRandomNumber(3);
    let message: string;
    if (rnd == 1) {
      this.tutorName = 'Kadet';
      message = 'Ćaos, ' + studentName + ' 🙂. Moje ime je ' + this.tutorName + ' i danas ću te pratiti dok razvijaš svoje veštine, kako bih ja nešto naučio. Sretno sa zadacima!';
    } else if (rnd == 2) {
      this.tutorName = 'Mona';
      message = 'Hej, ' + studentName + ' 🙂. Zovem se ' + this.tutorName + ' i danas ćemo se družiti. Posebno bih volela da čujem kako se snalaziš tokom rada, pa te molim da podeliš svoje misli i osećanja kad te pingam.';
    } else {
      this.tutorName = 'Nirko';
      message = 'Zdravo, ' + studentName + ' 🙂. Ime mi je ' + this.tutorName + ' i danas te bodrim dok učiš. Zamolio bih te da ostaviš par komentara na samom kraju tvoje sesije o čitavom utisku, pa da uposlim profesore da me unapređuju.';
    }
    this.presentMessage(message, '👋', 15, false);
  }

  private presentMessage(message: string, action: string, durationInSeconds: number, generateEvent = true) {
    this.tutorToaster.open(message, action, {
      duration: durationInSeconds * 1000,
      panelClass: 'interfacing-instructor'
    });
    if (!generateEvent) {
      return;
    }
    this.http.post(environment.apiHost + 'submissions/tutor-message', {message, kcId: this.kcId}).subscribe();
  }
}
function getName() {
  let baseName: string = JSON.parse(localStorage.getItem('STUDENT')).name;
  if(baseName.endsWith('a') || baseName.endsWith('e') || baseName.endsWith('i') || baseName.endsWith('o') || baseName.endsWith('u')) {
    return baseName;
  }
  return baseName + 'e';
}

