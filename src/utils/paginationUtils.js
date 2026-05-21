
export function buildPageWindow(currentPage, totalPages, maxVisible = 10) {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const result = [];
  
  // Near the start: 1, 2, 3, 4, 5, 6, 7, 8, ..., 20
  if (currentPage <= 5) {
    result.push(1, 2, 3, 4, 5, 6, 7, 8, '...', totalPages);
  } 
  // Near the end: 1, ..., 13, 14, 15, 16, 17, 18, 19, 20
  else if (currentPage >= totalPages - 4) {
    result.push(1, '...', totalPages - 7, totalPages - 6, totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } 
  // Somewhere in the middle: 1, ..., 8, 9, 10, 11, 12, ..., 20
  else {
    result.push(1, '...', currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, '...', totalPages);
  }

  return result;
}

// Verification
const testCases = [
  { curr: 1, total: 5, expected: [1, 2, 3, 4, 5] },
  { curr: 1, total: 20, expected: [1, 2, 3, 4, 5, 6, 7, 8, '...', 20] },
  { curr: 10, total: 20, expected: [1, '...', 8, 9, 10, 11, 12, '...', 20] },
  { curr: 20, total: 20, expected: [1, '...', 13, 14, 15, 16, 17, 18, 19, 20] },
  { curr: 1, total: 3, expected: [1, 2, 3] },
];

testCases.forEach(({ curr, total, expected }) => {
  const result = buildPageWindow(curr, total);
  const pass = JSON.stringify(result) === JSON.stringify(expected);
  console.log(`Test (${curr}, ${total}): ${pass ? 'PASS' : 'FAIL'} | Got: ${JSON.stringify(result)}`);
});
