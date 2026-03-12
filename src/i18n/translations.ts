export type Language = 'en' | 'hu';

export const translations = {
  en: {
    app: {
      skipToContent: 'Skip to content',
    },
    startPage: {
      title: 'TreeViz',
      subtitle: 'Tree Data Structure Visualizer',
      placeholder: 'Initial insertions (e.g.: 5, 1, 8, 1, 7, 2, 0, -1)',
      startButton: 'Start',
      selectTreePrompt: 'Please select at least one tree type',
      inputInvalidPrompt: 'Please provide a valid input (green border)',
    },
    trees: {
      bst: 'Binary Search Tree',
      avl: 'AVL Tree',
      rb: 'Red-Black Tree',
      b: 'B Tree',
    },
    controls: {
      insert: 'Insert',
      search: 'Search',
      delete: 'Delete',
      placeholder: 'Value',
      jumpToStart: 'Jump to start',
      previousStep: 'Previous step',
      play: 'Play',
      pause: 'Pause',
      nextStep: 'Next step',
      jumpToEnd: 'Jump to end',
      selectStep: 'Select step',
      playbackSpeed: 'Playback speed',
      fullscreenMode: 'Fullscreen mode',
      exitFullscreen: 'Exit fullscreen',
      downloadSVG: 'Download SVG',
      preorder: 'Preorder',
      inorder: 'Inorder',
      postorder: 'Postorder'
    },
    logs: {
      title: 'LOG',
      operationHistory: 'Operation History',
      step: 'Step',
      startSearch: 'Search started: {value}',
      notFound: '{value} not found.',
      examining: 'Examining: {value}',
      found: '{value} found.',
      alreadyExists: '{value} is already in the tree.',
      rootCreated: 'Root created: {value}',
      insertLeft: '{value} inserted to the left of {parent}.',
      insertRight: '{value} inserted to the right of {parent}.',
      nodeFound: '{value} found.',
      leafDeleted: 'Leaf node ({value}) deleted.',
      rootDeleted: 'Root deleted: {value}',
      oneChildDeleted: 'Node with one child ({value}) deleted.',
      replaceNode: 'Replacing node to delete with: {value}',
      twoChildrenDeleted: 'Node with two children ({value}) deleted.',
      rotateRight: '(LL) Rotating right',
      rotateLeft: '(RR) Rotating left',
      rotateLeftRight: '(LR) Rotating left child left',
      rotateRightLeft: '(RL) Rotating right child right',
      rebalanceLeft: '(LL) Rotating right',
      rebalanceRight: '(RR) Rotating left',
      uncleRed: '(Red Uncle) Recoloring',
      uncleBlackRotateParentLeft: '(Black Uncle) Rotating parent left',
      uncleBlackRotateParentRight: '(Black Uncle) Rotating parent right',
      uncleBlackRotateGrandparentLeft: '(Black Uncle) Rotating grandparent left',
      uncleBlackRotateGrandparentRight: '(Black Uncle) Rotating grandparent right',
      uncleBlackRecolor: '(Black Uncle) Recoloring',
      oneChildRecolor: '(1 child) Recoloring',
      rootBlack: 'Root colored black',
      fixupStart: 'Black node deleted. Fixup required (Double Black).',
      fixupCase1: '(Case 1) Sibling is Red. Rotating to make sibling Black.',
      fixupCase2: '(Case 2) Sibling and children are Black. Propagating Black up.',
      fixupCase3: '(Case 3) Sibling Black, near child Red. Rotating to align.',
      fixupCase4: '(Case 4) Sibling Black, far child Red. Final rotation.',
    },
  },
  hu: {
    app: {
      skipToContent: 'Ugrás a tartalomhoz',
    },
    startPage: {
      title: 'TreeViz',
      subtitle: 'Fa Adatszerkezet Vizualizáló',
      placeholder: 'Kezdeti beszúrások (pl.: 5, 1, 8, 1, 7, 2, 0, -1)',
      startButton: 'Start',
      selectTreePrompt: 'Kérem válasszon ki legalább egy fa típust.',
      inputInvalidPrompt: 'Adjon meg helyes formátumot (zöld körvonal)'
    },
    trees: {
      bst: 'Bináris keresőfa',
      avl: 'AVL Fa',
      rb: 'Piros-Fekete Fa',
      b: 'B Fa',
    },
    controls: {
      insert: 'Insert',
      search: 'Search',
      delete: 'Delete',
      placeholder: 'Value',
      jumpToStart: 'Ugrás az elejére',
      previousStep: 'Előző lépés',
      play: 'Lejátszás',
      pause: 'Szünet',
      nextStep: 'Következő lépés',
      jumpToEnd: 'Ugrás a végére',
      selectStep: 'Lépés kiválasztása',
      playbackSpeed: 'Lejátszási sebesség',
      fullscreenMode: 'Teljes képernyős mód',
      exitFullscreen: 'Kilépés (Esc)',
      downloadSVG: 'SVG letöltése',
      preorder: 'Preorder',
      inorder: 'Inorder',
      postorder: 'Postorder'
    },
    logs: {
      title: 'LOG',
      operationHistory: 'Művelet Előzmények',
      step: 'Lépés',
      startSearch: 'Keresés indítása: {value}',
      notFound: 'A {value} szám nem található.',
      examining: 'Vizsgálom: {value}',
      found: 'A {value} szám megtalálva.',
      alreadyExists: 'A {value} már szerepel a fában.',
      rootCreated: 'Gyökér létrehozva: {value}',
      insertLeft: '{value} beszúrva balra a(z) {parent} alá.',
      insertRight: '{value} beszúrva jobbra a(z) {parent} alá.',
      nodeFound: '{value} megtalálva.',
      leafDeleted: 'Levélelem ({value}) törölve.',
      rootDeleted: 'Gyökér törölve: {value}',
      oneChildDeleted: 'Egygyerekes elem ({value}) törölve.',
      replaceNode: 'Törlendő elem helyettesítése: {value}',
      twoChildrenDeleted: 'Kétgyerekes elem ({value}) törölve.',
      rotateRight: '(LL) Jobbra forgatás',
      rotateLeft: '(RR) Balra forgatás',
      rotateLeftRight: '(LR) Bal gyerek balra forgatása',
      rotateRightLeft: '(RL) Jobb gyerek jobbra forgatása',
      rebalanceLeft: '(LL) Jobbra forgatás',
      rebalanceRight: '(RR) Balra forgatás',
      uncleRed: '(Piros nagybácsi) átszínezés',
      uncleBlackRotateParentLeft: '(Fekete nagybácsi) Balra forgatás a szülőn',
      uncleBlackRotateParentRight: '(Fekete nagybácsi) Jobbra forgatás a szülőn',
      uncleBlackRotateGrandparentLeft: '(Fekete nagybácsi) Balra forgatás a nagyszülőn',
      uncleBlackRotateGrandparentRight: '(Fekete nagybácsi) Jobbra forgatás a nagyszülőn',
      uncleBlackRecolor: '(Fekete nagybácsi) átszínezés',
      oneChildRecolor: '(1 gyerek) átszínezés',
      rootBlack: 'Gyökér feketére színezve',
      fixupStart: 'Fekete elem törölve. Helyreállítás (Dupla Fekete).',
      fixupCase1: '(1. eset) A testvér Piros. Forgatás, hogy a testvér Fekete legyen.',
      fixupCase2: '(2. eset) A testvér és gyerekei Feketék. Fekete továbbadása fel.',
      fixupCase3: '(3. eset) A testvér Fekete, a közelebbi gyerek Piros. Forgatás.',
      fixupCase4: '(4. eset) A testvér Fekete, a távolabbi gyerek Piros. Végső forgatás.',
    },
  },
};

let currentLanguage: Language = 'hu';

export function setLanguage(lang: Language) {
  currentLanguage = lang;
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function t(key: string, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];

  for (const k of keys) {
    value = value?.[k];
  }

  let text = value || key;

  if (params && typeof text === 'string') {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
    });
  }

  return text;
}