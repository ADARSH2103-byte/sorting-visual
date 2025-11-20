const arrayContainer = document.getElementById("arrayContainer");
const generateArrayBtn = document.getElementById("generateArray");
const bubbleSortBtn = document.getElementById("bubbleSort");
const selectionSortBtn = document.getElementById("selectionSort");
const insertionSortBtn = document.getElementById("insertionSort");
const quickSortBtn = document.getElementById("quickSort");
const mergeSortBtn = document.getElementById("mergeSort");
const arraySizeInput = document.getElementById("arraySize");

let array = [];

// Generate Random Array
function generateArray(size = 50) {
  array = [];
  arrayContainer.innerHTML = '';
  for (let i = 0; i < size; i++) {
    const value = Math.floor(Math.random() * 300) + 10;
    array.push(value);

    const bar = document.createElement('div');
    bar.classList.add('array-bar');
    bar.style.height = `${value}px`;
    arrayContainer.appendChild(bar);
  }
}

// Sleep function for animation
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Update bars with optional coloring
function updateBars(bars, indices = [], type = 'compare') {
  for (let i = 0; i < bars.length; i++) {
    bars[i].style.height = `${array[i]}px`;
    bars[i].classList.remove('compare', 'swap', 'sorted');
    if (indices.includes(i)) bars[i].classList.add(type);
  }
}

// Disable buttons during sorting
function disableButtons() {
  document.querySelectorAll('button').forEach(btn => btn.disabled = true);
}

function enableButtons() {
  document.querySelectorAll('button').forEach(btn => btn.disabled = false);
}

// Bubble Sort
async function bubbleSort() {
  disableButtons();
  const bars = document.getElementsByClassName('array-bar');
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      updateBars(bars, [j, j + 1], 'compare');
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        updateBars(bars, [j, j + 1], 'swap');
      }
      await sleep(20);
    }
    updateBars(bars, [array.length - i - 1], 'sorted');
  }
  updateBars(bars, [...Array(array.length).keys()], 'sorted');
  enableButtons();
}

// Selection Sort
async function selectionSort() {
  disableButtons();
  const bars = document.getElementsByClassName('array-bar');
  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < array.length; j++) {
      updateBars(bars, [minIdx, j], 'compare');
      if (array[j] < array[minIdx]) minIdx = j;
      await sleep(20);
    }
    if (minIdx !== i) [array[i], array[minIdx]] = [array[minIdx], array[i]];
    updateBars(bars, [i, minIdx], 'swap');
    await sleep(20);
  }
  updateBars(bars, [...Array(array.length).keys()], 'sorted');
  enableButtons();
}

// Insertion Sort
async function insertionSort() {
  disableButtons();
  const bars = document.getElementsByClassName('array-bar');
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      updateBars(bars, [j, j + 1], 'swap');
      j--;
      await sleep(20);
    }
    array[j + 1] = key;
    updateBars(bars, [j + 1], 'sorted');
    await sleep(20);
  }
  updateBars(bars, [...Array(array.length).keys()], 'sorted');
  enableButtons();
}

// Quick Sort
async function quickSortWrapper() {
  disableButtons();
  const bars = document.getElementsByClassName('array-bar');

  async function quickSort(start, end) {
    if (start >= end) return;
    let pivotIndex = await partition(start, end);
    await quickSort(start, pivotIndex - 1);
    await quickSort(pivotIndex + 1, end);
  }

  async function partition(start, end) {
    let pivot = array[end];
    let i = start - 1;
    for (let j = start; j < end; j++) {
      updateBars(bars, [j, end], 'compare');
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        updateBars(bars, [i, j], 'swap');
      }
      await sleep(20);
    }
    [array[i + 1], array[end]] = [array[end], array[i + 1]];
    updateBars(bars, [i + 1, end], 'swap');
    await sleep(20);
    return i + 1;
  }

  await quickSort(0, array.length - 1);
  updateBars(bars, [...Array(array.length).keys()], 'sorted');
  enableButtons();
}

// Merge Sort
async function mergeSortWrapper() {
  disableButtons();
  const bars = document.getElementsByClassName('array-bar');

  async function mergeSort(start, end) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
  }

  async function merge(start, mid, end) {
    let left = array.slice(start, mid + 1);
    let right = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
      updateBars(bars, [k], 'compare');
      await sleep(20);
      if (left[i] <= right[j]) array[k++] = left[i++];
      else array[k++] = right[j++];
      updateBars(bars, [k - 1], 'swap');
    }

    while (i < left.length) array[k++] = left[i++];
    while (j < right.length) array[k++] = right[j++];

    updateBars(bars);
    await sleep(20);
  }

  await mergeSort(0, array.length - 1);
  updateBars(bars, [...Array(array.length).keys()], 'sorted');
  enableButtons();
}

// Event Listeners
generateArrayBtn.addEventListener('click', () => generateArray(arraySizeInput.value));
bubbleSortBtn.addEventListener('click', bubbleSort);
selectionSortBtn.addEventListener('click', selectionSort);
insertionSortBtn.addEventListener('click', insertionSort);
quickSortBtn.addEventListener('click', quickSortWrapper);
mergeSortBtn.addEventListener('click', mergeSortWrapper);
arraySizeInput.addEventListener('input', () => generateArray(arraySizeInput.value));

// Initialize
generateArray();