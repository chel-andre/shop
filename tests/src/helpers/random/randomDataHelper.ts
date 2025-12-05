const names = [
    'John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava',
    'Robert', 'Isabella', 'David', 'Mia', 'Joseph', 'Emily', 'Daniel',
    'Charlotte', 'Matthew', 'Amelia', 'Christopher', 'Evelyn'
];

export const generateRandomUsername = () => {
    const name = getRandomElementFromArray(names).toLowerCase();
    const number = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `${name}_${number}`;
};

export const getRandomNumber = (maxValue = 999999) =>
    Math.floor(Math.random() * maxValue);

export const getRandomString = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2);

function getRandomElementFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}