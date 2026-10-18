'use client';

import { useEffect, useRef, type Dispatch } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  FileSearch,
  FolderClosed,
  Lightbulb,
  LockKeyhole,
  MessageSquare,
  Radio,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  giveawaySources,
  giveawayStages,
  gradeGiveawayAnswer,
  type GiveawayAction,
  type GiveawayState,
} from '@/lib/fake-giveaway';
import { BadgeCard } from './badge-card';

const exhibits = [
  {
    title: 'The public posts',
    action: 'Open the public posts',
    Icon: MessageSquare,
  },
  {
    title: 'The payment record',
    action: 'Open the payment record',
    Icon: FileSearch,
  },
  {
    title: 'Your receipt experiment',
    action: 'Open the receipt experiment',
    Icon: ReceiptText,
  },
] as const;

function PublicPosts() {
  return (
    <>
      <p className="giveaway-exhibit-notice">
        Invented posts · not historical screenshots
      </p>
      <div className="giveaway-posts">
        {['A', 'B'].map((account) => (
          <article className="giveaway-post" key={account}>
            <div className="giveaway-profile">
              <span className="giveaway-avatar" aria-hidden="true">
                <UserRound size={20} />
              </span>
              <div>
                <strong>Famous account {account}</strong>
                <span>Illustrative public post</span>
              </div>
            </div>
            <span className="giveaway-scam-label">THE SCAM’S PROMISE</span>
            <p>“Send bitcoin. Get double back.”</p>
            <div className="giveaway-destination">
              <ArrowDown size={15} aria-hidden="true" />
              <span>GIVEAWAY ADDRESS</span>
            </div>
          </article>
        ))}
      </div>
      <p className="giveaway-observation">
        <Radio size={18} aria-hidden="true" />
        Two appeals. The same advertised destination.
      </p>
      <p className="giveaway-exhibit-notice">
        GIVEAWAY ADDRESS is a non-payable label, not a real address.
      </p>
    </>
  );
}

function TransferRecord() {
  return (
    <>
      <p className="giveaway-exhibit-notice">
        Invented sample · not the real case’s totals
      </p>
      <ol
        className="giveaway-transfers"
        aria-label="Three illustrative incoming transfers"
      >
        {['01', '02', '03'].map((number) => (
          <li key={number}>
            <span className="giveaway-transfer-icon" aria-hidden="true">
              <ArrowDown size={19} />
            </span>
            <div>
              <strong>Transfer {number}</strong>
              <span>Incoming · GIVEAWAY ADDRESS</span>
            </div>
            <span className="giveaway-recorded">Recorded</span>
          </li>
        ))}
      </ol>
      <div className="giveaway-count">
        <strong>3</strong>
        <span>transfer events</span>
      </div>
      <p className="giveaway-exhibit-notice">
        No names or ownership records are supplied.
      </p>
    </>
  );
}

