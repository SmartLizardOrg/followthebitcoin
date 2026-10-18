// Primary-source history, with deliberately fictional, non-payable exhibits.
export const giveawaySources = {
  charges: {
    title: 'DOJ · July 2020 charges and description of the Twitter hack',
    url: 'https://www.justice.gov/usao-ndca/pr/three-individuals-charged-alleged-roles-twitter-hack',
  },
  affidavit: {
    title: '2021 O’Connor criminal complaint · affidavit (PDF)',
    url: 'https://www.justice.gov/d9/press-releases/attachments/2021/07/21/o_connor_complaint.pdf',
  },
  records: {
    title: '2020 investigator affidavit · corroborating records (PDF)',
    url: 'https://www.justice.gov/d9/press-releases/attachments/2020/07/31/download_fazeli_complaint_0.pdf',
  },
  sentence: {
    title: 'DOJ · June 2023 O’Connor sentencing',
    url: 'https://www.justice.gov/usao-ndca/pr/uk-citizen-sentenced-five-years-cybercrime-offenses',
  },
};

export const giveawayStages = [
  {
    id: 'same-destination',
    name: 'The promise',
    stamp: 'TWO PUBLIC POSTS',
    title: 'Two famous accounts.\nOne strange promise.',
    story:
      'It is July 15, 2020. Familiar accounts are promoting a bitcoin giveaway. You are checking the public posts, without access to anyone’s private messages or account records.',
    knowledge:
      'Two invented posts, from Famous account A and Famous account B, both advertise the same non-payable label: GIVEAWAY ADDRESS. You have no information about who controls either account or the destination.',
    question: 'Both posts name the same destination. What does that establish?',
    answers: [
      {
        id: 'endorsement',
        text: 'Both famous people genuinely endorse the giveaway.',
      },
      {
        id: 'destination',
        text: 'The two public appeals point to the same payment destination.',
      },
      {
        id: 'identity',
        text: 'The destination reveals the attacker’s legal name.',
      },
    ],
    correct: 'destination',
    explanation:
      'You can link the appeals by their shared destination. That does not tell you who wrote them or who controls the bitcoin. In the real case, the DOJ described compromised Twitter accounts promoting a fake “double your bitcoin” offer. A familiar account was not proof of a genuine endorsement.',
    takeaway:
      'A shared public payment destination links the appeals. It does not authenticate the speaker or identify the recipient.',
    newWord: 'Bitcoin address',
    definition:
      'A destination used to receive bitcoin. It is not a person’s name, and one person or service can use many addresses. Our label is a non-payable placeholder.',
    source: 'charges',
    sourceNote:
      'The July 2020 DOJ announcement describes the hack as alleged in the complaints. These account labels and posts are invented teaching illustrations, not historical screenshots or exact quotations.',
  },
  {
    id: 'transfers-not-people',
    name: 'The payments',
    stamp: 'PUBLIC TRANSFER RECORD',
    title: 'Three transfers arrive.\nHow many people paid?',
    story:
      'Now inspect a tiny example of the public payment record. Each row is a transfer to the advertised destination. The record gives you no names and no account ownership records.',
    knowledge:
      'You can see three invented incoming transfers. There is no evidence telling you how many people or services sent them.',
    question:
      'Do these three incoming transfers prove that three different people paid?',
    answers: [
      {
        id: 'three-people',
        text: 'Yes. Each transfer must be a different person.',
      },
      {
        id: 'one-person',
        text: 'No. The same destination proves only one person paid.',
      },
      {
        id: 'not-headcount',
        text: 'No. A transfer count is not a count of people.',
      },
    ],
    correct: 'not-headcount',
    explanation:
      'A person can send more than once, and a service can send on behalf of different customers. These rows show payment events. They do not give you a reliable headcount, legal identities or a complete explanation of why each transfer happened.',
    takeaway:
      'Count transactions as transactions. More evidence is needed before turning them into a count of people.',
    newWord: 'Public ledger',
    definition:
      'Bitcoin’s shared record of transactions. Anyone can inspect it, but it is not a register of people or verified social media accounts.',
    source: 'affidavit',
    sourceNote:
      'The 2021 investigator affidavit, paragraphs 31–32, reports incoming and outgoing transactions associated with the scam address. Our three rows are invented, not the case’s transaction count or victim count.',
  },
  {
    id: 'public-receipt',
    name: 'Your footprint',
    stamp: 'WHAT-IF PRIVACY EXPERIMENT',
    title: 'The receipt is yours.\nWho else can connect it?',
    story:
      'Step outside the historical case for a fictional privacy experiment. Imagine you have a receipt referring to one of those transfers. Compare keeping it private with attaching it to a public profile.',
    knowledge:
      'In the private version, the receipt adds no public profile link. In the public version, an observer can read a profile’s post and its attached receipt, including the reference to Transfer 02. They have no other wallet or identity information.',
    question: 'What extra connection does the public post reveal?',
    answers: [
      {
        id: 'profile-link',
        text: 'A public connection between the profile and the referenced transfer.',
      },
      {
        id: 'all-wallets',
        text: 'Proof that the profile owner controls every related wallet.',
      },
      {
        id: 'no-link',
        text: 'Nothing. Receipts cannot add information to a public payment trail.',
      },
    ],
    correct: 'profile-link',
    explanation:
      'The post supplies context that Bitcoin’s record did not contain: a profile publicly associates itself with a particular transfer. That is a useful link, not proof of legal identity, ownership of every connected address or the truth of every claim in a post. Keeping a receipt private does not erase the public transaction; it avoids adding this public profile link.',
    takeaway:
      'Before sharing a payment receipt, check which transaction details it connects to your public profile.',
    newWord: 'Off-chain clue',
    definition:
      'Information outside Bitcoin’s transaction record, such as a public post or a receipt. It can add context to a transaction without proving every conclusion about its owner.',
    source: 'records',
    sourceNote:
      'The 2020 investigator affidavit in the Fazeli complaint, paragraphs 50–55, describes a public address, provider records and corroborating evidence. Our receipt comparison is an invented privacy exercise, not an actual exhibit or a claim that investigators used this receipt method.',
  },
] as const;

