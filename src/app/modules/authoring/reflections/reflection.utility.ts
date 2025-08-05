import { ReflectionQuestion } from "../../learning/reflection/reflection.model";

export function getCategories(): { id: number, name: string }[] {
  return [
    {id: 0, name: "Ostalo"},
    {id: 1, name: "Zadovoljstvo napretkom"},
    {id: 2, name: "Materijali (gradivo, pitanja, zadaci)"},
    {id: 3, name: "Sistem (mentor, tim, Tutor)"},
    {id: 4, name: "Doživljaj (emocija, organizacija, izazov)"}
  ];
}

export function getDefaultQuestions(): ReflectionQuestion[] {
  return [
    {
      id: 0,
      order: 1,
      text: 'Koliko je gradivo jasno izloženo?',
      category: 2,
      type: 2,
      labels: ['Nimalo', 'Slabo', 'Korektno', 'Veoma']
    },
    {
      id: 0,
      order: 2,
      text: 'Koliko su pitanja jasno formulisana?',
      category: 2,
      type: 2,
      labels: ['Nimalo', 'Slabo', 'Korektno', 'Veoma']
    },
    {
      id: 0,
      order: 3,
      text: 'Koliko su zadaci zahtevni?',
      category: 2,
      type: 2,
      labels: ['Ne mogu da krenem', 'Teški su', 'Taman', 'Laki su']
    },
    {
      id: 0,
      order: 4,
      text: 'Da li treba nešto posebno da unapredimo? Da ponudimo dodatno pojašnjenje ili primer?',
      category: 2,
      type: 1
    },
    {
      id: 0,
      order: 5,
      text: 'Koliki napredak vidite kod sebe u prethodnom periodu?',
      category: 1,
      type: 2,
      labels: ['Nikakav', 'Slab', 'Korektan', 'Jak']
    }
  ];
}