export function createResponse(messageCounter: number): string {
    if (messageCounter == 0) {
      return 'Zdravo! Kako se osećaš povodom učenja u ovom trenutku?';
    } 
    if (messageCounter == 1) {
      return createSecondMessage();
    }
    if (messageCounter == 2) {
      return 'Hvala na povratnoj informaciji! Vremenom ću bolje naučiti da pomažem učenicima.';
    }
    return '';
  }
  
  function createSecondMessage(): string {
    let rnd = getRandomNumber(5);
    return messageStore.secondMessage[rnd];
  }
  
  function getRandomNumber(max: number) {
    return Math.floor(Math.random() * max);
  }
  
  const messageStore = {
    secondMessage: [
      'Da li mi možeš ukratko reći zbog čega se tako osećaš?',
      'Da li mi možeš ukratko opisati razloge za tu emociju?',
      'Da li mi možeš ukratko reći šta je izazvalo tu emociju?',
      'Možeš li mi reći koji faktori su uticali na tvoje raspoloženje?',
      'Možeš li mi reći šta je uticalo na tvoje raspoloženje?',
    ],
  };
  