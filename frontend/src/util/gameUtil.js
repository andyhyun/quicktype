export const createRandomPrompt = (numWords) => {
  const words = [
    'the', 'be', 'and', 'a', 'of', 'to', 'in', 'I', 'you', 'it',
    'have', 'run', 'that', 'for', 'do', 'he', 'with', 'on', 'this', 'we',
    'night', 'not', 'but', 'they', 'say', 'at', 'what', 'number', 'from', 'go',
    'or', 'by', 'get', 'write', 'my', 'can', 'as', 'know', 'if', 'me',
    'your', 'all', 'who', 'case', 'their', 'will', 'lot', 'would', 'make', 'just',
    'up', 'think', 'time', 'book', 'see', 'live', 'bring', 'five', 'one', 'come',
    'people', 'take', 'year', 'job', 'them', 'some', 'want', 'how', 'when', 'which',
    'now', 'hold', 'other', 'could', 'our', 'into', 'here', 'then', 'than', 'look',
    'way', 'bad', 'these', 'no', 'thing', 'well', 'because', 'also', 'two', 'use',
    'tell', 'good', 'first', 'about', 'day', 'find', 'give', 'more', 'new', 'four',
    'us', 'any', 'those', 'very', 'city', 'need', 'back', 'there', 'should', 'even',
    'only', 'many', 'really', 'work', 'life', 'why', 'right', 'down', 'ever', 'try',
    'let', 'something', 'too', 'call', 'game', 'may', 'still', 'through', 'mean', 'after',
    'never', 'nope', 'world', 'inn', 'feel', 'yeah', 'great', 'last', 'child', 'oh',
    'over', 'ask', 'move', 'money', 'school', 'state', 'much', 'talk', 'out', 'keep',
    'leave', 'put', 'like', 'help', 'big', 'read', 'same', 'tall', 'own', 'while',
    'start', 'three', 'high', 'every', 'another', 'become', 'most', 'between', 'happen', 'family',
    'word', 'president', 'old', 'yes', 'house', 'show', 'again', 'student', 'so', 'seem',
    'might', 'part', 'hear', 'its', 'place', 'problem', 'where', 'believe', 'country', 'always',
    'week', 'point', 'hand', 'off', 'play', 'turn', 'few', 'group', 'such', 'against'
  ];

  const randomPromptWords = Array.from({length: numWords}, () => words[Math.floor(Math.random() * words.length)]);
  const randomPromptDivs = randomPromptWords.map((word) => <div>{word}</div>);

  return [randomPromptWords, randomPromptDivs];
}

export const wordStartIsSame = (str, reference) => {
  if (str.length > reference.length) {
    return false;
  }

  return str.substring(0, str.length) === reference.substring(0, str.length);
}

export const removeLastWord = (str) => {
  return str.substring(0, str.trim().lastIndexOf(' ') + 1);
}

export const combineStringAndKey = (str, key, ctrlPressed, altPressed) => {
  if (key === 'Backspace') {
    if (ctrlPressed) {
      if (str.trim().lastIndexOf(' ') !== -1) {
        return removeLastWord(str);
      }
      return '';
    }
    return str.slice(0, -1);
  } else if (ctrlPressed || altPressed) {
    return str;
  }

  return str + ((key.length === 1 && key !== ' ') ? key : '')
}
