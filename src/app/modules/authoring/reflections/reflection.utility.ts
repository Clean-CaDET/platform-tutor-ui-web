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
      text: 'Koliko je gradivo bilo jasno izloženo?',
      category: 2,
      type: 2,
      labels: ['Nimalo', 'Slabo', 'Korektno', 'Veoma']
    },
    {
      id: 0,
      order: 2,
      text: 'Koliko su pitanja bila jasno formulisana?',
      category: 2,
      type: 2,
      labels: ['Nimalo', 'Slabo', 'Korektno', 'Veoma']
    },
    {
      id: 0,
      order: 3,
      text: 'Koliko su zadaci bili zahtevni?',
      category: 2,
      type: 2,
      labels: ['Ne mogu da krenem', 'Teški su', 'Taman', 'Laki su']
    },
    {
      id: 0,
      order: 4,
      text: 'Kada se sve sabere, koliki napredak vidiš kod sebe u prethodnom periodu?',
      category: 1,
      type: 2,
      labels: ['Nikakav', 'Slab', 'Korektan', 'Jak']
    },
    {
      id: 0,
      order: 5,
      text: 'Da li treba negde posebno da obratimo pažnju?',
      category: 0,
      type: 1
    }
  ];
}