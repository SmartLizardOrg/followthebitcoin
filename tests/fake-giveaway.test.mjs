import test from 'node:test';
import assert from 'node:assert/strict';
import {
  giveawayReducer,
  initialGiveaway,
  giveawayStages,
  gradeGiveawayAnswer,
} from '../lib/fake-giveaway.ts';

test('the Signal Sleuth badge requires all three files and the receipt comparison, even with wrong guesses', () => {
  let state = initialGiveaway;
  assert.equal(giveawayReducer(state, { type: 'next' }), state);
  assert.equal(giveawayReducer(state, { type: 'open' }), state);
  state = giveawayReducer(state, { type: 'begin' });
  for (const [index, stage] of giveawayStages.entries()) {
    const wrong = stage.answers.find(
      (answer) => answer.id !== stage.correct,
    ).id;
    assert.equal(giveawayReducer(state, { type: 'answer', id: wrong }), state);
    assert.equal(giveawayReducer(state, { type: 'next' }), state);
    assert.equal(
      giveawayReducer(state, { type: 'compare', shared: true }),
      state,
    );
    state = giveawayReducer(state, { type: 'open' });
    assert.equal(giveawayReducer(state, { type: 'open' }), state);
    if (index === 2) {
      assert.equal(
        giveawayReducer(state, { type: 'answer', id: wrong }),
        state,
      );
      assert.equal(
        giveawayReducer(state, { type: 'compare', shared: false }),
        state,
      );
      state = giveawayReducer(state, { type: 'compare', shared: true });
      assert.equal(state.explored, true);
      assert.equal(state.receiptShared, true);
      state = giveawayReducer(state, { type: 'compare', shared: false });
      assert.equal(state.explored, true);
    } else {
      assert.equal(
        giveawayReducer(state, { type: 'compare', shared: true }),
        state,
      );
    }
    state = giveawayReducer(state, { type: 'answer', id: wrong });
    assert.equal(state.phase, 'reveal');
    assert.equal(
      giveawayReducer(state, { type: 'answer', id: stage.correct }),
      state,
    );
    assert.equal(
      giveawayReducer(state, { type: 'compare', shared: true }),
      state,
    );
    state = giveawayReducer(state, { type: 'next' });
  }
  assert.equal(state.phase, 'complete');
  assert.equal(state.answers.length, 3);
  for (const action of [
    { type: 'next' },
    { type: 'begin' },
    { type: 'open' },
    { type: 'compare', shared: true },
  ])
    assert.equal(giveawayReducer(state, action), state);
  const reset = giveawayReducer(state, { type: 'reset' });
  assert.deepEqual(reset, initialGiveaway);
  assert.notEqual(reset.answers, initialGiveaway.answers);
  assert.deepEqual(initialGiveaway.answers, []);
});

test('each clue has exactly one supported answer and unknown answers cannot advance', () => {
  let state = giveawayReducer(initialGiveaway, { type: 'begin' });
  for (const [index, stage] of giveawayStages.entries()) {
    state = giveawayReducer(state, { type: 'open' });
    if (index === 2)
      state = giveawayReducer(state, { type: 'compare', shared: true });
    assert.throws(() =>
      giveawayReducer(state, { type: 'answer', id: 'invented-answer' }),
    );
    assert.equal(
      stage.answers.filter((answer) => gradeGiveawayAnswer(index, answer.id))
        .length,
      1,
    );
    assert.equal(gradeGiveawayAnswer(index, stage.correct), true);
    state = giveawayReducer(state, { type: 'answer', id: stage.correct });
    state = giveawayReducer(state, { type: 'next' });
  }
  assert.equal(state.phase, 'complete');
  assert.throws(() => gradeGiveawayAnswer(-1, 'profile-link'));
  assert.throws(() => gradeGiveawayAnswer(3, 'profile-link'));
});
