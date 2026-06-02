'use client';

export function LetterPreview({ subject, body }: { subject: string; body: string }) {
  return (
    <div style={{ background: '#fff', padding: 16, borderRadius: 8, marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>开发信预览</h3>
      <p><strong>Subject:</strong> {subject}</p>
      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{body}</pre>
    </div>
  );
}
