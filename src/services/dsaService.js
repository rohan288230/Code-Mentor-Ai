import apiClient from './apiClient';

export async function fetchProblems() {
  const { data } = await apiClient.get('/dsa');
  return data;
}

export async function fetchProblemById(id) {
  const { data } = await apiClient.get(`/dsa/${id}`);
  return data;
}

export async function runCode({ language, code, stdin }) {
  const { data } = await apiClient.post('/dsa/run', {
    language,
    code,
    stdin: stdin ?? '',
  });
  return data;
}

export async function submitCode({ language, code, problemId }) {
  const { data } = await apiClient.post('/dsa/submit', {
    language,
    code,
    problemId,
  });
  return data;
}

export async function fetchSubmissions(problemId) {
  const { data } = await apiClient.get('/dsa/submissions', {
    params: problemId ? { problemId } : {},
  });
  return data;
}

export async function fetchSavedCode(problemId, language) {
  const { data } = await apiClient.get('/dsa/saved-code', {
    params: { problemId, language }
  });
  return data.code;
}

export async function saveCodeDB({ problemId, language, code }) {
  const { data } = await apiClient.post('/dsa/save-code', {
    problemId, language, code
  });
  return data;
}