export type GiveawayState = {
  index: number;
  phase: 'briefing' | 'investigate' | 'reveal' | 'complete';
  opened: boolean;
  receiptShared: boolean;
  explored: boolean;
  answers: string[];
};
export type GiveawayAction =
  | { type: 'begin' }
  | { type: 'open' }
  | { type: 'compare'; shared: boolean }
  | { type: 'answer'; id: string }
  | { type: 'next' }
  | { type: 'reset' };

export const initialGiveaway: GiveawayState = {
  index: 0,
  phase: 'briefing',
  opened: false,
  receiptShared: false,
  explored: false,
  answers: [],
};

export function gradeGiveawayAnswer(index: number, id: string): boolean {
  const stage = giveawayStages[index];
  if (!stage || !stage.answers.some((answer) => answer.id === id))
    throw new Error('Unknown giveaway answer');
  return stage.correct === id;
}

export function giveawayReducer(
  state: GiveawayState,
  action: GiveawayAction,
): GiveawayState {
  if (action.type === 'reset') return { ...initialGiveaway, answers: [] };
  if (action.type === 'begin' && state.phase === 'briefing')
    return { ...state, phase: 'investigate' };
  if (action.type === 'open' && state.phase === 'investigate')
    return state.opened ? state : { ...state, opened: true };
  if (
    action.type === 'compare' &&
    state.phase === 'investigate' &&
    state.index === 2 &&
    state.opened &&
    state.receiptShared !== action.shared
  )
    return { ...state, receiptShared: action.shared, explored: true };
  if (
    action.type === 'answer' &&
    state.phase === 'investigate' &&
    state.opened &&
    (state.index !== 2 || state.explored)
  ) {
    gradeGiveawayAnswer(state.index, action.id);
    return {
      ...state,
      phase: 'reveal',
      answers: [...state.answers, action.id],
    };
  }
  if (action.type === 'next' && state.phase === 'reveal')
    return state.index === giveawayStages.length - 1
      ? { ...state, phase: 'complete' }
      : {
          ...state,
          index: state.index + 1,
          phase: 'investigate',
          opened: false,
          receiptShared: false,
          explored: false,
        };
  return state;
}
