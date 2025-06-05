import { ReflectionQuestion, ReflectionQuestionCategory } from "../../learning/reflection/reflection.model";

  export function getDefaultQuestions(categories: ReflectionQuestionCategory[]): ReflectionQuestion[] {
    return [
      {
        id: 0,
        order: 1,
        text: 'Koliko je gradivo bilo jasno izloženo?',
        categoryId: categories.find(c => c.code === 'materials').id,
        type: 2,
        labels: ['Nimalo', 'Slabo', 'Korektno', 'Veoma']
      },
      {
        id: 0,
        order: 2,
        text: 'Koliko su pitanja bila jasno formulisana?',
        categoryId: categories.find(c => c.code === 'materials').id,
        type: 2,
        labels: ['Nimalo', 'Slabo', 'Korektno', 'Veoma']
      },
      {
        id: 0,
        order: 3,
        text: 'Koliko su zadaci bili zahtevni?',
        categoryId: categories.find(c => c.code === 'materials').id,
        type: 2,
        labels: ['Ne mogu da krenem', 'Teški su', 'Taman', 'Laki su']
      },
      {
        id: 0,
        order: 4,
        text: 'Kada se sve sabere, koliki napredak vidiš kod sebe u prethodnom periodu?',
        categoryId: categories.find(c => c.code === 'satisfaction').id,
        type: 2,
        labels: ['Nikakav', 'Slab', 'Korektan', 'Jak']
      },
      {
        id: 0,
        order: 5,
        text: 'Da li treba negde posebno da obratimo pažnju?',
        categoryId: categories.find(c => c.code === 'other').id,
        type: 1
      }
    ];
  }