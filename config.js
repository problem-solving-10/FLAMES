/**
 * EMOTIONAL CONFIG
 * Controls only: presentation, wording, visuals, mood.
 * NEVER changes the algorithm result.
 */
const FLAMES_CONFIG = {
  F: {
    title:     'FRIENDS',
    emoji:     '💙',
    headline:  'Looks like you two have a beautiful friendship vibe! 💙',
    sub:       'Sometimes the best connections begin with friendship, trust, and a lot of laughter.',
    gradient:  'linear-gradient(135deg, #4facfe 0%, #a18cd1 100%)',
    bg:        'linear-gradient(160deg, #e8f4ff 0%, #ede0ff 50%, #f0f8ff 100%)',
    cardBg:    'rgba(79,172,254,0.08)',
    glow:      '#4facfe',
    particles: ['💙','🌟','✨','😊','🤝','💫','⭐','🌙'],
    confetti:  false,
    revealAnim:'friend-anim',
    shareMsg:  (n1, n2) =>
      `💙 Our FLAMES result is FRIENDS!\nWe put "${n1}" and "${n2}" into the FLAMES game and apparently we're best friends! 😊\n🔥 Try yours!`
  },
  L: {
    title:     'LOVERS',
    emoji:     '❤️',
    headline:  'Whoa… there\'s some serious romantic energy here! ❤️',
    sub:       'FLAMES says Lovers — but what really matters is the connection you build together.',
    gradient:  'linear-gradient(135deg, #ff6b9d 0%, #ff4d7e 100%)',
    bg:        'linear-gradient(160deg, #ffe0ec 0%, #ffd6e8 50%, #fff0f5 100%)',
    cardBg:    'rgba(255,107,157,0.08)',
    glow:      '#ff6b9d',
    particles: ['❤️','💕','💗','🌹','✨','💖','🫀','🌸'],
    confetti:  true,
    revealAnim:'lover-anim',
    shareMsg:  (n1, n2) =>
      `❤️ Our FLAMES result is LOVERS!\nWe put "${n1}" and "${n2}" into the FLAMES game and it said Lovers… 😍\n🔥 Try yours!`
  },
  A: {
    title:     'AFFECTION',
    emoji:     '💕',
    headline:  'There\'s a sweet affection between you two! 💕',
    sub:       'Sometimes a little care and warmth can mean a lot. You bring out the best in each other.',
    gradient:  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    bg:        'linear-gradient(160deg, #ffe8f5 0%, #fff0f8 50%, #ffeaf0 100%)',
    cardBg:    'rgba(240,147,251,0.08)',
    glow:      '#f093fb',
    particles: ['💕','🌸','✨','💗','🌷','💓','🫶','🎀'],
    confetti:  false,
    revealAnim:'affection-anim',
    shareMsg:  (n1, n2) =>
      `💕 Our FLAMES result is AFFECTION!\n"${n1}" and "${n2}" — there's some real warmth there! 🥰\n🔥 Try yours!`
  },
  M: {
    title:     'MARRIAGE',
    emoji:     '💍',
    headline:  'Whoa… FLAMES chose Marriage! 💍❤️',
    sub:       'That\'s quite a result! Whether it means anything is entirely up to the two of you. 😄',
    gradient:  'linear-gradient(135deg, #f7971e 0%, #e8b86d 100%)',
    bg:        'linear-gradient(160deg, #fff8e8 0%, #fff3e0 50%, #fdf0f8 100%)',
    cardBg:    'rgba(247,151,30,0.08)',
    glow:      '#f7971e',
    particles: ['💍','✨','🎉','💛','⭐','🌟','👑','🥂'],
    confetti:  true,
    revealAnim:'marriage-anim',
    shareMsg:  (n1, n2) =>
      `💍 Our FLAMES result is MARRIAGE!\n"${n1}" and "${n2}" and FLAMES went ALL IN! 😱\n🔥 Try yours!`
  },
  E: {
    title:     'ENEMIES',
    emoji:     '😂',
    headline:  'Uh-oh… a little chaos detected! 😂🔥',
    sub:       'Don\'t take it seriously! Every great duo can have a little friendly rivalry. It\'s all in good fun!',
    gradient:  'linear-gradient(135deg, #ff9a56 0%, #ff6348 100%)',
    bg:        'linear-gradient(160deg, #fff3e0 0%, #ffe8d6 50%, #fff0e0 100%)',
    cardBg:    'rgba(255,99,72,0.08)',
    glow:      '#ff6348',
    particles: ['😂','🔥','⚡','🎭','😜','✨','💥','🤣'],
    confetti:  false,
    revealAnim:'enemy-anim',
    shareMsg:  (n1, n2) =>
      `😂 Our FLAMES result is ENEMIES!\n"${n1}" and "${n2}" — apparently we're rivals! 🤣\n🔥 Try yours!`
  },
  S: {
    title:     'SIBLINGS',
    emoji:     '😄',
    headline:  'Looks like sibling energy! 😄💙',
    sub:       'Comfortable, chaotic, and always ready to annoy each other — in the most delightful way.',
    gradient:  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    bg:        'linear-gradient(160deg, #e8f8ff 0%, #e0f0ff 50%, #fffde8 100%)',
    cardBg:    'rgba(67,233,123,0.08)',
    glow:      '#43e97b',
    particles: ['😄','💛','⭐','🌟','✨','🎈','🙌','😆'],
    confetti:  false,
    revealAnim:'sibling-anim',
    shareMsg:  (n1, n2) =>
      `😄 Our FLAMES result is SIBLINGS!\n"${n1}" and "${n2}" — total sibling vibes! 😂\n🔥 Try yours!`
  }
};

const NUMBER_WORDS = [
  '', 'One', 'Two', 'Three', 'Four', 'Five',
  'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
  'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'
];

function numWord(n) {
  if (n === 0) return 'Zero';
  if (n <= 20) return NUMBER_WORDS[n];
  return String(n);
}

const ELIM_MESSAGES = [
  (l) => `Oops… ${l} is out! 😳`,
  (l) => `That's another one gone… ${l} didn't make it. 👀`,
  (l) => `${l} is eliminated! Things are getting serious now… 🎭`,
  (l) => `Only two possibilities left now! ${l} steps aside. 😱`,
  (l) => `Okay… this is it. The final answer is almost here. ❤️`
];

function elimMessage(round, letter) {
  const idx = Math.min(round, ELIM_MESSAGES.length - 1);
  return ELIM_MESSAGES[idx](letter);
}
