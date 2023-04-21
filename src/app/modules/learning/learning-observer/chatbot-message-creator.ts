export function createResponse(messageCounter: number): string {
    if (messageCounter == 0) {
      return createFirstMessage();
    }
    if (messageCounter == 1) {
      return createSecondMessage();
    }
    if (messageCounter == 2) {
      return 'Hvala na unetim podacima! Na osnovu ovih podataka ću moći da naučim da pomažem studentima i da ih motivišem!';
    }
    return '';
  }
  
  function createFirstMessage(): string {
    let rnd = getRandomNumber(19);
    switch (rnd) {
      case 1:
        return messageStore.firstMessage[1];
      case 2:
        return messageStore.firstMessage[2];
      case 3:
        return messageStore.firstMessage[3];
      case 4:
        return messageStore.firstMessage[4];
      case 5:
        return messageStore.firstMessage[5];
      case 6:
        return messageStore.firstMessage[6];
      case 7:
        return messageStore.firstMessage[7];
      case 8:
        return messageStore.firstMessage[8];
      case 9:
        return messageStore.firstMessage[9];
      case 10:
        return messageStore.firstMessage[10];
      case 11:
        return messageStore.firstMessage[11];
      case 12:
        return messageStore.firstMessage[12];
      case 13:
        return messageStore.firstMessage[13];
      case 14:
        return messageStore.firstMessage[14];
      case 15:
        return messageStore.firstMessage[15];
      case 16:
        return messageStore.firstMessage[16];
      case 17:
        return messageStore.firstMessage[17];
      case 18:
        return messageStore.firstMessage[18];
      case 19:
        return messageStore.firstMessage[19];
    }
  
    return '';
  }
  
  function createSecondMessage(): string {
    let rnd = getRandomNumber(14);
    switch (rnd) {
      case 1:
        return messageStore.secondMessage[1];
      case 2:
        return messageStore.secondMessage[2];
      case 3:
        return messageStore.secondMessage[3];
      case 4:
        return messageStore.secondMessage[4];
      case 5:
        return messageStore.secondMessage[5];
      case 6:
        return messageStore.secondMessage[6];
      case 7:
        return messageStore.secondMessage[7];
      case 8:
        return messageStore.secondMessage[8];
      case 9:
        return messageStore.secondMessage[9];
      case 10:
        return messageStore.secondMessage[10];
      case 11:
        return messageStore.secondMessage[11];
      case 12:
        return messageStore.secondMessage[12];
      case 13:
        return messageStore.secondMessage[13];
      case 14:
        return messageStore.secondMessage[14];
    }
    return '';
  }
  
  function getRandomNumber(max: number) {
    return Math.floor(Math.random() * max) + 1;
  }
  
  const messageStore = {
    firstMessage: {
      1: 'Dobro došao/la! Kako napreduješ sa učenjem danas?',
      2: 'Zdravo! Kako napreduješ sa materijalima?',
      3: 'Zdravo, kako ste danas?',
      4: 'Pozdrav! Kako ide tvoj rad na zadacima?',
      5: 'Dobro došao/la! Mogu li da znam kako se osećaš danas?',
      6: 'Dobrodošao/la nazad. Kako ide učenje?',
      7: 'Dobrodošao/la nazad. Kako se osećaš danas?',
      8: 'Dobro došao/la! Kako ide učenje danas?',
      9: 'Dobrodošao/la nazad. Kako napreduješ sa učenjem?',
      10: 'Zdravo! Kako ti ide učenje danas?',
      11: 'Zdravo! Kako ide učenje?',
      12: 'Zdravo! Vidim da si se vratio na učenje. Kako ide?',
      13: 'Pozdrav! Kako se danas osećaš?',
      14: 'Dobro jutro, kako se danas osećate?',
      15: 'Dobrodošao na današnju sesiju, kako se osećaš?',
      16: 'Ćao, kako se danas osećate?',
      17: 'Hej, kako ti ide danas sa ovim zadacima?',
      18: 'Dobar dan! Kako se danas osećate tokom učenja?',
      19: 'Dobar dan, kako se danas osećate?',
    },
    secondMessage: {
      1: 'Da li bi mi mogao/la reći nešto više o tome?',
      2: 'Mogu li da pitam zbog čega?',
      3: 'Da li možete mi reći više o razlozima za vašu emociju?',
      4: 'Možete li mi reći šta tačno izaziva tu emociju?',
      5: 'Želeo bih da saznate više o tome. Koji faktor je uticao na vaše raspoloženje danas?',
      6: 'Možeš li mi reći malo više o tome?',
      7: 'Koji delovi gradiva ti zadaju najveći problem?',
      8: 'Da li si se suočio sa nekim problemom koji bi mogao da utiče na tvoje učenje?',
      9: 'Možeš li mi reći nešto više o tvom raspoloženju? Šta je uticalo na njega?',
      10: 'Da li si se možda suočio/la sa nekim problemima u poslednje vreme koji bi mogli da utiču na tvoje raspoloženje?',
      11: 'Šta ti najviše smeta kod ove lekcije?',
      12: 'Razumem. Da li bi želeo/la da mi kažeš nešto više o tome?',
      13: 'Da li ti mogu pomoći u bilo čemu?',
      14: 'Koje su neke stvari koje ti otežavaju da se usredsrediš na učenje?',
    },
  };
  