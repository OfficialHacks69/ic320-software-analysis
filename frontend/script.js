async function submitQuestion() {
  const input = document.getElementById('user-input').value;
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: input })
  });
  const data = await response.json();
  document.getElementById('assistant-response').innerText = data.answer || data.error;
}