function ReceiptExperiment({
  game,
  dispatch,
}: {
  game: GiveawayState;
  dispatch: Dispatch<GiveawayAction>;
}) {
  return (
    <>
      <p className="giveaway-exhibit-notice">
        Invented what-if · not historical case evidence
      </p>
      <fieldset
        className="giveaway-compare"
        aria-label="Preview how the receipt is shared"
      >
        <button
          type="button"
          aria-pressed={!game.receiptShared}
          disabled={game.phase !== 'investigate'}
          onClick={() => dispatch({ type: 'compare', shared: false })}
        >
          <LockKeyhole size={16} aria-hidden="true" />
          Private receipt
        </button>
        <button
          type="button"
          aria-pressed={game.receiptShared}
          disabled={game.phase !== 'investigate'}
          onClick={() => dispatch({ type: 'compare', shared: true })}
        >
          <MessageSquare size={16} aria-hidden="true" />
          Public post
        </button>
      </fieldset>
      <div
        className={`giveaway-receipt-scene${game.receiptShared ? ' is-public' : ''}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {game.receiptShared && (
          <div className="giveaway-public-profile">
            <UserRound size={22} aria-hidden="true" />
            <div>
              <strong>Example public profile</strong>
              <span>“Here is my payment receipt.”</span>
            </div>
            <span className="giveaway-public-label">PUBLIC</span>
          </div>
        )}
        <div className="giveaway-receipt">
          <span className="giveaway-receipt-top">
            <ReceiptText size={20} aria-hidden="true" />
            SAMPLE PAYMENT RECEIPT
          </span>
          <dl>
            <div>
              <dt>Payment reference</dt>
              <dd>TRANSFER 02</dd>
            </div>
            <div>
              <dt>Destination</dt>
              <dd>GIVEAWAY ADDRESS</dd>
            </div>
          </dl>
          <span className="giveaway-receipt-edge" aria-hidden="true" />
        </div>
        <p className="giveaway-receipt-result">
          {game.receiptShared
            ? 'Public observer: this profile has posted a receipt pointing to Transfer 02.'
            : 'You keep the receipt private. This example adds no public profile link to Transfer 02.'}
        </p>
      </div>
      {!game.explored && (
        <p className="giveaway-try-hint">
          <ArrowUpRight size={17} aria-hidden="true" />
          Preview “Public post” to compare what an observer learns.
        </p>
      )}
      {game.explored && (
        <p className="giveaway-try-hint">
          <Check size={17} aria-hidden="true" />
          Comparison explored. You can now choose your conclusion.
        </p>
      )}
      <p className="giveaway-exhibit-notice">
        Simulation only. No profile, receipt or payment is created or uploaded.
      </p>
    </>
  );
}

function GiveawayBoard({
  game,
  dispatch,
}: {
  game: GiveawayState;
  dispatch: Dispatch<GiveawayAction>;
}) {
  const exhibit = exhibits[game.index];
  const exhibitHeading = useRef<HTMLHeadingElement>(null);
  const Icon = exhibit.Icon;
  useEffect(() => {
    if (game.opened) exhibitHeading.current?.focus({ preventScroll: true });
  }, [game.opened, game.index]);
  return (
    <section
      className="giveaway-board"
      aria-label={`${exhibit.title} evidence`}
    >
      <header className="giveaway-board-header">
        <span>
          <span className="giveaway-signal-dot" aria-hidden="true" />
          CASE 03
        </span>
        <span>EXHIBIT 0{game.index + 1} / 03</span>
      </header>
      {game.opened ? (
        <div className="giveaway-board-content">
          <div className="giveaway-exhibit-heading">
            <span>{giveawayStages[game.index].stamp}</span>
            <h3 ref={exhibitHeading} tabIndex={-1}>
              <Icon size={24} aria-hidden="true" />
              {exhibit.title}
            </h3>
          </div>
          {game.index === 0 ? (
            <PublicPosts />
          ) : game.index === 1 ? (
            <TransferRecord />
          ) : (
            <ReceiptExperiment game={game} dispatch={dispatch} />
          )}
        </div>
      ) : (
        <button
          className="giveaway-envelope"
          type="button"
          onClick={() => dispatch({ type: 'open' })}
        >
          <span className="giveaway-envelope-label">
            EVIDENCE READY TO INSPECT
          </span>
          <span className="giveaway-envelope-icon" aria-hidden="true">
            <FolderClosed size={53} strokeWidth={1.2} />
            <Icon size={23} />
          </span>
          <strong>
            {exhibit.action}
            <ArrowUpRight size={21} aria-hidden="true" />
          </strong>
          <span>Look closely. What does the evidence actually support?</span>
          <span className="giveaway-envelope-number" aria-hidden="true">
            0{game.index + 1}
          </span>
        </button>
      )}
      <p className="giveaway-board-footnote">
        Teaching illustrations. No real address, account, funds or wallet
        connection.
      </p>
    </section>
  );
}

export function GiveawayTeaser() {
  return (
    <div
      className="giveaway-teaser"
      aria-label="The Fake Giveaway: public posts, a payment record and your privacy footprint"
    >
      <div className="giveaway-teaser-top">
        <span>
          <Radio size={16} aria-hidden="true" />
          CASE 03
        </span>
        <span>SPOT THE SIGNAL</span>
      </div>
      <div className="giveaway-teaser-accounts">
        <span>
          <UserRound size={22} aria-hidden="true" />
          Famous account A
        </span>
        <span>
          <UserRound size={22} aria-hidden="true" />
          Famous account B
        </span>
      </div>
      <div className="giveaway-teaser-connection" aria-hidden="true">
        <span />
        <ArrowDown size={20} />
        <span />
      </div>
      <div className="giveaway-teaser-destination">
        <Radio size={24} aria-hidden="true" />
        <div>
          <span>ONE SHARED DESTINATION</span>
          <strong>Follow the clue.</strong>
        </div>
      </div>
      <p>Fame can fool you. Evidence needs a closer look.</p>
    </div>
  );
}

export function FakeGiveaway({
  game,
  dispatch,
  onFirstClue,
}: {
  game: GiveawayState;
  dispatch: Dispatch<GiveawayAction>;
  onFirstClue: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const question = useRef<HTMLHeadingElement>(null);
  const stage = giveawayStages[game.index];
  useEffect(() => {
    if (game.phase === 'reveal')
      feedback.current?.focus({ preventScroll: false });
    else heading.current?.focus({ preventScroll: false });
  }, [game.index, game.phase]);

  if (game.phase === 'briefing')
    return (
      <main id="main-content" className="giveaway-quest giveaway-briefing">
        <a className="quiet-link" href="#quests">
          <ArrowLeft size={15} />
          All quests
        </a>
        <div className="giveaway-briefing-grid">
          <section>
            <span className="eyebrow">QUEST 03 · INSPIRED BY A REAL CASE</span>
            <h1 ref={heading} tabIndex={-1}>
              The Fake
              <br />
              <span>Giveaway.</span>
            </h1>
            <p className="giveaway-lead">
              A famous account. An impossible promise. A clue hiding in plain
              sight.
            </p>
            <p>
              On July 15, 2020, compromised Twitter accounts promoted a fake
              bitcoin giveaway. Inspect three evidence files, separate facts
              from assumptions, then test your own privacy footprint.
            </p>
            <Button
              className="primary-action"
              onClick={() => dispatch({ type: 'begin' })}
            >
              Investigate the giveaway
              <ArrowRight size={18} />
            </Button>
            <p className="start-note">
              4–6 minutes. No Bitcoin experience needed. Every guess helps you
              learn.
            </p>
            <div className="giveaway-facts" aria-label="Quest overview">
              <div>
                <strong>2020</strong>
                <span>The Twitter hack</span>
              </div>
              <div>
                <strong>3 clues</strong>
                <span>Your investigation</span>
              </div>
              <div>
                <strong>1 badge</strong>
                <span>Signal Sleuth</span>
              </div>
            </div>
          </section>
          <GiveawayTeaser />
        </div>
        <aside className="giveaway-reconstruction">
          <ShieldCheck size={22} aria-hidden="true" />
          <p>
            <strong>Real event. Clearly marked illustrations.</strong> Posts,
            account labels and payment rows are invented teaching examples. The
            final receipt experiment is a fictional what-if, not evidence from
            the historical investigation. No real accounts, addresses or funds
            are involved.
          </p>
        </aside>
        <a
          className="source-link"
          href={giveawaySources.charges.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          Read the historical case · DOJ July 2020
          <ArrowUpRight size={14} />
        </a>
      </main>
    );

  if (game.phase === 'complete')
    return (
      <main id="main-content" className="summary-main giveaway-quest">
        <span className="eyebrow">CASE CLOSED · QUEST 03</span>
        <h1 ref={heading} tabIndex={-1}>
          You spotted the signal.
          <br />
          <span>And checked its limits.</span>
        </h1>
        <BadgeCard quest="fake-giveaway" />
        <div className="takeaways giveaway-takeaways">
          {giveawayStages.map((item, index) => (
            <article key={item.id}>
              <span className="takeaway-number">
                0{index + 1} · {item.stamp}
              </span>
              <h2>
                {
                  [
                    'One destination. Which conclusion?',
                    'Transactions are not people.',
                    'A receipt can add a connection.',
                  ][index]
                }
              </h2>
              <p>{item.takeaway}</p>
            </article>
          ))}
        </div>
        <section className="giveaway-outcome">
          <span className="eyebrow">BACK TO THE REAL CASE</span>
          <h2>The famous accounts had been compromised.</h2>
          <p>
            The July 2020 DOJ announcement described a fake “double your
            bitcoin” offer posted through compromised Twitter accounts. The
            public payment record was one source of evidence; it could not, by
            itself, authenticate the posts or name every person involved.
          </p>
          <p>
            On June 23, 2023, Joseph James O’Connor was sentenced to five years
            for multiple cybercrime offenses, including his role in the Twitter
            hack. That combined sentence covered more than the giveaway; it is
            not a sentence for every person connected to the case.
          </p>
          <div className="giveaway-source-list">
            {Object.values(giveawaySources).map((source) => (
              <a
                className="resource-link"
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {source.title}
                <ArrowUpRight size={15} />
              </a>
            ))}
          </div>
        </section>
        <section className="giveaway-personal-lesson">
          <LockKeyhole size={25} aria-hidden="true" />
          <div>
            <h2>Keep the insight. Check your next share.</h2>
            <p>
              Be skeptical of “send money to get more back” promises, even from
              familiar accounts. Before publishing a payment screenshot, check
              the reference, address and profile it could connect. No wallet
              details are needed to keep learning here.
            </p>
          </div>
        </section>
        <div className="completion-links">
          <Button onClick={onFirstClue}>
            Try everyday privacy choices
            <ArrowRight size={17} />
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<a href="#quests" aria-label="All quests" />}
          >
            All quests
          </Button>
          <Button variant="ghost" onClick={() => dispatch({ type: 'reset' })}>
            <RotateCcw size={17} />
            Reopen the case
          </Button>
        </div>
      </main>
    );

  const correct =
    game.phase === 'reveal' &&
    gradeGiveawayAnswer(game.index, game.answers[game.index]);
  const source = giveawaySources[stage.source];
  const ready = game.opened && (game.index !== 2 || game.explored);
  return (
    <main id="main-content" className="game-main giveaway-quest">
      <div className="intro-line">
        <a className="quiet-link" href="#quests">
          <ArrowLeft size={15} />
          All quests
        </a>
        <span className="eyebrow">
          THE FAKE GIVEAWAY · FILE {game.index + 1} OF 3
        </span>
      </div>
      <div className="round-heading">
        <h1 ref={heading} tabIndex={-1}>
          {stage.title.split('\n')[0]}
          <br />
          <span>{stage.title.split('\n')[1]}</span>
        </h1>
        <p className="round-story">{stage.story}</p>
      </div>
      <ol className="steps" aria-label="Case progress">
        {giveawayStages.map((item, index) => (
          <li
            key={item.id}
            className={
              index === game.index
                ? 'current'
                : index < game.index
                  ? 'complete'
                  : ''
            }
            aria-current={index === game.index ? 'step' : undefined}
          >
            <span className="step-number">
              {index < game.index ? <Check size={16} /> : `0${index + 1}`}
            </span>
            <span>{item.name}</span>
            <span className="step-line" />
          </li>
        ))}
      </ol>
      <div className="game-grid">
        <div>
          <GiveawayBoard game={game} dispatch={dispatch} />
          {game.opened && (
            <>
              <details className="glossary giveaway-glossary">
                <summary>New word: {stage.newWord}</summary>
                <p>{stage.definition}</p>
              </details>
              {ready && game.phase === 'investigate' && (
                <button
                  type="button"
                  className="map-jump"
                  onClick={() => question.current?.focus()}
                >
                  Choose your conclusion
                  <ArrowRight size={16} />
                </button>
              )}
            </>
          )}
        </div>
        <section
          className="question-card giveaway-question"
          aria-labelledby="giveaway-question-title"
        >
          <div className="observer">
            <span className="observer-icon">
              <FileSearch size={23} aria-hidden="true" />
            </span>
            <div>
              <span className="eyebrow">YOUR VIEW · PUBLIC OBSERVER</span>
              <strong>
                {game.opened
                  ? stage.stamp
                  : 'Evidence sealed · ready to inspect'}
              </strong>
            </div>
          </div>
          <div className="question-divider" />
          <h2 id="giveaway-question-title" tabIndex={-1} ref={question}>
            {stage.question}
          </h2>
          {!game.opened && (
            <p className="giveaway-pending">
              Open the evidence file first. Look for what you can observe, and
              what remains unknown.
            </p>
          )}
          {game.opened && (
            <p className="giveaway-knowledge">{stage.knowledge}</p>
          )}
          {game.opened && !ready && (
            <p className="giveaway-pending">
              Try the “Public post” preview in the receipt experiment. Compare
              what an observer learns before choosing.
            </p>
          )}
          {ready && game.phase === 'investigate' && (
            <>
              <fieldset
                className="answer-options"
                aria-labelledby="giveaway-question-title"
              >
                {stage.answers.map((answer, index) => (
                  <button
                    className="answer-option"
                    type="button"
                    key={answer.id}
                    onClick={() => dispatch({ type: 'answer', id: answer.id })}
                  >
                    <span className="answer-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{answer.text}</span>
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                ))}
              </fieldset>
              <p className="under-button">
                Every answer opens the explanation. Your badge does not depend
                on a perfect score.
              </p>
            </>
          )}
          {game.phase === 'reveal' && (
            <div className="answer-reveal" ref={feedback} tabIndex={-1}>
              <div className="verdict">
                <Lightbulb size={21} aria-hidden="true" />
                <strong>
                  {correct
                    ? 'You followed the evidence.'
                    : 'Here is the distinction worth spotting.'}
                </strong>
              </div>
              <p className="explanation">{stage.explanation}</p>
              <div className="theory-recap">
                <span>Your conclusion</span>
                <p>
                  {
                    stage.answers.find(
                      (answer) => answer.id === game.answers[game.index],
                    )?.text
                  }
                </p>
                {!correct && (
                  <>
                    <span>The supported conclusion</span>
                    <p>
                      {
                        stage.answers.find(
                          (answer) => answer.id === stage.correct,
                        )?.text
                      }
                    </p>
                  </>
                )}
              </div>
              <p className="giveaway-source-note">{stage.sourceNote}</p>
              <a
                className="source-link"
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {game.index === 2
                  ? 'Historical background'
                  : 'Inspect the primary source'}
                {stage.source === 'affidavit' && ' (PDF)'}
                <ArrowUpRight size={14} />
              </a>
              <Button
                className="primary-action"
                onClick={() => dispatch({ type: 'next' })}
              >
                {game.index === 2
                  ? 'Claim your Signal Sleuth badge'
                  : 'Open the next evidence file'}
                <ArrowRight size={18} />
              </Button>
            </div>
          )}
        </section>
      </div>
      <div className="bottom-note">
        <span>
          <LockKeyhole size={15} />
          Your answers stay in this tab.
        </span>
        <span>Real history · invented exhibits · no wallet needed.</span>
      </div>
    </main>
  );
}
